
var districtIncidents = {};

var drawBarChart = function(data) {
  var parsedRow = convertRow(data, 0);
  getCountPoliceDistricts(parsedRow);
  districtIncidents = d3.map(districtIncidents);
  var sortedDistrict = districtIncidents.keys().sort();
  var countMin = 0;
  var countMax = d3.max(districtIncidents.values());
  //Took from http://bl.ocks.org/sjengle/e8c0d6abc0a8d52d4b11
  var svg = d3.select("body").select("svg");
  var bounds = svg.node().getBoundingClientRect();
  var plotWidth = 430;
  var plotHeight = 880;

  /*Scales - TODO: change*/
  var countScale = d3.scale.linear()
    .domain([countMax, countMin])
    .range([plotHeight, 0])
    .nice();

  var districtScale = d3.scale.ordinal()
    .rangeRoundBands([0, plotWidth], 0.1, 0)
    .domain(sortedDistrict);

  var margin = {
    top:    15,
    right:  35,
    bottom: 30,
    left:   -25
  };
  var plot = svg.select("g#plot");
  if (plot.size() < 1) {
    plot = svg.append("g")
      .attr("id", "plot")
      .attr("transform", translate(margin.left, margin.top));
  }

  var xAxis = d3.svg.axis()
    .scale(countScale)
    .orient("bottom");

  var yAxis = d3.svg.axis()
    .scale(districtScale)
    .orient("left");

  var xPos = plotHeight - 450;
  var yPos = plotWidth - 350;

  plot.append("g")
    .attr("id", "x-axis")
    .attr("transform", "translate("+ yPos +", " + xPos + ")")
    .call(xAxis);

  plot.append("g")
    .attr("id", "y-axis")
    .attr("transform", "translate(" + yPos + ", 0)")
    .call(yAxis);


}

//Took from http://bl.ocks.org/sjengle/e8c0d6abc0a8d52d4b11
var translate = function(x, y) {
  return "translate(" + String(x) + ", " + String(y) + ")";
};

var getCountPoliceDistricts = function (parsedRow) {
  for (var key in parsedRow) {
    var policeDistrict = parsedRow[key]["Police District"];
    if (districtIncidents[policeDistrict] == null) {
      districtIncidents[policeDistrict] = 1;
    } else {
      districtIncidents[policeDistrict]++;
    }
  }
  return;
}

var convertRow = function(row, index) {
  let out = {};
  for (let col in row) {
    out[col] = row[col];
  }
  return out;
}
