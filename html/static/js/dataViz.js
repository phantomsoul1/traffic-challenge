function createCharts(myChart) {
  var queryUrl = `${BASE_URL}all`;

  d3.json(queryUrl).then(function(data) {
  console.log(data);
  
  // Create variables for data
  var crashes = data;
  var severity = crashes.map(object => object.severity);
  var counties = crashes.map(object => object.county);
  console.log(counties);

  //var sum = 0;
  
  // Create empty folders to append
  var capeMay = [];
  var mercer = [];
  var ocean = [];
  var monmouth = [];
  var camden = [];
  var cumberland = [];
  var bergen = [];
  var passiac = [];
  var sussex = [];
  var morris = [];
  var gloucester = [];
  var hudson = [];
  var warren = [];
  var union = [];
  var salem = [];
  var burlington = [];
  var somerset = [];
  var middlesex = [];
  var essex = [];
  var hunterdon = [];
  var atlantic = [];

counties.forEach(function(county){
  //sum += county;

  if (county === "Cape May") {
    capeMay.push(county);
  }
  else if (county === "Mercer") {
    mercer.push(county);
  }
  else if (county === "Ocean") {
    ocean.push(county);
  }
  else if (county === "Monmouth") {
    monmouth.push(county);
  }
  else if (county === "Camden") {
    camden.push(county);
  }
  else if (county === "Cumberland") {
    cumberland.push(county);
  }
  else if (county === "Bergen") {
    bergen.push(county);
  }
  else if (county === "Passiac") {
    passiac.push(county);
  }
  else if (county === "Sussex") {
    sussex.push(county);
  }
  else if (county === "Morris") {
    morris.push(county);
  }
  else if (county === "Hudson") {
    hudson.push(county);
  }
  else if (county === "Gloucester"){
    gloucester.push(county);
  }
  else if (county === "Warren"){
    warren.push(county);
  }
  else if (county === "Union"){
    union.push(county);
  }
  else if (county === "Salem"){
    salem.push(county);
  }
  else if (county === "Burlington"){
    burlington.push(county);
  }
  else if (county === "Somerset"){
    somerset.push(county);
  }
  else if (county === "Middlesex"){
    middlesex.push(county);
  }
  else if (county === "Essex"){
    essex.push(county);
  }
  else if (county === "Hunterdon"){
    hunterdon.push(county);
  }
  else {
    atlantic.push(county);
  }
});

//create array of length of county accidents
var numCapeMay = capeMay.length;
var numMercer = mercer.length;
var numOcean = ocean.length;
var numMonmouth = monmouth.length;
var numCamden = camden.length;
var numCumberland = cumberland.length;
var numBergen = bergen.length;
var numPassiac = passiac.length;
var numSussex = sussex.length;
var numMorris= morris.length;
var numGloucester = gloucester.length;
var numHudson = hudson.length;
var numWarren = warren.length;
var numUnion = union.length;
var numSalem = salem.length;
var numBurlington = burlington.length;
var numSomerset = somerset.length;
var numMiddlesex= middlesex.length;
var numEssex = essex.length;
var numHunterdon = hunterdon.length;
var numAtlantic = atlantic.length;
  
  console.log(numCapeMay);
  console.log(numMercer);
  console.log(numOcean);
  console.log(numMonmouth);
  console.log(numCamden);
  console.log(numCumberland);
  console.log(numBergen);
  console.log(numPassiac);
  console.log(numSussex);
  console.log(numMorris);
  console.log(numGloucester);
  console.log(numHudson);
  console.log(numWarren);
  console.log(numUnion);
  console.log(numSalem);
  console.log(numBurlington);
  console.log(numSomerset);
  console.log(numMiddlesex);
  console.log(numEssex);
  console.log(numHunterdon);
  console.log(numAtlantic);

  var countyLengths = [
        numCapeMay,
        numMercer,
        numOcean,
        numMonmouth,
        numCamden,
        numCumberland,
        numBergen,
        numPassiac,
        numSussex,
        numMorris,
        numGloucester,
        numHudson,
        numWarren,
        numUnion,
        numSalem,
        numBurlington,
        numSomerset,
        numMiddlesex,
        numEssex,
        numHunterdon,
        numAtlantic
  ];

  console.log(countyLengths); 

  var set = new Set(counties);
  console.log(counties);

  function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }
  var unique = counties.filter(onlyUnique);
  var unique = unique.sort();
  console.log(unique);

  var bubbleTrace = {
    x: unique,
    y: countyLengths,
    mode: 'markers',
    marker: {
      size: countyLengths,
      //setting 'sizeref' to less than 1, increases the rendered marker sizes
      sizeref: 0.2,
      sizemode: 'area',
      color: unique,
      colorscale: "Bluered"
    }
    };

  var bubbleData = [bubbleTrace];

  var bubbleLayout = {
    title: "Traffic Accidents by NJ Counties (2019)",
    xaxis: { title: "Counties"},
    yaxis: { title: "Frequency"}
  };

  Plotly.newPlot("myDiv", bubbleData, bubbleLayout);

  }); 
  
}
createCharts();
// When the browser window is resized, responsify() is called.
d3.select(window).on("resize", createCharts);