var svg = d3.select("body").append("svg")
    .attr("height", 1)
    .attr("width", 1);

var table = d3.select("#table-location")
    .append("table")
    .attr("class", "table table-condensed table-striped"),
    thead = table.append("thead")
    .attr("class", "thead-inverse"),
    tbody = table.append("tbody");


d3.tsv("data.tsv", function(error, data) {
    // this can be use ful in filter by species
    var columns = Object.keys(data[4])
        .filter(function(d) {
            return d;
        });

    //tabel header with sorting function
    var header = thead.append("tr")
        .selectAll("th")
        .data(columns)
        .enter()
        .append("th")
        .text(function(d) {
            return d;
        })
        .on("click", function(d) {
            if (d == "species") {
                rows.sort(function(a, b) {
                    if (a[d] < b[d]) {
                        return -1;
                    }
                    if (a[d] > b[d]) {
                        return 1;
                    } else {
                        return 0;
                    }
                });
            } else {
                rows.sort(function(a, b) {
                    return b[d] - a[d];
                })
            }
        });

    //make table body row
    var rows = tbody.selectAll("tr")
        .data(data)
        .enter()
        .append("tr")
        .on("mouseover", function(d) {
            d3.select(this)
                .style("background-color", "orange");
        })
        .on("mouseout", function(d) {
            d3.select(this)
                .style("background-color", "transparent");
        });

    //make table data
    var cells = rows.selectAll("td")
        .data(function(row) {
            return columns.map(function(d, i) {
                return {
                    i: d,
                    value: row[d]
                };
            });
        })
        .enter()
        .append("td")
        .html(function(d) {
            return d.value;
        });



});