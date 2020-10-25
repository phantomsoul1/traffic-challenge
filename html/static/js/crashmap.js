var icons;
var layers;
var njmap;

function overlaysChanged() {
    document.getElementById("overlay").style.display = "block";
    var bounds = getBounds(layers);
    if (bounds) njmap.fitBounds(bounds);

    document.getElementById("overlay").style.display = "none";
}

function countyChanged() {
    document.getElementById("overlay").style.display = "block";
    url = buildURL();
    
    console.log(url);
    d3.json(url).then((crashes) => {
        console.log(crashes[0]);
        updateMarkers(crashes);
    });
}

function monthChanged() {
    document.getElementById("overlay").style.display = "block";
    url = buildURL();
    
    console.log(url);
    d3.json(url).then((crashes) => {
        updateMarkers(crashes);
    });
}

function bodyLoaded() {

    document.getElementById("overlay").style.display = "block";

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

    initMapDisplay();

    // load data from the api
    console.log(BASE_URL);
    var url = `${BASE_URL}all`;
    console.log(url);
    d3.json(url).then((crashes) => {

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
            option.value = item.toLowerCase().replace(' ', '+'); // urls cannot have whitespace characters, as in Cape May County
            
            // set the text (displayed on screen) to the county name
            option.text = item;
            
            // add the option to the dropdown (select) element
            select.add(option);
        });

        updateMarkers(crashes);
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

    query = "";

    if (county != "") {
        query += query.length == 0 ? "?" : "&";
        query += `county=${county}`;
    }

    if (month != "") {
        query += query.length == 0 ? "?" : "&";
        query += `month=${month}`;
    }

    if (query != "") {
        query = "crashes" + query;
    }
    else {
        query = "all";
    }
    
    return BASE_URL + query;
}

function initMapDisplay() {
    
    layers = [
        new L.FeatureGroup(), // fender bender
        new L.FeatureGroup(), // moderate
        new L.FeatureGroup(), // bad
        new L.FeatureGroup()  // fatal
    ];

    var mburl = 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accesstoken}';
    var mbattr = 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
    '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
    'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>';

    var grayscale = L.tileLayer(mburl, {
        id: 'mapbox/light-v9',
        tileSize: 512,
        zoomOffset: -1,
        attribution: mbattr,
        accesstoken: API_KEY
    });
    var streets = L.tileLayer(mburl, {
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        attribution: mbattr,
        accesstoken: API_KEY
    });

    var baselayers = {
        'Grayscale': grayscale,
        'Streets': streets
    };
    var overlays = {
        'Fender-Benders': layers[0],
        'Moderate': layers[1],
        'Bad': layers[2],
        'Fatal': layers[3]
    }

    njmap = L.map('mapblock', {layers: [grayscale, layers[0]]}).setView([40.0583, -74.4057], 8);
    L.control.layers(baselayers, overlays).addTo(njmap);

    njmap.on('overlayadd', overlaysChanged);
    njmap.on('overlayremove', overlaysChanged);

    var info = L.control({
        position: "bottomright"
    });
    info.onAdd = function() {
        return L.DomUtil.create("div", "legend");
    };
    info.addTo(njmap);
}

function updateMarkers(crashes) {
    console.log(crashes[0]);

    if (layers) {
        layers.forEach(layer => {
            layer.clearLayers()
        });

        var crashCount = [0, 0, 0, 0];

        crashes.forEach(crash => {
            var lat = crash.start_lat;
            var lng = crash.start_lng;
            var city = crash.city;
            var county = crash.county;
            var severity = parseInt(crash.severity, 10);
            var sindex = severity - 1;
            var icon = icons[sindex];
            var weather = crash.weather_condition;
            var isday = crash.civil_twilight;
            var time = crash.start_time;

            crashCount[sindex]++;

            L.marker([lat, lng], {icon: icon})
                .bindPopup(`<b>Details:</b><br>City:${city}<br>Weather Conditions: ${weather}<br>Date/Time: ${time}`)
                .addTo(layers[sindex])
                .on('mouseover', function() {
                    this.bounce(1);
                });
        });

        document.querySelector(".legend").innerHTML = [
            //"<p>Updated: " + moment.unix(time).format("h:mm:ss A") + "</p>",
            "<p class='fender_bender'>Fender Bender: " + crashCount[0] + "</p>",
            "<p class='moderate'>Moderate: " + crashCount[1] + "</p>",
            "<p class='bad'>Bad: " + crashCount[2] + "</p>",
            "<p class='fatal'>Fatal: " + crashCount[3] + "</p>"
            
        ].join("");

        var bounds = getBounds(layers);
        if (bounds) njmap.fitBounds(bounds);
    }

    document.getElementById("overlay").style.display = "none";
    console.log("Done.");
}

function getBounds(layers) {
    var bounds;
    layers.forEach(layer => {
        var lbounds = layer.getBounds();
        if (lbounds) {
            if (bounds) {
                bounds.extend(lbounds);
            }
            else {
                bounds = lbounds;
            }
        }
    })

    return bounds;
}
