function bodyloaded() {
  var tbody = d3.select("tbody");
  var table = d3.select("table");
  table.attr("class", "table table-striped");
  var queryUrl = `${BASE_URL}all`;
  // console.log(queryUrl);
  d3.json(queryUrl).then(function(data){
    console.log("data");
  data.forEach((crash) => {

    var lat = crash.start_lat;
    var lng = crash.start_lng;
    var severity = crash.severity;
    var city = crash.city;
    var county = crash.county;
    //var state = crashes.map(data => data.State);
    var weather = crash.weather_condition;
    var day_night = crash.civil_twilight;
    var time = crash.start_time;
    var month = crash.month;
    
    
    
    
    var row = tbody.append("tr");
    row.append("td").html(city);
    row.append("td").html(county);
    row.append("td").html(month);
    row.append("td").html(severity);
    row.append("td").html(lat);
    row.append("td").html(lng);
    row.append("td").html(weather);
    row.append("td").html(time);

    // Append one cell for the student grade
    // row.append("td").html(lat[1]);

      // Object.entries(crashes).forEach(([key, value]) => {
      //   var cell = row.append("td");
      //   cell.text(value);
      // });
    });
  });
}