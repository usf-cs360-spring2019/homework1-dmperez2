var incidentsByDayOfWeek = {};

var drawLineChart = function(data) {
  var parsedRow = convertRow(data, 0);
  getIncidentsByDayOfWeek(parsedRow);
  incidentsByDayOfWeek = d3.map(incidentsByDayOfWeek);
  var countMin = 0;
  var countMax = d3.max(incidentsByDayOfWeek.values());
  //Took from http://bl.ocks.org/sjengle/e8c0d6abc0a8d52d4b11
  var svg = d3.select("body").select("svg#svg3");
  var bounds = svg.node().getBoundingClientRect();
  var plotWidth = 430;
  var plotHeight = 850;

  /*Scales*/
  var countScale = d3.scaleLinear()
    .domain([countMin, countMax])
    .range([plotHeight - 300, 200])
    .nice();

  var dayOfWeekScale = d3.scaleBand()
    .domain(incidentsByDayOfWeek.keys())
    .range([120, plotWidth + 350])
    .paddingInner(0.6);

  var margin = {
    top:    -140,
    right:  35,
    bottom: 30,
    left:   0
  };
  var plot = svg.select("g#plot");
  if (plot.size() < 1) {
    plot = svg.append("g")
      .attr("id", "plot")
      .attr("transform", translate(margin.left, margin.top));
  }

  var xAxis = d3.axisBottom(dayOfWeekScale);
  var yAxis = d3.axisLeft(countScale);

  var xPos = plotHeight - 300;
  var yPos = plotWidth - 350;

  var grid = d3.axisLeft(countScale)
      .tickFormat("")
      .tickSize(-plotHeight + 160);

  plot.append("g")
        .attr("class", "grid")
        .attr("transform", "translate(75, 0)")
        .call(grid);

  svg.append("text")
        .attr("x", margin.left + 20)
        .attr("y", margin.top + 170)
        .attr("text-anchor", "left")
        .style("font-size", "23px")
        .text("Incidentes by Day of Week");

  svg.append("text")
    .attr("x", margin.left - 360)
    .attr("y", margin.top + 170)
    .attr("text-anchor", "left")
    .attr("transform", "rotate(-90)")
    .style("font-size", "13px")
    .text("Count of Incident Day of Week");

  svg.append("text")
    .attr("x", margin.left + 400)
    .attr("y", margin.top + 190)
    .attr("text-anchor", "left")
    .style("font-size", "13px")
    .text("Incident Day of Week");

  var caption = svg.append("text")
      .attr("x", margin.left - 120)
      .attr("y", margin.top + 580)
      .attr("text-anchor", "right")
      .style("font-size", "12px");

  var captionText = "Made by: Diana Pérez Hernández\n"+
          "Description: It's notorious that Saturday is "+
          "the day where most of the incidents happened in December while"+
          " Tuesday had a big fall, probably\nbecause is the middle of the week.";

  caption.selectAll("tspan.text")
        .data(captionText.split("\n"))
        .enter()
        .append("tspan")
        .attr("class", "text")
        .text(d => d)
        .attr("x", 20)
        .attr("dx", 10)
        .attr("dy", 15);

  var valueline = d3.line()
    .x(function(d) { return dayOfWeekScale(d.key); })
    .y(function(d) { return countScale(d.value); });

   plot.append("path")
      .attr("class", "line")
      .attr("d", valueline(incidentsByDayOfWeek.entries()));

  plot.append("g")
    .attr("id", "x-axis")
    .attr("transform", "translate(-20, " + xPos + ")")
    .call(xAxis);

  plot.append("g")
    .attr("id", "y-axis")
    .attr("transform", "translate(" + yPos + ", 0)")
    .call(yAxis);
}


var getIncidentsByDayOfWeek = function(parsedRow) {
  for (var key in parsedRow) {
    var dayOfWeek = parsedRow[key]["Incident Day of Week"];
    if (incidentsByDayOfWeek[dayOfWeek] == null) {
      incidentsByDayOfWeek[dayOfWeek] = 1;
    } else {
      incidentsByDayOfWeek[dayOfWeek]++;
    }
  }
  return;
}
