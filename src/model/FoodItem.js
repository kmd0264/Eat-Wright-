// src/model/FoodItem.js

// Creates and returns a new food item near the doctor character
// It chooses a random food type and setting its initial properties

function spawnFood(doctor, foodTypes) {
  const foodObj = foodTypes[Math.floor(Math.random() * foodTypes.length)];
  return {
    x: doctor.x + doctor.width * 0.88,    // Starts near at the right edge of the doctor
    y: doctor.y + doctor.height - 28,     // Starts just above the bottom of the doctor
    width: 25,                            // Food item width (pixels)
    height: 25,                           // Food item height (pixels)
    type: foodObj.type,                   // Type of food (apple, banana, hotdog)
    img: foodObj.img,                     // Image for this food item
    name: foodObj.name,                   // Name of the food
    velocityX: 0.8 + Math.random() * 1,   // Initial horizontal speed (randomized)
    falling: false,                       // Whether the food is currently falling
    decidedLadder: null,                  // Ladder chosen for sliding
  };
}

export default { spawnFood };