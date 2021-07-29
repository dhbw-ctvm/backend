var express = require('express');
var app = express();
var cors = require('cors');
app.use(cors());
var xmljs = require("xml-js");
var fs = require('fs');

var incidence = require('./fetchNewIncidenceData.js');
var getRegion = require('./getRegion.js');
var testCeDuessel = require('./fetchNewTestcenterDataDue.js');
var testCeFormater = require('./testcenterDataFormater.js');

incidence.onStart();
testCeDuessel.onStart();

function xmlHeader(xslHref, rootTag, dtdUrl) {
    return '<?xml version="1.0" encoding="UTF-8"?>\n' +
        '<?xml-stylesheet type="text/xsl" href="http://ctvm.nkilders.de:8081' + xslHref + '"?>\n' +
        '<!DOCTYPE ' + rootTag + ' SYSTEM "http://ctvm.nkilders.de:8081' + dtdUrl + '">\n';
}

app.get('/xml/*.*', function (req, res) {
    let fp = '..' + req.originalUrl;

    fs.readFile(fp, 'utf8', function (err, data) {
        if (err) {
            res.sendStatus(404);
            return;
        }

        if (fp.endsWith('.xml')) res.setHeader('Content-Type', 'application/xml');
        if (fp.endsWith('.xsl')) res.setHeader('Content-Type', 'text/xsl');
        res.send(data);
    });
});

//Incidence http method, to get the data for your location
app.get('/incidence', function (req, res) {
    // Daten zu gegebenen Koordinaten abfragen

    incidence.fetchData();
    var point = [
        parseFloat(req.query.long),
        parseFloat(req.query.lat)
    ]
    var data = getRegion.main(point);

    if (data == undefined) {

        let rawdata = fs.readFileSync('../xml/inzidenz.xml');
        res.end(rawdata)
    }
    else {
        // Nicht benötigte Daten rausfiltern
        data = {
            xml: {
                kreis: data['BEZ'] + ' ' + data['GEN'],     // Stadtkreis Karlsruhe
                bundesland: data['BL'],                     // Baden-Württemberg
                inzidenz: data['cases7_per_100k'],          // 1.60225597...
                last_update: data['last_update']
            }
        }

        // JSON zu XML konvertieren
        data = xmljs.json2xml(JSON.stringify(data), { compact: true, spaces: 4 })
        // XML-Header einfügen
        data = xmlHeader('/xml/inzidenz.xsl', 'xml', '/xml/inzidenz.dtd') + data;

        res.setHeader('Content-Type', 'application/xml')
        res.end(data)
    }
});

//http get for testcenter locations
app.get('/centers/test', function (req, res) {
    testCeDuessel.fetchData();

    var data = JSON.parse(testCeFormater.testcenterData());

    data = xmljs.json2xml(JSON.stringify(data), { compact: true, spaces: 4 })
    data = xmlHeader('/xml/testzentren.xsl', 'xml', '/xml/testzentren.dtd') + data
    let rawdata = fs.readFileSync('../xml/testzentren.xml');
    res.end(data);
});

//vaccination centers are hard coded, because there is no api to get the current locations to get your self vaccinated
app.get('/centers/vaccination', function (req, res) {
    // TODO: Array aller Impfzentren zurückgeben
});

var server = app.listen(8081, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Listening at http://%s:%s", host, port)
});