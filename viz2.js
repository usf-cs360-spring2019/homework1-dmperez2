var policeDistrictByDay = {};

var drawStackBar = function(data) {
  var parsedRow = convertRow(data, 0);
  var countMax = getCountPoliceDistrictsByDay(parsedRow);
  policeDistrictByDay = d3.map(policeDistrictByDay);
  var countMin = 0;
  //Took from http://bl.ocks.org/sjengle/e8c0d6abc0a8d52d4b11
  var svg = d3.select("body").select("svg#svg2");
  var bounds = svg.node().getBoundingClientRect();
  var plotWidth = 430;
  var plotHeight = 390;
  var countScale = d3.scaleLinear()
    .domain([countMin, countMax])
    .range([plotHeight - 100, 40])
    .nice();

  var dayScale = d3.scaleBand()
    .domain(policeDistrictByDay.keys())
    .range([0, plotWidth + 200])
    .paddingInner(0.3);

  var margin = {
    top:    30,
    right:  45,
    bottom: 30,
    left:   80
  };
  var plot = svg.select("g#plot");
  if (plot.size() < 1) {
    plot = svg.append("g")
      .attr("id", "plot")
      .attr("transform", translate(margin.left, margin.top));
  }

  var xAxis = d3.axisBottom(dayScale);

  var yAxis = d3.axisLeft(countScale);

  var xPos = plotHeight - 100;
  var yPos = plotWidth - 435;

  //Inspired by https://bl.ocks.org/KingOfCramers/04dcd9742a2be13d99db5f7a7480b4ca
  var districts = getDistricts();

  var stack = d3.stack()
      .keys(districts)
      .order(d3.stackOrderNone)
      .offset(d3.stackOffsetNone);

  var colorScale = d3.scaleOrdinal()
      .domain(districts)
      .range(d3.schemePaired);

  var grid = d3.axisLeft(countScale)
      .tickFormat("")
      .tickSize(-plotHeight - 240);

  plot.append("g")
      .attr("class", "grid")
      .attr("transform", "translate(-7, 0)")
      .call(grid);

  var series = stack(policeDistrictByDay.values());
  var heightScale = d3.scaleLinear().domain([0,60]).range([20, 480]);

  svg.append("text")
        .attr("x", margin.left - 60)
        .attr("y", margin.top)
        .attr("text-anchor", "left")
        .style("font-size", "23px")
        .text("Daily Incidents reported by Police District");

  svg.append("text")
        .attr("x", margin.left - 360)
        .attr("y", margin.top + 10)
        .attr("text-anchor", "left")
        .attr("transform", "rotate(-90)")
        .style("font-size", "13px")
        .text("Count of Incident Day");

  svg.append("text")
        .attr("x", margin.left + 280)
        .attr("y", margin.top + 35)
        .attr("text-anchor", "left")
        .style("font-size", "13px")
        .text("Day of Incident Date");

  var caption = svg.append("text")
        .attr("x", margin.left - 120)
        .attr("y", margin.top + 400)
        .attr("text-anchor", "right")
        .style("fill", "grey")
        .style("font-size", "12px");

  var captionText = "Made by: Diana Pérez Hernández\n"+
        "Description: On December 25, the amount of incidents" +
        "reported for every district had a significant decrease."+
        "Still the amont of incidents\nreported every day doesn't "+
        "vary much with an exception of December 25."

  caption.selectAll("tspan.text")
          .data(captionText.split("\n"))
          .enter()
          .append("tspan")
          .attr("class", "text")
          .text(d => d)
          .attr("x", 20)
          .attr("dx", 10)
          .attr("dy", 15);

  svg.append("text")
    .attr("x", 735)
    .attr("y", 65)
    .attr("text-anchor", "left")
    .style("font-size", "15px")
    .text("Police District");

  var y = 65;
  var districtsReverse = districts.reverse();
  for (var i in districtsReverse) {
    svg.append("text")
        .attr("x", 760)
        .attr("y", y + 20)
        .attr("text-anchor", "right")
        .style("font-size", "13px")
        .text(districts[i]);
        y += 20;
  }
  y = 53;
  for (var i in districtsReverse) {
    svg.append("rect")
        .attr("x", 740)
        .attr("y", y + 20)
        .attr("width", 15)
        .attr("height", 15)
        .style("fill", colorScale(districtsReverse[i]));
        y += 20;
  }
  plot.selectAll("g.bar")
    .data(series)
    .enter()
    .append("g")
    .attr("class", "bar")
    .each(function(d) {
        d3.select(this).selectAll("rect")
            .data(d)
            .enter()
            .append("rect")
            .attr("width", dayScale.bandwidth())
            .attr("height", d => countScale(d[0]) - countScale(d[1]))
            .attr("x", (d, i) => dayScale(policeDistrictByDay.keys()[i]))
            .attr("y", d => countScale(d[1]))
            .style("fill", colorScale(d.key))
    });

  plot.append("g")
    .attr("id", "x-axis")
    .attr("transform", "translate("+ yPos +", " + xPos + ")")
    .call(xAxis)
    .selectAll("text")
    .attr("y", 0)
    .attr("x", -10)
    .attr("transform", "rotate(-90)")
    .style("text-anchor", "end");

  plot.append("g")
    .attr("id", "y-axis")
    .attr("transform", "translate(" + yPos + ", 0)")
    .call(yAxis);
}


var getDistricts = function() {
  var districts = [];
  var value = policeDistrictByDay.values()[0];
  for(var key in value) {
    districts.push(key);
  }
  return districts.sort().reverse();
}

var getCountPoliceDistrictsByDay = function(parsedRow) {
  var countByDay = {};
  var dayIncidents = {};
  for (var key in parsedRow) {
    var day = parsedRow[key]["Incident Date"];
    if (dayIncidents[day] == null) {
        dayIncidents[day] = [];
    }
    dayIncidents[day].push(parsedRow[key]["Police District"]) ;
  }
  for (var day in dayIncidents) {
    var values = dayIncidents[day];
    var countDistrict = {}
    var totalCount = 0;
    for (var district in values) {
      var districtName = values[district];
      totalCount++;
      if (countDistrict[districtName] == null) {
        countDistrict[districtName] = 1;
      } else {
        countDistrict[districtName]++;
      }
    }
    countByDay[day] = totalCount;
    policeDistrictByDay[day] = countDistrict;
  }
  countByDay = d3.map(countByDay);
  return d3.max(countByDay.values());
}
