// src/assets/audio/sfx/sfx.js

const sfxJump = new Audio('assets/audio/sfx/jumping_sound.mp3');
const sfxButton = new Audio('assets/audio/sfx/sound_effect_button.mp3');
const sfxCollectFoods = new Audio('assets/audio/sfx/collect_foods.mp3');
const sfxGoldenApple = new Audio('assets/audio/sfx/golden_apple_captured.mp3');
const sfxGameEnd = new Audio('assets/audio/sfx/gameplay_end.mp3');

// Set SFX volume (optional, keep it less than 1.0 for user comfort)
[sfxJump, sfxButton, sfxCollectFoods, sfxGoldenApple, sfxGameEnd].forEach(s => s.volume = 0.2);

// Create an object to export
const sfx = {
  sfxJump,
  sfxButton,
  sfxCollectFoods,
  sfxGoldenApple,
  sfxGameEnd,
};

export default sfx;
