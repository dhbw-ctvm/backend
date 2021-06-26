var incidence = require('./fetchNewIncidenceData.js');
var getRegion = require('./getRegion.js');

//if the Incidentce data is older than 6 hours, it gets fetched new
if (incidence.ageOfData() > 21600) {
  console.log('fetching new Incidentce Data')
  incidence.fetchData();
}

var pointKi = [10.131973, 54.323640]; //Point in Kiel
var pointKa = [8.407017, 49.014498]; //Point in Karlsruhe 

getRegion.main(pointKa);