var convertRow = function(row, index) {
  let out = {};
  for (let col in row) {
    var date = parseDate(row[col]["Incident Date"]);
    if (date != null) {
      row[col]["Incident Date"] = date;
      out[col] = row[col];
    }
  }
  return out;
}

var parseDate = function(date) {
  if (date == null) {
    return null;
  }
  date = date.replace(/\//g,"-");
  var parsing = d3.timeParse("%Y-%m-%d");
  var dateParsed = parsing(date);
  if (dateParsed.getMonth() == 0) {
    return null;
  }
  return "December " + dateParsed.getDate() + ", 2018";
}
