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
    fs.writeFile('Data/Testcenter/Duesseldorf.json', str, err => {
      if (err) {
        console.error(err)
        return
      }
      //file written successfully
    });
  });
}
//https.get(options, callback);

module.exports = {
  fetchData: function () {
    var seconds;
    fs.stat('Data/Testcenter/Duesseldorf.json', function (err, stats) {
      seconds = (new Date().getTime() - stats.mtime) / 1000;
      console.log(`TestcenterData is ${seconds} sec old`);
      //if the Testcenter data is older than 6 hours, it gets fetched new 
      if (parseFloat(seconds) > 21600) {
        console.log('fetching new Testcenter Data')
        https.get(options, callback);
      }
    })
  },
  onStart: function () {
    https.get(options, callback);
  }
}