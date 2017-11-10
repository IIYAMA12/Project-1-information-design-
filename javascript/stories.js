var stories = [
    {
        id : "IQ",
        title : "Fluoride verlaagt IQ bij kinderen",
        secondaryTitle : "1 + 1 = ?",
        bodyText : "Uit onderzoek blijkt dat fluoride een negatief effect heeft op het IQ bij kinderen. Dit onderzoek is afgenomen door onderzoekers van de Harvard School of Public Health",
        url : "https://ehp.niehs.nih.gov/1104912/"
    },
    {
        id : "ziekte",
        title : "Fluoride en kanker?",
        secondaryTitle : "Akelig",
        bodyText : "Volgens het boek 'Wat je weten moet over kanker' zou fluoride in ieder geval bij dieren kanker kunnen veroorzaken. Fluoride hoopt op in het lichaam. Een gezond volwassen mens scheiden slechts de helft van de fluoride uit. Bij diabetici, kinderen en `mensen met nier problemen` zou mogelijk 2/3 fluoride vastgehouden worden.",
        url : "https://books.google.nl/books?id=cexLZLLIviYC&pg=PA35&lpg=PA35&dq=fluoride+kanker&source=bl&ots=wAhTO7Ksm9&sig=QCGF1dIdait02aiVO-OTdAEkOFE&hl=nl&ei=brRsTprCEcuZOs-61NYF&sa=X&oi=book_result&ct=result#v=onepage&q=fluoride%20kanker&f=false"
    },
    {
        id : "zwanger",
        title : "Schadelijk voor ongeboren kind?",
        secondaryTitle : "Ooievaar",
        bodyText : "Ook al is fluoride giftig, er zijn gelukkig nog geen indicaties gevonden dat fluoride schadelijk is voor het ongeboren kind.",
        url : "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3530971/"
    }
];

var usedStories = [];

// It is a copy of the stories object and will be renewed onces it is empty.
var availableNewStories; //= [];

// renew stories
function makeCopyOfStories () {
    availableNewStories = deepClone(stories);
}

// Is the moving animation active?
var storyAnimationStatus = false;

function getStoryAnimationStatus () {
    return storyAnimationStatus;
}

function setStoryAnimationStatus (status) {
    storyAnimationStatus = status;
}

// Get a new story everytime.
function getNewStory () {
    if (availableNewStories != undefined) {
        if (availableNewStories.length == 0) {
            makeCopyOfStories ();
        }
        if (availableNewStories.length > 0) {
            var storyIndex = Math.floor(Math.random() * availableNewStories.length);
            var selectedStory = availableNewStories[storyIndex];
            availableNewStories.splice(storyIndex, 1);

            usedStories[usedStories.length] = selectedStory;

            return selectedStory;
        }
    }
    return false;
}

// make sure you can run the animation again.
function reActivateStorySelection () {
    setStoryAnimationStatus (false);
}
