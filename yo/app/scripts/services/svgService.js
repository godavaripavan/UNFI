angular.module('mrc').factory('svgService', function() {
	var chart = function(data) {
		angular.extend(this, data);
	};
	chart.createColumnBarChart = function(data) {
		var data = data;
		var margin = {
				top: 10,
				right: 15,
				bottom: 35,
				left: 10
			},
			width = $('#averageProductMixChart').width() - margin.left - margin.right,
			height = 180 - margin.top - margin.bottom;
		$('#averageProductMixChart').html('');
		var x = d3.scale.ordinal()
			.rangeRoundBands([0, width], 0.4);
		var y = d3.scale.linear()
			.rangeRound([height, 0]);
		var color = d3.scale.ordinal()
			.range(['#19C463', '#FC000D', '#118ED1', '#fff']);
		var xAxis = d3.svg.axis()
			.scale(x)
			.orient("bottom")
			.tickFormat(function(d, i) {

				d = new Date(d);

				var month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
				return month[d.getMonth()];
			})

		var yAxis = d3.svg.axis()
			.scale(y)
			.orient("left")
			.tickFormat(function(d, i) {
				return d.toFixed(0) + '%';
			});
		var legendData = ["Gas Products", "Valves", "Speciality Products", "Services"]
		var legendColors = d3.scale.ordinal()
			.range(['#fff', '#FC000D', '#118ED1', '#19C463']);
		var svg = d3.select("#averageProductMixChart")
			.append('svg')
			.attr({
				'width': width+20,
				'height': 50
			})

		svg.selectAll('.legend')
			.data([10, 20, 30, 40])
			.enter()
			.append('rect')
			.attr("stroke", "rgb(204, 194, 194)")
			.attr('x', function(d, i) {
				if (i < 2) {
					return (i * 180) + 10;
				} else if (i < 4) {
					return (i % 2 * 180) + 10;
				}
			})
			.attr('y', function(d, i) {
				if (i < 2) {
					return 7.5;
				} else if (i < 4) {
					return 27;
				}
			})
			.attr({
				'width': 15,
				"height": 15
			})
			.attr('fill', function(d, i) {
				return legendColors(i);
			});
		svg.selectAll('.legendtext')
			.data(legendData)
			.enter()
			.append('text')

		.attr('x', function(d, i) {

			if (i < 2) {
				return (i * 180) + 35;
			} else if (i < 4) {
				return (i % 2 * 180) + 35;
			}

		})
			.attr('y', function(d, i) {
				if (i < 2) {
					return 20;
				} else {
					return 40;
				}
			})
			.text(function(d, i) {
				return legendData[i];
			})
			.attr('fill', '#757575');
		var svg = d3.select("#averageProductMixChart").append("svg")
			.attr("width", width - margin.left + margin.right)
			.style("background", "#383838")
			.attr("height", height + margin.top + margin.bottom + margin.right)
			.append("g")
			.style({
				"text-anchor": "middle",
				"font-size": "0.8em",
				"fill": "#757575"

			})
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
		//	svg.call(tip);
		color.domain(d3.keys(data[0]).filter(function(key) {
			return key !== "date";
		}));
		data.forEach(function(d, i) {
			var y0 = 0;
			d.dates = color.domain().map(function(name) {
				return {
					name: name,
					y0: y0,
					y1: y0 += +d[name]
					// dataset: data[i]
				};
			});
			d.total = d.dates[d.dates.length - 1].y1;
		});
		x.domain(data.map(function(d) {
			return d.date;
		}));
		y.domain([0, d3.max(data, function(d) {
			return d.total;
		})]);


		svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + height + ")")
			.call(xAxis)
			.selectAll(".tick text")
			.style("font-size", "0.7em");

		var date = svg.selectAll(".date")
			.data(data)
			.enter().append("g")
			.attr("class", "g")
			.attr("transform", function(d) {
				return "translate(" + x(d.date) + ",0)";
			});

		date.selectAll("rect")
			.data(function(d) {
				return d.dates;
			})
			.enter().append("rect")
			.attr("class", function(d, i, j) {
				return "stack" + j;
			})
			.attr("rx", 3)
			.attr("ry", 4)
			.attr("width", x.rangeBand())
			.attr("y", function(d) {
				if (d.y1) {
					return y(d.y1);
				};
			})
			.attr("height", function(d) {
				if (d.y1 || d.y0) {
					return y(d.y0) - y(d.y1);
				}
			})

		.style("fill", function(d) {
			return color(d.name);
		});

		var colors = d3.scale.ordinal()
			.range(['#000', '#FC000D', '#118ED1', '#19C463']);
	};

	chart.createStackedAreaLine = function() {
		var margin = {
				top: 80,
				right: 20,
				bottom: 30,
				left: 60
			},
			width = $('#ytdGraph').width() - margin.left - margin.right,
			height = 250 - margin.top - margin.bottom;

		// width = 700 - margin.left - margin.right,
		// height = 250 - margin.top - margin.bottom;

		var parseDate = d3.time.format("%d-%b-%y").parse;

		var x = d3.time.scale()
			.range([0, width]);

		var y = d3.scale.linear()
			.range([height, 0]);

		var xAxis = d3.svg.axis()
			.scale(x)
			.orient("bottom")
			.tickFormat(function(d, i) {

				d = new Date(d);
				var month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
				return month[d.getMonth()] + "'14";
			})


		var yAxis = d3.svg.axis()
			.scale(y)
			.orient("left")
			.tickFormat(function(d, i) {
				var value = d;
				console.log("goal value", value)
				if (value == null || value == undefined) {
					return 0;
				} else if (value >= 1000000) {
					return (value / 1000000).toFixed(1) + "M";
				} else if (value >= 1000) {
					return (value / 1000).toFixed(0) + "K";
				} else {
					return parseFloat(value).toFixed(1);
				}
			})

		var area = d3.svg.area()
			.x(function(d) {
				return x(d.date);
			})
			.y0(height)
			.y1(function(d) {
				return y(d.close);
			});
		var area1 = d3.svg.area()
			.x(function(d) {
				return x(d.date);
			})
			.y0(height)
			.y1(function(d) {
				return y(d.close1);
			});

		var svg = d3.select("#ytdGraph").append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
			.style("background", "#383838")
			.append("g")
			.style({
				"text-anchor": "middle",
				"font-size": "0.8em",
				"fill": "#757575"

			})
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
		var gradient = svg.append("svg:defs")
			.append("svg:linearGradient")
			.attr("id", "gradient")
			.attr("x1", "10%")
			.attr("y1", "20%")
			.attr("x2", "80%")
			.attr("y2", "100%")
			.attr("spreadMethod", "pad");

		gradient.append("svg:stop")
			.attr("offset", "0%")
			.attr("stroke-width", "1.5")
			.attr("stop-color", "#339960")
			.attr("transparent", 0.1);

		gradient.append("svg:stop")
			.attr("offset", "50%")
			.attr("stop-color", "#1290AE")
			.attr("transparent", 0.1);


		d3.tsv("fixtures/data.tsv", function(error, data) {
			data.forEach(function(d) {
				d.date = parseDate(d.date);
				d.close = +d.close;
				d.close1 = +d.close1;
			});

			x.domain(d3.extent(data, function(d) {
				return d.date;
			}));
			y.domain([0, d3.max(data, function(d) {

				return d.close1;
			})]);

			svg.append("path")
				.datum(data)
				.attr("class", "area1")
				.attr("d", area);
			svg.append("path")
				.datum(data)
				.attr("class", "area")
				.attr("d", area1)
				.style("fill", "url(#gradient)");

			svg.append("g")
				.attr("class", "x axis")
				.attr("transform", "translate(0," + height + ")")
				.call(xAxis)


			svg.append("g")
				.attr("class", "y axis")
				.call(yAxis)
				.append("text")
				.attr("transform", "rotate(-90)")
				.attr("y", 6)
				.attr("dy", ".71em")
				.style("text-anchor", "end")
				.text("Goal");
		});

	};

	return chart;
});