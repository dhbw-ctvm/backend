var express = require('express');
var app = express();
var fs = require("fs");
var main = require('./main.js');

app.get('/getLocation/:location', function (req, res) {
    // First read existing users.  req.params.location
    console.log(req.params.location);
    var paraString = req.params.location;
    var point = paraString.split('S');
    point[0] = point[0].replace('P', '.');
    point[1] = point[1].replace('P', '.');
    point[0] = parseFloat(point[0]);
    point[1] = parseFloat(point[1]);
    var data = main.startStack(point);
    res.end(JSON.stringify(data));

})

app.get('/getLocationDebug', function (req, res) {
    var data = main.startStack([8.407017, 49.014498])
    res.end(JSON.stringify(data));

})

var server = app.listen(8081, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Example app listening at http://%s:%s", host, port)
})