// GLOBAL VARS

// const top_margin_amount = 50

const countryText_bubble = {
    "GTM": "Guatemala",
    "HND": "Honduras",
    "SLV": "El Salvador"
};
const pathwaysList = ["regular", "irrregular coyote", "irregular on own, with caravan"];
const pathwayTypes = {
  "regular": {label: "Regular Pathway", color: "#e23cad", yPosSide: 1, xPosLegend: 0},
  "irrregular coyote": {label: "Irregular with Smuggler", color: "#662d91", yPosSide: 25, xPosLegend: 11},
  "irregular on own, with caravan": {label: "Irregular with a Caravan", color: "#faa41a", yPosSide: 28, xPosLegend: 26}
};
const pathwayAttr = {
    "regular": {"label": "Through a Regular Pathway", "color": "#e23cad"},
    "irrregular coyote": {"label": "Using a Smuggler to Migrate", "color": "#662d91"},
    "irregular on own, with caravan": {"label": "Migrating on One's Own or with a Caravan", "color": "#faa41a"}
};
const pathwayAttr_narrative = {
  "regular": {"label": "through a regular pathway", "color": "#e23cad"},
  "irrregular coyote": {"label": "using a smuggler", "color": "#662d91"},
  "irregular on own, with caravan": {"label": "individually or with a caravan", "color": "#faa41a"}
};
const financeText = {
    "1": {"label":"No Response"}
};

