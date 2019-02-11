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
      right:  35, // leave space for y-axis
      bottom: 30, // leave space for x-axis
      left:   10
    };
    var bounds = svg.node().getBoundingClientRect();
    var plotWidth = bounds.width - margin.right - margin.left;
    var plotHeight = bounds.height - margin.top - margin.bottom;

    var countScale = d3.scale.linear()
    .domain([countMin, countMax])
    .range([plotHeight, 0])
    .nice();

    var districtScale = d3.scale.ordinal()
    // range, between-bar padding, outside padding
    .rangeRoundBands([0, plotWidth], 0.1, 0)
    .domain(Object.keys(districtIncidents));

    var plot = svg.select("g#plot");
    var bars = plot.selectAll("rect")
    .data(Object.keys(districtIncidents), function(d) { return d.key; });
  });
}


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
