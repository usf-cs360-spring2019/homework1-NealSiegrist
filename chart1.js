let outputObj = {
  days:[],
  incident:[],
}

var Loading = function(){
  convertRow = function(row, index){
    let out = {};

    for (col in row) {

      switch (col){
        case "D\u0000a\u0000y\u0000":
          var str = row[col].replace("\u0000", "");
          str = str.replace("\u0000", "");
          str = str.replace("\u0000", "");
          str = str.replace("\u0000", "");
          outputObj.days.push(+str);
          break;
        case "\u0000IncidentCount\u0000":
          var str = row[col].replace("\u0000", "");
          str = str.replace("\u0000", "");
          str = str.replace("\u0000", "");
          str = str.replace("\u0000", "");
          outputObj.incident.push(+str);
          break;
        default:
          console.log(col);
      }
    }
    return out;
  }
  d3.csv("/input/chart1-crime-count.csv", convertRow).then(() => {
    console.log("Ended");
  }).then(function() {
    outputObj.days.reverse();
    outputObj.incident.reverse();
  }).then(drawBarChart);
}

var drawBarChart = function() {
  let countMin = 0;
  let countMax = 500;
  let svg = d3.select("body").select("section:nth-child(2)").select("div").select("svg");
  let margin = {
    top: 15,
    right: 35,
    bottom: 30,
    left: 40
  };
    let bounds = svg.node().getBoundingClientRect();
    let plotWidth = bounds.width - margin.right - margin.left;
    let plotHeight = bounds.height - margin.top - margin.bottom;

    let numIncidentScale = d3.scaleLinear()
      .domain([countMin, countMax])
      .range([plotHeight, 0])
      .nice();

      let dayScale = d3.scaleBand()
          .domain(outputObj.days) // all letters (not using the count here)
          .rangeRound([25, plotWidth])
          .paddingInner(0.1);

          let plot = svg.select("g#plot");

            if (plot.size() < 1) {
              plot = svg.append("g").attr("id", "plot");
              plot.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
            }

            let xAxis = d3.axisBottom(dayScale);
            let yAxis = d3.axisLeft(numIncidentScale);

            if (plot.select("g#y-axis").size() < 1) {
              let xGroup = plot.append("g").attr("id", "x-axis");

              xGroup.call(xAxis);

              xGroup.attr("transform", "translate(0," + plotHeight + ")");

              let yGroup = plot.append("g").attr("id", "y-axis");
              yGroup.call(yAxis);
              yGroup.attr("transform", "translate(" + 25 + ",0)");
            }
            else {
              plot.select("g#y-axis").call(yAxis);
            }

            let bars = plot.selectAll("rect")
              .data(outputObj.days);

            bars.enter().append("rect")
              .attr("class", "bar")
              .attr("width", dayScale.bandwidth())
              .attr("x", function(d, i) {
                return dayScale(outputObj.days[i]);
              })
              .attr("y", function(d, i) {
                return numIncidentScale(outputObj.incident[i]);
              })
              .attr("height", function(d, i) {
                return plotHeight - numIncidentScale(outputObj.incident[i]);
              })

              .attr("fill", "blue");

            bars.transition()
              .attr("y", function(d) { return countScale(d.value); })
              .attr("height", function(d) { return plotHeight - countScale(d.value); });

            bars.exit()
              .each(function(d, i, nodes) {
                console.log("Removing bar for:", d.key);
              })
              .transition()
              .attr("y", function(d) { return countScale(countMin); })
              .attr("height", function(d) { return plotHeight - countScale(countMin); })
              .remove();

              svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0)
        .attr("x",0 - (plotHeight / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Number of Records");

        svg.append("text")
          .attr("transform",
            "translate(" + (plotWidth/2) + " ," +
                           (0 + margin.top+ 5) + ")")
          .style("text-anchor", "middle")
          .text("Incident Date");
}

//Loading();
