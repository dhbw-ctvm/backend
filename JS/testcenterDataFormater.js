const fs = require('fs');

let rawdata = fs.readFileSync('Data/testcenterDuesseldorf.json');
let data = JSON.parse(rawdata);

function getData() {
    var resultf = '{ \"testzentren\": {\"testzentrum\" : [';
    for (var i = 0; i < data.result.total; i++) {
        var result = data.result.records[i];
        var hs = ''+result['name_teststelle']
        if (!(hs.includes('\r'))) {
            resultf = resultf + '{' +
                '\"name\":\"' + result['name_teststelle'] + '\",' +
                '\"addresse\":\"' + result['standort_teststelle_strasse'] + ', ' + result['standort_teststelle_plz'] +
                ' ' + result['standort_teststelle_ort'] + '\",' +
                '\"koordinaten\": { \"laenge\":\"' + result['longitude'] + '\", \"breite\":\"' + result['latitude'] + '\"},' +
                '\"terminbuchung\":\"' + result['internet']
                + '\"}'
            if (i != data.result.total - 1) {
                resultf = resultf + ','
            }
        }

    }
    resultf = resultf + ']}}'
    fs.writeFile('./test.json', resultf, err => {
        if (err) {
            console.error(err)
            return
        }
        //file written successfully
    });
    return resultf;
}

module.exports = {
    testcenterData: function () {
        return getData();
    }
}