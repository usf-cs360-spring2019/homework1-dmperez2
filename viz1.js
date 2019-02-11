var drawBarChart = function() {
  var districtIncidents = {};
  var mapDistricts = d3.csv("data.csv", function(data) {
    var parsedRow = convertRow(data, 0);
    for (var key in parsedRow) {
      var policeDistrict = parsedRow[key]["Police District"];
      if (districtIncidents[policeDistrict] == null) {
        districtIncidents[policeDistrict] = 1;
      } else {
        districtIncidents[policeDistrict]++;
      }
    }

    var countMin = 0;
    var countMax = getMaxDictionary(districtIncidents);

    //Took from http://bl.ocks.org/sjengle/e8c0d6abc0a8d52d4b11
    var margin = {
      top:    15,
      right:  35,
      bottom: 30,
      left:   10
    };
    var svg = d3.select("body").select("svg");
    var bounds = svg.node().getBoundingClientRect();
    var plotWidth = bounds.width - margin.right - margin.left;
    var plotHeight = bounds.height - margin.top - margin.bottom;
    var countScale = d3.scale.linear()
      .domain([countMin, countMax])
      .range([plotHeight, 0])
      .nice();
    var districtScale = d3.scale.ordinal()
      .rangeRoundBands([0, plotWidth], 0.1, 0)
      .domain(Object.keys(districtIncidents));
    var plot = svg.select("g#plot");
    var xAxis = d3.svg.axis()
      .scale(countScale)
      .orient("bottom");
    var yAxis = d3.svg.axis()
      .scale(districtScale)
      .orient("left");
    if (plot.select("g#y-axis").size() < 1) {
      plot.append("g")
        .attr("id", "x-axis")
        .attr("transform", "translate(0, " + plotHeight + ")")
        .call(xAxis);
      plot.append("g")
        .attr("id", "y-axis")
        .attr("transform", "translate(" + plotWidth + ", 0)")
        .call(yAxis);
    }
  });
  var svg = d3.select("body").select("svg");
  var plot = svg.select("g#plot");
}

var translate = function(x, y) {
  return "translate(" + String(x) + ", " + String(y) + ")";
};


var getMaxDictionary = function(dictionary) {
  var maxValue = 0;
  for (var key in dictionary) {
    if (dictionary[key] > maxValue) {
      maxValue = dictionary[key]
    }
  }
  return maxValue;
}

var convertRow = function(row, index) {
  let out = {};
  for (let col in row) {
    out[col] = row[col];
  }
  return out;
}
