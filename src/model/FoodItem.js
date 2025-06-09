// src/model/FoodItem.js

// Creates and returns a new food item near the doctor character
// It chooses a random food type and setting its initial properties

function spawnFood(doctor, foodTypes) {
  const foodObj = foodTypes[Math.floor(Math.random() * foodTypes.length)];
  return {
    x: doctor.x + doctor.width * 0.88,
    y: doctor.y + doctor.height - 28,
    width: 25,
    height: 25,
    type: foodObj.type,
    img: foodObj.img,
    name: foodObj.name,
    velocityX: 2 + Math.random() * 1,
    falling: false,
    decidedLadder: null,
  };
}

export default { spawnFood };
