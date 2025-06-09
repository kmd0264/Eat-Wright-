// src/model/foodTypes.js

// List of the available food types in the game
// Each food item has a name, image source, and a type (healthy or junk)

const foodTypes = [
  // Healthy food items
  { name: 'Apple',       imgSrc: 'assets/images/healthy_foods/Apple.png',        type: 'healthy' },   
  { name: 'Avocado',     imgSrc: 'assets/images/healthy_foods/Avocado.png',      type: 'healthy' },
  { name: 'Banana',      imgSrc: 'assets/images/healthy_foods/Banana.png',       type: 'healthy' },
  { name: 'Eggs',        imgSrc: 'assets/images/healthy_foods/Eggs.png',         type: 'healthy' },
  { name: 'Fish',        imgSrc: 'assets/images/healthy_foods/Fish.png',         type: 'healthy' },
  { name: 'Lemon',       imgSrc: 'assets/images/healthy_foods/Lemon.png',        type: 'healthy' },
  { name: 'Orange',      imgSrc: 'assets/images/healthy_foods/Orange.png',       type: 'healthy' },
  { name: 'Pear',        imgSrc: 'assets/images/healthy_foods/Pear.png',         type: 'healthy' },
  { name: 'Pineapple',   imgSrc: 'assets/images/healthy_foods/Pineapple.png',    type: 'healthy' },
  { name: 'Strawberry',  imgSrc: 'assets/images/healthy_foods/Strawberry.png',   type: 'healthy' },

  // Junk food items
  { name: 'Burger',      imgSrc: 'assets/images/junk_foods/Burger.png',          type: 'junk' },      
  { name: 'Cake',        imgSrc: 'assets/images/junk_foods/Cake_red_velvet.png', type: 'junk' },
  { name: 'Chicken',     imgSrc: 'assets/images/junk_foods/Chicken_leg.png',     type: 'junk' },
  { name: 'Fries',       imgSrc: 'assets/images/junk_foods/French_fries.png',    type: 'junk' },
  { name: 'Hotdog',      imgSrc: 'assets/images/junk_foods/Hotdog.png',          type: 'junk' },
  { name: 'Pie',         imgSrc: 'assets/images/junk_foods/Pie_pumpkin.png',     type: 'junk' },
  { name: 'Pretzel',     imgSrc: 'assets/images/junk_foods/Pretzel.png',         type: 'junk' },
  { name: 'Pizza',       imgSrc: 'assets/images/junk_foods/Pizza.png',           type: 'junk' },
  { name: 'Soda',        imgSrc: 'assets/images/junk_foods/Soda.png',            type: 'junk' },
  { name: 'Tiramisu',    imgSrc: 'assets/images/junk_foods/Tiramisu.png',        type: 'junk' },
];

// Preload the food images so they are ready when drawn in the game
foodTypes.forEach(f => {
  f.img = new Image();
  f.img.src = f.imgSrc;
});

export default foodTypes;