function bubbleChart() {

  //   var width = 1500;
  //   var height = 700;
  const width = 1400;
  const height = 1000;
  const sqLen = 1;
  const sideWidth = 0;
  var padding = 2;
  var tooltip = floatingTooltip('viz-col');
  var center = { x: width / 2, y: height / 2 };

  var yearCenters = {
    "GTM": { x: width / 5.4, y: height / 2 },
    "HND": { x: width / 1.9, y: height / 2 },
    "SLV": { x: 2.5 * (1 * width / 3), y: height / 2 }
  };
  
  var beeCenters = {
    "all loans": { x: width / 5, y: 0 },
    "some loans": { x: width / 1.9, y:0 },
    "no loans": { x: 2.5 * (1 * width / 3), y:0 }
  };
  
  var meansCenters = {
    "regular": { x: width / 7, y: height / 2 },
    "irregular on own, with caravan": { x: 2.9 * (1 * width / 5), y: height / 2 },
    "irrregular coyote": { x: 3.5 * (1 * width / 5), y: height / 2 }
  };
     
        
  var forceStrength = 0.023;
//   var svg = null;
//   var bubbles = null;
//   var nodes = [];

  function charge(d) {
    return -Math.pow(d.radius, 1) * forceStrength;
  }
  
  var posScale = d3v4.scaleLinear().domain([20,22000]);
    posScale.range([0, height]);
    
  var posScaleMonths = d3v4.scaleLinear().domain([20,22000]);
    posScale.range([0, height]);
 
var posScaleRev = d3v4.scaleLinear().domain([22000,0]); 
    posScaleRev.range([0, height]); 
    
  var simulation = d3v4.forceSimulation()
    .velocityDecay(0.17)
    .force('collide', d3v4.forceCollide().radius(function(d) {
		return d.radius + padding;
		}).strength(.65))
    .force('x', d3v4.forceX().strength(forceStrength).x(center.x))
    .force('y', d3v4.forceY().strength(forceStrength).y(center.y))
//     .force('charge', d3v4.forceManyBody().strength(charge))
    .on('tick', ticked);
  simulation.stop();
  
//     var simulationB = d3v4.forceSimulation()
// //     .velocityDecay(0.21)
//     .force('collide', d3v4.forceCollide().radius(function(d) {
// 		return d.radius + padding;
// 		}))
//     .force('x', d3v4.forceX().strength(.2).x(center.x))
// //     .force('y', d3v4.forceY().strength(2).y(center.y))
//     .alphaDecay(0.3)
// //     .force('charge', d3v4.forceManyBody().strength(charge))
//     .on('tick', ticked);
//   simulationB.stop();

//   var fillColor = d3v4.scaleOrdinal()
//     .domain(['low', 'medium', 'high'])
//     .range(['#3ba7c9', '#1540c4', '#e23cad']);

  function createNodes(rawData) {

    var maxAmount = d3v4.max(rawData, function (d) { return +d.mig_ext_cost_total; });

    var radiusScale = d3v4.scalePow()
      .exponent(0.9)
      .range([2, 85])
      .domain([0, maxAmount]);

    // may need to include other data attributes here
    var myNodes = rawData.map(function (d) {
      return {
        rsp_id: d.rsp_id,
        id: d.id,
        radius: radiusScale(+d.mig_ext_cost_total),
        value: +d.mig_ext_cost_total,
        valuenull: d.nul,
        name: d.mig_ext_medio,
        // org: d.organization,
        group: d.mig_ext_finance,
        year: d.country,
        x: Math.random() * 1800,
        y: Math.random() * 1000
      };
    });

    myNodes.sort(function (a, b) { return b.value - a.value; });

    return myNodes;
  }

  var chart = function chart(selector, rawData) {
    nodes = createNodes(rawData);
    

// 
// const svg = d3v4.select("#frame-motivations")
//     .append("svg")
//         .attr("id", "viz-motivations")
//         .attr("viewBox", [-(sideWidth), 0, width + (sideWidth), height]);
        
    var svg = d3v4.select("#frame-cost")
      .append('svg')
      .attr('id', 'cost-svg')
      .attr("viewBox", [-(sideWidth + sqLen), 0, width + (sideWidth + sqLen), height + 20]);
    //   .classed("svg-content-responsive", true)
    //   .classed("svg-container", true) 
    //   .attr("preserveAspectRatio", "xMidYMid meet");

//   svg = d3v4.select(selector)
//       .append('svg')
//       .attr('width', width)
//       .attr('height', height);

    bubbles = svg.selectAll('.bubble')
      .data(nodes, function (d) { return d.id; });

    var bubblesE = bubbles.enter().append('circle')
      .attr("id", d => "cir-" + d.rsp_id)
      .classed('bubble', true)
      .attr('r', 0)
      .attr('fill', function (d) { return fillColor(d.name); })
      .style('fill', function (d) { if (d.value <= 1) return "#fff";})
      .style('stroke', function (d) { if (d.value <= 1) return fillColor(d.name);})
      .style('stroke-width', function (d) { if (d.value <= 1) return .9;})
      // .attr('stroke', function (d) { return d3v4.rgb(fillColor(d.name)).darker(); })
      .attr('stroke-width', .0)
      .on('mouseover', showDetail)
      .on('mouseout', hideDetail);
      

    bubbles = bubbles.merge(bubblesE);

    bubbles.transition()
    .ease(d3v4.easeBounce)
      .duration(.5)
      .attr('r', function (d) { return d.radius; });
      
    simulation.nodes(nodes);

    groupBubbles();

    // motivations categories legend
    const legend = svg.append("g")
    .attr("class", "legend")
 
    // legend squares
    legend.append("g")
         .attr("class", "legend-sq")
     .selectAll("rect")
     .data(pathwaysList)
     .enter()
     .append("rect")
         .attr("x", d => scale(pathwayTypes[d].xPosLegend))
         .attr("y", (top_margin_amount+parseInt(scale(0))).toString()) // row number (1624/numPerRow + 9) 
         .attr("width", 24)
         .attr("height", 24)
         .attr("fill", d => pathwayTypes[d].color)
         .attr("stroke", "#fff")
         .attr("stroke-width", gap);

    // legend text
    legend.append("g")
         .attr("class", "legend-text")
     .selectAll("text")
     .data(pathwaysList)
     .enter()
     .append("text")
     .attr("x", d => scale(pathwayTypes[d].xPosLegend + 1.25))
     .attr("y", (top_margin_amount+parseInt(scale(1))).toString())
     .attr("dy", "-0.18em")
     .attr("font-size", "1.3em")
     .attr("text-anchor", "start")
     .attr("fill", d => pathwayTypes[d].color)
     .text(d => pathwayTypes[d].label.toUpperCase());

  }
  
  function axis() {
    d3v4.select("svg").append("svg").attr("class","axis")
        .call(d3v4.axisRight(posScaleRev).ticks(5).tickFormat((d, i) => ['50', '40', '25', '15', '0'][i]).tickSize(0))
        .call(g => g.selectAll(".tick text").attr("class","axis")
            .attr("x", 4)
            .attr("dy", -5));
    d3v4.select("svg").append("svg")
        .call(d3v4.axisRight(posScaleRev).ticks(5).tickFormat((d, i) => ['Months', 'Months', 'Months', 'Months', 'Months'][i]).tickSize(0))
        .call(g => g.selectAll(".tick text").attr("class","axis2")
            .attr("x", 4)
            .attr("dy", 8));    
  }

  function removeaxis(){
    d3v4.selectAll(".axis,.axis2")
      .style("opacity",0);
  }
    
  function updateaxis(){
    d3v4.selectAll(".axis,.axis2")
      .style("opacity",1);
  }
	
	
  function ticked() {
    bubbles
      .attr('cx', function (d) { return d.x; })
      .attr('cy', function (d) { return d.y; });
  }
  
//       function ticked() {
//     bubbles
//       .attr('cx', function (d) { return d.x; })
//       .attr('cy', function(d){return height - posScale(d.value);});
//   }

  function nodeMeansPos(d) {
    return meansCenters[d.name].x;
  }
  
  function nodeCountryPos(d) {
    return yearCenters[d.year].x;
  }
  
  function nodeBeePosb(d) {
     return beeCenters[d.group].x;
  }
  
  function nodeBeePosc(d) {
     return posScale(d.value).y;
  }
  

  function groupBubbles() {
    hideYearTitles();
    hideMeansTitles();
    hideFinanceTitles();
    showNullValues();
    removeaxis();
    removeaxis();
    remAvRegAnn();
    remFinanceLabel();
        
    simulation.force('x', d3v4.forceX().strength(forceStrength).x(center.x));
    simulation.force('y', d3v4.forceY().strength(forceStrength).y(center.y));
    simulation.alpha(1).restart();

  }

  function hideYearTitles() {
    svg.selectAll('.year,.year2,.year3').remove();
  }
  
    function hideMeansTitles() {
    svg.selectAll('.means,.means2,.means3').remove();
  }
  
    function hideFinanceTitles() {
    svg.selectAll('.finance,.finance2,.finance3').remove();
  }
  
  function hideNullValues() {
      svg.selectAll('circle').filter(function(d){ return d.value <= 1; }).transition().attr('y', 50000);
      // .style('stroke', "#fff" );
  }

  function showNullValues() {
      svg.selectAll('circle').filter(function(d){ return d.value <= 1; });
  //     .style('fill', function (d) { if (d.value <= 1) return "#fff";})
  //       .style('stroke', function (d) { if (d.value <= 1) return fillColor(d.name);})
  //       .style('stroke-width', function (d) { if (d.value <= 1) return .9;});
   }

  
  function showDetail(d) {
    // change outline to indicate hover state.
    d3v4.select(this).attr('stroke', 'black').style('stroke-width','2');

    $("#gates_tooltip").empty();
    const tooltipTemplate = $(".tooltip.template");
    let tooltipContent = tooltipTemplate.clone();
    let pathwayColor = pathwayAttr[d.name].color;

    tooltipContent.find(".side-color").css("background", pathwayColor);
    tooltipContent.find(".text-color").css("color", pathwayColor);
    tooltipContent.find(".label-cost").html("$" + addCommas(d.value));
    tooltipContent.find('.label-cost').filter(function () { if (d.value <= 1) return this;}).html("N.A.");
    tooltipContent.find(".label-country").html(countryText_bubble[d.year]);
    tooltipContent.find(".label-pathway").html(pathwayAttr[d.name].label);

    tooltipContent.children().appendTo("#gates_tooltip");

    // responsive screenwidths
    if (winWidth > 768) {
        tooltip.showTooltip(event);
    }
    else {
        $("#gates_tooltip").css({'opacity': 1.0, 'top': '1rem', 'left': '50%'});
    }
  }

  function hideDetail(d) {
    d3v4.select(this)
     .style('stroke', function (d) { if (d.value <= 1) return fillColor(d.name);})
      .style('stroke-width', function (d) { if (d.value <= 1) return .9;});
//       .style('stroke-width',function (d) { if (d.value > 1) return 0;});

    if (winWidth > 768) {
        tooltip.hideTooltip();
    }
  }

  return chart;

}



        
// Create bubble chart using function from above
var myBubbleChart = bubbleChart();




