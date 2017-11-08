
var parseTimeHourMinute = d3.timeParse("%H:%M");
// https://github.com/d3/d3-time-format


// a global data cleaner
function prepareData (fileData) {
    var allData = fileData.allData;
    if (allData == undefined) {
        console.log("allData is nil for ID", fileData.id);
    } else {
        // these columns must contain values
        var mustBeFilledIn = fileData.mustBeFilledIn != undefined ? fileData.mustBeFilledIn : [];

        var timeParseFormats = fileData.timeParseFormats; // syntax: {column:format, column:format}
        if (timeParseFormats == undefined) {
            timeParseFormats = {};
        }

        var columnCount = getObjectItemCount(allData[0]); // get the column count based on the first item.
        // todo I have to check this later: allData.columns.length

        for (var i = allData.length - 1; i > -1 ;i--) { // invert loop for slice (else it will skip items, because the array becomes shorter)

            var data = allData[i];

            if (data != undefined) {

                // define how many checks the item has to pass in order to be OK.
                var checks = columnCount;

                // check all properties
                for (var prop in data) {
                    var value = data[prop];

                    // please be lowercase, no need to think about it later.
                    var newProp = prop.toLowerCase();

                    // not sure if it is possible, but I do not want undefined or nulls converted to strings. Will result in "undefined"/"null" with the >String< function.
                    if (value == undefined) {
                        value = "";
                    }

                    // convert numbers to strings, for the string functions below. (afaik I once has numbers in stead of strings, probably because it were actualy numbers or booleans >0,1<
                    value = String(value);

                    // remove special characters
                    newProp = removeAllSpecialCharacters(newProp);

                    // trim arround
                    newProp = newProp.trim();
                    value = value.trim();

                    // replace spaces
                    newProp = replaceAll(newProp, " ", "_");


                    // remove new lines
                    value = replaceAll(value, "\n", "");


                    // make it a number to check if it is a number
                    var convertedToNumber = Number(value);

                    if (newProp === "datum" || newProp === "date" || newProp === "year") { // maybe a date?

                        // parse the date
                        var timeParseFormat = timeParseFormats[newProp] != undefined ? timeParseFormats[newProp] : "%d-%m-%Y";
                        var convertedToDate = d3.timeParse(timeParseFormat)(value);


                        // no date found? Make a backup (for debug + fixing later purposes)
                        if (value == undefined) {
                            data[prop + "_backup"] = value;
                        }

                        value = convertedToDate;


                    } else if (value.search(":") > 0  && value.search("-") <= 0  && (newProp.search("tijd") > 0 || newProp.search("time") > 0 )) { // is it ONLY time?

                        value = parseTimeHourMinute(value);
                        if (value != undefined) {
                            var hours = value.getHours();
                            value = Math.round((value.getMinutes() / 60) + hours);
                        }
                    } else if (convertedToNumber && !isNaN(convertedToNumber)) { // Is it a number?
                        value = convertedToNumber;
                    }

                    // remove old data, with old index.
                    delete data[prop];

                    if ((!mustBeFilledIn[newProp]) || (value != "undefined" && value != null && value !== "")) { // OK property is correct.

                        // lets assign it to the new index.
                        data[newProp] = value;

                        // drop the check count till it is zero. Zero = OK
                        checks--;

                    } else { // Property NOT OK, break the property check loop
                        break;
                    }
                }

                // this will allow me to debug the item and see where it came from.
                data.debugIndex = i;

                // give it an id. Which is actually the same value as the debugIndex. But can be used for NON debug purposes, this is done for definition purposes.
                data.id = i;

                // item is invalid remove it.
                if (checks !== 0) {
                    allData.splice(i, 1);
                }

            } else { // no item found? Shouldn't be happening, but just incase remove it.
                allData.splice(i, 1);
            }
        }

        // sort the date.
        allData = allData.sort(sortByDateAscending);

        return allData;
    }
    return false;
}


// ----------------------------------------------------------------------------------------------------------------------------------------------------

// ----------------------------------------------------------------------------------------------------------------------------------------------------

// ----------------------------------------------------------------------------------------------------------------------------------------------------


