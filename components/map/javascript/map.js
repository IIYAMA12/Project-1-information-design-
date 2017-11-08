window.onload = function () {
    window.parent.setCallBackWhenDataIsReadyForId("fluorideWater", dataIsReadyForMap);
    var dataFunctions = window.parent.getDataFunctions("fluorideWater");

    // it seems like I can't extract the d3 libary with the variable d3. Annoying!
    // var d3 = window.parent.d3;
    // console.log("d3", d3);

    var mapGroup = d3.select("#map-group");
    var mapContainer = mapGroup.select("#map-container");

    // colors
    var firstColor = d3.color("#0080ff");
    var secondColor = d3.color('#55d911');
    var allColors = [secondColor, firstColor];

    // make extra info indicator while hovering
    var mapHoverInformation = mapGroup
        .append("g")
            .attr("id", "map-hover-info")
    ;

    mapHoverInformation
        .append("circle")
            .attr("cx", "0")
            .attr("cy", "0")
            .attr("r", "150")
            .attr("fill", "#ffffff")
    ;



    // create an d3 object/function that will process our data and use it to create the piechart.
    var deliciousPie = d3.pie() // https://github.com/d3/d3-shape/blob/master/README.md#pie
        .sort(null) // disable sorting, because there only 2 values.
    ;
        // .value(function(d) {
        //     return d.precent;
        // })
    //;

    var pieRadius = 100;

    var calculatedPath = d3.arc() // lets create our calculated paths. (this is not an html element!)
        .outerRadius(pieRadius - 10)
        .innerRadius(0)
    ;

    var arc = mapHoverInformation.selectAll(".arc")
        .data(deliciousPie([50, 50])); // add fake data

    arcWithEnter = arc
        .enter().append("g")
            .attr("class", "arc");

    arc.exit().remove();


    arcWithEnter
        .append("path")
            .attr("stroke", "white")
            .attr("stroke-width", 1)
            .attr("d", 0)
            .attr("d", calculatedPath)
            .attr("fill",
                function(d, i) {
                    return allColors[i];
                }
            )
    ;


    // prapare label
    var labelPosition = d3.arc()
        .outerRadius(pieRadius + 100)
        .innerRadius(pieRadius + 100);

    arcWithEnter
        .append("text")
            .attr("transform", function(d) { return "translate(" + labelPosition.centroid(d) + ")"; })
            .attr("dy", "1em")
            .attr("font-size", 20)
            .attr("fill", "black")
            .text("");




    // https://github.com/d3/d3-shape/blob/master/README.md#arc
    // https://en.wikipedia.org/wiki/Arc_(geometry)


    // all map elements = states of US
    var mapElements = mapContainer.selectAll(function() {
      return this.children; // this will get all element children. Love it, hacking in d3.
    });





    // hover over a state of the US
    mapElements
        .on("mouseover", function () {
            var fileData = dataFunctions.getDataOfFileById("fluorideWater");
            if (fileData != undefined) {
                var allData = dataFunctions.filterFileData(fileData);
                if (allData != undefined) {


                    var transitionCircleDiagram = d3.transition().duration(400).ease(d3.easeLinear);

                    var selectedElement = d3.select(this);
                    var elementId = selectedElement.attr("id");


                    // find the data based location
                    var targetData = null;
                    for (var i = 0; i < allData.length; i++) {
                        if (allData[i].locationabbr === elementId) {
                            targetData = allData[i];
                            break;
                        }
                    }

                    if (targetData) {

                        var elementBoxData = selectedElement.node().getBBox();
                        // get the svg element size: https://stackoverflow.com/questions/21990857/d3-js-how-to-get-the-computed-width-and-height-for-an-arbitrary-element

                        var width = elementBoxData.width,
                            height = elementBoxData.height,
                            x = elementBoxData.x,
                            y = elementBoxData.y
                        ;

                        var circleSize = 80;//Math.min(width, height) * 0.8; // 80% of the minimal size


                        var centerX = x + width / 2,
                            centerY = y + height / 2
                        ;


                        // move the container to the center of the selected area.
                        mapHoverInformation
                            .attr("transform", "translate(" + centerX + ", " + centerY + ")")
                        ;

                        // create the big white circle, which makes the text readable
                        mapHoverInformation
                            .select("circle")
                            .transition(transitionCircleDiagram)
                                .attr("r", circleSize / 2)
                        ;

                        var calculatedPath = d3.arc() // lets create our calculated paths. (this is not an html element!)
                            .outerRadius(circleSize / 2 * 0.8)
                            .innerRadius(circleSize / 2 * 0.2)
                        ;

                        // get the value. datavalue == column. So no camelCase
                        var dataValue = targetData.datavalue;

                        // prepare the new arc
                        var arc = mapHoverInformation.selectAll(".arc")
                            .data(deliciousPie([dataValue, 100 - dataValue]));

                        var labelPosition = d3.arc()
                            .outerRadius(circleSize / 2 * 1.4)
                            .innerRadius(circleSize / 2 * 1.4);

                        // update the circle
                        arc.select("path")
                            // .attr("d", 0)
                            .transition(transitionCircleDiagram)
                                .attr("opacity", 1)
                                .attr("d", calculatedPath)
                                .attr("fill",
                                    function(d, i) {
                                        return allColors[i];
                                    }
                                )
                        ;

                        arc.select("text")
                            .attr("transform", function(d) {
                                var textPosition = labelPosition.centroid(d);
                                textPosition[1] -= 10; // push the text 10 down = up on screen
                                return "translate(" + textPosition + ")";
                            })
                            .attr("text-anchor", "middle")
                            .text(function(d) {
                                return Math.floor(d.data + 0.5) + "%"; // Math.floor + 0.5 = same as Math.round
                            })
                            .transition(transitionCircleDiagram)
                                .attr("opacity", 1)
                        ;

                    }
                }
            }
        })
    ;


    mapElements
        .on("click", function () {
            var selectedElement = d3.select(this);

        })
    ;

    mapElements
        .on("mouseout", function () {
            var transitionCircleDiagram = d3.transition().duration(400).ease(d3.easeLinear);
            mapHoverInformation
                .select("circle")
                .transition(transitionCircleDiagram)
                    .attr("r", 0)
            ;

            var arc = mapHoverInformation.selectAll(".arc");

            var calculatedPath = d3.arc() // lets create our calculated paths. (this is not an html element!)
                .outerRadius(2)
                .innerRadius(1)
            ;

            arc.select("path")
                // .attr("d", 0)
                .transition(transitionCircleDiagram)
                    .attr("d", calculatedPath)
                    .attr("opacity", 0)
            ;

            arc.select("text")
                .transition(transitionCircleDiagram)
                    .attr("opacity", 0)
            ;

        })

    ;

    function dataIsReadyForMap (fileData) {
        var allData = dataFunctions.filterFileData(fileData);




        // get the color properties.
        // https://github.com/d3/d3-color/blob/master/README.md#color


        //var colorRangeR = d3.scaleLinear().domain([i, allData.length]).range([firstColor.r, secondColor.r]);
        var colorRangeG = d3.scaleLinear().domain([0, 100]).range([firstColor.g, secondColor.g]);
        var colorRangeB = d3.scaleLinear().domain([0, 100]).range([firstColor.b, secondColor.b]);

        var colorRange = function (index) {
            return d3.rgb(0, colorRangeG(index), colorRangeB(index));
        };



        mapElements
            .data(allData, function(d, i) {
                //console.log(d ? d.locationabbr : d3.select(this).attr("id"));
                return d ? d.locationabbr : d3.select(this).attr("id");
                // if (d) {
                //     console.log(d.locationabbr, d3.select(this).attr("id"));
                //
                // } else {
                //     console.log("d undefined at", this.id);
                // }
                // return false;
            }) // https://github.com/d3/d3-selection#selection_data)
            .attr("fill", function (d) {
                return colorRange(d.datavalue);
            });

        // mapContainer
        //     .selectAll("path")
        //         .attr("fill", "red");
    }



};
