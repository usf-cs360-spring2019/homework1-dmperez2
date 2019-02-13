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
  var plotHeight = 500;
  var countScale = d3.scaleLinear()
    .domain([countMin, countMax])
    .range([plotHeight - 100, 40])
    .nice();

  var dayScale = d3.scaleBand()
    .domain(policeDistrictByDay.keys())
    .range([0, plotWidth + 200], 0.3)
    .paddingInner(0.3);

  var margin = {
    top:    -10,
    right:  45,
    bottom: 30,
    left:   20
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
  var yPos = plotWidth - 350;

  //Inspired by https://bl.ocks.org/KingOfCramers/04dcd9742a2be13d99db5f7a7480b4ca
  var districts = getDistricts();

  var stack = d3.stack()
      .keys(districts)
      .order(d3.stackOrderNone)
      .offset(d3.stackOffsetNone);

  var colorScale = d3.scaleSequential(d3.schemeSet2);

  var series = stack(policeDistrictByDay.values());
  var heightScale = d3.scaleLinear().domain([0,60]).range([20, 480])

  var bars = plot.selectAll("g.bar")
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
            .attr("height", p => heightScale(p[1]) - heightScale(p[0]))
            .attr("x", 500)
            .attr("y", 100)
            //.style("fill", colorScale(d.key))
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
  return districts;
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
