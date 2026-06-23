// SAKE DATABOX
const sakeData = {
    id: "sake",
    name: "Shinzui's Sake Gourd",
    nameColor: "#AA381E",
    width: 22,
    height: 22,

    // MANUAL POSITIONING (YOU CONTROL THIS NOW)
    x: 536,   // ← change freely
    y: 155,   // ← change freely

    dialogueLines: [
        "An alcoholic beverage made by fermenting polished rice.",
        "Sake, alternatively known as 'rice wine', has a smooth gently acidic profile, and is enjoyed by many.",
        "This particular gourd seems to belong to the man known as the 'Heaviest Drinker in the World',",
        "<color=#E34234><b>Shinzui</b></color>"
    ],

    // Character-specific inspection dialogue
    characterDialogue: {
        zero: [
              "ZERO: A particularly strong yet pure variant of the drink.",
              "ZERO: It contains far more Ethanol than any one man should be able to drink... and yet...",
              "ZERO: I'm sure he will anyway."

        ],

        fermi: [
            "FERMI: <i>We eagerly await Fermi's elaboration through Zeospark's response...</i>"
        ],

        shinzui: [
             "SHINZUI: <color=red><big>@_@</big></color>"
        ]
    },

    imageLoaded: false,
    imageElement: new Image(),

    portraitLoaded: false,
    portraitImage: new Image()
};

// Load sprite
sakeData.imageElement.src = "Sprites/Sake.png";
sakeData.imageElement.onload = function () {
    sakeData.imageLoaded = true;
};

sakeData.portraitImage.src = "Sprites/SakePortrait.png";
sakeData.portraitImage.onload = function () {
    sakeData.portraitLoaded = true;
};