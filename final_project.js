function plot_it() {
    var pad = 50;
    var width = 1500,
        height = 600;
    //var radius = (height - pad * 2)/2;
    var lines_width = width / 2 - pad * 2,
        lines_height = height - pad * 2;
    var svg = d3.select('body').append('svg').attr('width', width).attr('height', height);
    var crime_keys = ["MURDER", "RAPE", "ROBBERY", "FELONY ASSAULT", "BURGLARY", "GRAND LARCENY", "GRAND LARCENY OF MOTOR VEHICLE"]

    // Pie Chart
    var pieWidth = width / 2,
        pieHeight = height - pad * 2;
    var piedata = null;
    var radius = Math.min(pieWidth, pieHeight) / 2;
    var currentYear = 2000;

    var color = d3.scaleOrdinal(['#4daf4a', '#377eb8', '#ff7f00', '#984ea3', '#e41a1c', '#964b00', '#ff69b4']);

    var pie = d3.pie().value(function (d) {
        return d[currentYear];
    });

    var path = d3.arc()
        .outerRadius(radius - 10)
        .innerRadius(0);

    var label = d3.arc()
        .outerRadius(radius)
        .innerRadius(radius);

    d3.select('svg').append('g').attr('transform', "translate(" + (radius + pad) + "," + (height - pad * 6) + ")").attr('id', 'piecharts');
    d3.select('svg').append('g').attr('transform', 'translate(' + (width / 2 + pad) + ',' + (pad) + ')').attr('id', 'lineplot');

    d3.csv("Offense.csv", function (data) {

        // List of groups (here I have one group per column)
        var allGroup = ["2000", "2001", "2002", "2003", "2004", "2005", "2006", "2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018"];

        // add the options to the button
        d3.select("#selectButton")
            .selectAll('myOptions')
            .data(allGroup)
            .enter()
            .append('option')
            .text(function (d) {
                return d;
            }) // text showed in the menu
            .attr("value", function (d) {
                return d;
            }); // corresponding value returned by the button

        var arc = d3.select("#piecharts").selectAll()
            .data(pie(data)).enter().append("g")
            .attr("class", "arc");

        arc.append("path")
            .attr("d", path)
            .attr("fill", function (d) {
                return color(d.data.OFFENSE);
            });

        arc.append("text")
            .attr("transform", function (d) {
                if (d.data.OFFENSE == 'RAPE') {
                    return "translate(" + label.centroid(d) + ")" + " translate(60)";
                } else return "translate(" + label.centroid(d) + ")";
            })
            .text(function (d) {
                return d.data.OFFENSE;
            });

        // A function that update the chart
        function update() {

            var arc = d3.select("#piecharts").selectAll(".arc")
                .data(pie(data));

            arc.exit().remove(); //remove unneeded circles

            arc.enter().append("g")
                .attr("class", "arc");

            arc.select("path")
                .attr("d", path)
                .attr("fill", function (d) {
                    return color(d.data.OFFENSE);
                });

            arc.select("text")
                .attr("transform", function (d) {
                    if (d.data.OFFENSE == 'RAPE') {
                        return "translate(" + label.centroid(d) + ")" + " translate(60)";
                    } else return "translate(" + label.centroid(d) + ")";
                })
                .text(function (d) {
                    return d.data.OFFENSE;
                });

        }

        // When the button is changed, run the updateChart function
        d3.select("#selectButton").on("change", function () {
            // recover the option that has been chosen
            currentYear = d3.select(this).property("value");
            // run the updateChart function with this selected option
            update();
        })
    });

    svg.append("g")
        .attr("transform", "translate(" + (pieWidth / 2 - 126.87) + "," + 30 + ")")
        .append("text")
        .text("Crime Distribution of New York City")
        .attr("class", "title")



    // code for line plot
    d3.csv("full_data.csv", function (data) {
        var years = d3.range(2000, 2019, 1)
        var x = d3.scalePoint()
            .domain(years)
            .range([0, lines_width]);

        var y_max = 49631;

        var y = d3.scaleLinear()
            .domain([0, y_max])
            .range([lines_height, 0]);

        // Add the line
        for (var i = 0; i < crime_keys.length; i++) {
            d3.select("#lineplot").append("path")
                .datum(data)
                .attr("fill", "none")
                .attr("stroke", color(crime_keys[i]))
                .attr("stroke-width", 1.5)
                .attr("d", d3.line()
                    .x(function (d) {
                        return x(d.DATE)
                    })
                    .y(function (d) {
                        return y(d[crime_keys[i]])
                    })
                )
        }

        for (var i = 0; i < crime_keys.length; i++) {
            d3.select("#lineplot").append('g').selectAll("circle").data(data).enter()
                .append("circle")
                //.datum(data)
                .attr("cx", function (d) {
                    return x(d.DATE);
                })
                .attr("cy", function (d) {
                    return y(d[crime_keys[i]]);
                })
                .attr("r", 5)
                .attr("id", function (d) {
                    return d.id;
                })
                .style("fill", "#fcb0b5")
                .on("mouseover", function(d) {
                    d3.select(this).transition().duration(200).style("fill", "#d30715");

                    d3.select("#lineplot").append('g').selectAll("#tooltip").data([d]).enter().append("text")
                        .attr("id", "tooltip")
                        .text(function (d) {
                            return d[crime_keys[i]];
                        })
                        .attr("y", function (d) {
                            return y(d[crime_keys[i]]) - 12
                        })
                        .attr("x", function (d) {
                            return x(d.DATE);
                        })

                    d3.select("#lineplot").append('g').selectAll("#tooltip_path").data([d]).enter().append("line")
                        .attr("id", "tooltip_path")
                        .attr("class", "line")
                        .attr("d", d3.line()
                            .x(function (d) {
                                return x(d.DATE)
                            })
                            .y(function (d) {
                                return y(d[crime_keys[i]])
                            }))
                        .attr("x1", function(d) {return x(d.DATE)})
                        .attr("x2", function(d) {return x(d.DATE)})
                        .attr("y1", lines_height)
                        .attr("y2", function(d) {return y(d[crime_keys[i]])})
                        //.attr("y2", function(d) {return y(d[crime_keys[i]])})
                        .attr("stroke", "black")
                        .style("stroke-dasharray", ("3, 3"));
                })
                .on("mouseout", function(d) {
                    d3.select(this).transition().duration(500).style("fill", "#fcb0b5");
                    d3.select("#lineplot").selectAll("#tooltip").remove();
                    d3.select("#lineplot").selectAll("#tooltip_path").remove();
        });
        }

        var lines_leftaxis = d3.select('#lineplot').append("g")
            .call(d3.axisLeft(y));

        var lines_bottomaxis = d3.select('#lineplot').append('g')
            .attr('transform', 'translate(' + '0' + ',' + (lines_height) + ')')
            .call(d3.axisBottom(x));
    });






    // var full_data = [["OFFENSE",2000,2001,2002,2003,2004,2005,2006,2007,2008,2009,2010,2011,2012,2013,2014,2015,2016,2017,2018],
    //     ["MURDER & NON-NEGL. MANSLAUGHTER",673,649,587,597,570,539,596,496,523,471,536,515,419,335,333,352,335,292,295],
    //     ["RAPE",2068,1981,2144,2070,1905,1858,1525,1351,1299,1205,1373,1420,1445,1378,1352,1438,1438,1449,1794],
    //     ["ROBBERY",32562,28202,27229,25989,24373,24722,23739,21809,22401,18601,19486,19717,20144,19128,16539,16931,15500,13956,12913],
    //     ["FELONY ASSAULT",25924,23453,21147,19139,18622,17750,17309,17493,16284,16773,16956,18482,19381,20297,20207,20270,20847,20052,20208],
    //     ["BURGLARY",38352,32763,31275,29110,26976,24117,23143,21762,20725,19430,18600,18720,19168,17429,16765,15125,12990,12083,11687],
    //     ["GRAND LARCENY",49631,46329,45771,46751,48763,48243,46625,44924,44242,39580,37835,38501,42497,45368,43862,44005,44279,43150,43558],
    //     ["GRAND LARCENY OF MOTOR VEHICLE",35442,29531,26656,23413,20884,18246,15745,13174,12482,10670,10329,9314,8093,7400,7664,7332,6327,5676,5428]];
    // // d3.csv('full_data.csv', function(data) {
    // //     full_data = data;
    // // });
    //
    //
    //
    // var years = d3.range(2000,2019,1)
    // var line_x_scale = d3.scalePoint()
    //     .domain(years)
    //     .range([0,lines_width]);
    // // console.log(line_x_scale.domain)
    //
    // var y_min = full_data[1][1]
    // var y_max = y_min
    // for(var i = 1; i < full_data.length; i++) {
    //     for (var j = 1; j < full_data[1].length;j++) {
    //         if(full_data[i][j] < y_min) {
    //             y_min = full_data[i][j]
    //         }
    //         if(full_data[i][j] > y_max) {
    //             y_max = full_data[i][j]
    //         }
    //     }
    // }
    // console.log(y_max)
    //
    // var line_y_scale = d3.scaleLinear()
    //     .domain([0, y_max])
    //     .range([lines_height, 0])
    //
    // var each_line = d3.line()
    // 	.x((d,i) => line_x_scale(i))
    // 	.y(d => line_y_scale(d))
    //
    // var lines_leftaxis = d3.select('#lineplot').append("g")
    // 	.call(d3.axisLeft(line_y_scale));
    //
    // var lines_bottomaxis = d3.select('#lineplot').append('g')
    // 	.attr('transform', 'translate('+'0'+','+ (lines_height) +')')
    // 	.call(d3.axisBottom(line_x_scale));
    //
    // var data_value = [];
    // for (var i = 1; i < full_data.length; i++) {
    //     data_value.push(full_data[i].slice(1, full_data[i].length))
    // }
    // console.log(data_value)
    // var lines = d3.select("#lineplot").selectAll('.line').data(data_value).enter().append("path").attr("class", "line").attr("d", d => each_line(d))
    // 	.attr('fill', 'None').attr('stroke', d3.hcl(30,60,75)).attr('stroke-width', 2).attr('stroke-opacity', 0.12);
}