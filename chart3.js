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
  }).then(drawBarChart3);
}


var drawBarChart3 = function() {
  var svg = d3.select("body").select("section:nth-child(4)").select("div").select("svg");
  let bounds = svg.node().getBoundingClientRect();

  var margin = {top: 15, right: 35, bottom: 30, left: 50}
    , width = bounds.width - margin.right - margin.left
    , height = bounds.height - margin.top - margin.bottom;

  var n = 24;

  var xScale = d3.scaleLinear()
      .domain([0, n-1]) // input
      .range([0, width])
      .nice(); // output

  var yScale = d3.scaleLinear()
      .domain([0, 800]) // input
      .range([height, 0])
      .nice();

  var line = d3.line()
      .x(function(d, i) { return xScale(i); })
      .y(function(d) { return yScale(d.y); })

    var dataset = d3.range(n).map(function(d, i) { return {"y": outputObj3.numrecs[i] } })
      svg.attr("width", width + margin.left + margin.right)
      svg.attr("height", height + margin.top + margin.bottom)
    svg.append("g")
      svg.attr("transform", "translate(0" + "," + margin.top + ")");

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(60," + 378 + ")")
      .call(d3.axisBottom(xScale).ticks(23));

  svg.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(60" + ",23)")
      .call(d3.axisLeft(yScale));

  svg.append("path")
      .datum(dataset)
      .attr("class", "line")
      .attr("transform", "translate(" + 61 + ",23)")
      .attr("d", line);

  svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0)
      .attr("x",0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Number of Records");

  svg.append("text")
      .attr("transform","translate(" + (width/2) + " ," +
                         (10 + margin.top) + ")")
      .style("text-anchor", "middle")
      .text("Incident Time");
}
