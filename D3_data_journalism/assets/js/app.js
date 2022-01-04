var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

//Checked Data and print into consol log
d3.csv("assets/data/data.csv").then(function(censusdata){console.log(censusdata)});

// Import Data
d3.csv("assets/data/data.csv").then(function(censusdata){
  
  //Parse Data as numbers
  censusdata.forEach(function(data){
    data.poverty = +data.poverty;
    data.healthcare = +data.healthcare;
  })

// Create scales
  var xLinearScale = d3.scaleLinear()
    .domain([8,d3.max(censusdata, d => d.poverty)]) 
    .range([0, width]);

  var yLinearScale = d3.scaleLinear()
    .domain([0,d3.max(censusdata, d => d.healthcare)]) 
    .range([height,0]);

// Create initial Axis function
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

// Append x axis
  chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

// Append y axis
  chartGroup.append("g")
    .call(leftAxis);

// Append initial circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(censusdata)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", 15)
    .attr("fill", "purple")
    .attr("opacity", ".70");

// Add label for each circle
    var circlesText = chartGroup.append("text")
    .style("text-anchor","middle")
    .selectAll("tspan")
    .data(censusdata)
    .enter()
    .append("tspan")
    .text(d => d.abbr)
    .attr("x", d=> xLinearScale(d.poverty))
    .attr("y", d => yLinearScale(d.healthcare)+5);



// Create axes labes
chartGroup.append("text")
.attr("transform", "rotate(-90)")
.attr("y", 0 - margin.left)
.attr("x", 0 - (height) / 2)
.attr("dy", "1em")
// .attr("class", "axisText")
.classed("axis-text", true)
.text("Healthcare (%)");

  chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      // .attr("class", "axisText")
      .classed("axis-text", true)
      .text("In Poverty (%)");


// Create Tooltip
var toolTip = d3.tip()
.attr("class", "tooltip")
.offset([80, -40])
.html(function(d) {
  return (`State: ${d.state} (${d.abbr})<br> Poverty (%): ${d.poverty}<br> Healthcare (%): ${d.healthcare}`);
});

// chartGroup.call(toolTip);
circlesGroup.call(toolTip);

//Create Event listeners to display and hide tooltips
circlesGroup.on("mouseover", function(data) {
toolTip.show(data, this);
})
// onmouseout event
.on("mouseout", function(data, index) {
  toolTip.hide(data);
});

// return circlesGroup;

}).catch(function(error) {
  console.log(error);


});

