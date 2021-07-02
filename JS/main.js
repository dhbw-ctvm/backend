var incidence = require('./fetchNewIncidenceData.js');
var getRegion = require('./getRegion.js');
var testCeDuessel = require('./testcenterD.js'); 
var testCeFormater = require('./testcenterDataFormater.js');

//if the Incidence data is older than 6 hours, it gets fetched new
if (incidence.ageOfData() > 21600) {
  console.log('fetching new Incidentce Data')
  incidence.fetchData();
}

//Debug locations. The Coordinats for Locations have to be in the formate: [Longitude, Latitude]!
var pointKi = [10.131973, 54.323640]; //Point in Kiel
var pointKa = [8.407017, 49.014498]; //Point in Karlsruhe  ../8P407017S49P014498
var pointGl = [7.1105689944801505, 51.08395546273353]; //Point in Burscheid
var pointNoIdea = [10.689161607437237, 51.30893277278768] //just clicked on the map of Germany

//getRegion.main(pointNoIdea);

module.exports = {
  startStack: function (location) {
    //if the Incidence data is older than 6 hours, it gets fetched new 
    if (incidence.ageOfData() > 21600) {
      console.log('fetching new Incidentce Data')
      incidence.fetchData();
    }

    var point = location
    return getRegion.main(point);
  },

  startTestCenterStack: function () {
    if (testCeDuessel.ageOfData() > 21600) {
      console.log('fetching new Testcenter Data')
      testCeDuessel.fetchData();
    }
    return testCeFormater.testcenterData();
  }
}