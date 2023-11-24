const baseUrl = "http://localhost:3000/";
var fileData = [];
var errorData = [];
var processCount = 0;


async function processData() {
    try {
        var file = $('#dataFile')[0].files[0];
        const results = await readFileData(file);
        // Process the results
        readFileDataCallback(results);
    } catch (error) {
        console.error('Error reading file data:', error);
    }
}
function readFileDataCallback(results) {
    console.log(results); // Log the entire results object
    fileData = results
    uploadRows();

}





function uploadRows() {

    updateUploadDialog();

    var row = fileData;
    processCount++;

    var json = JSON.stringify(row);
    var url = baseUrl + 'index';
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: json
    };
    // console.log(json);
    fetch(url, options)
        .then(res => {
            if (!res.ok) {
                throw new Error("Network response is not ok!");
            } else {
                return res.text();
            }
        })
        .then(data => {
            // uploadRows();
        })
        .catch(error => {
            row.error = JSON.parse(response.responseText).message;
            errorData.push(row);
            // uploadRows();
        })
}

function downloadErrors() {
    if (errorData.length == 0) {
        alert("Nothing to download");
    }
    else {
        writeFileData(errorData);
    }
}
function resetUploadDialog() {
    //Reset file name
    var $file = $('#dataFile');
    $file.val('');
    $('#dataFileName').html("Choose File");
    //Reset various counts
    processCount = 0;
    fileData = [];
    errorData = [];
    //Update counts
    updateUploadDialog();
}

function updateUploadDialog() {
    $('#rowCount').html("" + fileData.length);
    $('#processCount').html("" + processCount);
    $('#errorCount').html("" + errorData.length);
}

function updateFileName() {
    var $file = $('#dataFile');
    var fileName = $file.val();
    $('#dataFileName').html(fileName);
}
function enableUpload() {
    var btn = document.getElementById("process-data");
    btn.disabled = false;
}
function displayUploadData() {
    resetUploadDialog();
    console.log('displayData');
    var btn = document.getElementById("process-data");
    btn.disabled = true;
    $('#upload-data-modal').modal('toggle');
}
function readFileData(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (event) => {
            try {
                const text = event.target.result;
                const jsonData = JSON.parse(text);
                // Check if jsonData is an array with a length property
                if (Array.isArray(jsonData) && jsonData.length !== undefined) {
                    resolve(jsonData);
                } else {
                    reject(new Error('Invalid JSON data format'));
                }
            } catch (error) {
                reject(error);
            }
        };

        reader.onerror = (event) => {
            reject(event.error);
        };

        reader.readAsText(file);
    });
}





function writeFileData(arr) {
    var config = {
        quoteChar: '',
        escapeChar: '',
        delimiter: "\t"
    };

    var data = Papa.unparse(arr, config);
    var blob = new Blob([data], { type: 'text/tsv;charset=utf-8;' });
    var fileUrl = null;

    if (navigator.msSaveBlob) {
        fileUrl = navigator.msSaveBlob(blob, 'download.tsv');
    } else {
        fileUrl = window.URL.createObjectURL(blob);
    }
    var tempLink = document.createElement('a');
    tempLink.href = fileUrl;
    tempLink.setAttribute('download', 'download.tsv');
    tempLink.click();
}
function init() {
    $('#upload-data').click(displayUploadData);
    $('#process-data').click(processData);
    $('#download-errors').click(downloadErrors);
}

$(document).ready(init);


// filtering and adding graph from here

var countrySelect = document.getElementById('country-select');
var countrySelect1 = document.getElementById('country-select1');
var chartContainer = document.getElementById('chart-container');
var countryUrl = baseUrl + 'getCountryList';
var countryList = [];

fetch(countryUrl).
    then(response => response.json())
    .then(countries => {
        countryList = countries;
        assignCountryInFilter();
    })
    .catch(error => console.log('Error in fetching countries ' + error));

function assignCountryInFilter() {
    countryList.forEach(element => {
        const option = document.createElement('option');
        option.value = element;
        option.textContent = element;
        countrySelect.appendChild(option);
    });
    // console.log(countries);
    updateChart();
}
function updateChart() {
    var getEconomicGrowth = baseUrl + "ecnomicGrowth"
    var div = document.getElementById('error');
    fetch(getEconomicGrowth)
        .then(response => response.json())
        .then(data => {
            var selectedCountry = countrySelect.value ? countrySelect.value : 'India';
            var filteredData = selectedCountry ? data.filter(entry => entry.country === selectedCountry) : div.innerHTML = "Please select the country";
            console.log(filteredData);
            if (selectedCountry) {
                chartContainer.innerHTML = '';

                // Set up the chart dimensions
                const margin = { top: 50, right: 30, bottom: 80, left: 60 };
                const width = 600 - margin.left - margin.right;
                const height = 400 - margin.top - margin.bottom;

                // Create SVG container
                const svg = d3.select("#chart-container")
                    .append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", `translate(${margin.left},${margin.top})`);

                // Define scales
                const xScale = d3.scaleBand()
                    .domain(filteredData.map(d => d.title))
                    .range([0, width])
                    .padding(0.2);

                const yScale = d3.scaleLinear()
                    .domain([0, d3.max(filteredData, d => Math.max(d.likelihood, d.relevance))])
                    .range([height, 0]);

                // Create bars
                svg.selectAll("rect")
                    .data(filteredData)
                    .enter()
                    .append("rect")
                    .attr("x", d => xScale(d.title))
                    .attr("y", d => yScale(d.relevance))
                    .attr("width", xScale.bandwidth())
                    .attr("height", d => height - yScale(d.relevance))
                    .attr("fill", "steelblue");

                // Create axes
                const xAxis = d3.axisBottom(xScale)
                    .tickFormat(d => d.length > 15 ? d.slice(0, 15) + "..." : d)
                    .tickSizeOuter(0);

                const yAxisLeft = d3.axisLeft(yScale)
                    .ticks(5);

                const yAxisRight = d3.axisRight(yScale)
                    .ticks(5);

                svg.append("g")
                    .attr("class", "x-axis")
                    .attr("transform", `translate(0, ${height})`)
                    .call(xAxis)
                    .selectAll("text")
                    .attr("transform", "rotate(-45)")
                    .attr("text-anchor", "end")
                    .attr("dy", "0.5em");

                svg.append("g")
                    .attr("class", "y-axis-left")
                    .call(yAxisLeft)
                    .append("text")
                    .attr("transform", "rotate(-90)")
                    .attr("y", 0 - margin.left)
                    .attr("x", 0 - height / 2)
                    .attr("dy", "1em")
                    .style("text-anchor", "middle")
                    .style("fill", "black") // Set text color to black
                    .text("Relevance");

                svg.append("g")
                    .attr("class", "y-axis-right")
                    .attr("transform", `translate(${width}, 0)`)
                    .call(yAxisRight)
                    .append("text")
                    .attr("transform", `translate(0,${height / 2}) rotate(90)`)
                    .attr("dy", "-1em")
                    .style("text-anchor", "middle")
                    .style("fill", "black") // Set text color to black
                    .text("Likelihood");

                // Add labels
                svg.append("text")
                    .attr("text-anchor", "middle")
                    .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`) // Adjusted y-coordinate
                    .text("Insight Titles");

            }
        })

}

countrySelect.addEventListener('change', updateChart);
