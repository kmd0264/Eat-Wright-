// src/model/levelData.js

// Defines the level layout for the game
// "tilemap" represents the platforms by using '=' characters
// "ladderMap" uses 'H' to mark the ladder's position

const tilemap = [
  // Platform tiles ('='), Empty spaces ('.')
  "==================...", // Row 0
  "..===================", // Row 1
  "==================...", // Row 2
  "..===================", // Row 3 
  "===================="   // Row 4
];

const ladderMap = [
  // Ladder positions ('H'), Empty spaces ('.')
  "...................",   // row 0
  "..H...H.......H....",   // Row 1
  "....H.....H........",   // Row 2
  "......H.........H..",   // Row 3
  ".........H....H...."    // Row 4
];

export default { tilemap, ladderMap };
