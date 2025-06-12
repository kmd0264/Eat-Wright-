// src/assets/audio/music/music.js

// Handles all of the background music for Eat Wright! game screens
const mainMenuMusic = new Audio('assets/audio/music/main_menu_bg.mp3');
const ingameMusic = new Audio('assets/audio/music/ingame_bg.mp3');
const allScreensMusic = new Audio('assets/audio/music/all_screens.mp3');

// I have set the default volume for all music tracks to 0.2 as it is fairly quiet and intented for user comfort (range: 0.0 to 1.0)
[mainMenuMusic, ingameMusic, allScreensMusic].forEach(s => s.volume = 0.2);

// Loop all the music tracks so they play continuously
mainMenuMusic.loop = true;
ingameMusic.loop = true;
allScreensMusic.loop = true;

// Stops all of the music instantly and reset their position
function stopAllMusic() {
  mainMenuMusic.pause();
  mainMenuMusic.currentTime = 0;
  ingameMusic.pause();
  ingameMusic.currentTime = 0;
  allScreensMusic.pause();
  allScreensMusic.currentTime = 0;
}

// Exported music manager
const music = {
  mainMenuMusic,
  ingameMusic,
  allScreensMusic,
  stopAllMusic
};

export default music;