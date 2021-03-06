// @TODO: YOUR CODE HERE!

//create a scatter plot between two of the data variables such as `Healthcare vs. Poverty` or `Smokers vs. Age`.

//Setting up the height and width and margins before creating the graph
let svgWidth = 1000;
let svgHeight = 600;

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
d3.csv("assets/data/data.csv", function(data){
    data.poverty = +data.poverty;
    data.healthcare = +data.healthcare;
    return data;
}).then(function(data) {
    console.log(data);
    console.log(data.abbr)
    
//Graph Scaling: 
var xScale = d3.scaleLinear()
.domain([8, d3.max(data,function(d){
return +d.poverty;
})])
.range([0, width]);

var yScale = d3.scaleLinear()
.domain([2, d3.max(data,function(d){
return +d.healthcare;
})])
.range([height, 0]);

// Create axis
var xAxis = d3.axisBottom(xScale);
var yAxis = d3.axisLeft(yScale);

// Adding in x and y axis
chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(xAxis);
chartGroup.append("g")
    .call(yAxis);

//Data Points: 
var circlesGroup = chartGroup.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", d => xScale(d.poverty))
    .attr("cy", d => yScale(d.healthcare))
    .attr("r", "10")
    .attr("fill", "green")
    .classed("stateCircle", true);

// State abbreviations
chartGroup.selectAll(".stateText")
    .data(data)
    .enter()
    .append("text")
    .attr("x", d => xScale(d.poverty))
    .attr("y", d => (yScale(d.healthcare-0.28)))
    .classed("stateText", true)
    .text(function(d){
        console.log(d.abbr);
        return(d.abbr)
    });
 


// x labels
chartGroup.append("text")
.attr("transform", "rotate(-90)")
.attr("y", 0 - margin.left)
.attr("x", 0 - (height / 2)-50)
.attr("dy", "1em")
.classed("Text", true)
.attr("data-axis-name", "healthcare")
.text("Lacks Healthcare(%)");

// y labels                                                                            
chartGroup.append("text")
.attr("transform", "translate(" + width / 2 + " ," + (height + margin.top + 20) + ")")
.attr("data-axis-name", "poverty")
.classed("Text", true)
.text("In Poverty (%)");

// ToolTip
var toolTip = d3.tip()
.attr("class", "d3-tip")
.offset([-10, 30])
.html(function(d) {
    return (`${d.state}<br>Poverty: ${d.poverty}%
            <br>Healthcare: ${d.healthcare}%`);
            });


// Using the tool tip into the chart group:
chartGroup.call(toolTip);

// Event listener for display and hide of ToolTip
circlesGroup.on("mouseover", function(d) {
toolTip.show(d, this);
})
.on("mouseout", function(d){
    toolTip.hide(d);
});

});
