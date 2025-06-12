// src/model/constants.js

// This defines the key game constants used for food behavior, tile sizing, and layout spacing

const constants = {
  foodFallSpeed: 50,      // How fast the food falls (pixels per second)
  fallMultiplier: 0.5,    // Multiplier for food fall speed (for slower drops)
  foodCooldown: 3000,     // Time (ms) between the food spawns
  tileSize: 64,           // Width on each of the platform tile (pixels)
  tileHeight: 15,         // Height on each of the platform tile (pixels)
  boxHeight: 30,          // Height of boxes or containers (pixels)
  topPadding: 140,        // Top margin of the game area (pixels)
  bottomPadding: 20       // Bottom margin of the game area (pixels)
};

export default constants;