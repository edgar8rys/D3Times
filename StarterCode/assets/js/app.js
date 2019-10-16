// set the chart dimensions 
var svgHeight = 500;
var svgWidth = 900;

// set margins
var margins = {
    top: 30,
    right: 30,
    bottom: 60,
    left: 100
};

// set actual chart dimensions (accounting for margins)
var width = svgWidth - margins.left - margins.right;
var height = svgHeight - margins.top - margins.bottom;

// create the svg wrapper and append the chart group
var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

var chartGroup = svg.append("g")
    .attr("transform", `translate(${margins.left}, ${margins.top})`);

//import data from csv
d3.csv("assets/data/data.csv").then(lifeData => {
    
    console.log(lifeData);
    // format the data. Defines data needed as integers
    lifeData.forEach(function(data) {
        data.income = +data.income;
        data.healthcare = +data.healthcare;
        data.healthcareHigh = +data.healthcareHigh;
        data.healthcareLow = +data.healthcareLow;
    });

    // create scales
    var xScale = d3.scaleLinear()
        .domain(d3.extent(lifeData, d => d.obesity))
        .range([0, width]);

    var yScale = d3.scaleLinear()
        .domain(d3.extent(lifeData, d => d.income))
        .range([height, 0]);

    // create axis
    var bottomAxis = d3.axisBottom(xScale);
    var leftAxis = d3.axisLeft(yScale)

    // append axis to the chartGroup
    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    chartGroup.append("g")
        .call(leftAxis);

    //create circles
    var circleGroup = chartGroup.selectAll("circle")
        .data(lifeData)
        .enter()
        .append("circle")
        .attr("cx", d => xScale(d.obesity))
        .attr("cy", d => yScale(d.income))
        .attr("r", "15")
        .classed("stateCircle", true)
        .attr("opacity", ".75")

    // add text element within chartGroup
    var textLabels = chartGroup.selectAll()
        .data(lifeData)
        .enter()
        .append("text")
        .attr("x", d => xScale(d.obesity))
        .attr("y", d => yScale(d.income))
        .text(d => d.abbr)
        .classed("stateText", true);

    // axes labels
    chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margins.top + 20})`)
        .attr("class", "axisText")
        .text("Obesity (%)");

    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margins.left + 20)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Income ($)");

    // create a tooltip
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .html(d => `State: ${d.state} <br> Income: ${d.income} <br> Obesity: ${d.obesity}`);

    chartGroup.call(toolTip);

    // event listeners to show and hide tool tip
    chartGroup.on("click", function(data){
        toolTip.show(data, this);
    })
        .on("mouseout", function(data, index){
            toolTip.hide(data);
        });


});