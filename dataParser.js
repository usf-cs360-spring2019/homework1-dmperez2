var convertRow = function(row, index) {
  let out = {};
  for (let col in row) {
    row[col]["Incident Date"] = parseDate(row[col]["Incident Date"]);
    out[col] = row[col];
  }
  return out;
}

var parseDate = function(date) {
  date = date.replace(/\//g, "-");
  return d3.time.format("%Y-%m-%d").parse(date);
}
