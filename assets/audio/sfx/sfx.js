// src/assets/audio/sfx/sfx.js

//  Handles all one-shot sound effects for Eat Wright! game actions and feedback
const sfxJump = new Audio('assets/audio/sfx/jumping_sound.mp3');
const sfxButton = new Audio('assets/audio/sfx/sound_effect_button.mp3');
const sfxCollectFoods = new Audio('assets/audio/sfx/collect_foods.mp3');
const sfxGoldenApple = new Audio('assets/audio/sfx/golden_apple_captured.mp3');
const sfxGameEnd = new Audio('assets/audio/sfx/gameplay_end.mp3');

// I have set the default volume for all SFX 0.2 as it is gentle to hear and avoids being too loud
[sfxJump, sfxButton, sfxCollectFoods, sfxGoldenApple, sfxGameEnd].forEach(s => s.volume = 0.2);

// Export as a single object for easy access in the game code
const sfx = {
  sfxJump,
  sfxButton,
  sfxCollectFoods,
  sfxGoldenApple,
  sfxGameEnd,
};

export default sfx;