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
function searchRegion(point, dataJson) {
    for (var i = 0; i < dataJson.features.length; i++) {
        if (inside(point, dataJson.features[i].geometry.rings[0])) {
            console.log(dataJson.features[i]);
            return dataJson.features[i];
        }
    }
}

let rawdata = fs.readFileSync('Data/incidenceData.json');
let data = JSON.parse(rawdata);

module.exports = {
    main: function (location) {
        searchRegion(location, data);
    }
}