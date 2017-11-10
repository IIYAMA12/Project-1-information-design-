
var pathStart = "./datasets/"; // ./dataFiles/

var allFileData = [

    {
        // write the rest of the path. pathStart will be added in front of the path below.
        path : "Water_Fluoridation_Statistics_-_Percent_of_PWS_population_receiving_fluoridated_water.csv",  // *

        metadata : {
            owner : "CDC",
            source : "https://chronicdata.cdc.gov/Oral-Health/Water-Fluoridation-Statistics-Percent-of-PWS-popul/8235-5d73",
            apaFormat : "CDC. (2017, 25 oktober). Water Fluoridation Statistics - Percent of PWS population receiving fluoridated water [Dataset]. Geraadpleegd van https://chronicdata.cdc.gov/Oral-Health/Water-Fluoridation-Statistics-Percent-of-PWS-popul/8235-5d73"
        },

        readAsType : "csv", // csv / tsv / text  // *

        // give the data an id. (don't add spaces and special characters are not recommended)
        id : "fluorideWater", // *

        // give it a friendlyName / title
        friendlyName : "Fluoridewater en populatie", // *

        // fill in columns that must be filled in. If not filled in, they will be deleted.
        mustBeFilledIn : {
            // format: column : true OR column : false OR do not fill in.
            "datavalue" : true,
            "year" : true,
            "locationdesc" : true
        },

        // this indicates if the file has been ready. (pls leave it default >false<)
        ready : false,
        filterData : [
        // filter format
        /*
            {
                filterOn : "", // column
                friendlyName : "", // title name
                defaultValue : "", // the default selected value (optional)
                filterFunction : function (d) { // how do you want to filter it?
                    return d[this.filterOn] === this.defaultValue; // default
                },
            }
        */
            {
                id : "year",
                filterOn : "year", // column
                friendlyName : "Year", // title name
                filterFunction : function (d) { // how do you want to filter it?
                    return d[this.filterOn].getTime() === this.defaultValue.getTime(); // default
                },
            },
            {
                id : "percent",
                filterOn : "datavaluetype", // column
                friendlyName : "Percent", // title name
                filterFunction : function (d) { // how do you want to filter it?
                    return d[this.filterOn] === "Percent"; // default
                },
                doNotAddToFilterSelection : true
            },
            {
                id : "population",
                filterOn : "datavaluetype", // column
                friendlyName : "Population", // title name
                filterFunction : function (d) { // how do you want to filter it?
                    return d[this.filterOn] === "Population"; // default
                },
                doNotAddToFilterSelection : true,
                filterOnlyOnRequest : true
            },
        ],

        timeParseFormats : {
            "year" : "%Y"
        },

        customData : {

        },

        //

        startFunction : function (error, allData) {
            if (error) throw error;




            // all processes. Please feel to add and remove processes below.
            var processes = [
                this.processes.preProcessFunction,
                this.processes.processFunction,
                // this.processes.afterProcessFunction,
                // this.processes.prepareGraphFunction,
                // this.processes.prepareSecondaryGraphFunction
            ];

            this.allData = allData;

            // status if a process fails.
            var oneProcessFailed = false;

            // run all processes
            var i;

            for (i = 0; i < processes.length; i++) {
                allData = processes[i](this, allData);
                this.allData = allData;
                if (allData == undefined || !allData || typeof(allData) == "string" || typeof(allData) == "number") {
                    oneProcessFailed = true;
                    break;
                }
            }




            // all processes successfully executed?
            if (!oneProcessFailed) {
                this.endFunction(this, allData);
            } else {
                console.log("From file >", this.id, "< A process at index:", i, "has failed.");
            }
        },

        //

        processes : {
            preProcessFunction : function (fileData, allData) { // run all processes) { // before reading






                return allData;
            },
            processFunction : function (fileData, allData) { // after reading

                // The data is ready to be read, add here your pre-edit functions

                // you can find the prepareData function in the file: fileDataFunctions.js
                // It is used to clean and remove broken data. Feel free to edit and customize it.
                // Also fill in the mustBeFilledIn array(see top), if you want to filter on missing data.

                prepareData(fileData);

                allData = allData.filter(function (d) {
                    // Add only the right data
                    if (d.locationabbr !== "US") {
                        return true;
                    }

                });



                // var yearsData = filterFileData (fileData, ["year"]);

                var yearsData = allData.filter(function (d) {
                    // Add only the right data
                    if (d.datavaluetype === "Percent") {
                        return true;
                    }

                });


                // add here your edit functions
                fileData.customData.percentPerYear = {};
                var percentPerYear = fileData.customData.percentPerYear;

                var yearsNested = d3.nest()
                    .key(function(d) { return d.year; })
                    .entries(yearsData);

                for (var i = 0; i < yearsNested.length; i++) {
                    var yearData = yearsNested[i];
                    percentPerYear[yearData.key] = d3.sum(yearData.values, function(d) { return d.datavalue; }) / yearData.values.length;
                    // ;
                }

                // http://bl.ocks.org/phoebebright/raw/3176159/

                return allData;
            },
            afterProcessFunction : function (fileData, allData) {
                // Still need to change data? Please do it here.


                //
                return allData;
            },
            prepareGraphFunction : function (fileData, allData) {

                return allData;
            },
            prepareSecondaryGraphFunction : function (fileData, allData) {
                /*fileData.secondaryGraph = {
                    column : "tot_respondents",
                    columnLabel : "team"
                };*/
                return allData;
            }
        },

        //

        endFunction : function (fileData, allData) {

            // data is ready to use.
            fileData.ready = true;

            // add filters for the graph
            if (fileData.filterData != undefined && fileData.filterData.length > 0) {
                prepareFilters (allData, fileData.filterData); // disabled the auto filter, because I set this manualy.
            }

            callDataRequestersBack (fileData);

            createFilters (fileData);
        }
    },

    // ----------------------------------------------------------------------------------------------------------------------------------------------------

    // ----------------------------------------------------------------------------------------------------------------------------------------------------

    // ----------------------------------------------------------------------------------------------------------------------------------------------------

    // NEXT FILE

    // ----------------------------------------------------------------------------------------------------------------------------------------------------

    // ----------------------------------------------------------------------------------------------------------------------------------------------------

    // ----------------------------------------------------------------------------------------------------------------------------------------------------
    {
        // write the rest of the path. pathStart will be added in front of the path below.
        path : "NOHSS_Adult_Indicators.csv",  // *

        metadata : {
            owner : "CDC",
            source : "https://chronicdata.cdc.gov/Oral-Health/NOHSS-Adult-Indicators/jz6n-v26y",
            apaFormat : "CDC. (2017, 25 oktober). NOHSS Adult Indicators [Dataset]. Geraadpleegd van https://chronicdata.cdc.gov/Oral-Health/NOHSS-Adult-Indicators/jz6n-v26y"
        },

        readAsType : "csv", // csv / tsv / text  // *

        // give the data an id. (don't add spaces and special characters are not recommended)
        id : "gebitsgezondheid", // *

        // give it a friendlyName / title
        friendlyName : "Gebitsgezondheid van volwassenen.", // *

        // fill in columns that must be filled in. If not filled in, they will be deleted.
        mustBeFilledIn : {
            // format: column : true OR column : false OR do not fill in.
            "datavalue" : true,
            "year" : true,
            "locationdesc" : true
        },

        // this indicates if the file has been ready. (pls leave it default >false<)
        ready : false,
        filterData : [
        // filter format
        /*
            {
                filterOn : "", // column
                friendlyName : "", // title name
                defaultValue : "", // the default selected value (optional)
                filterFunction : function (d) { // how do you want to filter it?
                    return d[this.filterOn] === this.defaultValue; // default
                },
            }
        */
        ],

        timeParseFormats : {
            "year" : "%Y"
        },

        customData : {

        },

        //

        startFunction : function (error, allData) {
            if (error) throw error;




            // all processes. Please feel to add and remove processes below.
            var processes = [
                this.processes.preProcessFunction,
                this.processes.processFunction,
                // this.processes.afterProcessFunction,
                // this.processes.prepareGraphFunction,
                // this.processes.prepareSecondaryGraphFunction
            ];

            this.allData = allData;

            // status if a process fails.
            var oneProcessFailed = false;

            // run all processes
            var i;

            for (i = 0; i < processes.length; i++) {
                allData = processes[i](this, allData);
                this.allData = allData;
                if (allData == undefined || !allData || typeof(allData) == "string" || typeof(allData) == "number") {
                    oneProcessFailed = true;
                    break;
                }
            }




            // all processes successfully executed?
            if (!oneProcessFailed) {
                this.endFunction(this, allData);
            } else {
                console.log("From file >", this.id, "< A process at index:", i, "has failed.");
            }
        },

        //

        processes : {
            preProcessFunction : function (fileData, allData) { // run all processes) { // before reading






                return allData;
            },
            processFunction : function (fileData, allData) { // after reading

                // The data is ready to be read, add here your pre-edit functions

                // you can find the prepareData function in the file: fileDataFunctions.js
                // It is used to clean and remove broken data. Feel free to edit and customize it.
                // Also fill in the mustBeFilledIn array(see top), if you want to filter on missing data.

                prepareData(fileData);

                // nest data based on location
                allData = d3.nest()
                    .key(function(d) { return d.locationdesc; })
                    .entries(allData);

                // make sure you can access each object also with it's key. (this is saved in custom data)
                var accessDataByKey = {};

                for (var i = 0; i < allData.length; i++) {
                    // calculate the median
                    var values = allData[i].values;
                    var medianValue = d3.median(values.map(function (d) {
                        return d.lowconfidenceinterval;
                    }));

                    allData[i].average = medianValue;
                    accessDataByKey[allData[i].key] = allData[i];
                }

                fileData.customData.accessDataByKey = accessDataByKey;

                // http://bl.ocks.org/phoebebright/raw/3176159/

                return allData;
            },
            afterProcessFunction : function (fileData, allData) {
                // Still need to change data? Please do it here.


                //
                return allData;
            },
            prepareGraphFunction : function (fileData, allData) {

                return allData;
            },
            prepareSecondaryGraphFunction : function (fileData, allData) {

                return allData;
            }
        },

        //

        endFunction : function (fileData, allData) {

            // data is ready to use.
            fileData.ready = true;

            // add filters for the graph
            if (fileData.filterData != undefined && fileData.filterData.length > 0) {
                prepareFilters (allData, fileData.filterData); // disabled the auto filter, because I set this manualy.
            }

            callDataRequestersBack (fileData);

        }
    }


];

// quick path edit.
for (var i = 0; i < allFileData.length; i++) {
    allFileData[i].path = pathStart + allFileData[i].path;
}
