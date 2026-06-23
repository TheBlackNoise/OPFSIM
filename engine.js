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
        cleanSpeechText = rawLine;    }
}

// ===============================
// DEBUG HELPER (NEW - SAFE ADD)
// ===============================
let activeLinePortrait = null;
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

    const hb = char.hitbox ?? {
        x: 0,
        y: 0,
        w: char.width,
        h: char.height
    };

    const left = char.x + hb.x;
    const right = left + hb.w;
    const top = char.y + hb.y;
    const bottom = top + hb.h;

    if (
        mouseX >= left &&
        mouseX <= right &&
        mouseY >= top &&
        mouseY <= bottom
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
  // CASE A: Clicked a Devil Fruit directly
if (clickedFruit) {

    if (selectedCharacter) {

        const characterId = selectedCharacter.id.toLowerCase();

        if (
            clickedFruit.characterDialogue &&
            clickedFruit.characterDialogue[characterId]
        ) {

            gameState = "pathfinding";
            talkingCharacter = selectedCharacter;
            interactingPartner = clickedFruit;
            fullDialogueList = clickedFruit.characterDialogue[characterId];

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

    // Use the ACTUAL fruit object
    talkingCharacter = clickedFruit;

    // Give it a text colour for the header
    talkingCharacter.nameColor = "#eed202";

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

    const randomIndex = Math.floor(
        Math.random() * clickedChar.dialogueLines.length
    );

    fullDialogueList = clickedChar.dialogueLines[randomIndex];

} else {

    fullDialogueList = [
        `${clickedChar.name}: ...`
    ];


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

if (event.key === "h" || event.key === "H") {
    DEBUG_HITBOXES = !DEBUG_HITBOXES;
}
    if (event.key === " " || event.key === "x" || event.key === "X") {
        event.preventDefault();
    }

    if ((event.key === "x" || event.key === "X") &&
        (gameState === "dialogue" || gameState === "fade-in")) {
        gameState = "fade-out";
        return;
    }

    if (event.key === " " && gameState === "dialogue") {
        if (textCharacterIndex < getVisibleLength(cleanSpeechText)) {
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
    // Devil Fruit portrait
if (char.width === 22) {

    if (char.portraitLoaded) {

       ctx.drawImage(
    char.portraitImage,
    drawX + 125,
    drawY + 180,
    150,
    150
);

    } else if (char.imageLoaded) {

        // Temporary fallback until every fruit has artwork
        ctx.drawImage(
            char.imageElement,
            drawX,
            drawY,
            400,
            400
        );

    } else {

        ctx.fillStyle = "#ffffff";
        ctx.fillRect(drawX + 125, drawY + 125, 150, 150);

    }

    ctx.restore();
    ctx.globalAlpha = 1;
    return;
}

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

function wrapText(ctx, text, maxWidth) {
    let words = text.split(" ");
    let lines = [];
    let currentLine = "";

    for (let word of words) {

        // build test line WITH raw text
        let testLine = currentLine + word + " ";

        // strip tags BEFORE measuring
        let cleanTestLine = testLine.replace(/<[^>]*>/g, "");

        let width = ctx.measureText(cleanTestLine).width;

        if (width > maxWidth && currentLine !== "") {
            lines.push(currentLine.trim());
            currentLine = word + " ";
        } else {
            currentLine = testLine;
        }
    }

    lines.push(currentLine.trim());
    return lines;
}
function getVisibleLength(text) {
    return text.replace(/<[^>]+>/g, "").length;
}

function getVisibleSubstring(text, visibleChars) {

    let result = "";
    let visibleCount = 0;

    for (let i = 0; i < text.length; i++) {

        // If we hit a formatting tag...
        if (text[i] === "<") {

            // Copy the ENTIRE tag instantly.
            while (i < text.length) {
                result += text[i];

                if (text[i] === ">") {
                    break;
                }

                i++;
            }

            continue;
        }

        // Stop once enough visible characters have been typed.
        if (visibleCount >= visibleChars) {
            break;
        }

        result += text[i];
        visibleCount++;
    }

    return result;
}

function drawStyledText(text, x, y) {

ctx.save();



    let parts = text.split(/(<[^>]+>)/g).filter(Boolean);

    let isBold = false;
    let isItalic = false;
    let isSmall = false;
    let isShake = false;
    let isGlow = false;
    let isBig = false;
    let isWraith = false;

    let color = "#ffffff";
    let offsetX = 0;

    for (let part of parts) {

        // =====================
        // TAG HANDLING
        // =====================

        if (part === "<b>") { isBold = true; continue; }
        if (part === "</b>") { isBold = false; continue; }

        if (part === "<i>") { isItalic = true; continue; }
        if (part === "</i>") { isItalic = false; continue; }

        if (part === "<small>") { isSmall = true; continue; }
        if (part === "</small>") { isSmall = false; continue; }

        if (part === "<shake>") { isShake = true; continue; }
        if (part === "</shake>") { isShake = false; continue; }

        if (part === "<glow>") { isGlow = true; continue; }
        if (part === "</glow>") { isGlow = false; continue; }

        if (part === "<big>") { isBig = true; continue; }
        if (part === "</big>") { isBig = false; continue; }

        if (part === "<wraith>") { isWraith = true; continue; }
        if (part === "</wraith>") { isWraith = false; continue; }

        let colorMatch = part.match(/<color=(.*?)>/);
        if (colorMatch) { color = colorMatch[1]; continue; }

        if (part === "</color>") { color = "#ffffff"; continue; }

        // =====================
        // FONT SIZE (BIG SUPPORT)
        // =====================
        let size = 16;

        if (isSmall) size = 12;
        if (isBig) size = 28;

        let font = `${size}px sans-serif`;

        if (isBold && isItalic) font = `bold italic ${size}px sans-serif`;
        else if (isBold) font = `bold ${size}px sans-serif`;
        else if (isItalic) font = `italic ${size}px sans-serif`;

        ctx.font = font;

        // =====================
        // COLOR + GLOW
        // =====================
        ctx.fillStyle = isSmall ? "rgba(255,255,255,0.6)" : color;

        if (isGlow || isWraith) {
            ctx.shadowColor = color;
            ctx.shadowBlur = isWraith ? 18 : 10;
        } else {
            ctx.shadowBlur = 0;
        }

        // =====================
        // WRAITH LAYERS (MULTI VOICE EFFECT)
        // =====================
        let layers = isWraith ? 4 : 1;

        for (let i = 0; i < layers; i++) {

            let layerX = x + offsetX + (isWraith ? (Math.random() - 0.5) * 6 : 0);
            let layerY = y + (isWraith ? (Math.random() - 0.5) * 6 : 0);

            let wave = Math.sin((offsetX * 0.05) + performance.now() * 0.01) * (isWraith ? 6 : 2);

            let finalX = layerX;
            let finalY = layerY + wave;

            ctx.globalAlpha = isWraith ? 0.25 : 1;

            // =====================
            // DRAW TEXT
            // =====================
            ctx.fillText(part, finalX, finalY);
        }

        ctx.globalAlpha = 1;

        // =====================
        // POSITION ADVANCE
        // =====================
        offsetX += ctx.measureText(part).width;
    }

    ctx.shadowBlur = 0;
ctx.shadowColor = "transparent";
ctx.globalAlpha = 1;
ctx.restore();
}
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

    ctx.globalAlpha = boxFadeAlpha * fadeAlpha;

// Fruit interactions stay centered
if (
    interactingPartner &&
    interactingPartner.width === 22
) {

    drawPortraitElement(talkingCharacter, "center");

}
// Character interactions stay left/right
else if (interactingPartner) {

    drawPortraitElement(talkingCharacter, "left");
    drawPortraitElement(interactingPartner, "right");

}
// Solo dialogue
else {

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
        printedText = getVisibleSubstring(cleanSpeechText, textCharacterIndex);
    }
}

    ctx.textAlign = "left";
    ctx.fillStyle = headerColor;
    ctx.font = "bold 16px sans-serif";
    ctx.fillText(currentSpeakerName, 40, canvas.height - 82);

ctx.fillStyle = "#ffffff";
ctx.font = "16px sans-serif";
ctx.textAlign = "left";

let lines = wrapText(ctx, printedText, canvas.width - 80);

for (let i = 0; i < lines.length; i++) {
    drawStyledText(lines[i], 40, canvas.height - 52 + (i * 20));
}
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

// Fruit special handling (slightly tighter positioning)
if (interactingPartner.width === 22) {
    targetX += (talkingCharacter.x < interactingPartner.x) ? -32 : 32;
} else {
    targetX += (talkingCharacter.x < interactingPartner.x) ? -48 : 48;
}

                if (Math.abs(char.x - targetX) > 4) {
                    char.state = "walking";
                    char.moveX = char.x < targetX ? 1 : -1;
                    let walkSpeed = 8;

if (interactingPartner && interactingPartner.width === 22) {
    walkSpeed = 8;
}

char.x += char.moveX * char.speed * walkSpeed;
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
    // NO Y MOVEMENT — LOCK CHARACTERS TO THEIR LANE
char.moveY = 0;
    
    if (char.x < 0) char.x = 0;
    if (char.x + char.width > canvas.width)
        char.x = canvas.width - char.width;

// HARD Y LOCK (prevents drift accumulation)
char.y = Math.round(char.y); 

}

// ===============================
// GAME LOOP
// ===============================
// Walking animation state
let walkFrame = 0;
let walkTimer = 0;
let DEBUG_HITBOXES = false;

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
        // Advance walking animation
if (char.state === "walking" && char.walkLoaded) {

    walkTimer++;

    if (walkTimer >= 8) {

        walkFrame = (walkFrame + 1) % 4;
        walkTimer = 0;

    }

}

        if (char.imageLoaded) {
let sprite = char.imageElement;

if (char.state === "walking" && char.walkLoaded) {
    sprite = char.walkFrames[walkFrame];
}
            ctx.save();

            if (char.moveX === -1) {
                ctx.translate(Math.round(char.x) + char.width, Math.round(char.y));
                ctx.scale(-1, 1);
                ctx.drawImage(sprite, 0, 0, char.width, char.height);
            } else {
                if (sprite && sprite.complete && sprite.naturalWidth !== 0) {
    ctx.drawImage(sprite, Math.round(char.x), Math.round(char.y), char.width, char.height);
}
            }

            ctx.restore();
        }

        if (selectedCharacter && selectedCharacter.id === char.id) {
    ctx.strokeStyle = "#61DE2A";
    ctx.lineWidth = 0.5;
    ctx.strokeRect(Math.round(char.x) + 12, Math.round(char.y) + 28, char.width - 25, char.height - 25);
}
// DEBUG HITBOX VISUALS (toggle with H)
if (DEBUG_HITBOXES) {
    const hb = char.hitbox ?? { x: 0, y: 0, w: char.width, h: char.height };

    ctx.strokeStyle = "rgba(0,255,0,0.8)";
    ctx.lineWidth = 1;
    ctx.strokeRect(
        char.x + hb.x,
        char.y + hb.y,
        hb.w,
        hb.h
    );
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
