let outputObj = {
  category:[],
  numrec: [],
}

var Loading = function() {
  console.log("Here");
  convertRow = function(row, index) {
    let out = {};

    for (col in row) {
      switch (col) {
        case "category":
          outputObj.category.push(row[col]);
          break;
        case "numrec":
          outputObj.numrec.push(row[col]);
          break;
        default:
          console.log("in default");
          break;
      }
    }
  }
}

Loading();
