function plot_it() {
    var pad = 50;
    var width = 1500,
        height = 600;
    //var radius = (height - pad * 2)/2;
    var lines_width = width / 2 - pad * 2,
        lines_height = height - pad * 2;
    var div = d3.select('body').append('div').attr('class', 'wrapper');
    var svg = d3.select('.wrapper').append('svg').attr('width', width).attr('height', height);
    var crime_keys = ["MURDER", "RAPE", "ROBBERY", "FELONY ASSAULT", "BURGLARY", "GRAND LARCENY", "GRAND LARCENY OF MOTOR VEHICLE"]

    // Pie Chart
    var pieWidth = width / 2,
        pieHeight = height - pad * 2;
    var radius = Math.min(pieWidth, pieHeight) / 2;
    var currentYear = 2000;

    var color = d3.scaleOrdinal(['#4daf4a', '#377eb8', '#ff7f00', '#984ea3', '#e41a1c', '#964b00', '#ff69b4']);

    d3.select('svg').append('g').attr('transform', "translate(" + (radius + pad) + "," + (height - pad * 6) + ")").attr('id', 'piecharts');
    var chart = d3.select('svg').append('g').attr('transform', 'translate(' + (width / 2 + pad) + ',' + (pad) + ')').attr('id', 'lineplot');

    var pie = d3.pie().value(function (d) {
            return d[currentYear];
        })
        .sort(null);

    var path = d3.arc()
        .outerRadius(radius - 10)
        .innerRadius(0);

    var label = d3.arc()
        .outerRadius(radius)
        .innerRadius(radius);



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

        var arc = d3.select("#piecharts").selectAll('path')
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

        // define tooltip
        var tooltip = d3.select('.wrapper') // select element in the DOM with id 'chart'
            .append('div') // append a div element to the element we've selected                                    
            .attr('class', 'tooltip'); // add class 'tooltip' on the divs we just selected

        tooltip.append('div') // add divs to the tooltip defined above                     
            .attr('class', 'count'); // add class 'count' on the selection                  

        tooltip.append('div') // add divs to the tooltip defined above  
            .attr('class', 'percent'); // add class 'percent' on the selection

            
        // mouse event handlers are attached to path so they need to come after its definition
        arc.on('mouseover', function (d) { // when mouse enters div   
            var sum = 0;
            data.forEach(d => {
                sum += parseInt(d[currentYear]);
            });


            var percent = Math.round(1000 * parseInt(d.data[currentYear]) / sum) / 10; // calculate percent
            tooltip.select('.count').html('Count: ' + parseInt(d.data[currentYear])); // set current count            
            tooltip.select('.percent').html(percent + '%'); // set percent calculated above          
            tooltip.style('display', 'block'); // set display                     
        });

        arc.on('mouseout', function () { // when mouse leaves div                        
            tooltip.style('display', 'none'); // hide tooltip for that element
        });

        arc.on('mousemove', function (d) { // when mouse moves                  
            tooltip.style('top', (d3.event.layerY + 10) + 'px') // always 10px below the cursor
                .style('left', (d3.event.layerX + 10) + 'px'); // always 10px to the right of the mouse
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
    //d3.csv("full_data.csv", function (data) {

    var years = d3.range(2000, 2019, 1)
        var x = d3.scaleLinear()
            .domain([2000,2018])
            .range([0, lines_width]);

        var y_max = 49631;

        var y = d3.scaleLinear()
            .domain([0, y_max])
            .range([lines_height, 0]);

        const each_line = d3.line().x(d => x(d.year)).y(d => y(d.value));

        const tooltip = d3.select(".wrapper").append("div").attr('id','tooltip').style('position', 'absolute')
            .style("background-color", "#D3D3D3")
            .style('padding', 6)
            .style('display', 'none');

        const tooltipLine = chart.append('line');

        d3.select("#lineplot").append('text').text('Crime Rate Over Time').attr('x', 200);

        let offenses, tipBox;

    d3.json('full_data.json', d => {
        offenses = d;
        console.log(offenses)
        d3.select("#lineplot").append('g').selectAll(".paths")
            .data(d).enter()
            .append('path')
            .attr('fill', 'none')
            .attr('stroke', d => color(d.offense))
            .attr('stroke-width', 2)
            .datum(d => d.history)
            .attr('d', each_line);

        d3.select("#linepolot").append('g').selectAll(".text")
            .data(offenses).enter()
            .append('text')
            .html(d => d.offense)
            .attr('fill', d => color(d.offense))
            .attr('alignment-baseline', 'middle')
            .attr('x', width)
            .attr('dx', '.5em')
            .attr('y', d => y(d.history.value));

        tipBox = d3.select('#lineplot').append('rect')
            .attr('width', lines_width)
            .attr('height', lines_height)
            .attr('opacity', 0)
            .on('mousemove', drawTooltip)
            .on('mouseout', removeTooltip);

        var lines_leftaxis = d3.select('#lineplot').append("g")
            .call(d3.axisLeft(y));

        var lines_bottomaxis = d3.select('#lineplot').append('g')
            .attr('transform', 'translate(' + '0' + ',' + (lines_height) + ')')
            .call(d3.axisBottom(x)).tickFormat(d3.format("d"));
    });

    function removeTooltip() {
        if (tooltip) tooltip.style('display', 'none');
        if (tooltipLine) tooltipLine.attr('stroke', 'none');
    }

    function drawTooltip() {
        const year = Math.round((x.invert(d3.mouse(tipBox.node())[0])));
        console.log(year)
        //const year = Math.floor((x.invert(d3.mouse(tipBox.node())[0]) + 5) / 10) * 10;

    // offenses.sort((a, b) => {
    //     return b.history.find(h => (h.year == year)).value - a.history.find(h => (h.year == year)).value;
    // })

        offenses.sort(function(x, y){
           return d3.descending(x.history.year, y.history.year);
        })

    tooltipLine.attr('stroke', 'black')
    .attr('x1', x(year))
    .attr('x2', x(year))
    .attr('y1', 0)
    .attr('y2', lines_height);

    tooltip.html(year)
    .style('display', 'block')
    .style('left', (d3.event.pageX + 20) + 'px')
    .style('top', (d3.event.pageY - 20) + 'px')
    .selectAll(".tip")
    .data(offenses).enter()
    .append('div')
    .style('color', d => color(d.offense))
    .html(d => d.offense + ': ' + d.history.find(h => h.year == year).value);
    }
}