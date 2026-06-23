// GANMA FRUIT DATABOX
const ganmaData = {
    id: "ganma",

    name: "GANMA GANMA NO MI",

    width: 22,
    height: 22,

    // Choose your own coordinates
    x: 536,
    y: 203,

    dialogueLines: [
        "The <color=orange><b>Ganma Ganma no Mi</b></color>, a Logia-type <color=orange><b>Devil Fruit</b></color>",
        "It allows It's user to create, control, and transform into nuclear energy at will, making the user a 'Nuclear Human'",
        "Previous User?",
        "Unknown.",
        "Current User?",
        "<color=#61DE2A><b>Fermi</b></color>"
    ],

    characterDialogue: {

        zero: [
            "ZERO: What marvelous, overwhelming, unbelieveable <big><wraith><shake><glow><color=lime>POWER</color></glow></shake></wraith></big>!",
            "ZERO: This is Mr. <color=#61DE2A>Fermi</color>'s <color=orange><b>Devil Fruit</b></color>.",
            "ZERO: It's destructive is in a league of its own,",
            "ZERO: In fact, it's the single most destructive power in the world! <small> I think...</small>",
            "ZERO: Though I will admit, I do <i>NOT</i> envy the cleanup on this one, like <i>AT ALL</i>."

        ],

        fermi: [
            "FERMI: These powers were drawn to me because I have the capability to use them to their full extent.",
            "FERMI: It's ironic, Power that can be used to cause a global disaster can be used for good",
            "FERMI: The pirates are a cancer upon this world, and these Devil fruit powers can wipe it out before it spreads. ",
            "FERMI: Once the pirates are eradicated, I will make sure they won't pose a threat again."
        ]

    },

    imageLoaded: false,
    imageElement: new Image(),

    portraitLoaded: false,
    portraitImage: new Image()
};

ganmaData.imageElement.src = "Sprites/Gamma.png";

ganmaData.imageElement.onload = function () {
    ganmaData.imageLoaded = true;
};

ganmaData.portraitImage.src = "Sprites/GammaPortrait.png";

ganmaData.portraitImage.onload = function () {
    ganmaData.portraitLoaded = true;
};
