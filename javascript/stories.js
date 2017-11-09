var stories = [
    {
        id : "IQ",
        title : "Fluoride verlaagt IQ",
        secondaryTitle : "1 + 1 = ?",
        bodyText : "bla bla bla bla"
    },
    {
        id : "IQ2",
        title : "Fluoride verlaagt IQ",
        secondaryTitle : "1 + 1 = ?",
        bodyText : "bla bla bla bla"
    },
    {
        id : "IQ3",
        title : "Fluoride verlaagt IQ",
        secondaryTitle : "1 + 1 = ?",
        bodyText : "bla bla bla bla"
    }
];

var usedStories = [];

var availableNewStories; //= [];

function makeCopyOfStories () {
    console.log("makeCopyOfStories");
    availableNewStories =  deepClone(stories);
}

var storyAnimationStatus = false;

function getStoryAnimationStatus () {
    return storyAnimationStatus;
}

function setStoryAnimationStatus (status) {
    storyAnimationStatus = status;
}

function getNewStory () {
    if (availableNewStories != undefined && availableNewStories.length > 0) {
        var storyIndex = Math.floor(Math.random() * availableNewStories.length);
        var selectedStory = availableNewStories[storyIndex];
        availableNewStories.splice(storyIndex, 1);

        usedStories[usedStories.length] = selectedStory;

        return selectedStory;
    }
    return false;
}

function reActivateStorySelection () {
    setStoryAnimationStatus (false);
}
