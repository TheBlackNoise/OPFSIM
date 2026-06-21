// SINGLE BACKGROUND LOADER SYSTEM (With clean single-trigger loading)
const bgImage = new Image();
bgImage.src = "Sprites/Background.png";
let bgLoaded = false;

let bgOverlayLoaded = false;
let bgOverlayImage = null;

// Smart helper function to break "NAME: Speech" apart dynamically
function parseCurrentDialogueLine() {
    if (!fullDialogueList || fullDialogueList.length === 0) return;

    const rawLine = fullDialogueList[currentLineIndex];

    if (rawLine.includes(": ")) {
        const parts = rawLine.split(": ");
        currentSpeakerName = parts[0].toUpperCase().trim();
        cleanSpeechText = parts.slice(1).join(": ");
    } else {
        if (talkingCharacter) {
            currentSpeakerName = talkingCharacter.name;
        } else {
            currentSpeakerName = "UNKNOWN";
        }
        cleanSpeechText = rawLine;
    }
}

// 1. MOUSE CONTROLS (CHARACTER + FRUIT INTERACTIONS)
canvas.addEventListener("click", function(event) {
    if (gameState !== "simulation") return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

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

    // CASE A: Fruit clicked
    if (clickedFruit) {
        if (selectedCharacter) {
            const fruitId = clickedFruit.id.toLowerCase();

            if (
                selectedCharacter.interactions &&
                selectedCharacter.interactions[fruitId]
            ) {
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

    // CASE B: Character clicked
    if (clickedChar) {
        if (selectedCharacter && selectedCharacter.id === clickedChar.id) {
            gameState = "fade-in";
            fadeAlpha = 0;
            boxFadeAlpha = 0;

            talkingCharacter = clickedChar;
            interactingPartner = null;

            if (
                clickedChar.dialogueLines &&
                clickedChar.dialogueLines.length > 0
            ) {
                const randomIndex = Math.floor(
                    Math.random() * clickedChar.dialogueLines.length
                );

                const chosen = clickedChar.dialogueLines[randomIndex];

                fullDialogueList = Array.isArray(chosen)
                    ? chosen
                    : [chosen];
            } else {
                fullDialogueList = ["..."];
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

        if (selectedCharacter && selectedCharacter.id !== clickedChar.id) {
            const targetId = clickedChar.id.toLowerCase();

            if (
                selectedCharacter.interactions &&
                selectedCharacter.interactions[targetId]
            ) {
                let interactionData =
                    selectedCharacter.interactions[targetId];

                let chosenChat = null;

                if (Array.isArray(interactionData)) {
                    if (!selectedCharacter._chatCounters) {
                        selectedCharacter._chatCounters = {};
                    }

                    if (selectedCharacter._chatCounters[targetId] === undefined) {
                        selectedCharacter._chatCounters[targetId] = 0;
                    }

                    let index = selectedCharacter._chatCounters[targetId];

                    chosenChat = interactionData[index];

                    selectedCharacter._chatCounters[targetId] =
                        (index + 1) % interactionData.length;
                } else {
                    chosenChat = interactionData;
                }

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

// 2. 🔥 M1 DIALOGUE SYSTEM (REPLACES KEYBOARD)
window.addEventListener("mousedown", function(event) {
    if (event.button !== 0) return; // only left click

    if (gameState === "dialogue") {
        // Skip typing animation
        if (textCharacterIndex < cleanSpeechText.length) {
            textCharacterIndex = cleanSpeechText.length;
            printedText = cleanSpeechText;
            return;
        }

        // Next line
        currentLineIndex++;

        if (currentLineIndex < fullDialogueList.length) {
            printedText = "";
            textCharacterIndex = 0;
            parseCurrentDialogueLine();
        } else {
            gameState = "fade-out";
        }
    }
});

// 3. GRAPHICS
function drawBackground() {
    if (bgLoaded) {
        ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
    } else {
        ctx.fillStyle = "#2c3e50";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
}

function drawPortraitElement(char, positionMode) {
    if (!char) return;

    const isSpeaking =
        currentSpeakerName === char.name ||
        currentSpeakerName === char.id?.toUpperCase();

    let drawX = 0;
    const drawY = canvas.height - 490;

    if (positionMode === "left") drawX = -40;
    else if (positionMode === "right") drawX = canvas.width - 360;
    else drawX = canvas.width / 2 - 200;

    ctx.globalAlpha = fadeAlpha * (isSpeaking ? 1 : 0.4);
    ctx.save();

    if (char.portraitLoaded) {
        let frame =
            Array.isArray(char.portraitFrames)
                ? char.portraitFrames[portraitFrame]
                : char.portraitFrames;

        if (positionMode === "right") {
            ctx.translate(drawX + 400, drawY);
            ctx.scale(-1, 1);
            ctx.drawImage(frame, 0, 0, 400, 400);
        } else {
            ctx.drawImage(frame, drawX, drawY, 400, 400);
        }
    } else {
        ctx.fillStyle = char.color || "#fff";
        ctx.fillRect(drawX + 125, drawY + 125, 150, 150);
    }

    ctx.restore();
    ctx.globalAlpha = 1;
}

if (typeof boxFadeAlpha === "undefined") {
    var boxFadeAlpha = 0;
}

// 4. VN RENDER LAYER
function drawVisualNovelLayer() {
    if (gameState === "simulation" || gameState === "pathfinding") return;

    if (gameState === "fade-in") {
        boxFadeAlpha += 0.05;
        if (boxFadeAlpha >= 1) {
            boxFadeAlpha = 1;
            fadeAlpha += 0.05;
            if (fadeAlpha >= 1) {
                fadeAlpha = 1;
                gameState = "dialogue";
                portraitFrame = 0;
                portraitAnimTimer = 0;
            }
        }
    } else if (gameState === "fade-out") {
        fadeAlpha -= 0.08;
        if (fadeAlpha <= 0) {
            fadeAlpha = 0;
            boxFadeAlpha -= 0.05;
            if (boxFadeAlpha <= 0) {
                boxFadeAlpha = 0;
                gameState = "simulation";
                talkingCharacter = null;
                interactingPartner = null;
            }
        }
    }

    ctx.globalAlpha = boxFadeAlpha;
    ctx.fillStyle = "rgba(0,0,0,0.6)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (gameState === "dialogue") {
        portraitAnimTimer++;
        if (portraitAnimTimer >= 12) {
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

// 5. CHARACTER UPDATE (unchanged)
function updateCharacter(char) {
    if (gameState !== "simulation") return;

    char.timer--;
    if (char.timer <= 0) {
        if (Math.random() < char.activityLevel) {
            char.state = "walking";
            char.moveX = Math.random() < 0.5 ? -1 : 1;
            char.moveY = 0;
            char.timer = Math.floor(Math.random() * 120) + 60;
        } else {
            char.state = "idle";
            char.moveX = 0;
            char.moveY = 0;
            char.timer = Math.floor(Math.random() * 180) + 120;
        }
    }

    char.x += char.moveX * char.speed;

    if (char.x < 0) char.x = 0;
    if (char.x + char.width > canvas.width)
        char.x = canvas.width - char.width;
}

// 6. MAIN LOOP
function gameLoop() {
    drawBackground();

    if (typeof fruits !== "undefined") {
        fruits.forEach(fruit => {
            if (fruit.imageLoaded) {
                ctx.drawImage(
                    fruit.imageElement,
                    Math.round(fruit.x),
                    Math.round(fruit.y),
                    fruit.width,
                    fruit.height
                );
            }
        });
    }

    characters.forEach(char => {
        updateCharacter(char);

        if (char.imageLoaded) {
            ctx.drawImage(
                char.imageElement,
                Math.round(char.x),
                Math.round(char.y),
                char.width,
                char.height
            );
        }

        if (selectedCharacter && selectedCharacter.id === char.id) {
            ctx.strokeStyle = "#61DE2A";
            ctx.lineWidth = 3;
            ctx.strokeRect(
                Math.round(char.x) - 2,
                Math.round(char.y) - 2,
                char.width + 4,
                char.height + 4
            );
        }
    });

    drawVisualNovelLayer();
    requestAnimationFrame(gameLoop);
}

// 7. START ENGINE
window.addEventListener("load", function () {
    bgLoaded = true;
    gameLoop();
});
