let outputObj2 = {
  category:[],
  numrec: [],
}

var loadingChart2 = function() {
  //console.log("Here");
  convertRow = function(row, index) {
    let out2 = {};

    for (col in row) {
      switch (col) {
        case "category":
          outputObj2.category.push(row[col]);
          break;
        case "numrec":
          outputObj2.numrec.push(+row[col]);
          break;
        default:
          //console.log("in default");
          break;
      }
    }
    return out2;
  }
  d3.csv("input/chart2-crime-type.csv", convertRow).then(() => {}).then(function() {
    //console.log("loaded file");
    //outputObj2.numrec.reverse();
    outputObj2.category.reverse();
  }).then(drawBarChart2);
}

//loadingChart2();

var drawBarChart2 = function() {
  let countMin = 0;
  let countMax = 4500;
  let svg = d3.select("body").select("section:nth-child(3)").select("div").select("svg");
  let margin = {
    top: 15,
    right: 35,
    bottom: 30,
    left: 200
  };
    let bounds = svg.node().getBoundingClientRect();
    let plotWidth = bounds.width - margin.right - margin.left;
    let plotHeight = bounds.height - margin.top - margin.bottom;

    let crimeCount = d3.scaleLinear()
      .domain([0, countMax])
      .range([0, plotWidth])
      .nice();

      let categories = d3.scaleBand()
          .domain(outputObj2.category)
          .rangeRound([plotHeight, 12])
          .paddingInner(0.1);

          let plot = svg.select("g#plotChart2");

            if (plot.size() < 1) {
              plot = svg.append("g").attr("id", "plotChart2");
              plot.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
            }

            let xAxis = d3.axisBottom(crimeCount);
            let yAxis = d3.axisLeft(categories);

            if (plot.select("g#y-axisChart2").size() < 1) {
              let xGroup = plot.append("g").attr("id", "x-axisChart2");

              xGroup.call(xAxis);

              xGroup.attr("transform", "translate(0," + plotHeight + ")");

              let yGroup = plot.append("g").attr("id", "y-axisChart2");
              yGroup.call(yAxis);
              //yGroup.attr("transform", "translate(" + 25 + ",0)");
            }
            else {
              plot.select("g#y-axisChart2").call(yAxis);
            }

            let bars2 = plot.selectAll("rect")
              .data(outputObj2.numrec);

              bars2.enter().append("rect")
                .attr("class", "bar")
                .attr("width", function(d, i) {
                  return crimeCount(outputObj2.numrec[i]);
                })
                .attr("x", function(d, i) {
                  return categories(outputObj2.numrec[i]);
                })
                .attr("y", function(d, i) {
                  return plotHeight - categories(outputObj2.category[i]);
                })
                .attr("height", function(d, i) {
                  return categories.bandwidth();
                })

                .attr("fill", "blue");

            bars2.transition()
              .attr("y", function(d) { return crimeCount(d.value); })
              .attr("height", function(d) { return plotHeight - crimeCount(d.value); });

            bars2.exit()
              .each(function(d, i, nodes) {
                console.log("Removing bar for:", d.key);
              })
              .transition()
              .attr("y", function(d) { return crimeCount(countMin); })
              .attr("height", function(d) { return plotHeight - crimeCount(countMin); })
              .remove();


        svg.append("text")
          .attr("transform",
            "translate(" + (130) + " ," +
                           (10 + margin.top) + ")")
          .style("text-anchor", "middle")
          .text("Incident Category");
}
