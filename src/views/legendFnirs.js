import * as d3 from 'd3';
export function add_legendFnirs(){
      //fnirs agg legend

      let legendSvg = d3.select("#legend-svg")
    
      legendSvg.append("text")
      .attr("x",5)
      .attr("y", 13)
      .attr("text-anchor","start")
      .style("font-size","11px" )
      .text("Mental")
      .append("tspan")
      .attr("x", 7)
      .attr("dy","1.2em")
      .text("State"); 
  
      legendSvg.append("rect")
          .attr("x",45)
          .attr("y", 10)
          .attr("height", 9)
          .attr("width", 9)
          .attr("fill", "#99070d");
      
      legendSvg.append("text")
          .attr("x",55)
          .attr("y", 18)
          .attr("text-anchor","start")
          .style("font-size","10px" )
          .text("Overload");
  
      legendSvg.append("rect")
          .attr("x",105)
          .attr("y",10)
          .attr("height", 9)
          .attr("width", 9)
          .attr("fill", "#eb5a4d");
  
      legendSvg.append("text")     
          .attr("x", 115)
          .attr("y",18)
          .attr("text-anchor","start")
          .style("font-size","10px" )
          .text("Optimal");
  
      legendSvg.append("rect")
          .attr("x",160)
          .attr("y", 10)
          .attr("height", 8)
          .attr("width", 8)
          .attr("fill", "#ffb0b0");
      
      legendSvg.append("text")
          .attr("x",170)
          .attr("y", 18)
          .attr("text-anchor","start")
          .style("font-size","10px" )
          .text("Underload");
  
}