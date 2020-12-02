// @TODO: YOUR CODE HERE!

//create a scatter plot between two of the data variables such as `Healthcare vs. Poverty` or `Smokers vs. Age`.

//Setting up the height and width and margins before creating the graph
let svgWidth = 580;
let svgHeight = 380;

let margin = {
    top: 25,
    right: 45,
    bottom: 85,
    left: 105
}

let width = svgWidth - margin.left - margin.right;
let height = svgHeight - margin.top - margin.bottom;

//SVG wrapper, SVG group to hold the created chart and then shifting the latter by left and top margins:
let svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

//importing the data: 
d3.csv("data.csv", function(data){
    data.poverty = +data.poverty;
    data.healthcare = +data.healthcare;
    return data;
}).then(function(data) {
    console.log(data);
    
//Graph Scaling: 
var xLinearScale = d3.scaleLinear()
.domain([8, d3.max(data,function(d){
return +d.poverty;
})])
.range([0, width]);

var yLinearScale = d3.scaleLinear()
.domain([2, d3.max(data,function(d){
return +d.healthcare;
})])
.range([height, 0]);

// Create axis
var bottomAxis = d3.axisBottom(xScale);
var leftAxis = d3.axisLeft(yScale);

// Adding in bottom and left axis
chartGroup.append("g")
.attr("transform", 'translate(0, ${height}')
.call(bottomAxis);
chartGroup.append("g")
.call(leftAxis);

//Data Points: 
var circlesGroup = chartGroup.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", (d,i) => xScale(d.poverty))
    .attr("cy", d => yScale(d.healthcare))
    .attr("r", "15")
    .attr("fill", "blue")
    .classed("stateCircle", true)

// State abbreviations
chartGroup.selectAll("text")
    .data(data)
    .enter()
    .append("text")
    .attr("x", (d,i) => xScale(d.poverty))
    .attr("y", d => (yScale(d.healthcare-0.28)))
    .classed("stateText", true)
    .text(d => d.abbr)
    .on("mouseover", function(d) {
        toolTip.show(d);
    })
    .on("mouseout", function(d,i) {
        toolTip.hide(d);
    });

    // x labels
chartGroup.append("text")
.attr("transform", "rotate(-90)")
.attr("y", 0 - margin.left)
.attr("x", 0 - height / 2)
.attr("dy", "1em")
.classed("aText", true)
.attr("data-axis-name", "healthcare")
.text("Lacks Healthcare(%)");

// y labels
chartGroup.append("text")
.attr("transform", "translate(" + width / 2 + " ," + (height + margin.top + 20) + ")")
.attr("data-axis-name", "poverty")
.classed("aText", true)
.text("In Poverty (%)");

// ToolTip
var toolTip = d3.tip()
.attr("class", "tooltip")
.offset([-10, 30])
.html(function(d) {
    return ('${d.abbr}<br>Healthcare (%): ${d.healthcare}%<br>Poverty: ${d.poverty}');
});


// Using the tool tip into the chart group:
chartGroup.call(toolTip);

// Event listener for display and hide of ToolTip
circlesGroup.on("mouseover", function(d) {
toolTip.show(d);
})
.on("mouseout", function(d, i){
    toolTip.hide(d);
});

});
