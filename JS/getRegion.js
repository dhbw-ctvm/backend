const fs = require('fs');

function inside(point, vs) {
    // ray-casting algorithm based on
    // https://wrf.ecse.rpi.edu/Research/Short_Notes/pnpoly.html/pnpoly.html
    var x = point[0];
    var y = point[1];

    var inside = false;
    for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        var xi = vs[i][0], yi = vs[i][1];
        var xj = vs[j][0], yj = vs[j][1];

        var intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }

    return inside;
};

//gets the gemoetry of all Regions in Germany and passes them to the function inside, which checks if the given Location is in the Region
function searchRegion(point) {

    let rawdata = fs.readFileSync('./Data/incidenceData.json');
    let dataJson = JSON.parse(rawdata);

    for (var i = 0; i < dataJson.features.length; i++) {
        if (inside(point, dataJson.features[i].geometry.rings[0])) {
            //console.log(dataJson.features[i]);
            var data = dataJson.features[i].attributes;
            return data;
        }
    }
}

//Debug locations. The Coordinats for Locations have to be in the formate: [Longitude, Latitude]!
var pointKi = [10.131973, 54.323640]; //Point in Kiel
var pointKa = [8.407017, 49.014498]; //Point in Karlsruhe  ../8P407017S49P014498
var pointGl = [7.1105689944801505, 51.08395546273353]; //Point in Burscheid
var pointNoIdea = [10.689161607437237, 51.30893277278768] //just clicked on the map of Germany

module.exports = {
    main: function (location) {
        return searchRegion(location);
    }
}