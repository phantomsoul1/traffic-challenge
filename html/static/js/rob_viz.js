const svg = d3.select("svg"), 
margin = {top: 20, right: 20, bottom: 30, left: 40}, 
width = +svg.attr("width") - margin.left - margin.right, 
height = +svg.attr("height") - margin.top - margin.bottom, 
x = d3.scaleBand().rangeRound([0, width]).padding(0.2), 
y = d3.scaleLinear().rangeRound([height, 0]), 
g = svg.append("g") 
.attr("transform", `translate(${margin.left},${margin.top})`);

d3.json("http://127.0.0.1:5000/all").then((crashes) => {
    console.log(crashes);

    nestedData = d3.nest()
        .key(function(d) {return d.county;})
        .key(function(d) {return d.city;})
        .rollup(function(d){ return function(d){d3.mean(d.severity)}})
        .entries(crashes)
    
    console.log(nestedData)
    x.domain(nestedData.map(d => d.city));
    y.domain([0,d3.max(nestedData, d=> d.severity)])

    g.append("g")
     .attr("class", "axis axis-x")
     .attr("transform", `translate(0,${height})`)
     .call(d3.axisBottom(x));
    
    g.append("g")
     .attr("class", "axis axis-y")
     .call(d3.axisLeft(y).ticks(10));
    
    g.selectAll(".bar")
     .data(nestedData)
     .enter().append("rect")
     .attr("class", "bar")
     .attr("x", d => x(d.city))
     .attr("y", d => y(d.severity))
     .attr("width", x.bandwidth())
     .attr("height", d => height - y(d.severity))
});