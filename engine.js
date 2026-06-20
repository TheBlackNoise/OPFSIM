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

// 1. MOUSE CONTROLS (SELECTION & INTERACTION LINKS)
canvas.addEventListener("click", function(event) {
    if (gameState !== "simulation") return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    let clickedChar = null;
    characters.forEach(char => {
        if (mouseX >= char.x && mouseX <= char.x + char.width && mouseY >= char.y && mouseY <= char.y + char.height) {
            clickedChar = char;
        }
    });

    if (clickedChar) {
        // SOLO TOGGLE CLICK
        if (selectedCharacter && selectedCharacter.id === clickedChar.id) {
            gameState = "fade-in"; 
            fadeAlpha = 0;
            boxFadeAlpha = 0; 
            talkingCharacter = clickedChar;
            interactingPartner = null; 
            fullDialogueList = clickedChar.dialogueLines;
            currentLineIndex = 0; printedText = ""; textCharacterIndex = 0;
            portraitFrame = 0; portraitAnimTimer = 0;
            parseCurrentDialogueLine();
            selectedCharacter = null; return;
        }
        
        // DUAL LINK INTERACTION CLICK
        if (selectedCharacter && selectedCharacter.id !== clickedChar.id) {
            if (selectedCharacter.interactions && selectedCharacter.interactions[clickedChar.id]) {
                gameState = "fade-in"; 
                fadeAlpha = 0;
                boxFadeAlpha = 0; 
                talkingCharacter = selectedCharacter; 
                interactingPartner = clickedChar;     
                fullDialogueList = selectedCharacter.interactions[clickedChar.id];
                currentLineIndex = 0; printedText = ""; textCharacterIndex = 0;
                portraitFrame = 0; portraitAnimTimer = 0;
                parseCurrentDialogueLine();
                selectedCharacter = null; return;
            } else {
                selectedCharacter = null; return;
            }
        }
        selectedCharacter = clickedChar;
    } else { selectedCharacter = null; }
});

// 2. KEYBOARD CONTROLS (SPACEBAR PROGRESSION & X EXIT)
window.addEventListener("keydown", function(event) {
    if (event.key === " " || event.key === "x" || event.key === "X") event.preventDefault();
    if ((event.key === "x" || event.key === "X") && (gameState === "dialogue" || gameState === "fade-in")) {
        gameState = "fade-out"; return;
    }
    if (event.key === " " && gameState === "dialogue") {
        if (textCharacterIndex < cleanSpeechText.length) {
            textCharacterIndex = cleanSpeechText.length;
            printedText = cleanSpeechText;
        } else {
            currentLineIndex++;
            if (currentLineIndex < fullDialogueList.length) {
                printedText = ""; textCharacterIndex = 0;
                parseCurrentDialogueLine(); 
            } else { 
                gameState = "fade-out"; 
            }
        }
    }
});

// 3. GRAPHICS GENERATORS
function drawBackground() {
    ctx.fillStyle = "#2c3e50"; ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "#34495e"; ctx.lineWidth = 2;
    for (let x = 0; x < canvas.width; x += 64) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke(); }
    for (let y = 0; y < canvas.height; y += 64) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke(); }
}

function drawPortraitElement(char, positionMode) {
    if (!char) return;

    const isSpeaking = (currentSpeakerName === char.name || currentSpeakerName === char.id.toUpperCase() || rawSpeakerCheck(char));
    
    let drawX = 0;
    const drawY = canvas.height - 490;

    if (positionMode === "left") drawX = -40; 
    else if (positionMode === "right") drawX = canvas.width - 360; 
    else drawX = (canvas.width / 2) - 200; 

    ctx.globalAlpha = fadeAlpha * (isSpeaking ? 1.0 : 0.4);

        ctx.save(); // Save canvas settings before flipping

    if (char.portraitLoaded) {
        let currentFrameImg = (Array.isArray(char.portraitFrames) && char.portraitFrames.length > 0) 
            ? char.portraitFrames[portraitFrame] 
            : char.portraitFrames;

        // If this portrait is on the right side, mirror it horizontally
        if (positionMode === "right") {
            ctx.translate(drawX + 400, drawY);
            ctx.scale(-1, 1);
            ctx.drawImage(currentFrameImg, 0, 0, 400, 400);
        } else {
            ctx.drawImage(currentFrameImg, drawX, drawY, 400, 400);
        }
    } else {
        ctx.fillStyle = char.color;
        ctx.fillRect(drawX + 125, drawY + 125, 150, 150);
    }

    ctx.restore(); // Undo the flip so the rest of the game draws normally
    ctx.globalAlpha = 1.0; 
}

function rawSpeakerCheck(char) {
    if(!currentSpeakerName) return false;
    return char.name.toUpperCase().startsWith(currentSpeakerName);
}

if (typeof boxFadeAlpha === 'undefined') {
    var boxFadeAlpha = 0;
}

