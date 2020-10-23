var accessToken = "pk.eyJ1IjoicGhhbnRvbXNvdWwiLCJhIjoiY2tmcHl4eXA1MGZ0djJyczlqMjc1OWU2MyJ9.3q0uTnkUZT618c4IH31CkQ";
var icons;
var layers;
var njmap;
var markerGroup;



function countyChanged() {
    url = buildURL();
    
    console.log(url);
    d3.json(buildURL(), (crashes) => {
        updateMarkers(crashes);
    });
}

function monthChanged() {
    url = buildURL();
    
    console.log(url);
    d3.json(buildURL(), (crashes) => {
        updateMarkers(crashes);
    });
}

function bodyLoaded() {

    icons = [
        L.ExtraMarkers.icon({
            icon: "ion-android-car",
            iconColor: "white",
            markerColor: "green",
            shape: "circle"
        }),
        L.ExtraMarkers.icon({
            icon: "ion-android-car",
            iconColor: "white",
            markerColor: "orange",
            shape: "circle"
        }),
        L.ExtraMarkers.icon({
            icon: "ion-android-car",
            iconColor: "white",
            markerColor: "red",
            shape: "circle",
            //iconSize: [400, 900]
        }),
        L.ExtraMarkers.icon({
            icon: "ion-android-car",
            iconColor: "white",
            markerColor: "black",
            shape: "circle"
        })
    ];

    // load data from the api
    d3.json("http://127.0.0.1:5000/all", (crashes) => {

        // maps api result to just counties
        var counties = crashes.map(c => c.county);
        
        // removes duplicates by only keeping items who's first occurence is the same as the tested occurence within the array
        counties = counties.filter((item, pos) => counties.indexOf(item) == pos);
        
        // sorts the remaining array by ASCII ascending order (default)
        counties = counties.sort();
        
        // gets a reference the counties dropdown (select) element
        var select = document.getElementById("counties");
        var options = select.options;

        // for each county in the counties list, add it as an option to the list
        counties.forEach(function(item, index) {
            
            // create a new option element
            var option = document.createElement("option");
            
            // set its value to the lowercased county name (to help make it case insensitive)
            option.value = item.toLowerCase();
            
            // set the text (displayed on screen) to the county name
            option.text = item;
            
            // add the option to the dropdown (select) element
            select.add(option);
        });
    });

    // gets a list of month names by taking a counting array of 1-12 and getting each number's localized full month name
    var months = Array.from({length: 12}, (e, i) => {
        return new Date(null, i + 1, null).toLocaleDateString("en", {month: "long"});
    });
    
    // gets a reference the counties dropdown (select) element
    select = document.getElementById("months");
    options = select.options;

    // for each county in the counties list, add it as an option to the list
    months.forEach(function(item, index) {
        
        // create a new option element
        var option = document.createElement("option");
        
        // set its value to the lowercased county name (to help make it case insensitive)
        option.value = index + 1;
        
        // set the text (displayed on screen) to the county name
        option.text = item;
        
        // add the option to the dropdown (select) element
        select.add(option);
    });

    njmap = L.map('mapblock').setView([51.505, -0.09], 13);

    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: accessToken
}).addTo(njmap);

    // layers = [
    //     new L.LayerGroup(), // fender bender
    //     new L.LayerGroup(), // moderate
    //     new L.LayerGroup(), // bad
    //     new L.LayerGroup()  // fatal
    // ];

    // var mburl = 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accesstoken}';
    // var mbattr = 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
    // '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
    // 'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>';

    // var grayscale = L.tileLayer(mburl, {
    //     id: 'mapbox/light-v9',
    //     tileSize: 512,
    //     zoomOffset: -1,
    //     attribution: mbattr,
    //     accesstoken: accessToken
    // });
    // var streets = L.tileLayer(mburl, {
    //     id: 'mapbox/streets-v11',
    //     tileSize: 512,
    //     zoomOffset: -1,
    //     attribution: mbattr,
    //     accesstoken: accessToken
    // });

    // create a map object in the page's mapblock element
    // njmap = L.map('mapblock', {layers: [grayscale, layers[0]]});
    // njmap = L.map('mapblock');
    // streets.addTo(njmap);

    // var baselayers = {
    //     'Grayscale': grayscale,
    //     'Streets': streets
    // };
    // var overlays = {
    //     'Fender-Benders': layers[0],
    //     'Moderate': layers[1],
    //     'Bad': layers[2],
    //     'Fatal': layers[3]
    // }

    // create and add a mapbox street tile layer to the map
    // var basemap = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    //     attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    //     maxZoom: 18,
    //     id: 'mapbox/streets-v11',
    //     tileSize: 512,
    //     zoomOffset: -1,
    //     accessToken: accessToken
    // });
    // basemap.addTo(njmap);

    //markerGroup = L.featureGroup().addTo(njmap);

    // L.control.layers(baselayers, overlays).addTo(njmap);

    // var info = L.control({
    //     position: "bottomright"
    // });
    // info.onAdd = function() {
    //     return L.DomUtil.create("div", "legend");
    // };
    // info.addTo(njmap);

    // d3.json(buildURL(), (crashes) => {
    //     updateMarkers(crashes);
    // });
}

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

function updateMarkers(crashes) {
    // console.log(crashes[0]);

    // if (layers) {
    //     layers.forEach((group) => group.clearLayers());

    //     var crashCount = [0, 0, 0, 0];

    //     crashes.forEach(crash => {
    //         var lat = crash.start_lat;
    //         var lng = crash.start_lng;
    //         var city = crash.city;
    //         var county = crash.county;
    //         var severity = parseInt(crash.severity, 10);
    //         var sindex = severity - 1;
    //         var icon = icons[sindex];
    //         var weather = crash.weather_condition;
    //         var isday = crash.civil_twilight;
    //         var time = crash.start_time;

    //         crashCount[sindex]++;

    //         L.marker([lat, lng], {
    //             icon: icon
    //         }).bindPopup(`<b>Details:</b><br>City:${city}<br>Weather Conditions: ${weather}<br>Date/Time: ${time}`)
    //             .addTo(layers[sindex]);
    //     });

    //     document.querySelector(".legend").innerHTML = [
    //         //"<p>Updated: " + moment.unix(time).format("h:mm:ss A") + "</p>",
    //         "<p class='fender_bender'>Fender Bender: " + crashCount[0] + "</p>",
    //         "<p class='moderate'>Moderate: " + crashCount[1] + "</p>",
    //         "<p class='bad'>Bad: " + crashCount[2] + "</p>",
    //         "<p class='fatal'>Fatal: " + crashCount[3] + "</p>"
            
    //       ].join("");

    //     //njmap.fitBounds(layers.getBounds());
    // }

    // console.log("Done.");
}
