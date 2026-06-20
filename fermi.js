// FERMI'S PERSONAL DATABOX
const fermiData = {
    id: "fermi", // Unique code name for relationships
    name: "FERMI", 
    vibeName: "FERMI",
    vibeTitle: "FLEET ADMIRAL OF THE MARINES",
    x: 128,
    y: 128,
    moveX: 0,
    moveY: 0,
    width: 64,
    height: 64,
    color: "#ff4757",
    activityLevel: 0.5,
    speed: 0.5,
    state: "idle",
    timer: 0,
    nameColor: "#61DE2A",
    
    // Solo monologue lines
    dialogueLines: [
        "Are you a new recruit?",
        "If so you are very... very lost.",
        "Go back to your assigned living space."
    ],
    
    // RELATIONSHIPS DICTIONARY: What happens when interacting with others
    interactions: {
        "char2": [
            "FERMI: Stand at attention, soldier!",
            "CHARACTER 2: Ah! Yes, sir! Sorry, sir!"
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
    fermiData.portraitFrames[i].src = `Sprites/Fermicloseup${i + 1}.png`;
    fermiData.portraitFrames[i].onload = function() {
        loadedFermiPortraits++;
        if (loadedFermiPortraits === 4) fermiData.portraitLoaded = true;
    };
}