// Display bubble chart
function display(error, data) {
  if (error) {
    console.log(error);
  }
  
  // console.log("DOTS DATA:", data)

  myBubbleChart('#vis', data);

  // put this in .then:

  if (window.location.hash.length != 0){

    d3v4.selectAll('circle')
    .attr("opacity", 0.2)

    // get migrant id
    const migrant_id = window.location.hash.slice(1,)
    console.log("HASH ID HERE in bubble chart:", migrant_id)

    const selected_migrant_array = data.filter(item => item.rsp_id == migrant_id)
    const selected_migrant = selected_migrant_array[0]
    console.log("cost selected_migrant", selected_migrant)

    // change opacity of specific rectangle
    d3v4.select("#cir-" + migrant_id)
    .attr("opacity", 1)

    // console.log("COST ATTR:", $("#cir-" + migrant_id).attr())
    // console.log("COST ATTR:", $("#cir-" + migrant_id).attr("cx"))

    // select motivation paragraph and change text
    const costTextContent = $(".narrative-2");
    // textContent.find(".text-color").css("color", motivColor);
    costTextContent.find(".migrant-name").html(selected_migrant.name);
    costTextContent.find(".migrant-cost").html(selected_migrant.mig_ext_cost_total);
    costTextContent.find(".migrant-channel").html(pathwayAttr_narrative[selected_migrant.mig_ext_medio].label);
  }
  
}






