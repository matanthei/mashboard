var margin = {top: 10, right: 10, bottom: 10, left: 10},
	width = 320 - margin.left - margin.right,
	height = 166 - margin.top - margin.bottom;
	
var parseDate = d3.time.format("%Y%m%d").parse;

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
	
var target_line = d3.svg.line()
	.x(function(d) { return x(d.date); })
	.y(function(d) { return y(10000); });
	
var chart = d3.select("#moves_stacked").append("svg")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.append("g")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.json("data/moves.json", function(error, data) {
	//console.log(data);
	data.forEach(function(d) {
		d.date = parseDate(d.date);
		if (d['summary']!=null) {
			for (i=0;i<(d['summary'].length);i++) 
			{
				if (d['summary'][i]['activity'] == 'wlk') 
				{
					d.wlk = d['summary'][i]['steps'];
				} else if (d['summary'][i]['activity'] == 'run') 
				{
					d.run = d['summary'][i]['steps'];
				}
			}
			d.steps = d.wlk + d.run ;
		} else  
		{
			d.wlk = 0;
			d.run = 0;
			d.steps = 0;
		}
	});
	
	x.domain(d3.extent(data, function(d) { return d.date; }));
	max_steps = d3.max(data, function(d) { return d.steps; });
	if (max_steps <= 11000) 
	{
		max_steps = 11000;
	}
	console.log(d3.max(data, function(d) { return d.steps; }));
	y.domain([0, max_steps]);
		
	chart.selectAll("rect")
		.data(data)
	.enter().append("rect")
		.attr("x", function(d,i) { return i * 30; })
		.attr("class", "bar walk")
		.attr("width", 20)
		.attr("y", function(d) { return height - y(d.wlk); })
		.attr("height", function (d) { return y(d.wlk); });
	
	chart.append("path")
		.attr("class", "target_line")
		.attr("d", target_line);
		
	chart.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis);
	
	chart.append("g")
		.attr("class", "y axis")
		.call(yAxis)
		.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", 6)
		.attr("dy", "0.71em")
		.style("text-anchor", "end");
});