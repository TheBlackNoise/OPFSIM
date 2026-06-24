// JUU FRUIT DATABOX
const juuData = {
    id: "juu",

    name: "JUU JUU NO MI",

    width: 22,
    height: 22,

    // Choose your own coordinates
    x: 558,
    y: 203,

    dialogueLines: [
        "The <color=orange><b>Juu Juu no Mi</b></color>, a Logia-type <color=orange><b>Devil Fruit</b></color>",
        "It allows It's user to create, control, and transform into Carbon in all it's forms at will, making the user a 'Carbon Human'",
        "Previous User?",
        "Unknown.",
        "Current User?",
        "<color=red><b>Sawyer</b></color>"
    ],

    characterDialogue: {

        zero: [
            "ZERO: Ah, so this is what the power of carbon looks like.",
            "ZERO: This is Mr. <color=red><b>Sawyer</b></color>'s <color=orange><b>Devil Fruit</b></color>.",
            "ZERO: It has quite a large amount of potential, which thankully has been thoroughly tapped.",
            "ZERO: Though I have my qualms with the logia class, I wouldn't be upset if I ate this one. <small> I think...</small>",
            "ZERO: It's impressive though, I feel that may be more a product of its user than it's own merit."

        ],

        shinzui: [
            "SHINZUI: <i> We patiently await Eastie's input on this pressing matter...</i>"
        ],

         fermi: [
            "FERMI: <i> We patiently await Zeospark's input on this pressing matter...</i>"
        ]


    },

    imageLoaded: false,
    imageElement: new Image(),

    portraitLoaded: false,
    portraitImage: new Image()
};

juuData.imageElement.src = "Sprites/Juu.png";

juuData.imageElement.onload = function () {
    juuData.imageLoaded = true;
};

juuData.portraitImage.src = "Sprites/JuuPortrait.png";

juuData.portraitImage.onload = function () {
    juuData.portraitLoaded = true;
};