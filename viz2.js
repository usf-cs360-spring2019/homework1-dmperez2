var policeDistrictByDay = {};

var drawStackBar = function(data) {
  var parsedRow = convertRow(data, 0);
  getCountPoliceDistrictsByDay(parsedRow);
}


var getCountPoliceDistrictsByDay = function(parsedRow) {
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
    for (var district in values) {
      var districtName = values[district];
      if (countDistrict[districtName] == null) {
        countDistrict[districtName] = 1;
      } else {
        countDistrict[districtName]++;
      }
    }
    policeDistrictByDay[day] = countDistrict;
  }
  return;
}