function drawVisualNovelLayer() {
    if (gameState === "simulation") return;

    // A. REVERSED STAGGERED FADE-IN (BOX FIRST, THEN PORTRAIT)
    if (gameState === "fade-in") {
        boxFadeAlpha += 0.05; 
        if (boxFadeAlpha >= 1) {
            boxFadeAlpha = 1;
            fadeAlpha += 0.05; 
            if (fadeAlpha >= 1) {
                fadeAlpha = 1;
                gameState = "dialogue"; 
                // Reset animation timers right when talking starts
                portraitFrame = 0;
                portraitAnimTimer = 0;
            }
        }
    } 
    // B. REVERSED STAGGERED FADE-OUT (PORTRAIT FIRST, THEN BOX)
    else if (gameState === "fade-out") {
        fadeAlpha -= 0.08; 
        if (fadeAlpha <= 0) {
            fadeAlpha = 0;
            boxFadeAlpha -= 0.05; 
            if (boxFadeAlpha <= 0) {
                boxFadeAlpha = 0;
                gameState = "simulation";
                talkingCharacter = null; interactingPartner = null;
                return;
            }
        }
    }

    // --- RENDER STAGE 1: BACKGROUND DIM OVERLAY ---
    ctx.globalAlpha = boxFadeAlpha;
    ctx.fillStyle = "rgba(0, 0, 0, 0.6)"; ctx.fillRect(0, 0, canvas.width, canvas.height);

    // --- RENDER STAGE 2: CHARACTERS ANIMATION LOOP TICK ---
    // This clock code forces each frame to last exactly 0.2 seconds
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

    // Find Active Speaker Data Box for styling attributes
    let headerColor = "#ffffff";
    let activeSpeakerTitle = ""; 
    let activeSpeakerVibeName = "";

    characters.forEach(char => {
        if (currentSpeakerName === char.name || currentSpeakerName === char.id.toUpperCase()) {
            if (char.nameColor) headerColor = char.nameColor;
            if (char.vibeTitle) activeSpeakerTitle = char.vibeTitle; 
            if (char.vibeName) activeSpeakerVibeName = char.vibeName;
        }
    });

    // --- RENDER STAGE 3: INTERFACE OVERLAYS ---
    ctx.globalAlpha = boxFadeAlpha;

    // Faded Vibe Labels
    ctx.textAlign = "center";
    ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
    ctx.font = "italic 12px sans-serif";
    ctx.fillText(activeSpeakerTitle, canvas.width - 150, canvas.height - 144);
    ctx.font = "bold 24px sans-serif";
    ctx.fillText(activeSpeakerVibeName, canvas.width - 150, canvas.height - 118);

    // Dialogue Frame Box
    ctx.fillStyle = "#1e272e"; ctx.fillRect(20, canvas.height - 110, canvas.width - 40, 90);
    ctx.strokeStyle = "#dcdde1"; ctx.lineWidth = 4; ctx.strokeRect(22, canvas.height - 108, canvas.width - 44, 86);

    // Typewriter increments
    if (gameState === "dialogue") {
        if (textCharacterIndex < cleanSpeechText.length) {
            textCharacterIndex += 1;
            if (textCharacterIndex > cleanSpeechText.length) textCharacterIndex = cleanSpeechText.length;
            printedText = cleanSpeechText.substring(0, textCharacterIndex);
        }
    }

    // Chatbox String Maps
    ctx.textAlign = "left"; 
    ctx.fillStyle = headerColor; 
    ctx.font = "bold 16px sans-serif"; 
    ctx.fillText(currentSpeakerName, 40, canvas.height - 82);

    ctx.fillStyle = "#ffffff"; 
    ctx.font = "16px sans-serif"; 
    ctx.fillText(printedText, 40, canvas.height - 52); 

    // Subtitle Prompt Layout
    ctx.fillStyle = "#718093"; ctx.font = "11px sans-serif"; ctx.textAlign = "right";
    ctx.fillText("[SPACE] Continue / [X] Close", canvas.width - 40, canvas.height - 35);
    
    ctx.globalAlpha = 1.0; 
}
// 4. MOVEMENT TICKS
function updateCharacter(char) {
    if (gameState !== "simulation") return;
    char.timer--;
    if (char.timer <= 0) {
        if (Math.random() < char.activityLevel) {
            char.state = "walking";
            char.moveX = Math.floor(Math.random() * 3) - 1; char.moveY = Math.floor(Math.random() * 3) - 1;
            if (char.moveX === 0 && char.moveY === 0) char.state = "idle";
            char.timer = Math.floor(Math.random() * 120) + 60;
        } else {
            char.state = "idle"; char.moveX = 0; char.moveY = 0;
            char.timer = Math.floor(Math.random() * 180) + 120;
        }
    }
    char.x += char.moveX * char.speed; char.y += char.moveY * char.speed;
    if (char.x < 0) char.x = 0;
    if (char.x + char.width > canvas.width) char.x = canvas.width - char.width;
    if (char.y < 0) char.y = 0;
    if (char.y + char.height > canvas.height - 120) char.y = canvas.height - 120 - char.height; 
}

// 5. ENGINE LOOP
function gameLoop() {
    drawBackground();
    characters.forEach(char => {
        updateCharacter(char);
        if (char.imageLoaded) { ctx.drawImage(char.imageElement, Math.round(char.x), Math.round(char.y), char.width, char.height); }
        else { ctx.fillStyle = char.color; ctx.fillRect(Math.round(char.x), Math.round(char.y), char.width, char.height); }
        
        if (selectedCharacter && selectedCharacter.id === char.id) {
            ctx.strokeStyle = "#61DE2A"; ctx.lineWidth = 3;
            ctx.strokeRect(Math.round(char.x) - 2, Math.round(char.y) - 2, char.width + 4, char.height + 4);
        }
    });
    drawVisualNovelLayer();
    requestAnimationFrame(gameLoop);
}
gameLoop();