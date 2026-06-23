// ===============================
// FERMI DATABOX (REFURBISHED)
// ===============================
const fermiData = {
    id: "fermi",
    name: "FERMI",
    vibeName: "FERMI",
    vibeTitle: "FLEET ADMIRAL OF THE MARINES",

    x: 128,
    y: 203,
    moveX: 0,
    moveY: 0,

    width: 64,
    height: 64,

    hitbox: {
        x: 17,
        y: 35,
        w: 30,
        h: 30
    },

    color: "#ff4757",
    nameColor: "#61DE2A",

    activityLevel: 0.4,
    speed: 0.5,
    state: "idle",
    timer: 0,

    // ===============================
    // DIALOGUE (ALL CONVERSATION BLOCKS)
    // ===============================
    dialogueLines: [
        [
            "FERMI: Maintaining absolute order is exhausting..."
        ],

        [
            "FERMI: Are you a new recruit?",
            "FERMI: If so you are very... very lost.",
            "FERMI: Go back to your assigned living space."
        ]
    ],

    // ===============================
    // INTERACTIONS
    // ===============================
    interactions: {
        zero: [
            [
                "FERMI: We eagerly await Zeospark's input.",
                "ZERO: Well hello, Fleet Admiral. Did you need me for something?",
                "FERMI: We eagerly await Zeospark's input.",
                "ZERO: So... uhhhhh...",
                "ZERO: nice weather?"
            ]
        ]
    },

    imageLoaded: false,
    imageElement: new Image(),

    portraitLoaded: false,
    portraitFrames: []
};

// ===============================
// LOAD FERMI ASSETS
// ===============================
fermiData.imageElement.src = "Sprites/Fermiidle1.png";
fermiData.imageElement.onload = function () {
    fermiData.imageLoaded = true;
};

let loadedFermiPortraits = 0;
for (let i = 0; i < 4; i++) {
    fermiData.portraitFrames[i] = new Image();
    fermiData.portraitFrames[i].src = `Sprites/Fermicloseup${i + 1}.png`;

    fermiData.portraitFrames[i].onload = function () {
        loadedFermiPortraits++;
        if (loadedFermiPortraits === 4) {
            fermiData.portraitLoaded = true;
        }
    };
}
