function countyChanged() {

    // get a reference to the counties dropdown (select)
    var county = document.getElementById("counties");

    // get the selected value out of the dropdown (select)
    var selectedValue = county.options[county.selectedIndex].value;
    
    console.log(selectedValue);
}

function monthChanged() {
    // get a reference to the month dropdown (select)
    var month = document.getElementById("months");

    // get the selected value out of the dropdown (select)
    var selectedValue = month.options[month.selectedIndex].value;
    
    console.log(selectedValue);
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
        option.value = item.toLowerCase();
        
        // set the text (displayed on screen) to the county name
        option.text = item;
        
        // add the option to the dropdown (select) element
        select.add(option);
    });

}
