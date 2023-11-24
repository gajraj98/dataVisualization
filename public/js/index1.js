var currentTopic = "oil";
topicList = [];
var jsonData = [];
const topicUrl = baseUrl + "topic";
var topicSelect = document.getElementById('topicDropdown');
fetch(topicUrl).
    then(response => response.json())
    .then(topic => {
        topicList = topic;
        assignTopicInFilter();
    })
    .catch(error => console.log('Error in fetching countries ' + error));

function assignTopicInFilter() {
    topicList.forEach(element => {
        const option = document.createElement('option');
        option.value = element;
        option.textContent = element;
        topicSelect.appendChild(option);
    });
    // console.log(countries);

}
// Set up the chart dimensions


var url = baseUrl + 'regionalImpactOnOilAndGasPrices'
fetch(url)
    .then(data => data.json())
    .then(data => {
        jsonData = data;
        updateOilAndGasChart();
        console.log(jsonData);
    })
    .catch(error => console.log(error));


// Initial draw


// Update function
function updateOilAndGasChart() {
    // Get selected topic
    currentTopic = document.getElementById("topicDropdown").value;

    // Filter data based on the selected topic
    var filteredData = jsonData.filter(function (d) {
        return d.topic === currentTopic;
    });

    // Set up the chart dimensions
    var margin = { top: 20, right: 20, bottom: 50, left: 50 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // Remove existing SVG elements
    d3.select("#chart").selectAll("svg").remove();

    // Create SVG element
    var svg = d3.select("#chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Define scales
    var xScale = d3.scaleBand()
        .range([0, width])
        .padding(0.1)
        .domain(filteredData.map(function (d) { return d.region; }));

    var yScale = d3.scaleLinear()
        .range([height, 0])
        .domain([0, d3.max(filteredData, function (d) { return d.intensity; })]);

    // Draw x-axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale))
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("transform", "rotate(-45)")
        .attr("dy", "0.15em"); // Adjust rotation position

    // X-axis label
    svg.append("text")
        .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.top + 20) + ")")
        .style("text-anchor", "middle")
        .text("Region");

    // Draw y-axis
    svg.append("g")
        .call(d3.axisLeft(yScale));

    // Y-axis label
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Intensity");

    // Join data
    var bars = svg.selectAll(".bar")
        .data(filteredData);

    // Exit old elements
    bars.exit().remove();

    // Update existing elements
    bars.attr("x", function (d) { return xScale(d.region); })
        .attr("width", xScale.bandwidth())
        .attr("y", function (d) { return yScale(d.intensity); })
        .attr("height", function (d) { return height - yScale(d.intensity); });

    // Enter new elements
    bars.enter().append("rect")
        .attr("class", "bar")
        .attr("x", function (d) { return xScale(d.region); })
        .attr("width", xScale.bandwidth())
        .attr("y", function (d) { return yScale(d.intensity); })
        .attr("height", function (d) { return height - yScale(d.intensity); });
}
