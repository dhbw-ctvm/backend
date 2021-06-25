const fs = require('fs');

//var filePath = 'Data/kiel.json'
//Beispiel Kiel: Punkt in Stadt (54.323640, 10.131973)

function inside(point, vs) {
    // ray-casting algorithm based on
    // https://wrf.ecse.rpi.edu/Research/Short_Notes/pnpoly.html/pnpoly.html

    //console.log(vs);

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
    
    console.log(inside);
    return inside;
};

var pointK = [10.131973, 54.323640];


let rawdata = fs.readFileSync('Data/test.json');
let data = JSON.parse(rawdata);
console.log(data);

function searchRegion(point, array){
    array[array.length-2]
}

inside(pointK, data);

