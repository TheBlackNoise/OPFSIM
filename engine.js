// ===============================
// ENGINE (MOBILE SAFE VERSION)
// ===============================

const bgImage = new Image();
bgImage.src = "Sprites/Background.png";
let bgLoaded = false;

let bgOverlayLoaded = false;
let bgOverlayImage = null;

// ===============================
// STATE
// ===============================
let gameState = "simulation";

let fadeAlpha = 0;
let boxFadeAlpha = 0;

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
// DIALOGUE PARSER
// ===============================
function parseCurrentDialogueLine() {
    if (!fullDialogueList || fullDialogueList.length === 0) return;

    const rawLine = fullDialogueList[currentLineIndex];

    if (rawLine.includes(": ")) {
        const parts = rawLine.split(": ");
        currentSpeakerName = parts[0].toUpperCase().trim();
        cleanSpeechText = parts.slice(1).join(": ");
    } else {
        currentSpeakerName = talkingCharacter
            ? talkingCharacter.name
            : "UNKNOWN";
        cleanSpeechText = rawLine;
    }
}

// ===============================
// SINGLE CLICK CONTROLLER (IMPORTANT)
// ===============================
canvas.addEventListener("click", function (event) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    // ===============================
    // 1. DIALOGUE ALWAYS TAKES PRIORITY
    // ===============================
    if (gameState === "dialogue" || gameState === "fade-in") {

        const boxX = 20;
        const boxY = canvas.height - 110;
        const boxW = canvas.width - 40;
        const boxH = 90;

        const insideBox =
            mouseX >= boxX &&
            mouseX <= boxX + boxW &&
            mouseY >= boxY &&
            mouseY <= boxY + boxH;

        if (!insideBox) return;

        // finish typing instantly
        if (textCharacterIndex < cleanSpeechText.length) {
            textCharacterIndex = cleanSpeechText.length;
            printedText = cleanSpeechText;
            return;
        }

        // next line or close
        currentLineIndex++;

        if (currentLineIndex < fullDialogueList.length) {
            printedText = "";
            textCharacterIndex = 0;
            parseCurrentDialogueLine();
        } else {
            gameState = "fade-out";
        }

        return;
    }

    // ===============================
    // 2. CHARACTER DETECTION
    // ===============================
    let clickedChar = null;
    characters.forEach(char => {
        if (
            mouseX >= char.x &&
            mouseX <= char.x + char.width &&
            mouseY >= char.y &&
            mouseY <= char.y + char.height
        ) {
            clickedChar = char;
        }
    });

    let clickedFruit = null;
    if (typeof fruits !== "undefined") {
        fruits.forEach(fruit => {
            if (
                mouseX >= fruit.x &&
                mouseX <= fruit.x + fruit.width &&
                mouseY >= fruit.y &&
                mouseY <= fruit.y + fruit.height
            ) {
                clickedFruit = fruit;
            }
        });
    }

    // ===============================
    // 3. FRUIT CLICK
    // ===============================
    if (clickedFruit) {
        if (selectedCharacter) {
            const fruitId = clickedFruit.id.toLowerCase();

            if (selectedCharacter.interactions?.[fruitId]) {
                gameState = "pathfinding";
                talkingCharacter = selectedCharacter;
                interactingPartner = clickedFruit;
                fullDialogueList = selectedCharacter.interactions[fruitId];
            } else {
                gameState = "fade-in";
                talkingCharacter = selectedCharacter;
                interactingPartner = null;
                fullDialogueList = [
                    `${selectedCharacter.name}: It's a Devil Fruit...`
                ];
            }
        } else {
            gameState = "fade-in";
            talkingCharacter = {
                name: clickedFruit.name,
                nameColor: "#eed202",
                portraitLoaded: false
            };
            interactingPartner = null;
            fullDialogueList = clickedFruit.dialogueLines;
        }

        currentLineIndex = 0;
        printedText = "";
        textCharacterIndex = 0;
        portraitFrame = 0;
        portraitAnimTimer = 0;

        parseCurrentDialogueLine();
        selectedCharacter = null;
        return;
    }

    // ===============================
    // 4. CHARACTER CLICK
    // ===============================
    if (clickedChar) {

        if (selectedCharacter && selectedCharacter.id === clickedChar.id) {
            gameState = "fade-in";
            fadeAlpha = 0;
            boxFadeAlpha = 0;

            talkingCharacter = clickedChar;
            interactingPartner = null;

            let chosen = clickedChar.dialogueLines?.[
                Math.floor(Math.random() * clickedChar.dialogueLines.length)
            ] || "...";

            fullDialogueList = Array.isArray(chosen) ? chosen : [chosen];

            currentLineIndex = 0;
            printedText = "";
            textCharacterIndex = 0;
            portraitFrame = 0;
            portraitAnimTimer = 0;

            parseCurrentDialogueLine();
            selectedCharacter = null;
            return;
        }

        if (selectedCharacter && selectedCharacter.id !== clickedChar.id) {
            const targetId = clickedChar.id.toLowerCase();

            if (selectedCharacter.interactions?.[targetId]) {
                let interactionData = selectedCharacter.interactions[targetId];

                let chosenChat = Array.isArray(interactionData)
                    ? interactionData[
                        Math.floor(Math.random() * interactionData.length)
                      ]
                    : interactionData;

                gameState = "pathfinding";
                fadeAlpha = 0;
                boxFadeAlpha = 0;

                talkingCharacter = selectedCharacter;
                interactingPartner = clickedChar;
                fullDialogueList = chosenChat;

                currentLineIndex = 0;
                printedText = "";
                textCharacterIndex = 0;
                portraitFrame = 0;
                portraitAnimTimer = 0;

                parseCurrentDialogueLine();
                selectedCharacter = null;
                return;
            }

            selectedCharacter = null;
            return;
        }

        selectedCharacter = clickedChar;
    } else {
        selectedCharacter = null;
    }
});

