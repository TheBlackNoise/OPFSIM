// ===============================
// ZERO DATABOX (REFURBISHED)
// ===============================
const zeroData = {
    id: "zero",
    name: "ZERO",
    vibeName: "ZERO",
    vibeTitle: "THE WORLD'S FAVORITE",

    x: 320,
    y: 204,
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

    color: "#eed202",
    nameColor: "#eed202",

    activityLevel: 0.6,
    speed: 0.8,
    state: "idle",
    timer: 0,

    // ===============================
    // DIALOGUE (ALL CONVERSATION BLOCKS)
    // ===============================
    dialogueLines: [
        [
            "ZERO: He's staring..."
        ],

        [
            "ZERO: Heya.",
            "ZERO: Did you need something?"
        ],

        [
            "ZERO: Well, what's this?",
            "ZERO: You're rather displaced.",
            "ZERO: Are you certain whatever you're doing is worth it?"
        ]
    ],

    // ===============================
    // INTERACTIONS
    // ===============================
    interactions: {
      shinzui: [
    [
        "ZERO: Hello, what could I do for- Ah... it's you.",
        "SHINZUI: We eagerly await Eastie's input.",
        "ZERO: ...???"
    ]
],
        fermi: [
            [
                "ZERO: Oi~ Mr Fermi?",
                "FERMI: We eagerly await Zeospark's input.",
                "ZERO: What? Who's Zeospark?",
                "FERMI: We eagerly await Zeospark's input.",
                "ZERO: ...???"
            ],

            [
                "ZERO: So, you think the other Vice Admirals like me at all?",
                "FERMI: We eagerly await Zeospark's input.",
                "ZERO: Ah right...",
                "FERMI: We eagerly await Zeospark's input."
            ],

        ]
    },

    imageLoaded: false,
    imageElement: new Image(),

    portraitLoaded: false,
    portraitFrames: []
};

// ===============================
// LOAD ZERO ASSETS
// ===============================
zeroData.imageElement.src = "Sprites/Zeroidle1.png";
zeroData.imageElement.onload = function () {
    zeroData.imageLoaded = true;
};

let loadedZeroPortraits = 0;
for (let i = 0; i < 4; i++) {
    zeroData.portraitFrames[i] = new Image();
    zeroData.portraitFrames[i].src = `Sprites/Zerocloseup${i + 1}.png`;

    zeroData.portraitFrames[i].onload = function () {
        loadedZeroPortraits++;
        if (loadedZeroPortraits === 4) {
            zeroData.portraitLoaded = true;
        }
    };
}
