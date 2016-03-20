var count1 = 0,
    count2 = 0,
    count3 = 0,
    count4 = 0,
    count5 = 0;
var counter = [],
    dataContainer = [];
var type = ['Setosa', 'Versicolor', 'Virginica'];
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
var dataSets = [],
    irisData = [],
    setosa = [],
    versicolor = [],
    virginica = [],
    virginicaData = [],
    setosaData = [],
    versicolorData = [];
var x1 = [];
d3.tsv("data.tsv", function(error, data) {
    if (error) throw error;


    //filtering for species and search for range of sepalWidth
    var filteredData = data.filter(function(d) {
        //filtering by species and only collecting sepalWidth regard improving the performance 
        if (d["species"] == 'setosa') {
            setosa.push(d["sepalWidth"]);

        } else if (d["species"] == 'versicolor') {
            versicolor.push(d["sepalWidth"]);

        } else if (d["species"] == 'virginica') {
            virginica.push(d["sepalWidth"]);

        }
    });
    setosaData = countRange(setosa);
    versicolorData = countRange(versicolor);
    virginicaData = countRange(virginica);
    change(setosaData, 'Setosa');
    dataContainer = [setosaData, versicolorData, virginicaData];

    function countRange(dataArg) {
        var model;
        count1 = 0,
            count2 = 0,
            count3 = 0,
            count4 = 0,
            count5 = 0;
        for (var i = 0; i < dataArg.length; i++) {
            model = countData(dataArg[i]);
            if (i == dataArg.length - 1) {
                console.log(model);
                return model;

            }
        }

    }

    //sepal width counter 
    function countData(data) {
        counter = [];
        width = data;
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

        //sample data model
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

        return dataset;

    };




})



//virginicaData = dataset;

var width = 750,
    height = 450,
    radius = Math.min(width, height) / 2;

var color = d3.scale.ordinal()
    .range(["#EB7514", "#C8EB14", "#14EB51", "#14CBEB", "#1814EB", "#B614EB", "#EB1418"]);

var arc = d3.svg.arc()
    .outerRadius(radius - 10)
    .innerRadius(0);

var pie = d3.layout.pie()
    .sort(null)
    .value(function(d) {
        return d.count;
    });


var svg = d3.select("#chartDiv").append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("id", "pieChart")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

var path = svg.selectAll("path")
    .data(pie(dataset))
    .enter()
    .append("path");

path.transition()
    .duration(400)
    .attr("fill", function(d, i) {
        return color(d.data.range);
    })
    .attr("d", arc)
    .each(function(d) {
        this._current = d;
    }); // store the initial angles


function change(data, name) {
    $('#chartTitle').text(name + ' Sepal Width');
    path.data(pie(data));
    path.transition().duration(650).attrTween("d", arcTween); // redraw the arcs

}

var currentShow = 0;

function test() {
    if (currentShow == 3) {
        currentShow = 0;
    }

    $("#rad" + currentShow).prop("checked", true);
    change(dataContainer[currentShow]);
    $('#chartTitle').text(type[currentShow] + ' Sepal Width');
    console.log('types[xc]');
    currentShow++;
}
var refreshId = setInterval(test, 3000);

// Store the displayed angles in _current.
// Then, interpolate from _current to the new angles.
// During the transition, _current is updated in-place by d3.interpolate.

function arcTween(a) {
    var i = d3.interpolate(this._current, a);
    this._current = i(0);
    return function(t) {
        return arc(i(t));
    };
}