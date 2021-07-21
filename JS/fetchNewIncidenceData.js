const https = require('https');
const fs = require('fs');

var options = {
  host: 'services7.arcgis.com',
  path: '/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_Landkreisdaten/FeatureServer/0/query?where=1%3D1&outFields=BEZ,KFL,death_rate,cases,deaths,cases_per_100k,cases_per_population,BL,BL_ID,county,OBJECTID,GEN,RS,EWZ,last_update,cases7_per_100k,recovered,cases7_bl&returnGeometry=true&outSR=4326&f=json'
};

callbackIncidence = function (response) {
  var strIncidence = '';

  //another chunk of data has been received, so append it to `str`
  response.on('data', function (chunk) {
    strIncidence += chunk;
  });

  //the whole response has been received, so we just print it out here
  response.on('end', function () {

    //write output
    fs.writeFile('Data/Incidence/Data.json', strIncidence, err => {
      if (err) {
        console.error(err)
        return
      }
      //file written successfully
    });
  });
}
https.get(options, callbackIncidence);

module.exports = {
  fetchData: function () {
    var seconds;
    fs.stat('Data/Incidence/Data.json', function (err, stats) {
      seconds = (new Date().getTime() - stats.mtime) / 1000;
      console.log(`incidenceData is ${seconds} sec old`);
      //if the Incidence data is older than 6 hours, it gets fetched new 
      if (parseFloat(seconds) > 21600) {
        console.log('fetching new Incidentce Data')
        https.get(options, callbackIncidence);
      }
    })
  },
  onStart: function () {
    https.get(options, callbackIncidence);
  }
}