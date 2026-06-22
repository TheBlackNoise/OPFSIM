const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;

// GAME STATE MODES
let gameState = "simulation"; 
let fadeAlpha = 0;           

// Selection States
let selectedCharacter = null; 

// Dialogue Tracking Systems
let fullDialogueList = [];   
let currentLineIndex = 0;     
let printedText = "";        
let textCharacterIndex = 0;  

// Dual Interaction Casting
let talkingCharacter = null;    // The FIRST character clicked (Stands on the Left)
let interactingPartner = null;  // The SECOND character clicked (Stands on the Right)

let currentSpeakerName = "";    // Dynamically parsed speaker name
let cleanSpeechText = "";       // Dynamically parsed dialogue text sentence

let portraitFrame = 1;
let portraitAnimTimer = 0;
