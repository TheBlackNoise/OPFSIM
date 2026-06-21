// BUSSHI FRUIT DATABOX
const busshiData = {
    id: "busshi", // Codename used for character interaction links
    name: "BUSSHI BUSSHI NO MI",
    width: 22,
    height: 22,
    
    // The exact shelf grid position slots (We will fill these numbers in next!)
    x: 0, 
    y: 0, 
    
    // Default encyclopedia description when double-clicked on its own
    dialogueLines: [
        "The Busshi Busshi no Mi, A Special Paramecia type devil fruit.",
        "It grants the user the power to 'Rule the world' through direct control over matter.",
        "Previous User, Unknown.",
        "Current User, Vincam Zero."
    ],
    
    imageLoaded: false,
    imageElement: new Image()
};

// Load the 22x22 pixel art graphic from your Sprites folder
busshiData.imageElement.src = "Sprites/Busshi.png";
busshiData.imageElement.onload = function() { 
    busshiData.imageLoaded = true; 
};
