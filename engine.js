// ===============================
// SAFE ENGINE BOOTSTRAP (GITHUB SAFE)
// ===============================

const canvas = document.getElementById("gameCanvas");
if (!canvas) {
    console.error("Canvas not found! Check HTML: <canvas id='gameCanvas'>");
}

const ctx = canvas ? canvas.getContext("2d") : null;
if (ctx) ctx.imageSmoothingEnabled = false;

// ===============================
// GLOBAL SAFETY NETS
// ===============================
window.characters = window.characters || [];
window.fruits = window.fruits || [];

// ===============================
// GAME STATE
// ===============================
let gameState = "simulation";
let fadeAlpha = 0;

let selectedCharacter = null;

let fullDialogueList = [];
let currentLineIndex = 0;
let printedText = "";
let textCharacterIndex = 0;

let talkingCharacter = null;
let interactingPartner = null;

let currentSpeakerName = "";
let cleanSpeechText = "";

let portraitFrame = 0;
let portraitAnimTimer = 0;

// ===============================
// BACKGROUND
// ===============================
const bgImage = new Image();
bgImage.src = "Sprites/Background.png";
let bgLoaded = false;

// ===============================
// DIALOGUE PARSER
// ===============================
function parseCurrentDialogueLine() {
    if (!fullDialogueList || fullDialogueList.length === 0) return;

    const rawLine = fullDialogueList[currentLineIndex];

    if (typeof rawLine === "string" && rawLine.includes(": ")) {
        const parts = rawLine.split(": ");
        currentSpeakerName = parts[0].toUpperCase().trim();
        cleanSpeechText = parts.slice(1).join(": ");
    } else {
        currentSpeakerName = talkingCharacter?.name || "UNKNOWN";
        cleanSpeechText = rawLine || "";
    }
}

// ===============================
// SAFE CLICK INPUT
// ===============================
canvas?.addEventListener("click", function (event) {
    if (gameState !== "simulation") return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    let clickedChar = null;
    for (const char of characters) {
        if (
            mouseX >= char.x &&
            mouseX <= char.x + char.width &&
            mouseY >= char.y &&
            mouseY <= char.y + char.height
        ) {
            clickedChar = char;
            break;
        }
    }

    let clickedFruit = null;
    for (const fruit of fruits) {
        if (
            mouseX >= fruit.x &&
            mouseX <= fruit.x + fruit.width &&
            mouseY >= fruit.y &&
            mouseY <= fruit.y + fruit.height
        ) {
            clickedFruit = fruit;
            break;
        }
    }

    // FRUIT CLICK
    if (clickedFruit) {
        gameState = "fade-in";
        talkingCharacter = selectedCharacter || {
            name: clickedFruit.name,
            nameColor: "#eed202",
            portraitLoaded: false
        };

        interactingPartner = null;
        fullDialogueList = clickedFruit.dialogueLines || ["..."];
        currentLineIndex = 0;
        textCharacterIndex = 0;
        printedText = "";

        parseCurrentDialogueLine();
        selectedCharacter = null;
        return;
    }

    // CHARACTER CLICK
    if (clickedChar) {
        if (selectedCharacter && selectedCharacter.id === clickedChar.id) {
            gameState = "fade-in";
            talkingCharacter = clickedChar;
            interactingPartner = null;

            const lines = clickedChar.dialogueLines || ["..."];
            const pick = lines[Math.floor(Math.random() * lines.length)];
            fullDialogueList = Array.isArray(pick) ? pick : [pick];

            currentLineIndex = 0;
            textCharacterIndex = 0;
            printedText = "";

            parseCurrentDialogueLine();
            selectedCharacter = null;
            return;
        }

        selectedCharacter = clickedChar;
    } else {
        selectedCharacter = null;
    }
});

// ===============================
// CONTINUE TAP (MOBILE FIX)
// ===============================
canvas?.addEventListener("click", function (event) {
    if (gameState !== "dialogue") return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const boxX = 20;
    const boxY = canvas.height - 110;
    const boxW = canvas.width - 40;
    const boxH = 90;

    const inside =
        mouseX >= boxX &&
        mouseX <= boxX + boxW &&
        mouseY >= boxY &&
        mouseY <= boxY + boxH;

    if (!inside) return;

    if (textCharacterIndex < cleanSpeechText.length) {
        textCharacterIndex = cleanSpeechText.length;
        printedText = cleanSpeechText;
        return;
    }

    currentLineIndex++;

    if (currentLineIndex < fullDialogueList.length) {
        textCharacterIndex = 0;
        printedText = "";
        parseCurrentDialogueLine();
    } else {
        gameState = "fade-out";
    }
});

// ===============================
// GAME LOOP (CRASH-PROOF)
// ===============================
function gameLoop() {
    if (!ctx) return;

    try {
        ctx.fillStyle = "#2c3e50";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        for (const char of characters) {
            if (char.imageLoaded) {
                ctx.drawImage(char.imageElement, char.x, char.y, char.width, char.height);
            }
        }

        for (const fruit of fruits) {
            if (fruit.imageLoaded) {
                ctx.drawImage(fruit.imageElement, fruit.x, fruit.y, fruit.width, fruit.height);
            }
        }

        requestAnimationFrame(gameLoop);
    } catch (err) {
        console.error("ENGINE CRASH PREVENTED:", err);
    }
}

// ===============================
// BOOT SAFE
// ===============================
window.addEventListener("load", () => {
    bgLoaded = true;
    gameLoop();
}); 
