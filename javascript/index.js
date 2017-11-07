// wait for the website to load, then start loading the files.
window.onload = function () {
    setTimeout(function () {
        // use a timer to load to files (which helps older browsers to not process too much in one time)
        var index = 0;
        var loadingTimer;
        loadingTimer = setInterval(function () {

            // get the data from the table below, which contains all information how the file must be handled.
            var fileData = allFileData[index];
            index++;

            // A usefull function that I found to check if the file exist. In Firefox using it, will result in this warning:
            /*
                Synchronous XMLHttpRequest op de hoofdthread wordt niet meer ondersteund vanwege de nadelige effecten op de eindgebruikerservaring. Zie http://xhr.spec.whatwg.org/ voor meer informatie
            */
            // But it still works!

            if (fileData != undefined && fileData.path != undefined && fileExists(fileData.path)) {

                // now use the data fill in the d3 file read request.
                d3[fileData.readAsType](fileData.path, function (error, allData) {
                    fileData.startFunction(error, allData);
                });

            } else {
                console.log("Can't find file:", fileData ? fileData.path : "???");
            }
            if (index >= allFileData.length) {
                clearInterval(loadingTimer);
            }
        }, 100);
    }, 1000);




};



// ----------------------------------------------------------------------------------------------------------------------------------------------------

// ----------------------------------------------------------------------------------------------------------------------------------------------------

// ----------------------------------------------------------------------------------------------------------------------------------------------------