var fillColor = d3v4.scaleOrdinal()
    .domain(['irrregular coyote', 'irregular on own, with caravan', 'regular'])
    .range(['#662d91', '#faa41a', '#e23cad']);   
    
var highlightirrcoy = d3v4.scaleOrdinal()
    .domain(['irrregular coyote', 'irregular on own, with caravan', 'regular'])
    .range(['#662d91', '#f9e4c5', '#ffdbf5']);    
    
var highlightirrown = d3v4.scaleOrdinal()
    .domain(['irrregular coyote', 'irregular on own, with caravan', 'regular'])
    .range(['#e9d7f7', '#faa41a', '#ffdbf5']); 
    
var highlightregular = d3v4.scaleOrdinal()
    .domain(['irrregular coyote', 'irregular on own, with caravan', 'regular'])
    .range(['#e9d7f7', '#f9e4c5', '#e23cad']);   
    


function fillColorN() {

  d3v4.selectAll("circle")
      .transition()
      .duration(2000)

        .attr('fill', function (d) { if (d.value > 1) return fillColor(d.name);})
        .style('fill', function (d) { if (d.value <= 1) return "#fff";})
        .style('stroke', function (d) { if (d.value <= 1) return fillColor(d.name);})
        .style('stroke-width', function (d) { if (d.value <= 1) return .9;});
  //       .attr('stroke', function (d) { return d3v4.rgb(highlightirrcoy(d.name)).darker(); })
        // .style('stroke-width', .1);
}
    
    
function highlightRegular() {
  d3v4.selectAll("circle")
      .transition()
      .duration(2000)

        .attr('fill', function (d) { if (d.value > 1) return highlightregular(d.name);})
        .style('fill', function (d) { if (d.value <= 1) return "#fff";})
        .style('stroke', function (d) { if (d.value <= 1) return highlightregular(d.name);})
        .style('stroke-width', function (d) { if (d.value <= 1) return .9;});
  //       .attr('stroke', function (d) { return d3v4.rgb(highlightirrcoy(d.name)).darker(); })
        // .style('stroke-width', .1);
}

