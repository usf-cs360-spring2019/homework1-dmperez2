
var districtIncidents = {};

var drawBarChart = function(data) {
  var parsedRow = convertRow(data, 0);
  getCountPoliceDistricts(parsedRow);
  districtIncidents = d3.map(districtIncidents);
  var sortedDistrict = districtIncidents.keys().sort();
  var countMin = 0;
  var countMax = d3.max(districtIncidents.values());
  //Took from http://bl.ocks.org/sjengle/e8c0d6abc0a8d52d4b11
  var svg = d3.select("body").select("svg#svg1");
  var bounds = svg.node().getBoundingClientRect();
  var plotWidth = 430;
  var plotHeight = 880;

  /*Scales*/
  var countScale = d3.scaleLinear()
    .domain([countMax, countMin])
    .range([plotHeight - 100, 0])
    .nice();

  var districtScale = d3.scaleBand()
    .domain(sortedDistrict)
    .range([100, plotWidth])
    .paddingInner(0.4);


  var margin = {
    top:    15,
    right:  35,
    bottom: 30,
    left:   -10
  };
  var plot = svg.select("g#plot");
  if (plot.size() < 1) {
    plot = svg.append("g")
      .attr("id", "plot")
      .attr("transform", translate(margin.left, margin.top));
  }

  var bars = plot.selectAll("rect")
    .data(districtIncidents.entries(), function(d) { return d.key; });

  var xAxis = d3.axisBottom(countScale);

  var yAxis = d3.axisLeft(districtScale);

  var xPos = plotHeight - 450;
  var yPos = plotWidth - 350;

  var grid = d3.axisBottom(countScale)
    .tickFormat("")
    .tickSize(plotHeight);

  plot.append("g")
      .attr("class", "grid")
      .call(grid);

  bars.enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", function(d) { return yPos;})
    .attr("width",function(d) { return countScale(d.value);})
    .attr("y", function(d) { return districtScale(d.key);})
    .attr("height", districtScale.bandwidth());

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
