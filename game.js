const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;

// 1. GAME STATE MODES
let gameState = "simulation"; 
let currentText = "";
let talkingCharacter = null;

let portraitFrame = 1;
let portraitAnimTimer = 0;

// 2. CHARACTER SETUP
const characters = [
    {
        name: "FERMI, FLEET ADMIRAL OF THE MARINES", // Updated to your exact full title
        vibeName: "FERMI", // For the decorative right-side label
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
        dialogue: "And why, are you talking to me exactly?", // Updated line!
        nameColor: "#61DE2A", // Your custom toxic green hex code
        
        imageLoaded: false,
        imageElement: new Image(),
        
        portraitLoaded: false,
        portraitFrames: [new Image(), new Image(), new Image(), new Image()]
    },
    {
        name: "CHARACTER 2",
        vibeName: "CHAR 2",
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
        dialogue: "...Oh, hi. I was just daydreaming.",
        nameColor: "#ffdd59",
        
        imageLoaded: false,
        imageElement: new Image(),
        portraitLoaded: false,
        portraitFrames: []
    }
];

// Load Fermi's map sprite
characters[0].imageElement.src = "sprites/Fermiidle1.png";
characters[0].imageElement.onload = function() { characters[0].imageLoaded = true; };

// Load Fermi's 4 portrait frames
let loadedPortraitCount = 0;
for (let i = 0; i < 4; i++) {
    characters[0].portraitFrames[i].src = `sprites/Fermicloseup${i + 1}.png`;
    characters[0].portraitFrames[i].onload = function() {
        loadedPortraitCount++;
        if (loadedPortraitCount === 4) {
            characters[0].portraitLoaded = true;
        }
    };
}


// 3. MOUSE CLICK DETECTOR
canvas.addEventListener("click", function(event) {
    if (gameState === "dialogue") return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    characters.forEach(char => {
        if (
            mouseX >= char.x &&
            mouseX <= char.x + char.width &&
            mouseY >= char.y &&
            mouseY <= char.y + char.height
        ) {
            gameState = "dialogue";
            talkingCharacter = char;
            currentText = char.dialogue;
            portraitFrame = 0;
            portraitAnimTimer = 0;
        }
    });
});

// 4. KEYBOARD KEY DETECTOR (ENTER KEY)
window.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        if (gameState === "dialogue") {
            gameState = "simulation";
            talkingCharacter = null;
            currentText = "";
        }
    }
});

// 5. BACKGROUND GRID GENERATOR
function drawBackground() {
    ctx.fillStyle = "#2c3e50";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "#34495e";
    ctx.lineWidth = 2;

    for (let x = 0; x < canvas.width; x += 64) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 64) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
    }
}

// 6. VISUAL NOVEL RENDER ENGINE
function drawVisualNovelLayer() {
    if (gameState !== "dialogue") return;

    // A. Dim the background screen
    ctx.fillStyle = "rgba(0, 0, 0, 0.6)"; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // B. Handle Portrait Frame Flipping (Changes frames every 12 ticks)
    portraitAnimTimer++;
    if (portraitAnimTimer >= 6) {
        portraitFrame = (portraitFrame + 1) % 4;
        portraitAnimTimer = 0;
    }

    // C. Center the 400px Animated Portrait
    if (talkingCharacter && talkingCharacter.portraitLoaded) {
        ctx.drawImage(
            talkingCharacter.portraitFrames[portraitFrame], 
            (canvas.width / 2) - 200, // Centers a 400px wide image perfectly on the canvas
            canvas.height - 490,      // Sits beautifully above the text box
            400, 400 
        );
    } else if (talkingCharacter) {
        ctx.fillStyle = talkingCharacter.color;
        ctx.fillRect((canvas.width / 2) - 75, canvas.height - 275, 150, 150);
    }

    // D. Decorative Vibe Name Label above text box on the right side
    if (talkingCharacter) {
        ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
        ctx.font = "bold 24px sans-serif";
        ctx.textAlign = "right";
        ctx.fillText(talkingCharacter.vibeName, canvas.width - 30, canvas.height - 120);
    }

    // E. Draw Main Dialogue Box Frame
    ctx.fillStyle = "#1e272e";
    ctx.fillRect(20, canvas.height - 110, canvas.width - 40, 90);

    ctx.strokeStyle = "#dcdde1";
    ctx.lineWidth = 4;
    ctx.strokeRect(22, canvas.height - 108, canvas.width - 44, 86);

    // F. Name Tag Text (Toxic Green and Upper Case)
    ctx.fillStyle = talkingCharacter.nameColor; 
    ctx.font = "bold 15px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(talkingCharacter.name, 40, canvas.height - 85);

    // G. Main Speech Dialogue Text
    ctx.fillStyle = "#ffffff";
    ctx.font = "16px sans-serif";
    ctx.fillText(currentText, 40, canvas.height - 55);

    // H. Small Enter prompt in the bottom right corner of the box
    ctx.fillStyle = "#718093"; // Soft gray color so it doesn't distract
    ctx.font = "11px sans-serif";
    ctx.textAlign = "right";
    ctx.fillText("[ENTER] to close", canvas.width - 40, canvas.height - 35);
}

// 7. MOVEMENT LOGIC
function updateCharacter(char) {
    if (gameState === "dialogue") return;

    char.timer--;
    if (char.timer <= 0) {
        if (Math.random() < char.activityLevel) {
            char.state = "walking";
            char.moveX = Math.floor(Math.random() * 3) - 1;
            char.moveY = Math.floor(Math.random() * 3) - 1;
            if (char.moveX === 0 && char.moveY === 0) char.state = "idle";
            char.timer = Math.floor(Math.random() * 120) + 60;
        } else {
            char.state = "idle";
            char.moveX = 0; char.moveY = 0;
            char.timer = Math.floor(Math.random() * 180) + 120;
        }
    }
    char.x += char.moveX * char.speed;
    char.y += char.moveY * char.speed;

    if (char.x < 0) char.x = 0;
    if (char.x + char.width > canvas.width) char.x = canvas.width - char.width;
    if (char.y < 0) char.y = 0;
    if (char.y + char.height > canvas.height - 120) char.y = canvas.height - 120 - char.height; 
}

// 8. MAIN GAME LOOP
function gameLoop() {
    drawBackground();

    characters.forEach(char => {
        updateCharacter(char);

        if (char.imageLoaded) {
            ctx.drawImage(char.imageElement, Math.round(char.x), Math.round(char.y), char.width, char.height);
        } else {
            ctx.fillStyle = char.color;
            ctx.fillRect(Math.round(char.x), Math.round(char.y), char.width, char.height);
        }
    });

    drawVisualNovelLayer();

    requestAnimationFrame(gameLoop);
}

gameLoop();