function highlightIrreCoy() {
  d3v4.selectAll("circle")
      .transition()
      .duration(2000)
        .attr('fill', function (d) { if (d.value > 1) return highlightirrcoy(d.name);})
        .style('fill', function (d) { if (d.value <= 1) return "#fff";})
        .style('stroke', function (d) { if (d.value <= 1) return highlightirrcoy(d.name);})
        .style('stroke-width', function (d) { if (d.value <= 1) return .9;});
  //       .attr('stroke', function (d) { return d3v4.rgb(highlightirrcoy(d.name)).darker(); })
        // .style('stroke-width', .1);
}

function highlightIrreOwn() {
  d3v4.selectAll("circle")
      .transition()
      .duration(2000)

        .attr('fill', function (d) { if (d.value > 1) return highlightirrown(d.name);})
        .style('fill', function (d) { if (d.value <= 1) return "#fff";})
        .style('stroke', function (d) { if (d.value <= 1) return highlightirrown(d.name);})
        .style('stroke-width', function (d) { if (d.value <= 1) return .9;});
  //       .attr('stroke', function (d) { return d3v4.rgb(highlightirrcoy(d.name)).darker(); })
      // .style('stroke-width', .1);
}

/*
 * Helper function to convert a number into a string
 * and add commas to it to improve presentation.
 */
function addCommas(nStr) {
  nStr += '';
  var x = nStr.split('.');
  var x1 = x[0];
  var x2 = x.length > 1 ? '.' + x[1] : '';
  var rgx = /(\d+)(\d{3})/;
  while (rgx.test(x1)) {
    x1 = x1.replace(rgx, '$1' + ',' + '$2');
  }

  return x1 + x2;
}

const type = d3.annotationCustomType(d3.annotationCalloutCircle, {
  connector: { end: "arrow" }, note: {wrap: 370},
});

function addGuatAnn(){ 
		d3v4.select("svg")
		.append("ellipse")
		  .attr('class', "subject guat")
			   .attr("cx", 260)
			   .attr("cy", 500)
			   .attr("rx", 255)
			   .attr("ry", 255);
	d3v4.select("svg")
		.append('text')
		  .attr('x', 170)
		  .attr('y', 800)
			.attr('class', "annotation-note  guat")	
		  .text("Government Spent")
		  .style("fill","#6c757d");
		d3v4.select("svg")
		.append('text')
		  .attr('x', 170)
		  .attr('y', 837)
			.attr('class', "annotation-note-title  guat")
			.style("fill","#6c757d")
			
		  .text("$1.3 Billion");
		  d3v4.select("svg").append("line")          
    .style("stroke", "black")  
        .attr('class', "guat")
    .attr("x1", 165)
    .attr("y1", 750)   
    .attr("x2", 165)  
    .attr("y2", 870);
		d3v4.select("svg")
		.append('text')
		  .attr('x', 170)
		  .attr('y', 863)
		.attr('class', "annotation-note-medium  guat")	
		  .text("on Primary Education")
		  .style("fill","#6c757d")
		  .call(wrap,290);
		  }
  
  function remGuatAnn(){
d3v4.selectAll(".guat").remove();
  }
  
function upGuatAnn(){
d3v4.selectAll(".guat").style("opacity",1);
  }


