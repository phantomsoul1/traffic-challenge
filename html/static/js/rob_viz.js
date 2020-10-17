// Define SVG area dimensions
var svgWidth = 1100;
var svgHeight = 700;

// Define the chart's margins as an object
var chartMargin = {
    top: 30,
    right: 30,
    bottom: 30,
    left: 40
  };

// Define dimensions of the chart area
var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;

// Select body, append SVG area to it, and set the dimensions
var svg = d3.select("body")
  .append("svg")
  .attr("height", svgHeight)
  .attr("width", svgWidth);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);


queryUrl = "http://127.0.0.1:5000/all"
d3.json(queryUrl).then(function(crashes) {

    var weatherConditions = crashes.map(object => object.weather_condition);
    var severity = crashes.map(object => object.severity);
    console.log(weatherConditions)
    console.log(crashes)

    var fair = [];
    var cloudy = [];
    var mostlyCloudy = [];
    var clear = [];
    var partlyCloudy = [];
    var lightRain = [];
    var overcast = [];
    var rain = [];
    var lightSnow = [];
    var scatteredClouds = [];
    var fog = [];
    var fairWindy = [];
    var lightDrizzle = [];
    var snow = [];
    var icePellets= [];
    var heavyRain = [];
    var dump = [];

weatherConditions.forEach(function(condition){
    
    if (condition === "Fair"){
        fair.push(condition);
    }
    else if (condition === "Cloudy"){
        cloudy.push(condition);
    }
    else if (condition === "Mostly Cloudy"){
        mostlyCloudy.push(condition);
    }
    else if (condition === "Clear"){
        clear.push(condition);
    }
    else if (condition === "Partly Cloudy"){
        partlyCloudy.push(condition);
    }
    else if (condition === "Light Rain"){
        lightRain.push(condition);
    }
    else if (condition === "Overcast"){
        overcast.push(condition);
    }
    else if (condition === "Rain"){
        rain.push(condition);
    }
    else if (condition === "Light Snow"){
        lightSnow.push(condition);
    }
    else if (condition === "Scattered Clouds"){
        scatteredClouds.push(condition);
    }
    else if (condition === "Fog"){
        fog.push(condition);
    }
    else if (condition === "Light Drizzle"){
        lightDrizzle.push(condition);
    }
    else if (condition === "Heavy Rain"){
        heavyRain.push(condition);
    }
    else if (condition === "Fair / Windy"){
        fairWindy.push(condition);
    }
    else if (condition === "Snow"){
        snow.push(condition);
    }
    else if (condition === "Ice Pellets"){
        icePellets.push(condition);
    }
    else dump.push(condition);
});

var numFair = fair.length;
var numCloudy = cloudy.length;
var numMostlyCloudy = mostlyCloudy.length;
var numClear = clear.length;
var numPartlyCloudy = partlyCloudy.length;
var numLightRain = lightRain.length;
var numOvercast = overcast.length;
var numRain = rain.length;
var numLightSnow = lightSnow.length;
var numScatteredClouds = scatteredClouds.length;
var numFog = fog.length;
var numLightDrizzle = lightDrizzle.length;
var numFairWindy = fairWindy.length;
var numSnow = snow.length;
var numIcePellets = icePellets.length;
var numHeavyRain = heavyRain.length;

    var conditionCounts = {
            "Fair":numFair,
            "Cloudy":numCloudy,
            "Mostly Cloudy":numMostlyCloudy,
            "Clear": numClear,
            "Partly Cloudy": numPartlyCloudy,
            "Light Rain":numLightRain,
            "Overcast":numOvercast,
            "Rain":numRain,
            "Light Snow": numLightSnow,
            "Scattered Clouds": numScatteredClouds,
            "Fogs":numFog,
            "Light Drizzle":numLightDrizzle,
            "Heavy Rain" : numHeavyRain,
            "Fair/Windy": numFairWindy,
            "Snow": numSnow,
            "Ice Pellets": numIcePellets
            

    
    };

    var conditionArr = [
        {Condition:"Fair", Count: numFair},
        {Condition:"Cloudy", Count: numCloudy},
        {Condition:"Mostly Cloudy", Count: numMostlyCloudy},
        {Condition:"Clear", Count: numClear},
        {Condition:"Partly Cloudy", Count: numPartlyCloudy},
        {Condition:"Light Rain", Count: numLightRain},
        {Condition:"Overcast", Count: numOvercast},
        {Condition:"Rain", Count: numRain},
        {Condition:"Light Snow", Count: numLightSnow},
        {Condition:"Scattered Clouds", Count: numScatteredClouds},
        {Condition:"Fogs", Count: numFog},
        {Condition:"Light Drizzle", Count: numLightDrizzle},
        {Condition:"Heavy Rain", Count:  numHeavyRain},
        {Condition:"Fair/Windy", Count: numFairWindy},
        {Condition:"Snow", Count: numSnow},
        {Condition:"Ice Pellets", Count:  numIcePellets},

    ]
console.log(conditionArr);
var xBandScale = d3.scaleBand()
    .domain(conditionArr.map(d => d.Condition))
    .range([0, chartWidth])
    .padding(0.2);

  // Create a linear scale for the vertical axis.
  var yLinearScale = d3.scaleLinear()
    .domain([0, 4500])
    .range([chartHeight, 0]);

  // Create two new functions passing our scales in as arguments
  // These will be used to create the chart's axes
  var bottomAxis = d3.axisBottom(xBandScale);
  var leftAxis = d3.axisLeft(yLinearScale).ticks(10);

  // Append two SVG group elements to the chartGroup area,
  // and create the bottom and left axes inside of them

  chartGroup.append("g")
    .call(leftAxis);

  chartGroup.append("g")
    .attr("transform", `translate(0, ${chartHeight})`)
    .call(bottomAxis);


  // Create one SVG rectangle per piece of tvData
  // Use the linear and band scales to position each rectangle within the chart
  chartGroup.selectAll(".bar")
    .data(conditionArr)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", d => xBandScale(d.Condition))
    .attr("y", d => yLinearScale(d.Count))
    .attr("width", xBandScale.bandwidth())
    .attr("height", d => chartHeight - yLinearScale(d.Count));
  
})

