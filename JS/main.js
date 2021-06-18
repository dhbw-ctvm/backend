const http = require('http');
const fs = require('fs')

//url 'http://opendata.arcgis.com/datasets/917fc37a709542548cc3be077a786c17_0.geojson'
// https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_Landkreisdaten/FeatureServer/0/query?where=1%3D1&outFields=*&outSR=4326&f=json
var options = {
    host: 'services7.arcgis.com',
    path: '/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_Landkreisdaten/FeatureServer/0/query?where=1%3D1&outFields=*&outSR=4326&f=json'
  };
  
  callback = function(response) {
    var str = '';
  
    //another chunk of data has been received, so append it to `str`
    response.on('data', function (chunk) {
      str += chunk;
    });
  
    //the whole response has been received, so we just print it out here
    response.on('end', function () {
      //console.log(str);

      fs.writeFile('Data/test.txt' , str, err => {
        if (err) {
          console.error(err)
          return
        }
        //file written successfully
      });
    });
  }
  
  http.get(options, callback);
