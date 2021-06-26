const fs = require('fs');

//var filePath = 'Data/kiel.json'
//Beispiel Kiel: Punkt in Stadt (54.323640, 10.131973)

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

function searchRegion(point, dataJson){
    
   

    for (var i = 0; i < dataJson.features.length; i++){

                if (inside(point, dataJson.features[i].geometry.rings[0])){
                    console.log(dataJson.features[i]);
                    return;
            }
        
    }
}

var pointKi = [10.131973, 54.323640]; //Pojnt in Kiel
var pointKa = [8.407017, 49.014498]; //Point in Karlsruhe 

let rawdata = fs.readFileSync('Data/test.json');
let data = JSON.parse(rawdata);

searchRegion(pointKa,data);