// option for filtering data in the graph. (might not be used)
function prepareFilters (allData, filterData) {
    // loop though all filters
    for (var i = 0; i < filterData.length; i++) {
        var filterOn = filterData[i].filterOn; // for example filter on 'device'

        // find all data variants (for example device: smartphone, tablet, laptop)
        var variantsFound = {}; // register here

        // collect here. Looping through an array LATER is much faster than looping though an object.
        // It also keeps the data in order.
        var variantsFoundCollector = [];

        // set a defaultValue.
        var defaultValue;

        // loop though all items and collect variants.
        for (var j = 0; j < allData.length; j++) {
            var data = allData[j];
            var value = data[filterOn];

            if (undefined != value && !variantsFound[value]) {

                if (defaultValue == undefined) {
                    defaultValue = value;
                }

                variantsFound[value] = true; // found it! so do not add again.
                variantsFoundCollector[variantsFoundCollector.length] = value;
            }
        }

        filterData[i].defaultValue = defaultValue;

        // return all prepared filters.
        filterData[i].variantsFound = variantsFoundCollector;
    }
}


// ----------------------------------------------------------------------------------------------------------------------------------------------------

// ----------------------------------------------------------------------------------------------------------------------------------------------------

// ----------------------------------------------------------------------------------------------------------------------------------------------------


// Remove data from an object under multiple conditions. I prefer mutators, because I wany my data to stay linked.
function removeDataWithCondition (allData, conditions) {
    for (var i = allData.length - 1; i > -1; i--) { // invert the loop, because we are using splice. Else it will skip items.
        var data = allData[i];
        if (data) {
            for (var j = 0; j < conditions.length; j++) {
                if (conditions[j](data)) {
                    allData.splice(i, 1);
                }
            }
        }
    }
    return allData;
}

// Usage
/*
    removeDataWithCondition (allData,
        [
            // condition 1
            function (d) {
                return false; // do NOT remove
            },
            // condition 2
            function (d) {
                return true; // do remove
            }
        ]
    );
*/

function findFilterById (fileData, id) {
    var filterData = fileData.filterData;
    for (var i = 0; i < filterData.length; i++) {
        if (filterData[i].id === id) {
            return filterData[i];
        }
    }
    return false;
}

function filterFileData (fileData, filters) {
    var filterData = fileData.filterData;
    var allData = fileData.allData;
    if (allData != undefined) {
        if (filterData) {
            if (filters == undefined) {
                for (var i = 0; i < filterData.length; i++) {
                    var theFilter = filterData[i];
                    if (!theFilter.filterOnlyOnRequest) {
                        allData = allData.filter(theFilter.filterFunction, theFilter);
                    }
                }
            } else {
                for (var i = 0; i < filters.length; i++) {
                    var theFilter = findFilterById(fileData, filters[i]);
                    if (theFilter) {
                        allData = allData.filter(theFilter.filterFunction, theFilter);
                    } else {
                        console.log("can't find filter under id", filters[i]);
                    }
                }
            }
        }
        return allData;
    }
    return false;
}

function getAllFileData () {
    if (allFileData != undefined) {
        return allFileData;
    }
}

function getDataOfFile (index) {
    if (allFileData != undefined) {
        return allFileData[index];
    }
    return false;
}

function getDataOfFileById (id) {
    if (allFileData != undefined) {
        for (var i = 0; i < allFileData.length; i++) {
            if (allFileData[i].id == id) {
                return allFileData[i];
            }
        }
    }
    return false;
}

// ----------------------------------------------------------------------------------------------------------------------------------------------------

// ----------------------------------------------------------------------------------------------------------------------------------------------------

// ----------------------------------------------------------------------------------------------------------------------------------------------------


function getDataFunctions (id, callBackFunction) {
    return {getAllFileData : getAllFileData, getDataOfFile : getDataOfFile, getDataOfFileById : getDataOfFileById, filterFileData : filterFileData};
}




function setCallBackWhenDataIsReadyForId (id, callBackFunction) {
    var fileData = getDataOfFileById (id);
    if (fileData) {
        if (fileData.dataRequesters == undefined) {
            fileData.dataRequesters = [];
        }
        fileData.dataRequesters[fileData.dataRequesters.length] = callBackFunction;
    }
    return true;
}


function callDataRequestersBack (fileData) {
    // Add the ref to the html, to load this data.
    var dataRequesters = fileData.dataRequesters;
    for (var i = 0; i < dataRequesters.length; i++) {
        dataRequesters[i](fileData);
    }
}
