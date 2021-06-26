const https = require('https');
const fs = require('fs');
//var convert = require('xml-js');

var options = {
  host: 'services7.arcgis.com',
  path: '/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_Landkreisdaten/FeatureServer/0/query?where=1%3D1&outFields=BEZ,KFL,death_rate,cases,deaths,cases_per_100k,cases_per_population,BL,BL_ID,county,OBJECTID,GEN,RS,EWZ,last_update,cases7_per_100k,recovered,cases7_bl&returnGeometry=true&outSR=4326&f=json'
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
    fs.writeFile('Data/incidenceData.json', str, err => {
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
    fs.stat('Data/incidenceData.json', function (err, stats) {
      let seconds = (new Date().getTime() - stats.mtime) / 1000;
      console.log(`incidenceData is ${seconds} sec old`);
      return seconds;
    });
  }
}