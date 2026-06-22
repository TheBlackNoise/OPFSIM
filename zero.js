// ZERO'S PERSONAL DATABOX
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
    color: "#eed202", // Safety yellow color block
    activityLevel: 0.6,
    speed: 0.8,
    state: "idle",
    timer: 0,
    nameColor: "#eed202", // Safety yellow name text
    
    // Zero's standard solo dialogue lines
    dialogueLines: [
        // Choice 1: A simple one-line random text
        "He's staring...",
        
        // Choice 2: A different one-line random text
        [
            "Heya",
            "Did you need something?"
        ],
        
        // Choice 3: A multi-line story!
        [
            "Well, whats this?",
            "You're rather displaced.",
            "Are you certain whatever you're doing is worth it?"
        ]
    ],
    
    // Clicking Zero first, then clicking Fermi
    interactions: {
        "fermi": [
            // Conversation 1
            [
                "ZERO: Oi~ Mr Fermi?",
                "FERMI: <i>We eagerly await Zeospark's input</i>",
                "ZERO: What? Who's Zeospark?",
                "FERMI: <i>We eagerly await Zeospark's input</i>",
                "ZERO: ...???"
            ],
            // Conversation 2
            [
                "ZERO: So, you think the other Vice Admirals like me at all?",
                "FERMI: <i>We eagerly await Zeospark's input</i>",
                "ZERO: Ah right...",
                "FERMI: <i>We eagerly await Zeospark's input</i>"
            ]
        ]
    },
    
    imageLoaded: false,
    imageElement: new Image(),
    portraitLoaded: false,
    portraitFrames: []
};

// Load Zero's Overworld Sprite
zeroData.imageElement.src = "Sprites/Zeroidle1.png"; 
zeroData.imageElement.onload = function() { zeroData.imageLoaded = true; };

// Load Zero's 4 Dialogue Portraits
let loadedZeroPortraits = 0;
for (let i = 0; i < 4; i++) {
    zeroData.portraitFrames[i] = new Image();
    zeroData.portraitFrames[i].src = `Sprites/Zerocloseup${i + 1}.png`;
    zeroData.portraitFrames[i].onload = function() {
        loadedZeroPortraits++;
        if (loadedZeroPortraits === 4) zeroData.portraitLoaded = true;
    };
}
