const fs = require('fs');

let rawdata = fs.readFileSync('Data/testcenterDuesseldorf.json');
let data = JSON.parse(rawdata);

function getData(){
    var resultf = '{ xml: '
        for (var i = 0; i < data.result.total; i++) {
            var result = data.result.records[i];
            resultf = resultf + {
                name: result['name_teststelle'],
                addresse: result['standort_teststelle_strasse'] + ', ' + result['standort_teststelle_plz'] + ' ' + result['standort_teststelle_ort'],
                koordinaten: { laenge: result['longitude'], breite: result['latitude'] },
                terminbuchung: result['internet']
            }
        }
        resultf = resultf + '}'
        return resultf;
}

module.exports = {
    testcenterData: function () {
        return getData();
    }
}