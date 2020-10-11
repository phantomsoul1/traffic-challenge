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
  center: [34.0522, -118.2437],
  zoom: 4,
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

// Perform an API call to the Citi Bike Station Information endpoint
var queryUrl = "http://127.0.0.1:5000/crashes"

//d3.json("https://gbfs.citibikenyc.com/gbfs/en/station_information.json", function(infoRes) {

  // When the first API call is complete, perform another call to the Citi Bike Station Status endpoint
  //var queryUrl = "Data.js" 
  d3.json(queryUrl, function(crashes)  {
    var lat = crashes.map(data => data.start_lat);
    var lng = crashes.map(data => data.start_lng);
    //lat = +lat
    //lng = +lng
    // var mark = L.marker([
    //   parseFloat(crashes[["start_lat"]]),
    //   parseFloat(crashes[["start_lng"]])
    // ]);
    var severity = crashes.map(data => data.severity);
    //var lat = crashes[0].start_lat;
    //var lng = crashes[0].start_lng;
    //var severity = crashes[0].severity;
    console.log(lat);
    console.log(lng);
    console.log(severity);
      

    var stationCount = {
      Fender_Bender: 0,
      Moderate: 0,
      Bad: 0,
      Fatal: 0
    };
    //   //Create a InfoBox Function
    //   function createInfoBox(bellyButtonId) {
    //     // use d3 library to read in `samples.json`
    //     d3.json("./samples.json").then((data) => {
    //         // get the metadata info
    //     var metaDataInfo = data.metadata;
    //     console.log(metaDataInfo);
    //     //filter meta data info by id
    //     var resultArray = metaDataInfo.filter(object => object.id == bellyButtonId);
    //     var result = resultArray[0];
    //     console.log(result);

    //     var infoBox = d3.select("#sample-metadata");
    //     infoBox.html("");

    //     Object.entries(result).forEach(([key, value]) => {
    //         infoBox.append("h5").text(`${key}: ${value}`);
    //     });
    // });
    // }
   
    // Create an object to keep of the number of markers in each layer
    // var stationCount = {
    //   COMING_SOON: 0,
    //   EMPTY: 0,
    //   LOW: 0,
    //   NORMAL: 0,
    //   OUT_OF_ORDER: 0
    // };

    // Initialize a stationStatusCode, which will be used as a key to access the appropriate layers, icons, and station count for layer group
    var stationStatusCode;

    // Loop through the stations (they're the same size and have partially matching data)
    for (var i = 0; i < severity.length; i++) {
      //L.marker([lat[i],lng[i]]).addTo(map);
      // Create a new station object with properties of both station objects
      var station = Object.assign({}, [lat[i], lng[i], severity[i]]);
      // var mark = L.marker(
      //   L.latLng(
      //     parseFloat(item["Latitude"]),
      //     parseFloat(item["Longitude"])
      //   )
      // );


      console.log(severity[i]);


      // If a station is listed but not installed, it's coming soon
      if (severity[i]<2) {
        stationStatusCode = "Fender_Bender";
      }
      // If a station has no bikes available, it's empty
      else if (severity[i]<3) {
        stationStatusCode = "Moderate";
      }
      // If a station is installed but isn't renting, it's out of order
      else if (severity[i]<4) {
        stationStatusCode = "Bad";
      }
      // Otherwise the station is normal
      else {
        stationStatusCode = "Fatal";
      }
      console.log(stationStatusCode);
      // Update the station count
      stationCount[stationStatusCode]++;
      // Create a new marker with the appropriate icon and coordinates
      var newMarker = L.marker([lat[i],lng[i]], {
        icon: icons[stationStatusCode]
        
      });

      // Add the new marker to the appropriate layer
      newMarker.addTo(layers[stationStatusCode]);

      // Bind a popup to the marker that will  display on click. This will be rendered as HTML
      newMarker.bindPopup ("Details <br>" + "Latitude: " + lat[i] + "<br> Longitude: " + lng[i] + "<br>" + " Severity: " + severity[i]);
      //newMarker.bindPopup `Latitude: ${(lat[i])}  <br> Capacity: ${(lng[i])}  <br>  Severity: ${(severity[i])}`;
    }

    //Call the updateLegend function, which will... update the legend!
    updateLegend(stationCount);
    //updateLegend(updatedAt, stationCount);
});

//Update the legend's innerHTML with the last updated time and station count
function updateLegend(stationCount) {
  document.querySelector(".legend").innerHTML = [
    //"<p>Updated: " + moment.unix(time).format("h:mm:ss A") + "</p>",
    "<p class='fender_bender'>Fender Bender: " + stationCount.Fender_Bender + "</p>",
    "<p class='moderate'>Moderate: " + stationCount.Moderate + "</p>",
    "<p class='bad'>Bad: " + stationCount.Bad + "</p>",
    "<p class='fatal'>Fatal: " + stationCount.Fatal + "</p>"
    
  ].join("");
}