function addHonAnn() { 
		d3v4.select("svg")
		.append("ellipse")
		  .attr('class', "subject hond")
			   .attr("cx", 730)
			   .attr("cy", 500)
			   .attr("rx", 200)
			   .attr("ry", 200);
	d3v4.select("svg")
		.append('text')
		  .attr('x', 630)
		  .attr('y', 800)
			.attr('class', "annotation-note  hond")	
		  .text("Government Spent")
		  .style("fill","#6c757d");	   
		d3v4.select("svg")
		.append('text')
		  .attr('x', 630)
		  .attr('y', 837)
			.attr('class', "annotation-note-title  hond")
			.style("fill","#6c757d")
		  .text("$700 Million");
d3v4.select("svg").append("line")          
    .style("stroke", "black")  
    .attr('class', "hond")
    .attr("x1", 625)
    .attr("y1", 683)   
    .attr("x2", 625)  
    .attr("y2", 870);
		d3v4.select("svg")
		.append('text')
		  .attr('x', 630)
		  .attr('y', 863)
		.attr('class', "annotation-note-medium  hond")	
		  .text("on Primary Education")
		  .style("fill","#6c757d")
		  .call(wrap,290);

		  }
		  
		  
  function remHonAnn(){
d3v4.selectAll(".hond").remove();
  }
  
function upHonAnn(){
d3v4.selectAll(".hond").style("opacity",1);
  }


function addSlvAnn(){ 
		d3v4.select("svg")
		.append("ellipse")
		  .attr('class', "subject salv")
			   .attr("cx", 1170)
			   .attr("cy", 500)
			   .attr("rx", 170)
			   .attr("ry", 170);
		d3v4.select("svg")
		.append('text')
		  .attr('x', 1090)
		  .attr('y', 800)
			.attr('class', "annotation-note  salv")	
		  .text("Government Spent")
		  .style("fill","#6c757d");	 	   
		d3v4.select("svg")
		.append('text')
		  .attr('x', 1090)
		  .attr('y', 837)
			.attr('class', "annotation-note-title  salv")
			.style("fill","#6c757d")
		  .text("$400 Million");
	d3v4.select("svg").append("line")          
    .style("stroke", "black")  
        .attr('class', "salv")
            .attr("x1", 1085)
    .attr("y1", 660)   
    .attr("x2", 1085)  
    .attr("y2", 870);
		d3v4.select("svg")
		.append('text')
		  .attr('x', 1090)
		  .attr('y', 863)
		.attr('class', "annotation-note-medium  salv")	
		  .text("on Primary Education")
		  .style("fill","#6c757d")
		  .call(wrap,290);
		  }
  
function remSlvAnn(){
d3v4.selectAll(".salv").remove();
  }
  
function upSlvAnn(){
d3v4.selectAll(".salv").style("opacity",1);
  }
  
function addAllAnn(){
d3v4.select("svg")
.append("ellipse")
  .attr('class', "subject allcirc")    
       .attr("cx", 700)
       .attr("cy", 500)
       .attr("rx", 390)
       .attr("ry", 390);
d3v4.select("svg")
.append('text')
  .attr('x', 1070)
  .attr('y', 830)
	.attr('class', "annotation-note-title  allcirc")
  .text("$2.9 Billion");
  d3v4.select("svg").append("line")          
    .style("stroke", "black")  
        .attr('class', "allcirc")
            .attr("x1", 1065)
    .attr("y1", 660)   
    .attr("x2", 1065)  
    .attr("y2", 944);
d3v4.select("svg")
.append('text')
  .attr('x', 1070)
  .attr('y', 860)
	.attr('class', "annotation-note-label  allcirc")	
  .text("spent by the U.S. Department of Homeland Security to apprehend El Salvadorans, Guatemalans, and Hondurans at the Southwest Border.")
  .call(wrap,250);
  }
  
function remAllAnn(){
d3v4.selectAll(".allcirc").remove();

}

function upAllAnn(){
d3v4.selectAll(".allcirc").remove();

}
  
  
 const type2 = d3.annotationCustomType(d3.annotationXYThreshold, {
   note: {wrap: 300},
//                 "lineType":"none",
//                 "orientation": "top",
//                 "align":"middle"}
}); 
  
