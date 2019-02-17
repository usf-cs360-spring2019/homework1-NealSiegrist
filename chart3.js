let outputObj3 = {
  time:[],
  numrecs: [],
}

var loadingChart3 = function() {
  console.log("Here");
  convertRow = function(row, index) {
    let out3 = {};

    for (col in row) {
      switch (col) {
        case "time":
          outputObj3.time.push(+row[col]);
          break;
        case "numrecs":
          outputObj3.numrecs.push(+row[col]);
          break;
        default:
          console.log("in default");
          break;
      }
    }
    return out3;
  }
  d3.csv("input/chart3-line.csv", convertRow).then(() => {}).then(function() {
    console.log("loaded file");
    //outputObj2.numrec.reverse();
    //outputObj3.category.reverse();
  }).then(drawBarChart3);
}


var drawBarChart3 = function() {
  // 2. Use the margin convention practice
  var svg = d3.select("body").select("section:nth-child(4)").select("div").select("svg");
  let bounds = svg.node().getBoundingClientRect();

  var margin = {top: 15, right: 35, bottom: 30, left: 50}
    , width = bounds.width - margin.right - margin.left
    , height = bounds.height - margin.top - margin.bottom;

  // The number of datapoints
  var n = 24;

  // 5. X scale will use the index of our data
  var xScale = d3.scaleLinear()
      .domain([0, n-1]) // input
      .range([0, width])
      .nice(); // output

  // 6. Y scale will use the randomly generate number
  var yScale = d3.scaleLinear()
      .domain([0, 800]) // input
      .range([height, 0])
      .nice();

  // 7. d3's line generator
  var line = d3.line()
      .x(function(d, i) { return xScale(i); }) // set the x values for the line generator
      .y(function(d) { return yScale(d.y); }) // set the y values for the line generator
      //.curve(d3.curveMonotoneX) // apply smoothing to the line

  // 8. An array of objects of length N. Each object has key -> value pair, the key being "y" and the value is a random number
  //var dataset = d3.range(n).map(function(d) { return {"y": d3.randomUniform(1)() } })
    var dataset = d3.range(n).map(function(d, i) { return {"y": outputObj3.numrecs[i] } })
  // 1. Add the SVG to the page and employ #2
      svg.attr("width", width + margin.left + margin.right)
      svg.attr("height", height + margin.top + margin.bottom)
    svg.append("g")
      svg.attr("transform", "translate(0" + "," + margin.top + ")");

  // 3. Call the x axis in a group tag
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(35," + 370 + ")")
      .call(d3.axisBottom(xScale).ticks(23)); // Create an axis component with d3.axisBottom

  // 4. Call the y axis in a group tag
  svg.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(35" + ",15)")
      .call(d3.axisLeft(yScale)); // Create an axis component with d3.axisLeft

  // 9. Append the path, bind the data, and call the line generator
  svg.append("path")
      .datum(dataset) // 10. Binds data to the line
      .attr("class", "line") // Assign a class for styling
      .attr("transform", "translate(" + 36 + ",15)")
      .attr("d", line); // 11. Calls the line generator
}
