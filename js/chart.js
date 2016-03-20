var width = 650,
    height = 450,
    radius = Math.min(width, height) / 2;

//set colors for to render for pie chart
var color = d3.scale.ordinal()
    .range(["#EB7514", "#C8EB14", "#14EB51", "#14CBEB", "#1814EB", "#B614EB", "#EB1418"]);

var arc = d3.svg.arc()
    .outerRadius(radius - 10)
    .innerRadius(0);

var labelArc = d3.svg.arc()
    .outerRadius(radius - 40)
    .innerRadius(radius - 40);

var pie = d3.layout.pie()
    .sort(null)
    .value(function(d) {
        return d.count;
    });

var svg = d3.select("#pie-chart").append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

//reading tsv fill for data
d3.tsv("data.tsv", function(error, data) {
    if (error) throw error;
    var count1 = 0,
        count2 = 0,
        count3 = 0,
        count4 = 0,
        count5 = 0;

    //filtering for species and search for range of sepalWidth
    var filteredData = data.filter(function(d) {
            if (d["species"] == "versicolor") {
                var width = d["sepalWidth"];

                switch (true) {

                    case width <= 2.5:
                        count1++;
                        break;
                    case width <= 3:
                        count2++;
                        break;
                    case width <= 3.5:
                        count3++;
                        break;
                    case width <= 4:
                        count4++;
                        break;
                    case width > 4:
                        count5++;
                        break;

                }
                return d;
            }

        })
        //Data range (<=2.5), (>2.5 and <=3), (>3 and <= 3.5), (>3.5 and <= 4), (>4)
    var dataset = [{
        range: '<=2.5',
        count: count1
    }, {
        range: '>2.5 and <=3',
        count: count2
    }, {
        range: '>3 and <= 3.5',
        count: count3
    }, {
        range: '>3.5 and <= 4',
        count: count4
    }, {
        range: '(>4)',
        count: count5
    }];

    // create the table header
    var thead = d3.select("thead").selectAll("th")
        .data(d3.keys(dataset[0]))
        .enter().append("th").text(function(d) {
            return d
        });
    // fill the table
    // create rows
    var tr = d3.select("tbody").selectAll("tr")
        .data(dataset).enter().append("tr")
        // cells
    var td = tr.selectAll("td")

    .data(function(d) {
            return d3.values(d)
        })
        .enter().append("td")
        .text(function(d) {
            return d
        });
    console.log(td);

    //cleaning and filtering dataset for rendering
    for (var i = 0; i < dataset.length; i++) {

        if (dataset[i].count == 0) {
            dataset.splice(i, 1);
            i--;
        }
    }


    var g = svg.selectAll(".arc")
        .data(pie(dataset))
        .enter().append("g")
        .attr("class", "arc");

    g.append("path")
        .attr("d", arc)
        .style("fill", function(d) {
            return color(d.data.range);
        });

    g.append("text")
        .attr("transform", function(d) {
            return "translate(" + labelArc.centroid(d) + ")";
        })
        .attr("dy", ".55em")
        .text(function(d) {
            return d.data.range;
        });
});