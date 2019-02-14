
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
  var plotWidth = 350;
  var plotHeight = 780;

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
    top:    -10,
    right:  35,
    bottom: 30,
    left:   150
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

  var xPos = plotHeight - 430;
  var yPos = plotWidth - 350;

  var grid = d3.axisBottom(countScale)
      .tickFormat("")
      .tickSize(plotHeight - 530);

  plot.append("g")
        .attr("class", "grid")
        .attr("transform", "translate(0, 100)")
        .call(grid);

  svg.append("text")
        .attr("x", margin.left - 120)
        .attr("y", margin.top + 60)
        .attr("text-anchor", "left")
        .style("font-size", "23px")
        .text("Incidents reported by Police Districts in SF");

  svg.append("text")
        .attr("x", margin.left - 90)
        .attr("y", margin.top + 90)
        .attr("text-anchor", "left")
        .style("font-size", "13px")
        .text("Police District");

  svg.append("text")
        .attr("x", margin.left + 280)
        .attr("y", margin.top + 390)
        .attr("text-anchor", "left")
        .style("font-size", "13px")
        .text("Count of Incident Category");

  var caption = svg.append("text")
        .attr("x", margin.left - 120)
        .attr("y", margin.top + 420)
        .attr("text-anchor", "left")
        .style("font-size", "13px");

  var captionText = "Made by: Diana Pérez Hernández\n"+
        "Description: The data shows that Central Police District "+
        "reported most of the incidents that happened in SF on December, "+
        "2018 and Park Disctrict reported a third of\nthe Central District did."

  caption.selectAll("tspan.text")
          .data(captionText.split("\n"))
          .enter()
          .append("tspan")
          .attr("class", "text")
          .text(d => d)
          .attr("x", 20)
          .attr("dx", 10)
          .attr("dy", 15);

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
    .style("stroke-width", "0")
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
