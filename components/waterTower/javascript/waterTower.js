var dataFunctions;


var watertowerSVG = d3.select("#watertower-svg");

var barContainer = document.getElementById('bars');
var clipMask;
if (barContainer) {
    clipMask = barContainer.children[0];
}


// create the scale
var y = d3.scaleLinear().rangeRound([919, 0]);
y.domain([0, 100]);



var axis = watertowerSVG.append("g")
    .attr("transform", "translate(" + 540 + "," + 188.80999999999995 + ")") // 540
    .attr("class", "axis axis-y")
    .attr("fill", "#ffffff")
    .call(d3.axisRight(y)
            .ticks(10)
            .tickFormat(function (d) {
                return d + "%";
            })
        );

axis.selectAll("line")
    .attr("stroke-width", 4)
    .attr("stroke", "white");

axis.selectAll("path")
    .attr("stroke-width", 4)
    .attr("stroke", "white");

axis.selectAll("text")
    .attr("font-size", 35)
    .attr("fill", "white");



function setWaterTowerContent (value1, value2) {
    if (clipMask != undefined) {

        // calculate the the precent of the values
        var total = value1 + value2;
        var percent1 = value1 / total * 100,
            percent2 = value2 / total * 100;






        // get the clipmasker
        var clipMaskD3 = d3.select(clipMask);


        // set the two colors.
        var colorClasses = [
            "fluoride-water-color",
            "water-color"
        ];

        // apply the data
        var groups = clipMaskD3.selectAll("g")
            .data([percent2, percent1]);



        // split the chain in two > groups and groupsWithEnter
        var groupsWithEnter = groups.enter()
            .append("g");

        var offsetTotalY = 0;

        var fluorideAndWaterTransition = d3.transition()
            .duration(600)
            .ease(d3.easeLinear);

        // hide bubbles
        var bubbles = d3.select("#bubbles");
        bubbles.attr("class", "hidden");

        // make the bars
        groupsWithEnter
            .append("rect")
                .attr("class", function (d, i){
                    return colorClasses[i];
                })
                .attr("x", "28.54")

                .attr("height", 0)

                .attr("y", function (d) {
                    return 1107.81 - offsetTotalY;
                })
                .attr("width", "510.95")
                .transition(fluorideAndWaterTransition)
                    .attr("height", function (d) {
                        return y(d);
                    })
                    .attr("y", function (d) {
                        var offsetY = offsetTotalY + y(d);
                        offsetTotalY += y(d);
                        return 1107.81 - offsetY;
                    });


        groups.select("rect")
            .transition(fluorideAndWaterTransition)
                .attr("y", function (d) {
                    var offsetY = offsetTotalY + y(d);
                    offsetTotalY += y(d);
                    return 1107.81 - offsetY;
                })
                .attr("height", function (d) {
                    return y(d);
                });
        //


        var firstGroup = clipMaskD3.select("g");
        var firstGroupRectangle = firstGroup.select("rect");

        // remove the skull
        groups.select("image")
            .remove();

        // remove the percentages
        groups.select("text")
            .remove();



        setTimeout(function () {

            var groups = clipMaskD3.selectAll("g")
                .data([percent1, percent2]);

            groups.select("image") // double remove skull, to prevent multiple skulls, while having interaction during an animation.
                .remove();

            // remove the percentages
            groups.select("text")
                .remove();




            var fluorideSkullTransition = d3.transition()
                    .duration(400)
                    .ease(d3.easeLinear);

            var imageSize = 100;

            // add percentages in the watertower
            groups
                .append("text")
                    .attr("x", function (d, i, allElements) {
                        var bar = d3.select(allElements[i].parentElement).select("rect");
                        return Number(bar.attr("x")) + Number(bar.attr("width") / 2);
                    })
                    .attr("y", function (d, i, allElements) {
                        var bar = d3.select(allElements[i].parentElement).select("rect");
                        return Number(bar.attr("y")) + Number(bar.attr("height") / 2);
                    })
                    .attr("fill", "white")
                    .attr("text-anchor", "middle")
                    .attr("font-size", 35)
                    .text(function (d) {
                        return Math.floor(d + 0.5) + "%";
                    })
            ;

            // create the skull image
            firstGroup
                .append("image")
                    .attr("height", imageSize)
                    .attr("width", imageSize)
                    .attr("x", Number(firstGroupRectangle.attr("x")) + Number(firstGroupRectangle.attr("width") / 2) - imageSize / 2)
                    .attr("y", Number(firstGroupRectangle.attr("y")) + Number(firstGroupRectangle.attr("height") / 2) - imageSize / 2 - (imageSize + 10))
                    .attr("href", "images/skull.svg")
                    .attr("opacity", 0)
                    .transition(fluorideSkullTransition)
                        .attr("opacity", 1);

            bubbles.selectAll("circle").attr("cy", Number(firstGroupRectangle.attr("y"))); // set bubbles height
            bubbles.attr("class", ""); // show bubbles
        }, 1000);






    }
}

// this function will be called when the data is ready for the watertower
function dataIsReadyForWaterTower (fileData) {

    var percentPerYear = fileData.customData.percentPerYear;
    // var = Object.keys(percentPerYear)[0];
    var defaultKey = fileData.filterData[0].defaultValue;

    var value = percentPerYear[defaultKey];

    setWaterTowerContent (value, 100 - value);
}

window.onload = function () {
    window.parent.setCallBackWhenDataIsReadyForId("fluorideWater", dataIsReadyForWaterTower);
    dataFunctions = window.parent.getDataFunctions("fluorideWater");
};
