var accessToken = "pk.eyJ1IjoicGhhbnRvbXNvdWwiLCJhIjoiY2tmcHl4eXA1MGZ0djJyczlqMjc1OWU2MyJ9.3q0uTnkUZT618c4IH31CkQ";
var njmap;
var markerLayerGroup;

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

    // create a map object in the page's mapblock element
    njmap = L.map('mapblock').setView([40.07, -74.558333], 8);

    // create and add a mapbox street tile layer to the map
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: accessToken
    }).addTo(njmap);

    markerLayerGroup = L.layerGroup().addTo(njmap);

    d3.json(buildURL(), (crashes) => {
        updateMarkers(crashes);
    })
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
    console.log(crashes[0]);

    if (markerLayerGroup) {
        markerLayerGroup.clearLayers();

        crashes.forEach(crash => {
            L.marker([crash.start_lat, crash.start_lng]).addTo(markerLayerGroup);
        });

        //console.log(markerLayerGroup.getBounds());
        //njmap.fitBounds(markerLayerGroup.getBounds());
    }
}
