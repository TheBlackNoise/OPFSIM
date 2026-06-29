// MASTER SYSTEM DIRECTORY LISt
const masterCharacterRoster = [
    fermiData,
    shinzuiData,
    sawyerData,
    zeroData
    // [ADD NEW CHARACTER VARIABLES RIGHT HERE SEPARATED BY A COMMA]
    // Example: , alexData, skyData
];

// This smart system loops through the roster and checks for the locked password line.
const characters = [];

masterCharacterRoster.forEach(char => {
    // If the window engine detects the secret password blocker string, skip them entirely!
    if (typeof WRONG_PASSWORD_LINE_REMOVE_ME !== 'undefined' && char.id === "sample") {
        console.log(`Skipped template loader character: ${char.name}`);
    } else {
        // Otherwise, everything is clean! Add them into the active hallway corridor simulation roster
        characters.push(char);
    }
});
