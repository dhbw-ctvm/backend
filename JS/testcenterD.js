const https = require('https');
const fs = require('fs');

var options = {
  host: 'opendata.duesseldorf.de',
  path: '/api/action/datastore/search.json?resource_id=d0ad2b6f-8fc1-4447-9e21-cb8b8e00ab65&limit=300'
};

callback = function (response) {
  var str = '';

  //another chunk of data has been received, so append it to `str`
  response.on('data', function (chunk) {
    str += chunk;
  });

  //the whole response has been received, so we just print it out here
  response.on('end', function () {
    //write output
    fs.writeFile('Data/testcenterDuesseldorf.json', str, err => {
      if (err) {
        console.error(err)
        return
      }
      //file written successfully
    });
  });
}

module.exports = {
  fetchData: function () {
    https.get(options, callback);
  },

  ageOfData: function () {
    fs.stat('Data/testcenterDuesseldorf.json', function (err, stats) {
      let seconds = (new Date().getTime() - stats.mtime) / 1000;
      console.log(`TestcenterData is ${seconds} sec old`);
      return parseFloat(seconds);
    });
  }
}