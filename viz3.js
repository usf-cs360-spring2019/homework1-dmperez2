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
  var plotHeight = 880;

  /*Scales*/
  var countScale = d3.scaleLinear()
    .domain([countMin, countMax])
    .range([plotHeight - 300, 200])
    .nice();

  var dayOfWeekScale = d3.scaleBand()
    .domain(incidentsByDayOfWeek.keys())
    .range([100, plotWidth + 300])
    .paddingInner(0.6);

  var margin = {
    top:    -130,
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
    .tickSize(-plotHeight);

  plot.append("g")
      .attr("class", "grid")
      .call(grid);

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
