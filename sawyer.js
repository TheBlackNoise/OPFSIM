// ===============================
// SAWYER DATABOX (REFURBISHED)
// ===============================
const sawyerData = {
    id: "sawyer",
    name: "SAWYER",
    vibeName: "SAWYER",
    vibeTitle: "World's Greatest Hunter",

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

    color: "#FF2400",
    nameColor: "#FF2400",

    activityLevel: 0.6,
    speed: 0.6,
    state: "idle",
    timer: 0,

    // ===============================
    // DIALOGUE (ALL CONVERSATION BLOCKS)
    // ===============================
    dialogueLines: [
        [
            "SAWYER: <i>We patiently await Ogre's input</i>"
        ],

        [
            "SAWYER: <i>We patiently await Ogre's input</i>",
            "SAWYER: <i>We patiently await Ogre's input</i>?"
        ],

        [
            "SAWYER: <i>We patiently await Ogre's input</i>",
            "SAWYER: <i>We patiently await Ogre's input</i>",
            "SAWYER: <i>We patiently await Ogre's input</i>"
        ]
    ],

    // ===============================
    // INTERACTIONS
    // ===============================
    interactions: {
      shinzui: [
    [
        "SAWYER: <i>We patiently await Ogre's input</i>",
        "SHINZUI: We eagerly await Eastie's input.",
        "SAWYER: <i>We patiently await Ogre's input</i>"
    ]
],

zero: [
    [
        "ZERO: <i>We patiently await Noise's input</i>",
        "ZERO: FUCK YOU MEAN WE WAITING ON YOUR INPUT, YOU'RE THE ONE WRITING.",
        "SAWYER: <i>We patiently await Ogre's input</i>",
        "ZERO: <i>We patiently await Noise's input</i>"
    ]
],

        fermi: [
            [
                "SAWYER: <i>We patiently await Ogre's input</i>",
                "FERMI: We eagerly await Zeospark's input.",
                "SAWYER: <i>We patiently await Ogre's input</i>",
                "FERMI: We eagerly await Zeospark's input.",
                "SAWYER: <i>We patiently await Ogre's input</i>"
            ],

            [
                "SAWYER: <i>We patiently await Ogre's input</i>",
                "SAWYER: <i>We patiently await Ogre's input</i>"
            ],


            [
                "SAWYER: <i>We patiently await Ogre's input</i>",
                "FERMI: We eagerly await Zeospark's input.",
                "SAWYER: <i>We patiently await Ogre's input</i>",
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
// LOAD sawyer ASSETS
// ===============================
sawyerData.imageElement.src = "Sprites/Sawyeridle1.png";
sawyerData.imageElement.onload = function () {
    sawyerData.imageLoaded = true;
};

let loadedsawyerPortraits = 0;
for (let i = 0; i < 4; i++) {
    sawyerData.portraitFrames[i] = new Image();
    sawyerData.portraitFrames[i].src = `Sprites/Sawyercloseup${i + 1}.png`;

    sawyerData.portraitFrames[i].onload = function () {
        loadedsawyerPortraits++;
        if (loadedsawyerPortraits === 4) {
            sawyerData.portraitLoaded = true;
        }
    };
}