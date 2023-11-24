var countryUrl = baseUrl + 'getCountryList';
var countryList = [];
var countrySelect2 = document.getElementById('country-select2');
fetch(countryUrl).
    then(response => response.json())
    .then(countries => {
        countryList = countries;
        console.log(countryList);
        assignCountryInFilter2();
        
    })
    .catch(error => console.log('Error in fetching countries ' + error));

function assignCountryInFilter2() {
    countryList.forEach(element => {
        const option = document.createElement('option');
        option.value = element;
        option.textContent = element;
        countrySelect2.appendChild(option);
    });
    // console.log(countries);
}
var jsonData1 = [];
var url1 = baseUrl + 'timeSeriesofOilProduction'
fetch(url1)
    .then(data => data.json())
    .then(data => {
        jsonData1 = data;
        // console.log(jsonData1);
        updateOilChart();
        
    })
    .catch(error => console.log(error));



function updateOilChart() {
    var margin = { top: 20, right: 20, bottom: 50, left: 50 };
    var width = 600 - margin.left - margin.right;
    var height = 400 - margin.top - margin.bottom;

    
    var startYear = parseInt(document.getElementById("startYearInput").value);
    var endYear = parseInt(document.getElementById("endYearInput").value);

    var country = countrySelect2.value?countrySelect2.value:'India'
    console.log(country);
    var filteredData = jsonData1.filter(function (d) {
        return d.start_year >= startYear && d.start_year <= endYear && country === d.country;
    });

    // Remove existing SVG elements
    d3.select("#oilChart").selectAll("svg").remove();

    // Create SVG element
    var svg = d3.select("#oilChart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Define scales
    var xScale = d3.scaleTime().range([0, width]);
    var yScale = d3.scaleLinear().range([height, 0]);

    // Set domain for scales
    xScale.domain([new Date(startYear, 0, 1), new Date(endYear, 0, 1)]);
    yScale.domain([0, d3.max(filteredData, function (d) { return d.intensity; })]);

    // Draw x-axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .attr("class", "x-axis")
        .call(d3.axisBottom(xScale));

    // X-axis label
    svg.append("text")
    .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.top + 20) + ")")
    .style("text-anchor", "middle")
    .text("year");

    // Draw y-axis
    svg.append("g")
        .attr("class", "y-axis")
        .call(d3.axisLeft(yScale));

    // Y-axis label
    svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Intensity");

    // Draw line
    var line = d3.line()
        .x(function (d) { return xScale(new Date(d.start_year, 0, 1)); })
        .y(function (d) { return yScale(d.intensity); });
            
    svg.append("path")
        .datum(filteredData)  
        .attr("class", "line")
        .attr("transform", "translate(" + 100 + "," + 100 + ")")
        .attr("d", line)
        .style("fill", "none")
        .style("stroke", "#CC0000")
        .style("stroke-width", "2");
    // svg.append("path")
    //   .datum([filteredData])
    //   .attr("fill", "none")
    //   .attr("stroke", "steelblue")
    //   .attr("stroke-width", 1.5)
    //   .attr("d", d3.line()
    //     .x(function(d) { return xScale(d.start_year) }) 
    //     .y(function(d) { return yScale(d.intensity) })
    //     )
}

countrySelect2.addEventListener('change', updateOilChart);