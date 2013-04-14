/**
 * @author abel.coronado@inegi.org.mx
 */
function parallelCoordinatesCharts(){
	var margin = {top: 30, right:40, bottom:20,left:200},
		width  = 560,
		height = 500,
		dimensions = [];/*,
		x = null,
		line = null,
		yAxis = null,
		dimension = null;*/

	function chart(selection){
		selection.each(
			function(data){
/*-----*/

				if(!data){

					return chart;
				};
				chart.update = function() { 					    	
					    	chart(selection);
				};
				//console.log(data);
				width  = width - margin.left - margin.right;
				height = height - margin.top - margin.bottom;
				var x = d3.scale.ordinal()
				    .domain(dimensions.map(function(d) { return d.name; }))
				    .rangePoints([0, width]);
				var line = d3.svg.line()
				    .defined(function(d) { return !isNaN(d[1]); });
				var yAxis = d3.svg.axis()
				    .orient("left");
				
				var svg = d3.select(this).selectAll("svg").data([data])
					.attr("width", width + margin.left + margin.right)
				    .attr("height", height + margin.top + margin.bottom);
				    
				
				svg = svg.enter().append("svg")
							.append("svg:g")
							.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
       
				/*svg = svg.selectAll(".g_container")
					.data([1])
					.enter().append("g")
					.attr("class", "g_container")
					.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
				*/
				var dimension = svg.selectAll(".dimension")
				    .data(dimensions)
				  .enter().append("g")
				    .attr("class", "dimension")
				    .attr("transform", function(d) { return "translate(" + x(d.name) + ")"; });
				dimensions.forEach(function(dimension) {
					if(dimension.type === Number){
						dimension.scale = d3.scale.linear().range([0,height]); 
					    dimension.scale.domain( 
					    	d3.extent(data, function(d) { return +d[dimension.name]; })
						);
					}else{
						dimension.scale = d3.scale.ordinal().rangePoints([0, height])
					    dimension.scale.domain( 
							data.map(function(d) { return d[dimension.name]; }).sort()
						);
					}
				});

				svg.selectAll(".background")
				 .data([1])
				 .enter().append("g")
			     .attr("class", "background")
			     .selectAll("path")
			      .data(data)
			     .enter().append("path")
			      .attr("d", draw);

				svg.selectAll(".foreground")
				 .data([1])
				 .enter().append("g")
				  .attr("class", "foreground")
				 .selectAll("path")
				  .data(data)
				 .enter().append("path")
				  .attr("d", draw);

				dimension.append("g")
				  .attr("class", "axis")
				  .each(function(d) { d3.select(this).call(yAxis.scale(d.scale)); })
				 .append("text")
			      .attr("class", "title")
			      .attr("text-anchor", "middle")
			      .attr("y", -9)
			      .text(function(d) { return d.name; });

			    svg.select(".axis").selectAll("text:not(.title)")
			      .attr("class", "label")
			      .data(data, function(d) { return d.name || d; });

				  var country = svg.selectAll(".axis text,.background path,.foreground path")
				      .on("mouseover", mouseover)
				      .on("mouseout", mouseout);

				  function mouseover(d) {
				    svg.classed("active", true);
				    country.classed("inactive", function(p) { return p !== d; });
				    country.filter(function(p) { return p === d; }).each(moveToFront);
				  }

				  function mouseout(d) {
				    svg.classed("active", false);
				    country.classed("inactive", false);
				  }

				  function moveToFront() {
				    this.parentNode.appendChild(this);
				  }
				  function draw(d) {
				  	console.log("QUE PASA!!!!");
				  	return line(dimensions.map(function(dimension) {
				    	return [x(dimension.name), dimension.scale(d[dimension.name])];
				  	}));
				   }
/*-----*/
			}
		);
	};

	//accessors
	chart.margin = function(_){
		if(!arguments.length) return margin;
		margin = _;
		return chart;
	};
	chart.width = function(_){
		if(!arguments.length) return width;
		width = _;
		return chart;
	};
	chart.height = function(_){
		if(!arguments.length) return height;
		height = _;
		return height;
	};
	chart.dimensions = function(_){
		if(!arguments.length) return dimensions;
		dimensions = _;
		return dimensions;
	};
	
	return chart;
}