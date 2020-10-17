function buildURL() {

  // get a reference to the counties dropdown (select)
  var element = document.getElementById("counties");

  // get the selected value out of the dropdown (select)
  var county = element.options[element.selectedIndex].value;

  // get a reference to the month dropdown (select)
  element = document.getElementById("months");

  // get the selected value out of the dropdown (select)
  var month = element.options[element.selectedIndex].value;

  base_url = "http://127.0.0.1:5000";
  query = "";

  if (county != "") {
      query += query.length == 0 ? "?" : "&";
      query += `county=${county}`;
  }

  if (month != "") {
      query += query.length == 0 ? "?" : "&";
      query += `month=${month}`;
  }

  return base_url + query;
}

function loadMap() {
    // Create the tile layer that will be the background of our map
    var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "light-v10",
      accessToken: API_KEY
    });

    // Initialize all of the LayerGroups we'll be using
    var layers = {
      Fender_Bender: new L.LayerGroup(),
      Moderate: new L.LayerGroup(),
      Bad: new L.LayerGroup(),
      Fatal: new L.LayerGroup(),
    };

    // Create the map with our layers
    var map = L.map("map-id", {
      center: [40.0583, -74.4057],
      zoom: 8,
      layers: [
        layers.Fender_Bender,
        layers.Moderate,
        layers.Bad,
        layers.Fatal,
      ]
    });

    // Add our 'lightmap' tile layer to the map
    lightmap.addTo(map);

    // Create an overlays object to add to the layer control
    var overlays = {
      "Fender_Bender": layers.Fender_Bender,
      "Moderate": layers.Moderate,
      "Bad": layers.Bad,
      "Fatal": layers.Fatal,
    };

    // Create a control for our layers, add our overlay layers to it
    L.control.layers(null, overlays).addTo(map);

    // Create a legend to display information about our map
    var info = L.control({
      position: "bottomright"
    });

    // When the layer control is added, insert a div with the class of "legend"
    info.onAdd = function() {
      var div = L.DomUtil.create("div", "legend");
      return div;
    };
    // Add the info legend to the map
    info.addTo(map);

    // Initialize an object containing icons for each layer group
    var icons = {
      Fender_Bender: L.ExtraMarkers.icon({
        icon: "ion-android-car",
        iconColor: "white",
        markerColor: "green",
        shape: "circle"
      }),
      Moderate: L.ExtraMarkers.icon({
        icon: "ion-android-car",
        iconColor: "white",
        markerColor: "orange",
        shape: "circle"
      }),
      Bad: L.ExtraMarkers.icon({
        icon: "ion-android-car",
        iconColor: "white",
        markerColor: "red",
        shape: "circle",
        //iconSize: [400, 900]
      }),
      Fatal: L.ExtraMarkers.icon({
        icon: "ion-android-car",
        iconColor: "white",
        markerColor: "black",
        shape: "circle"
      }),
      
    };

    // Perform an API call to the RESTAPI to get the crash data.
    var queryUrl = buildURL();




    // Parse the data in to Latitude, Longitude, and Severity for the map.
      d3.json(queryUrl, function(crashes)  {
        var lat = crashes.map(data => data.start_lat);
        var lng = crashes.map(data => data.start_lng);
        var severity = crashes.map(data => data.severity);
        var city = crashes.map(data => data.city);
        var county = crashes.map(data => data.county);
        //var state = crashes.map(data => data.State);
        var weather = crashes.map(data => data.weather_condition);
        var day_night = crashes.map(data => data.civil_twilight);
        var time = crashes.map(data => data.start_time);

        // console.log(lat);
        // console.log(lng);
        // console.log(severity);
          
    // Set up empty variables to count the number of crashes.
        var crashCount = {
          Fender_Bender: 0,
          Moderate: 0,
          Bad: 0,
          Fatal: 0
        };

        // Initialize a crashSeverity, which will be used as a key to access the appropriate layers, icons, and severity of crashes for layer group
        var crashSeverity;

        // Loop through the severity data, lat & lon data.
        for (var i = 0; i < severity.length; i++) {

          var station = Object.assign({}, [lat[i], lng[i], severity[i]]);
        


          //console.log(severity[i]);


          // If a crash severity = 1
          if (severity[i]<2) {
            crashSeverity = "Fender_Bender";
          }
          // If a crash severity = 2
          else if (severity[i]<3) {
            crashSeverity = "Moderate";
          }
          // If a crash severity = 3
          else if (severity[i]<4) {
            crashSeverity = "Bad";
          }
          // If a crash severity > 3
          else {
            crashSeverity = "Fatal";
          }
          //console.log(crashSeverity);
          // Update the crash count
          crashCount[crashSeverity]++;
          //Create a new marker with the appropriate icon and coordinates
          var newMarker = L.marker([lat[i],lng[i]], {
            icon: icons[crashSeverity]
            
          });
          // newMarker = L.marker([lat[i], lng[i]]).addTo(map).bounce();

          // Add the new marker to the appropriate layer
          newMarker.addTo(layers[crashSeverity]);

          //newMarker = L.marker([lat[i], lng[i]]).addTo(map).bounce();

          // Bind a popup to the marker that will  display on click. This will be rendered as HTML
          newMarker.bindPopup ("Details: <br>" + "City: " + city[i] + "<br> Weather Conditions: " + weather[i] + "<br>" + "Date/Time: " + time[i]);
          
        }

        //Call the updateLegend function, which will... update the legend!
        updateLegend(crashCount);
        //updateLegend(updatedAt, stationCount);
  });
}
//Update the legend's innerHTML with the last updated crash count
function updateLegend(crashCount) {
  document.querySelector(".legend").innerHTML = [
    //"<p>Updated: " + moment.unix(time).format("h:mm:ss A") + "</p>",
    "<p class='fender_bender'>Fender Bender: " + crashCount.Fender_Bender + "</p>",
    "<p class='moderate'>Moderate: " + crashCount.Moderate + "</p>",
    "<p class='bad'>Bad: " + crashCount.Bad + "</p>",
    "<p class='fatal'>Fatal: " + crashCount.Fatal + "</p>"
    
  ].join("");
}
