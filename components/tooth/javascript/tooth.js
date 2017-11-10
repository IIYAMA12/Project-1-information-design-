
var plaque = document.getElementById('plaque');
var progressCleaning = document.getElementById('progress-cleaning');

// function is called by the internal javascript, which changes the values of the tooth.
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
