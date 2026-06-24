// ===============================
// SHINZUI DATABOX (REFURBISHED)
// ===============================
const shinzuiData = {
    id: "shinzui",
    name: "SHINZUI",
    vibeName: "SHINZUI",
    vibeTitle: "THE HEAVIEST DRINKER IN THE WORLD",

    x: 360,
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

    color: "#E34234",
    nameColor: "#E34234",

    activityLevel: 0.6,
    speed: 0.8,
    state: "idle",
    timer: 0,

    // ===============================
    // DIALOGUE SYSTEM RULE:
    // EVERYTHING = CONVERSATION BLOCK
    // ===============================
    dialogueLines: [
        [
            "SHINZUI: Ah? New face.",
            "SHINZUI: Sit down.",
            "SHINZUI: If you're planning to kill me, at least have a drink first."
        ],

        [
            "SHINZUI: The sake's terrible today.",
            "SHINZUI: Which means it'll probably be memorable."
        ],
 
        [
            "SHINZUI: I remember when nobody knew your name.",
            "SHINZUI: Those were simpler times."
        ],

        [
            "SHINZUI: Don't look so disappointed.",
            "SHINZUI: Every legend starts as a nobody."
        ],

        [
            "SHINZUI: Never fight a battle that can be won yesterday."
        ],

        [
            "SHINZUI: If you have to explain your plan, your plan isn't finished"
        ],

        [
            "SHINZUI: Governments are like storms.",
            "SHINZUI: Some are useful. Some sink ships."
        ],

        [
            "SHINZUI: Hm."
        ],

        [
            "SHINZUI: I spent six months infiltrating an organization.",
            "SHINZUI: Why?",
            "SHINZUI: They had good food."
        ],

        [
            "SHINZUI: You again?",
            "SHINZUI: must either like me or owe me money."
        ],

        [
            "SHINZUI: I had a brilliant idea earlier.",
            "SHINZUI: I forgot it.",
            "SHINZUI: Which means it was probably dangerous."
        ],

        [
            "SHINZUI: Do you know what's funny?",
            "SHINZUI: <i>falls silent for thirty seconds</i>",
            "SHINZUI: I forgot."
        ],

        [
            "SHINZUI: That barrel was full this morning.",
            "SHINZUI: <i>looks at empty barrel</i>",
            "SHINZUI: Crime."
        ],

        [
            "SHINZUI: Somewhere out there is a man whose entire life fell apart because I was bored."
        ],

        [
            "SHINZUI: ..."
        ],

        [
            "SHINZUI: ...You expecting me to answer that sober?"
        ],

        [
            "SHINZUI: You're either very brave or very uninformed."
        ],

        [
            "SHINZUI: Do you know how many emperors I've buried?"
        ],

        [
            "SHINZUI: The day the world finally makes sense is the day I start worrying."
        ],

        [
            "SHINZUI: Funny thing about secrets.",
            "SHINZUI: Most of them aren't worth knowing."
        ],

    ],

    // ===============================
    // INTERACTIONS (CONVERSATION BLOCKS)
    // ===============================
    interactions: {
        zero: [
            [
                "ZERO: ...You...",
                "SHINZUI: We eagerly await Eastie's input.",
                "ZERO: Ah yes, the waiting game.",
                "SHINZUI: Still waiting.",
                "ZERO: ..."
            ],

            [
                "ZERO: So, you think the other Vice Admirals like me at all?",
                "SHINZUI: ...",
                "ZERO: ...You too huh..."
            ]
        ]
    },

    imageLoaded: false,
    imageElement: new Image(),

    portraitLoaded: false,
    portraitFrames: []
};

// ===============================
// LOAD SPRITES
// ===============================
shinzuiData.imageElement.src = "Sprites/Shinzuiidle1.png";
shinzuiData.imageElement.onload = function () {
    shinzuiData.imageLoaded = true;
};

// portraits
let loadedShinzuiPortraits = 0;
for (let i = 0; i < 4; i++) {
    shinzuiData.portraitFrames[i] = new Image();
    shinzuiData.portraitFrames[i].src = `Sprites/Shinzuicloseup${i + 1}.png`;

    shinzuiData.portraitFrames[i].onload = function () {
        loadedShinzuiPortraits++;
        if (loadedShinzuiPortraits === 4) {
            shinzuiData.portraitLoaded = true;
        }
    };
}
