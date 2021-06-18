const http = require('http');
const fs = require('fs')

//The url we want is: 'https://opendata.arcgis.com/datasets/917fc37a709542548cc3be077a786c17_0.geojson'
var options = {
    host: 'http://opendata.arcgis.com',
    path: '/datasets/917fc37a709542548cc3be077a786c17_0.geojson'
  };
  
  callback = function(response) {
    var str = '';
  
    //another chunk of data has been received, so append it to `str`
    response.on('data', function (chunk) {
      str += chunk;
    });
  
    //the whole response has been received, so we just print it out here
    response.on('end', function () {
      console.log(str);

      fs.writeFile('Data/test.txt' , str, err => {
        if (err) {
          console.error(err)
          return
        }
        //file written successfully
      });
    });
  }
  
  var responseGet = '';
  http.get('http://opendata.arcgis.com/datasets/917fc37a709542548cc3be077a786c17_0.geojson', callback);
