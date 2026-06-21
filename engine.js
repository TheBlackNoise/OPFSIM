// ===============================
// SINGLE BACKGROUND LOADER SYSTEM
// ===============================
const bgImage = new Image();
bgImage.src = "Sprites/Background.png";
let bgLoaded = false;

// Placeholder values to keep old parts of your game loop stable
let bgOverlayLoaded = false;
let bgOverlayImage = null;

// ===============================
// SMART DIALOGUE PARSER
// ===============================
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

// ===============================
// DEBUG HELPER (NEW - SAFE ADD)
// ===============================
function safeLoadImage(img, path, label) {
    img.onload = function () {
        img.loaded = true;
    };

    img.onerror = function () {
        console.warn(`[MISSING ASSET] ${label}: ${path}`);
    };

    img.src = path;
}

// ===============================
// MOUSE CONTROLS
// ===============================
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

    // ===============================
    // FRUIT INTERACTION
    // ===============================
    if (clickedFruit) {
        if (selectedCharacter) {
            const fruitId = clickedFruit.id.toLowerCase();

            if (selectedCharacter.interactions && selectedCharacter.interactions[fruitId]) {
                gameState = "pathfinding";
                talkingCharacter = selectedCharacter;
                interactingPartner = clickedFruit;
                fullDialogueList = selectedCharacter.interactions[fruitId];
            } else {
                gameState = "fade-in";
                talkingCharacter = selectedCharacter;
                interactingPartner = null;
                fullDialogueList = [`${selectedCharacter.name}: It's a Devil Fruit...`];
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
    // CHARACTER INTERACTION
    // ===============================
    if (clickedChar) {

        if (selectedCharacter && selectedCharacter.id === clickedChar.id) {
            gameState = "fade-in";
            fadeAlpha = 0;
            boxFadeAlpha = 0;

            talkingCharacter = clickedChar;
            interactingPartner = null;

            if (clickedChar.dialogueLines && clickedChar.dialogueLines.length > 0) {
                const randomIndex = Math.floor(Math.random() * clickedChar.dialogueLines.length);
                let chosenOption = clickedChar.dialogueLines[randomIndex];

                fullDialogueList = Array.isArray(chosenOption)
                    ? chosenOption
                    : [chosenOption];
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

            if (selectedCharacter.interactions && selectedCharacter.interactions[targetId]) {
                let interactionData = selectedCharacter.interactions[targetId];
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

// ===============================
// KEYBOARD CONTROLS
// ===============================
window.addEventListener("keydown", function(event) {
    if (event.key === " " || event.key === "x" || event.key === "X") {
        event.preventDefault();
    }

    if ((event.key === "x" || event.key === "X") &&
        (gameState === "dialogue" || gameState === "fade-in")) {
        gameState = "fade-out";
        return;
    }

    if (event.key === " " && gameState === "dialogue") {
        if (textCharacterIndex < cleanSpeechText.length) {
            textCharacterIndex = cleanSpeechText.length;
            printedText = cleanSpeechText;
        } else {
            currentLineIndex++;

            if (currentLineIndex < fullDialogueList.length) {
                printedText = "";
                textCharacterIndex = 0;
                parseCurrentDialogueLine();
            } else {
                gameState = "fade-out";
            }
        }
    }
});

// ===============================
// BACKGROUND RENDER
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
// PORTRAIT RENDER
// ===============================
function drawPortraitElement(char, positionMode) {
    if (!char) return;

    const isSpeaking =
        (currentSpeakerName === char.name ||
         currentSpeakerName === char.id.toUpperCase() ||
         rawSpeakerCheck(char));

    let drawX = 0;
    const drawY = canvas.height - 490;

    if (positionMode === "left") drawX = -40;
    else if (positionMode === "right") drawX = canvas.width - 360;
    else drawX = (canvas.width / 2) - 200;

    ctx.globalAlpha = fadeAlpha * (isSpeaking ? 1 : 0.4);

    ctx.save();

    if (char.portraitLoaded) {
        let frame = (Array.isArray(char.portraitFrames) && char.portraitFrames.length)
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
        ctx.fillStyle = char.color || "#ffffff";
        ctx.fillRect(drawX + 125, drawY + 125, 150, 150);
    }

    ctx.restore();
    ctx.globalAlpha = 1;
}

// ===============================
// SPEAKER CHECK
// ===============================
function rawSpeakerCheck(char) {
    if (!currentSpeakerName) return false;
    return char.name.toUpperCase().startsWith(currentSpeakerName);
}

// ===============================
// FADE STATE
// ===============================
if (typeof boxFadeAlpha === "undefined") {
    var boxFadeAlpha = 0;
}

// ===============================
// VN LAYER
// ===============================
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
    }

    if (gameState === "fade-out") {
        fadeAlpha -= 0.08;

        if (fadeAlpha <= 0) {
            fadeAlpha = 0;
            boxFadeAlpha -= 0.05;

            if (boxFadeAlpha <= 0) {
                boxFadeAlpha = 0;
                gameState = "simulation";
                talkingCharacter = null;
                interactingPartner = null;
                return;
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

    let headerColor = "#ffffff";
    let activeSpeakerTitle = "";
    let activeSpeakerVibeName = "";

    characters.forEach(char => {
        if (
            currentSpeakerName === char.name ||
            currentSpeakerName === char.id.toUpperCase()
        ) {
            if (char.nameColor) headerColor = char.nameColor;
            if (char.vibeTitle) activeSpeakerTitle = char.vibeTitle;
            if (char.vibeName) activeSpeakerVibeName = char.vibeName;
        }
    });

    ctx.globalAlpha = boxFadeAlpha;

    ctx.textAlign = "center";
    ctx.fillStyle = "rgba(255,255,255,0.15)";
    ctx.font = "italic 12px sans-serif";
    ctx.fillText(activeSpeakerTitle, canvas.width - 150, canvas.height - 144);

    ctx.font = "bold 24px sans-serif";
    ctx.fillText(activeSpeakerVibeName, canvas.width - 150, canvas.height - 118);

    ctx.fillStyle = "#1e272e";
    ctx.fillRect(20, canvas.height - 110, canvas.width - 40, 90);

    ctx.strokeStyle = "#dcdde1";
    ctx.lineWidth = 4;
    ctx.strokeRect(22, canvas.height - 108, canvas.width - 44, 86);

    if (gameState === "dialogue") {
        if (textCharacterIndex < cleanSpeechText.length) {
            textCharacterIndex++;
            printedText = cleanSpeechText.substring(0, textCharacterIndex);
        }
    }

    ctx.textAlign = "left";
    ctx.fillStyle = headerColor;
    ctx.font = "bold 16px sans-serif";
    ctx.fillText(currentSpeakerName, 40, canvas.height - 82);

    ctx.fillStyle = "#ffffff";
    ctx.font = "16px sans-serif";
    ctx.fillText(printedText, 40, canvas.height - 52);

    ctx.fillStyle = "#718093";
    ctx.font = "11px sans-serif";
    ctx.textAlign = "right";
    ctx.fillText("[SPACE] Continue / [X] Close", canvas.width - 40, canvas.height - 35);

    ctx.globalAlpha = 1;
}

// ===============================
// CHARACTER UPDATE
// ===============================
function updateCharacter(char) {
    if (gameState === "pathfinding") {
        if (talkingCharacter && interactingPartner) {
            if (char.id === talkingCharacter.id) {
                let targetX = interactingPartner.x;
                targetX += (talkingCharacter.x < interactingPartner.x) ? -48 : 48;

                if (Math.abs(char.x - targetX) > 4) {
                    char.state = "walking";
                    char.moveX = char.x < targetX ? 1 : -1;
                    char.x += char.moveX * char.speed * 2;
                } else {
                    char.x = targetX;
                    char.state = "idle";
                    gameState = "fade-in";
                }
            }

            if (char.id === interactingPartner.id) {
                char.state = "idle";
            }
            return;
        }
    }

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

    if (char.state === "walking") {
        if (Math.random() < 0.08) {
            char.moveY = (Math.random() * 2 - 1) * 0.2;
        }
        char.y += char.moveY;
    }

    const minY = 263;
    const maxY = 268;

    if (char.y + char.height < minY) char.y = minY - char.height;
    if (char.y + char.height > maxY) char.y = maxY - char.height;

    if (char.x < 0) char.x = 0;
    if (char.x + char.width > canvas.width)
        char.x = canvas.width - char.width;
}

// ===============================
// GAME LOOP
// ===============================
function gameLoop() {
    drawBackground();

    if (typeof fruits !== "undefined") {
        fruits.forEach(fruit => {
            if (fruit.imageLoaded) {
                ctx.drawImage(fruit.imageElement, Math.round(fruit.x), Math.round(fruit.y), fruit.width, fruit.height);
            }
        });
    }

    characters.forEach(char => {
        updateCharacter(char);

        if (char.imageLoaded) {
            ctx.save();

            if (char.moveX === -1) {
                ctx.translate(Math.round(char.x) + char.width, Math.round(char.y));
                ctx.scale(-1, 1);
                ctx.drawImage(char.imageElement, 0, 0, char.width, char.height);
            } else {
                ctx.drawImage(char.imageElement, Math.round(char.x), Math.round(char.y), char.width, char.height);
            }

            ctx.restore();
        }

        if (selectedCharacter && selectedCharacter.id === char.id) {
            ctx.strokeStyle = "#61DE2A";
            ctx.lineWidth = 3;
            ctx.strokeRect(Math.round(char.x) - 2, Math.round(char.y) - 2, char.width + 4, char.height + 4);
        }
    });

    drawVisualNovelLayer();
    requestAnimationFrame(gameLoop);
}

// ===============================
// BOOT
// ===============================
window.addEventListener("load", function () {
    bgLoaded = true;
    gameLoop();
});
