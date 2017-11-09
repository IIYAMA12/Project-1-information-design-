console.log("waterSupply.js started");

var crankHanleParts = d3.selectAll(".crank-handle");
var waterDropGroup = d3.select("#water-drop-group");
var waterDropScaleGroup = waterDropGroup.select(".scale-group");

crankHanleParts
    .on("click", function () {
        if (window.parent.getStoryAnimationStatus() === false) {
            window.parent.setStoryAnimationStatus(true);
            console.log("clicked on crank parts");

            // prepare transitions for the drop
            var waterDropCreationTransition = d3.transition()
                .duration(1000)
                .ease(d3.easeLinear);

            var waterDropFallTransition = d3.transition()
                .duration(300)
                .ease(d3.easeLinear);

            var waterDropSplashTransition = d3.transition()
                .duration(300)
                .ease(d3.easeLinear);


            var newStory = window.parent.getNewStory();

            console.log("newStory", newStory);

            setTimeout(function () {
                window.parent.reActivateStorySelection();
            }, 4500);

            waterDropScaleGroup
                .attr("transform", "translate(118.075, 0) scale(0, 0)")
                .transition(waterDropCreationTransition)
                    .attr("transform", "translate(0, 0) scale(1, 1)")

                    // multiple transition hack :D
                    .call(
                        function () {
                        waterDropScaleGroup
                            .transition(waterDropFallTransition)
                                .delay(4000)
                                .attr("transform", "translate(0, 200) scale(1, 1)")
                                .call(
                                    function () {
                                        waterDropScaleGroup
                                            .transition(waterDropSplashTransition)
                                                .delay(4300)
                                                .attr("transform", "translate(0, 600) scale(1, 0)");
                                    }
                                );
                        }
                    )
            ;
        }
    })
;
