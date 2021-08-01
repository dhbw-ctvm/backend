var express = require('express');
var app = express();
var cors = require('cors');
app.use(cors());
var xmljs = require("xml-js");
var fs = require('fs');
var xmldom = require('xmldom');

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

app.get('/xml/*.*', (req, res) => {
    let url = '..' + req.originalUrl;

    fs.readFile(url, 'utf8', (err, data) => {
        // 404 falls Datei nicht gefunden
        if (err) {
            res.sendStatus(404);
            return;
        }

        // Content-Type-Header hinzufügen
        if (url.endsWith('.xml')) res.setHeader('Content-Type', 'application/xml');
        if (url.endsWith('.xsl')) res.setHeader('Content-Type', 'text/xsl');

        res.send(data);
    });
});

// Incidence http method, to get the data for your location
app.get('/incidence', (req, res) => {
    incidence.fetchData();

    var point = [
        parseFloat(req.query.long),
        parseFloat(req.query.lat)
    ];

    // Daten zu gegebenen Koordinaten abfragen
    var data = getRegion.main(point);

    res.setHeader('Content-Type', 'application/xml');

    if (data == undefined) {
        // Dummy-Datei zurückgeben, falls keine Daten zu den gegebenen Koordinaten gefunden wurden
        let rawdata = fs.readFileSync('../xml/inzidenz.xml');
        res.end(rawdata);
    } else {
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

        res.end(data);
    }
});

// HTTP get for testcenter locations
app.get('/centers/test', (req, res) => {
    testCeDuessel.fetchData();

    var data = JSON.parse(testCeFormater.testcenterData());

    // JSON zu XML konvertieren
    data = xmljs.json2xml(JSON.stringify(data), { compact: true, spaces: 4 });
    // XML-Header einfügen
    data = xmlHeader('/xml/testzentren.xsl', 'xml', '/xml/testzentren.dtd') + data;

    // let rawdata = fs.readFileSync('../xml/testzentren.xml');

    res.setHeader('Content-Type', 'application/xml');
    res.end(data);
});

// Daten zu Testzentrum bei gegebenen Koordinaten
app.get('/center/test', (req, res) => {
    let coords = [
        parseFloat(req.query.long),
        parseFloat(req.query.lat)
    ];

    let data = JSON.parse(testCeFormater.testcenterData());

    for(let tz of data.testzentren.testzentrum) {
        let c = tz.koordinaten;

        if(c.laenge == coords[0] && c.breite == coords[1]) {
            let data = JSON.stringify({testzentrum: tz});
            data = xmljs.json2xml(data, { compact: true, spaces: 4 });
            data = xmlHeader('/xml/testzentrum.xsl', 'testzentrum', '/xml/testzentrum.dtd') + data;

            res.setHeader('Content-Type', 'application/xml');
            res.end(data);

            return;
        }
    }

    res.sendStatus(500);
    res.end();
});

// Daten zu Impfzentrum bei gegebenen Koordinaten
app.get('/center/vaccination', (req, res) => {
    let clickPos = [
        req.query.long,
        req.query.lat
    ];

    let data = fs.readFileSync('../xml/impfzentren.xml');
    data = new xmldom.DOMParser().parseFromString(data.toString(), 'text/xml');

    data = data.getElementsByTagName('impfzentrum');
    for(let i = 0; i < data.length; i++) {
        let coords = data[i].getElementsByTagName('koordinaten')[0];
        let lon = coords.getElementsByTagName('laenge')[0].textContent;
        let lat = coords.getElementsByTagName('breite')[0].textContent;

        if(lon == clickPos[0] && lat == clickPos[1]) {
            res.setHeader('Content-Type', 'application/xml');
            res.end(data[i].toString());
            return;
        }
    }

    res.sendStatus(500);
    res.end();
});

var server = app.listen(8081, () => {
    var host = server.address().address
    var port = server.address().port
    console.log("Listening at http://%s:%s", host, port)
});