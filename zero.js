// ZERO'S PERSONAL DATABOX
const zeroData = {
    id: "zero", // Keeping this id so his old links to Fermi still work!
    name: "ZERO",
    vibeName: "ZERO",
    vibeTitle: "THE WORLD'S FAVORITE",
    x: 320,
    y: 192,
    moveX: 0,
    moveY: 0,
    width: 64,
    height: 64,
    color: "#eed202", // Safety yellow color block
    activityLevel: 0.2,
    speed: 0.4,
    state: "idle",
    timer: 0,
    nameColor: "#eed202", // Safety yellow name text
    
    // Zero's standard solo dialogue lines
    dialogueLines: [
        "Well, what's this?",
        "You're rather displaced.",
        "Are you certain whatever you're doing is worth it?"
    ],
    
    // Clicking Zero first, then clicking Fermi
    interactions: {
        "fermi": [
            "ZERO: Oi~ Mr Fermi?",
            "FERMI: *sigh* Yes.. Zero?",
            "ZERO: Kinda wanna go... do stuff... mind if I get the day off?",
            "FERMI: Do as you please, just be back here on call.",
            "ZERO: Aww, shucks, you really are the best~"
        ]
    },
    
    imageLoaded: false,
    imageElement: new Image(),
    portraitLoaded: false,
    portraitFrames: []
};

// Load Zero's Overworld Sprite
zeroData.imageElement.src = "sprites/Zeroidle1.png"; 
zeroData.imageElement.onload = function() { zeroData.imageLoaded = true; };

// Load Zero's 4 Dialogue Portraits
let loadedZeroPortraits = 0;
for (let i = 0; i < 4; i++) {
    zeroData.portraitFrames[i] = new Image();
    zeroData.portraitFrames[i].src = `sprites/Zerocloseup${i + 1}.png`;
    zeroData.portraitFrames[i].onload = function() {
        loadedZeroPortraits++;
        if (loadedZeroPortraits === 4) zeroData.portraitLoaded = true;
    };
}