const annotations5 = [
  {
    note: { label: "On average takes 20 months for the Migrant to pay back the cost.",
    title: "20 Months Debt Irregular Migration with Smuggler" },
    subject: {
              x1: 1500,
              x2: 100 
            },
            y: 650,
  }
];
const makeAnnotations5 = d3.annotation()
  
.notePadding(5)
  .type(type2)
  .annotations(annotations5)

function addAvICAnn(){
d3v4.select("svg")
  .append("g")
  .attr('fill', "#662d91")
  .attr("class", "annotation-groupe")
  .attr("font-size", "1em")
  .style("opacity",1)
  .call(makeAnnotations5);
  d3v4.selectAll(".annotation text").attr("transform", "translate(800,-123)");
  }
  
function remAvICAnn(){
d3v4.selectAll(".annotation-groupe").style("opacity",0);
  }
  
function upAvICAnn(){
d3v4.selectAll(".annotation-groupe").style("opacity",1);
  }
  
  
  const annotations6 = [
  {
    note: { label: "On average takes 7 months for the Migrant to pay back the cost.",
    title: "7 Months Debt Irregular Migration on One's Own" },
    subject: {
              x1: 1500,
              x2: 100 
            },
            y: 870,
  }
];

const makeAnnotations7 = d3.annotation()
  
.notePadding(5)
  .type(type2)
  .annotations(annotations6)

function addAvIOAnn(){
d3v4.select("svg")
  .append("g")
  .attr('fill', "#faa41a")
  .attr("class", "annotation-groupf")
  .attr("font-size", "1em")
  .style("opacity",1)
  .call(makeAnnotations7);
  d3v4.selectAll(".annotation text").attr("transform", "translate(800,-123)");
  }
  
function remAvIOAnn(){
d3v4.selectAll(".annotation-groupf").style("opacity",0);
  }
  
function upAvIOAnn(){
d3v4.selectAll(".annotation-groupf").style("opacity",1);
  }
  
  
  const annotations8 = [
  {
    note: { label: "On average takes 10 months for the Migrant to pay back the cost.",
    title: "10 Months Debt Regular Migration" },
    subject: {
              x1: 1500,
              x2: 100 
            },
            y: 790,
  }
];

const makeAnnotations8 = d3.annotation()
  
.notePadding(5)
  .type(type2)
  .annotations(annotations8)

function addAvRegAnn(){
d3v4.select("svg")
  .append("g")
  .attr('fill', "#e23cad")
  .attr("class", "annotation-groupg")
  .attr("font-size", "1em")
  .style("opacity",1)
  .call(makeAnnotations8);
  d3v4.selectAll(".annotation text").attr("transform", "translate(800,-82)");
  }
  
function remAvRegAnn(){
d3v4.selectAll(".annotation-groupg").style("opacity",0);
  }
  
function upAvRegAnn(){
d3v4.selectAll(".annotation-groupg").style("opacity",1);
  }
  
function addIrrSmugg(){
d3v4.select("svg")
.append('text')
  .attr('x', 650)
  .attr('y', 830)
	.attr('class', "annotation-note-title  irrsmuggler")
	.style('fill','#662d91')
  .text("$1.7 Billion");
d3v4.select("svg")
.append('text')
  .attr('x', 650)
  .attr('y', 860)
	.attr('class', "annotation-note-label  irrsmuggler")

  .text("Spent Traveling with a Smuggler.")
  .call(wrap,250);
  }
  
function remIrrSmugg(){
d3v4.selectAll(".irrsmuggler").remove();

}

function upIrrSmugg(){
d3v4.select("svg")
.append('text')
  .attr('x', 650)
  .attr('y', 830)
	.attr('class', "annotation-note-title  irrsmuggler")
	.style('fill','#662d91')
  .text("$1.7 Billion");
d3v4.select("svg")
.append('text')
  .attr('x', 650)
  .attr('y', 860)
	.attr('class', "annotation-note-label  irrsmuggler")
	
  .text("Spent Traveling with a Smuggler.")
  .call(wrap,250);
  }
  
