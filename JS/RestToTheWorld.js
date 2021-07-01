var express = require('express');
var app = express();
var main = require('./main.js');
var xmljs = require("xml-js");

var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

app.get('/incidence', jsonParser, function (req, res) {
    if(req.headers['content-type'] != 'application/json') {
        res.status(415).send({error: 'content-type must be application/json'})
        return
    }

    var data = main.startStack([
        parseFloat(req.body.long),
        parseFloat(req.body.lat)
    ])

    // Damit das Rückgabe-XML einen Root-Tag hat
    data = { xml: data }

    // TODO: Filter, damit nur relevante Daten zurückgegeben werden

    data = xmljs.json2xml(JSON.stringify(data), {compact: true, spaces: 4})

    res.end(data)
});

app.get('/centers/test', function(req, res) {
    // TODO: Array aller Testzentren zurückgeben
});

app.get('/centers/vaccination', function(req, res) {
    // TODO: Array aller Impfzentren zurückgeben
});

var server = app.listen(8081, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Listening at http://%s:%s", host, port)
});