// CHARACTER 2'S PERSONAL DATABOX
const char2Data = {
    id: "char2", 
    name: "CHARACTER 2",
    vibeName: "CHAR 2",
    vibeTitle: "UNKNOWN GUEST",
    x: 320,
    y: 192,
    moveX: 0,
    moveY: 0,
    width: 64,
    height: 64,
    color: "#2ed573",
    activityLevel: 0.2,
    speed: 0.4,
    state: "idle",
    timer: 0,
    nameColor: "#ffffff",
    
    dialogueLines: [
        "...Oh, hi. I was just daydreaming.",
        "Please don't wake me up again."
    ],
    
    // Their personal view of relationships
    interactions: {
        "fermi": [
            "CHARACTER 2: I hope the Admiral doesn't see me slacking...",
            "FERMI: Too late. Fifty push-ups. Now."
        ]
    },
    
    imageLoaded: false,
    imageElement: new Image(),
    portraitLoaded: false,
    portraitFrames: []
};