function addIrrOwnCar(){
d3v4.select("svg")
.append('text')
  .attr('x', 650)
  .attr('y', 830)
	.attr('class', "annotation-note-title  irrown")
	.style('fill','#faa41a')
  .text("$230 Million");
d3v4.select("svg")
.append('text')
  .attr('x', 650)
  .attr('y', 860)

	.attr('class', "annotation-note-label  irrown")	
  .text("Spent traveling on One's own or with Caravans.")
  .call(wrap,250);
  }
  
function remIrrOwnCar(){
d3v4.selectAll(".irrown").remove();

}

function upIrrOwnCar(){
d3v4.select("svg")
.append('text')
  .attr('x', 650)
  .attr('y', 830)
	.attr('class', "annotation-note-title  irrown")
	.style('fill','#faa41a')
  .text("$230 Million");
d3v4.select("svg")
.append('text')
  .attr('x', 650)
  .attr('y', 860)
	.attr('class', "annotation-note-label  irrown")	
  .text("Spent traveling on One's own or with Caravans.")

  .call(wrap,250);
  }
  
function addReg(){  
 d3v4.select(".means2").style("fill","#e23cad");}
 
 function remReg(){  
 d3v4.select(".means2").style("fill","black");}
 
 function addTotalLabelCost(){
d3v4.select("svg")
.append('text')
  .attr('x', 5)
  .attr('y', 25)
.attr('class', "annotation-note-title  totlabcost")	
  .text("Estimated Annual Spending in 2021 by Migrants Traveling to the U.S. from Central America");
  }
  
function remTotalLabelCost(){
d3v4.selectAll(".totlabcost").remove();}

function upTotalLabelCost(){
d3v4.select("svg")
.append('text')
  .attr('x', 5)
  .attr('y', 25)

	.attr('class', "annotation-note-title  totlabcost")	
  .text("Estimated Annual Spending in 2021 by Migrants Traveling to the U.S. from Central America");
  }

 function addFinanceLabel(){
d3v4.select("svg")
.append('text')
  .attr('x', 5)
  .attr('y', 25)
.attr('class', "annotation-note-title  finlabcost")	
  .text("Financing Migration to the U.S.");
  }
  
function remFinanceLabel(){
d3v4.selectAll(".finlabcost").remove();}

function upFinanceLabelt(){
d3v4.select("svg")
.append('text')
  .attr('x', 5)
  .attr('y', 25)

	.attr('class', "annotation-note-title  finlabcost")	
  .text("Financing Migration to the U.S.");
  }
 

// Load the data.
d3v4.csv('data/dots_data2.csv', display);


// function (d){ if (d.name === "irrregular coyote") return 0.04; else .023}

 function wrap(text, width) {
    text.each(function() {
        var text = d3v4.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0, //<-- 0!
        lineHeight = 1.2, // ems
        x = text.attr("x"), //<-- include the x!
        y = text.attr("y"),
        dy = text.attr("dy") ? text.attr("dy") : 0; //<-- null check
        tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");
        while (word = words.pop()) {
            line.push(word);
            tspan.text(line.join(" "));
            if (tspan.node().getComputedTextLength() > width) {
                line.pop();
                tspan.text(line.join(" "));
                line = [word];
                tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
            }
        }
    });
}


// window resize
$(window).resize(function() {
    if (winWidth > 768) {
        $("#gates_tooltip").css('opacity', 0.0);
    }
    else {
        $("#gates_tooltip").css({'opacity': 1.0, 'top': '1rem', 'left': '50%'});
    }
});


// window.onload = function() {
//   const id_with_hash = window.location.hash

//   if (id_with_hash.length != 0) {
//       console.log("cost: item has been scanned")
//   }

//   else {
//       // const motivationTextContent = $(".migrant-motivation-content");
//       // motivationTextContent.html("Scan an item to get started")
//       const costTextContent = $(".migrant-cost-content");
//       costTextContent.html("Scan an item to get started")
//   }

// }