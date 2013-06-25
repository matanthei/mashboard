var margin = {top: 10, right: 10, bottom: 10, left: 10},
	width = 320 - margin.left - margin.right,
	height = 166 - margin.top - margin.bottom;
	
var parseDate = d3.time.format("%d-%b-%y").parse;

var x = d3.time.scale()
	.range([0, width]);
	
var y = d3.scale.linear()
	.range([height, 0]);

var xAxis = d3.svg.axis()
	.scale(x)
	.ticks(0)
	.tickSize(0)
	.orient("bottom");
	
var yAxis = d3.svg.axis() 
	.scale(y)
	.ticks(0)
	.tickSize(0)
	.orient("left");
	
var area = d3.svg.area()
	//.interpolate('basis')
	.x(function (d) { return x(d.date); })
	.y0(height)
	.y1(function(d) {return y(d.steps); });
	
var line = d3.svg.line()
	//.interpolate('basis')
	.x(function(d) { return x(d.date); })
	.y(function(d) { return y(d.steps); });
	
var svg = d3.select("#moves").append("svg")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.append("g")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.tsv("data/moves.tsv", function(error, data) {
	console.log(data);
	data.forEach(function(d) {
		d.date = parseDate(d.date);
		d.steps = d.steps ;
	});
	
	x.domain(d3.extent(data, function(d) { return d.date; }));
	y.domain([0, d3.max(data, function(d) { return d.steps; })]);
	
	
	svg.append("path")
		.datum(data)
		.attr("class", "area")
		.attr("d", area);
	
	svg.append("path")
		.datum(data)
		.attr("class", "line")
		.attr("d", line);
			
	svg.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis);
	
	svg.append("g")
		.attr("class", "y axis")
		.call(yAxis)
		.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", 6)
		.attr("dy", "0.71em")
		.style("text-anchor", "end");
});