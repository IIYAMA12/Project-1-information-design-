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

function setSubjectContent (title, bodyText) {
    var informationAboutSubject = d3.select("#information-about-subject");



    if (!informationAboutSubject.empty()) {
        informationAboutSubject
            .attr("class", ""); // removed class disabled-subject-info
        informationAboutSubject.select("h3")
            .text(title ? title : "");

        informationAboutSubject.select("p")
            .text(bodyText ? bodyText : "");
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
