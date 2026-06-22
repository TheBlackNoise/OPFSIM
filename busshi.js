// BUSSHI FRUIT DATABOX
const busshiData = {
    id: "busshi",
    name: "BUSSHI BUSSHI NO MI",
    nameColor: "#eed202",
    width: 22,
    height: 22,

    // MANUAL POSITIONING (YOU CONTROL THIS NOW)
    x: 536,   // ← change freely
    y: 178,   // ← change freely

    dialogueLines: [
        "The <color=orange><b>Busshi Busshi no Mi</b></color>, A Special Paramecia type <color=orange><b>Devil Fruit</b></color>.",
        "It grants the user the power to 'Rule the world' through direct control over matter, making the user a 'Sovreign Human'.",
        "Previous User?",
        "Unknown.",
        "Current User?",
        "<color=#EED202>Acheron</color>"
    ],

    // Character-specific inspection dialogue
    characterDialogue: {
        zero: [
            "ZERO: <b><big><wraith><shake><glow><color=yellow>EVERYTHING.</color></glow></shake></wraith></big></b>",
            "ZERO: <b><big><wraith><shake><glow><color=yellow>EVERYWHERE.</color></glow></shake></wraith></big></b>",
             "ZERO: <b><big><wraith><shake><glow><color=yellow>All.</color></glow></shake></wraith></big></b>",
             "ZERO: <b><big><wraith><shake><glow><color=yellow>AT.</color></glow></shake></wraith></big></b>",
              "ZERO: <b><big><wraith><shake><glow><color=yellow>ONCE.</color></glow></shake></wraith></big></b>"

        ],

        fermi: [
            "FERMI: This is <color=#EED202>Zero</color>'s <color=orange><b>Devil Fruit</b></color>.",
            "FERMI: <i>We eagerly await Fermi's elaboration through Zeospark's response...</i>"
        ]
    },

    imageLoaded: false,
    imageElement: new Image(),

    portraitLoaded: false,
    portraitImage: new Image()
};

// Load sprite
busshiData.imageElement.src = "Sprites/Busshi.png";
busshiData.imageElement.onload = function () {
    busshiData.imageLoaded = true;
};

busshiData.portraitImage.src = "Sprites/BusshiPortrait.png";
busshiData.portraitImage.onload = function () {
    busshiData.portraitLoaded = true;
};