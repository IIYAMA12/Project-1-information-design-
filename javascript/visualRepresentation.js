// ----------------------//
// first section content //


function createFilters (fileData) {
    var footer = d3.select("#first-content-section > footer");
    if (footer != undefined) {
        footer.html(""); // Remove the filters. No need to animate the recreation

        var filterData = fileData.filterData;
        if (filterData != undefined) {

            // footer.append("h3")
            //     .text("filters");

            for (var i = 0; i < filterData.length; i++) {


                var filter = filterData[i];
                var variants = filter.variantsFound;
                if (variants != undefined && !filter.doNotAddToFilterSelection) {

                    var formElement = footer.append("form");

                    if (filter.friendlyName != undefined && filter.friendlyName != "") {
                        formElement.append("legend")
                            .text(filter.friendlyName);
                    }

                    var fieldset = formElement
                        .append("fieldset")
                    ;

                    // make groups
                    var groups = fieldset
                        .selectAll("span")
                            .data(variants)
                                .enter()
                                    .append("span");

                    // put the filter inputs and labels in it.
                    var inputs = groups
                        .append("input")
                            .attr("id", function(d) {
                                return fileData.id + "-|-" + i + "-|-" + d;
                            })
                            .attr("type", "radio")
                            .attr("name", "filter")
                            .attr("value", function(d) {
                                return  i + "-|-" + d.getTime(); // side-filterId-filterData
                            })
                            // this should set only one radio button selected, but it isn't working.
                            .property('checked', function (d) {
                                return d === filter.defaultValue ? true : false;
                            })
                            // I love filtering...
                            .on("change", applyFilter);


                    var labels = groups
                            .append("label")
                                .attr("for", function(d) {
                                    return fileData.id + "-|-" + i + "-|-" + d;
                                })
                                .attr("type", "radio")
                                // .attr("value", function(d) {
                                //     return d;
                                // })
                                .text(function(d) {
                                    return d.getFullYear();
                                });

                    // check the right selected filter after refreshing the filters.
                    inputs
                        .property('checked', function (d) {
                            return d === filter.defaultValue ? true : false;
                        });

                }
            }
            return true;
        }
    }
    return false;
}


function applyFilter () {

    // get the data from the input element
    var filterDataString = this.value;
    if (filterDataString != undefined) {
        // make the data readable
        var filterDataArray = filterDataString.split("-|-");
        if (filterDataArray != undefined && filterDataArray.length === 2) {
            var filterId = Number(filterDataArray[0]);
            var data = Number(filterDataArray[1]);
            // validate
            if (filterId != undefined && data != undefined && data != "") {
                // try to access the data with the given information.
                var fileData = getDataOfFileById("fluorideWater");
                if (fileData) {

                    // now get the filter
                    var filterData = fileData.filterData;
                    if (filterData != undefined) {
                        var filter = filterData[filterId];
                        if (filter != undefined) {

                            // update the filter
                            filter.defaultValue = new Date(data);

                            // reload/update the graph
                            callDataRequestersBack (fileData);
                        }
                    }
                }
            }
        }
    }
}

// -----------------------//
// second section content //

function setSubjectContent (title, bodyText, url) {
    var informationAboutSubject = d3.select("#information-about-subject");

    if (!informationAboutSubject.empty()) {
        informationAboutSubject
            .attr("class", ""); // removed class disabled-subject-info
        informationAboutSubject.select("h3")
            .text(title ? title : "");

        informationAboutSubject.select("p")
            .text(bodyText ? bodyText : "");

        informationAboutSubject.select("a")
            .attr("href", url ? url : "#");

        return true;
    }
    return false;
}

function disableSubjectContent () {
    var informationAboutSubject = d3.select("#information-about-subject");
    if (!informationAboutSubject.empty()) {
        informationAboutSubject
            .attr("class", "disabled-subject-info"); // add class
    }
    return true;
}


// -----------------------//
// third section content //

var thirdContentSection = document.getElementById("third-content-section");
var toothbrush = document.getElementById("toothbrush");

setCallBackWhenDataIsReadyForId("gebitsgezondheid", function (fileData) {
    var list = d3.select(thirdContentSection).select("section").select("ul");

    var allData = fileData.allData;

    var listItems = list
        .selectAll("li")
            .data(allData)
                .enter()
                    .append("li")
    ;


    listItems
        .append("object")
            .attr("type", "text/html")
            .attr("data", "./components/tooth/tooth.html")
            .attr("id", function (d) {
                return d.key;
            })
    ;

    listItems
        .append("h4")
            .text(function (d) {
                return d.key;
            })
        ;

    if (thirdContentSection && toothbrush) {

        var keyIsPressed = false;

        document.addEventListener('mousedown', function(e) {
            keyIsPressed = true;
        });

        document.addEventListener('mouseup', function(e) {
            keyIsPressed = false;
        });

        thirdContentSection.addEventListener("mousemove", function (e) {
            var cursorPositionX = e.clientX;


            var cursorPositionY = e.clientY - thirdContentSection.getBoundingClientRect().top;
            // https://stackoverflow.com/questions/3234256/find-mouse-position-relative-to-element

            if (cursorPositionY > 0 && cursorPositionX > 0) {
                toothbrush.style.transform = "translate(" + cursorPositionX + "px, " + cursorPositionY + "px)";
                if (keyIsPressed) {
                    var source = e.target;
                    if (source.tagName == "OBJECT") {



                        var doc = source.contentDocument;
                        var win = doc.defaultView || doc.parentWindow;
                        // https://stackoverflow.com/questions/16010204/get-reference-of-window-object-from-a-dom-element
                        var selectedData = fileData.customData.accessDataByKey[source.id];
                        if (selectedData != undefined) {
                            if (selectedData.brushed == undefined) {
                                selectedData.brushed = 0;
                            }
                            win.cleaningTooth(selectedData);
                        }
                    }
                }
            }
        });
    }
});
