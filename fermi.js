// FERMI'S PERSONAL DATABOX
const fermiData = {
    id: "fermi", // Unique code name for relationships
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
    activityLevel: 0.4,
    speed: 0.5,
    state: "idle",
    timer: 0,
    facingDirection: "right",
    nameColor: "#61DE2A",
    
    // Upgraded multi-line solo dialogue pools
    dialogueLines: [
        // Choice 1: A brief, contemplative observation (like Zero's staring line!)
        "Maintaining absolute order is exhausting...",
        
        // Choice 2: The full multi-line conversation sequence grouped together perfectly!
        [
            "Are you a new recruit?",
            "If so you are very... very lost.",
            "Go back to your assigned living space."
        ]
    ],
    
    // RELATIONSHIPS DICTIONARY: What happens when interacting with others
    interactions: {
        "zero": [
            // Conversation 1 (Wrapped in its own brackets for the engine playlist!)
            [
                "FERMI: <i>We eagerly await Zeospark's input</i>",
                "ZERO: Well hello, Fleet Admiral. Did you need me for something?",
                "FERMI: <i>We eagerly await Zeospark's input</i>",
                "ZERO: So... uhhhhh...",
                "ZERO: nice weather?"
            ]
        ]
    },
    
    imageLoaded: false,
    imageElement: new Image(),
    portraitLoaded: false,
    portraitFrames: [new Image(), new Image(), new Image(), new Image()]
};

// Load Fermi Assets
fermiData.imageElement.src = "Sprites/Fermiidle1.png"; 
fermiData.imageElement.onload = function() { fermiData.imageLoaded = true; };

let loadedFermiPortraits = 0;
for (let i = 0; i < 4; i++) {
    fermiData.portraitFrames[i] = new Image(); // Safe layout initialization
    fermiData.portraitFrames[i].src = `Sprites/Fermicloseup${i + 1}.png`; 
    fermiData.portraitFrames[i].onload = function() {
        loadedFermiPortraits++;
        if (loadedFermiPortraits === 4) fermiData.portraitLoaded = true;
    };
}
