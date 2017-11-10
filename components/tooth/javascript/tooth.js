
var plaque = document.getElementById('plaque');
var progressCleaning = document.getElementById('progress-cleaning');


function cleaningTooth (data) {
    var maxValue = data.average;
    var value = data.brushed;

    value += 0.3;

    if (value > maxValue) {
        value = maxValue;
    }
    data.brushed = value;
    var progress = (value / maxValue);
    plaque.style.opacity =  1 - progress;
    progressCleaning.textContent = Math.floor(value) + "%";
}

// window.cleaningTooth = cleaningTooth;
