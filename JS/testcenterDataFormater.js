const fs = require('fs');

let rawdata = fs.readFileSync('Data/testcenterDuesseldorf.json');
let data = JSON.parse(rawdata);

module.exports = {
    testcenterData: function(){
        var result;
        for (var i = 0; i < data.result.total; i++) {
            result = result +data.result.records[i] ;
        }
        return result;
    }
}