// ===============================
// BACKGROUND
// ===============================
function drawBackground() {
    if (bgLoaded) {
        ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
    } else {
        ctx.fillStyle = "#2c3e50";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
}

// ===============================
// PORTRAITS
// ===============================
function drawPortraitElement(char, mode) {
    if (!char) return;

    const isSpeaking =
        currentSpeakerName === char.name ||
        currentSpeakerName === char.id?.toUpperCase();

    let x = (mode === "left") ? -40 :
            (mode === "right") ? canvas.width - 360 :
            (canvas.width / 2) - 200;

    const y = canvas.height - 490;

    ctx.globalAlpha = fadeAlpha * (isSpeaking ? 1 : 0.4);
    ctx.save();

    if (char.portraitLoaded) {
        let frame = char.portraitFrames?.[portraitFrame];

        if (mode === "right") {
            ctx.translate(x + 400, y);
            ctx.scale(-1, 1);
            ctx.drawImage(frame, 0, 0, 400, 400);
        } else {
            ctx.drawImage(frame, x, y, 400, 400);
        }
    }

    ctx.restore();
    ctx.globalAlpha = 1;
}

// ===============================
// VN LAYER
// ===============================
function drawVisualNovelLayer() {
    if (gameState === "simulation" || gameState === "pathfinding") return;

    if (gameState === "fade-in") {
        boxFadeAlpha = Math.min(1, boxFadeAlpha + 0.05);
        fadeAlpha = Math.min(1, fadeAlpha + 0.05);

        if (fadeAlpha >= 1) {
            gameState = "dialogue";
        }
    }

    if (gameState === "fade-out") {
        fadeAlpha -= 0.08;

        if (fadeAlpha <= 0) {
            boxFadeAlpha = 0;
            gameState = "simulation";
            talkingCharacter = null;
            interactingPartner = null;
            return;
        }
    }

    ctx.globalAlpha = boxFadeAlpha;
    ctx.fillStyle = "rgba(0,0,0,0.6)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (gameState === "dialogue") {
        if (textCharacterIndex < cleanSpeechText.length) {
            textCharacterIndex++;
            printedText = cleanSpeechText.substring(0, textCharacterIndex);
        }

        portraitAnimTimer++;
        if (portraitAnimTimer > 12) {
            portraitFrame = (portraitFrame + 1) % 4;
            portraitAnimTimer = 0;
        }
    }

    ctx.globalAlpha = fadeAlpha;

    if (interactingPartner) {
        drawPortraitElement(talkingCharacter, "left");
        drawPortraitElement(interactingPartner, "right");
    } else {
        drawPortraitElement(talkingCharacter, "center");
    }

    ctx.globalAlpha = 1;
}

// ===============================
// LOOP
// ===============================
function gameLoop() {
    drawBackground();

    if (typeof fruits !== "undefined") {
        fruits.forEach(f => {
            if (f.imageLoaded) {
                ctx.drawImage(f.imageElement, f.x, f.y, f.width, f.height);
            }
        });
    }

    characters.forEach(c => updateCharacter(c));

    drawVisualNovelLayer();
    requestAnimationFrame(gameLoop);
}

window.addEventListener("load", () => {
    bgLoaded = true;
    gameLoop();
});
