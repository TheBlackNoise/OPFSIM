// Master Directory connecting all separate Devil Fruits into a clean list
const fruits = [
    busshiData
    // Future fruits will be dropped right here separated by a comma!
];

// --- AUTOMATIC SHELF GRID PLACEMENT MATH (BAKED-IN ART SPACING) ---
// The shelf starts 200px from the top, and 210px from the right edge (558px from left)
const shelfStartX = 768 - 231; 
const shelfStartY = 400 - 222; 

// Every fruit sprite is exactly 22x22 pixels
const slotSize = 22;

// Loop through your list and snap each fruit into its designated shelf row and column slot
fruits.forEach((fruit, index) => {
    // Math to determine which row (0, 1, 2) and which column (0 to 8) the fruit belongs to
    let row = Math.floor(index / 9);
    let col = index % 9;
    
    // Horizontal (X): Touch border-to-border with no extra space since the art handles it
    fruit.x = shelfStartX + (col * slotSize);
    
    // Vertical (Y): Add exactly 1 pixel of vertical spacing between each row level
    fruit.y = shelfStartY + (row * (slotSize + 1));
});
