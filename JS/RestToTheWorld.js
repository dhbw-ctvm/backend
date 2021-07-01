var express = require('express');
var app = express();
var cors = require('cors');
app.use(cors());

var main = require('./main.js');
var xmljs = require("xml-js");
var fs = require('fs');

function xmlHeader(xslHref, rootTag, dtdUrl) {
    return  '<?xml version="1.0" encoding="UTF-8"?>\n' +
            '<?xml-stylesheet type="text/xsl" href="' + xslHref + '"?>\n' +
            '<!DOCTYPE ' + rootTag + ' SYSTEM "' + dtdUrl + '">\n';
}

app.get('/incidence', function (req, res) {
    // Daten zu gegebenen Koordinaten abfragen
    var data = main.startStack([
        parseFloat(req.query.long),
        parseFloat(req.query.lat)
    ])

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
    data = xmljs.json2xml(JSON.stringify(data), {compact: true, spaces: 4})

    // XML-Header einfügen
    data = xmlHeader('.xsl', 'xml', '.dtd') + data;

    res.end(data)
});

app.get('/centers/test', function (req, res) {
    // TODO: Array aller Testzentren zurückgeben

    let rawdata = fs.readFileSync('../xml/testzentren.xml');
    res.end(rawdata);
});

app.get('/centers/vaccination', function (req, res) {
    // TODO: Array aller Impfzentren zurückgeben
});

var server = app.listen(8081, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Listening at http://%s:%s", host, port)
});