function plot_it () {
    var width = 500, height = 400;
	var svg = d3.select('body').append('svg').attr('width', width).attr('height', height);

	var radius = Math.min(width, height) / 2;

    // var svg = d3.select("svg"),
    //     width = svg.attr("width"),
    //     height = svg.attr("height"),
    //     radius = Math.min(width, height) / 2;

    // var g = svg.append("g")
    //     .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    d3.select('svg').append('g').attr('transform', "translate(" + width / 2 + "," + height / 2 + ")").attr('id', 'piecharts')

    var color = d3.scaleOrdinal(['#4daf4a', '#377eb8', '#ff7f00', '#984ea3', '#e41a1c', '#964b00', '#800080']);

    var pie = d3.pie().value(function (d) {
        return d3.sum(d.COUNT);
    });

    var path = d3.arc()
        .outerRadius(radius - 10)
        .innerRadius(0);

    var label = d3.arc()
        .outerRadius(radius)
        .innerRadius(radius - 80);

    d3.csv("browseruse.csv", function (error, data) {
        if (error) {
            throw error;
        }
        var arc = d3.select("#piecharts").selectAll(".arc")
            .data(pie(data))
            .enter().append("g")
            .attr("class", "arc");

        arc.append("path")
            .attr("d", path)
            .attr("fill", function (d) {
                return color(d.data.browser);
            });

        console.log(arc)

        arc.append("text")
            .attr("transform", function (d) {
                return "translate(" + label.centroid(d) + ")";
            })
            .text(function (d) {
                return d.data.browser;
            });
    });

    svg.append("g")
        .attr("transform", "translate(" + (width / 2 - 120) + "," + 20 + ")")
        .append("text")
        .text("Browser use statistics - Jan 2017")
        .attr("class", "title")

    // The code for the line plot
    // var svg2 = d3.select('g')
    // 		.attr('width', svg.attr("width"))
    // 		.attr('height', svg.attr("height"))
    // 		.attr("transform", "translate("+ width + "," + (height/2) +")")
}