var tbody = d3.select("tbody");

var queryUrl = buildURL();

var data = d3.json(queryUrl, function(crashes){

data.forEach((crashes) => {
    var row = tbody.append("tr");
    Object.entries(crashes).forEach(([key, value]) => {
      var cell = row.append("td");
      cell.text(value);
    });
  });
});