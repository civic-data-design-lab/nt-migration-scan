/*
 * Creates tooltip with provided id that
 * floats on top of visualization.
 * Most styling is expected to come from CSS
 * so check out bubble_chart.css for more details.
 */
function floatingTooltip(divId) {
  // Local variable to hold tooltip div for
  // manipulation in other functions.

    const divIdSelector = "#" + divId;
    if (divId == "frame-cost") {
        var tt = d3v4.select(divIdSelector)
            .append('div')
                .attr('id', "tt-cost")
                .attr('class', 'tooltip tooltip-cost')
                .html("<div class='side-color' style='background: rgb(102, 45, 145);'></div><div class='row mb-1'><div class='col-7'><p class='text-label-onemigrant'>ONE MIGRANT</p><p>From <span class='label-country text-label'>El Salvador</span> Spent</p></div><div class='col-5'><h3 class='label-cost text-color' style='color: rgb(102, 45, 145);'>$9,000</h3></div></div><h3 class='label-pathway text-color' style='color: rgb(102, 45, 145)'>Using a Smuggler to Migrate</h3>")
                .style("display", "none"); // initially hide tooltip
    }
    else {
        var tt = d3v4.select('body')
            .append('div')
            .attr('class', 'tooltip tooltip-cost')
            .attr('id', "tt-cost");

    //         // Initially it is hidden.
            hideTooltip();
            $("tt-cost").css("display", "none");
    }
  // Set a width if it is provided.
//   if (width) {
//     tt.style('width', width);
//   }

  

  /*
   * Display tooltip with provided content.
   *
   * content is expected to be HTML string.
   *
   * event is d3v4.event for positioning.
   */
//   function showTooltip(content, event) {
  function showTooltip(event) {
    tt.style('opacity', 1.0)
    //   .html(content);

    updatePosition(event);
  }

  /*
   * Hide the tooltip div.
   */
  function hideTooltip() {
    tt.style('opacity', 0.0);
  }

  /*
   * Figure out where to place the tooltip
   * based on d3v4 mouse event.
   */
  function updatePosition(event) {    
    if (winWidth >= 720) {
        tt
        .style("top", (divHtml) => {
            var divY = event.pageY;
            var ttHeight = $("#tt-cost").outerHeight();
            var divHeight = $("#frame-cost #cost-svg").height();

            if ((divY + ttHeight + 60) > winHeight) {
                divY = divY - ttHeight - 15;
            };
            return (divY + 5) + "px"
        })
        .style("left", (divHtml) => {
            var divX = event.pageX;
            var ttWidth = $("#tt-cost").width();
            var divWidth = $("#frame-cost #cost-svg").width();

            if ((divX + ttWidth) > divWidth) {
                divX = divX - ttWidth - 15;
            };
            return (divX + 5) + "px"
        })
    }
    else {
        tt.style("top", "1rem")
            .style("left", "57%");
    }
  }

  return {
    showTooltip: showTooltip,
    hideTooltip: hideTooltip,
    updatePosition: updatePosition
  };
}
