<<<<<<< HEAD
// ===============================
//        MAIN MENU VIEW
//  Loads main screen with nav
//  and connects button logic
// ===============================

import GameView from './GameView.js';
import TutorialView from './TutorialView.js';
import HighScoresView from './HighScoresView.js';
import AboutView from './AboutView.js';
import music from '../../assets/audio/music/music.js';
import sfx from '../../assets/audio/sfx/sfx.js'; 

// ===============================
//      MAIN MENU MUSIC SETUP
// ===============================

music.mainMenuMusic.play();
music.ingameMusic.pause();
music.ingameMusic.currentTime = 0;

// ===============================
//       MAIN MENU VIEW CLASS
// ===============================

export default class MainMenuView {
  constructor(app) {
    this.app = app;
  }


  
render() {
  this.app.innerHTML = `
    <main class="main-menu">
      <nav class="menu-sidebar">
        <button id="play-button" class="menu-button">
          <img src="assets/images/main_menu_section/play_icon.png" alt="Play">
          Play
        </button>
        <button id="tutorial-button" class="menu-button">
          <img src="assets/images/main_menu_section/tutorial_icon.png" alt="Tutorial">
          Tutorial
        </button>
        <button id="scores-button" class="menu-button">
          <img src="assets/images/main_menu_section/high-score_icon.png" alt="Scores">
          Scores
        </button>
        <button id="about-button" class="menu-button">
          <img src="assets/images/main_menu_section/about_icon.png" alt="About">
          About
        </button>
      </nav>
      <div class="menu-main">
        <h1 class="game-title">Eat Wright!</h1>
      </div>
    </main>
  `;

  // --- SOUND BUTTON + SLIDER UI ---
  let existingSoundControl = document.getElementById('sound-control-container');
  if (existingSoundControl) existingSoundControl.remove();

  const soundControl = document.createElement('div');
  soundControl.id = 'sound-control-container';
  soundControl.className = 'sound-control-container';

  soundControl.innerHTML = `
    <button id="sound-icon-btn" class="sound-icon-btn">
      <img src="assets/images/main_menu_section/sound_icon.png" alt="Sound" class="sound-icon-img" id="sound-icon-img">
    </button>
    <div id="sound-slider-panel" class="sound-slider-panel">
      <input type="range" id="volume-slider" class="volume-slider" min="0" max="1" step="0.01" value="${music.ingameMusic.volume || 0.1}">
    </div>
  `;
  document.body.appendChild(soundControl);

  // --- SOUND BUTTON/SLIDER FUNCTIONALITY ---
  const soundBtn = document.getElementById('sound-icon-btn');
  const sliderPanel = document.getElementById('sound-slider-panel');
  const volumeSlider = document.getElementById('volume-slider');
  const soundIconImg = document.getElementById('sound-icon-img');

  const muteIconPath = "assets/images/main_menu_section/sound_icon_mute.png";
  const soundIconPath = "assets/images/main_menu_section/sound_icon.png";

  let sliderTimeout;
  let previousVolume = volumeSlider.value > 0 ? volumeSlider.value : 0.5;


  // Updates the icon when volume is changed
  function updateSoundIcon(volume) {
    if (parseFloat(volume) <= 0) {
      soundIconImg.src = muteIconPath;
      soundIconImg.alt = "Muted";
    } else {
      soundIconImg.src = soundIconPath;
      soundIconImg.alt = "Sound";
    }
  }

  // Show/hide slider
  function showSlider() {
    clearTimeout(sliderTimeout);
    sliderPanel.style.display = 'block';
    sliderPanel.style.opacity = '1';
  }
  function hideSlider() {
    sliderPanel.style.opacity = '0';
    sliderTimeout = setTimeout(() => { sliderPanel.style.display = 'none'; }, 200);
  }

    // Show the slider when mouse enters either icon or panel
  soundBtn.addEventListener('mouseenter', showSlider);
  sliderPanel.addEventListener('mouseenter', showSlider);

  // Hide the slider when mouse leaves BOTH icon and panel
  soundBtn.addEventListener('mouseleave', () => {
    sliderTimeout = setTimeout(hideSlider, 200);
  });
  sliderPanel.addEventListener('mouseleave', () => {
    sliderTimeout = setTimeout(hideSlider, 200);
  });

  soundBtn.addEventListener('click', (e) => {
    if (sliderPanel.style.display === 'block') {
      // --- Mute/unmute toggle ---
      if (parseFloat(volumeSlider.value) > 0) {
        previousVolume = volumeSlider.value; // Save last non-zero volume
        volumeSlider.value = 0;
      } else {
        volumeSlider.value = previousVolume || 0.5; // Restore previous or default to 0.5
      }
      volumeSlider.dispatchEvent(new Event('input')); // Sync everything!
      e.stopPropagation();
    } else {
      showSlider();
      e.stopPropagation();
    }
  });

  volumeSlider.addEventListener('input', (e) => {
    const volume = parseFloat(e.target.value);
    Object.values(music).forEach(m => {
      if (m instanceof Audio) m.volume = volume;
    });
    Object.values(sfx).forEach(s => {
      if (s instanceof Audio) s.volume = volume;
    });
    updateSoundIcon(volume);
  });

  // Set icon correctly on load:
  updateSoundIcon(volumeSlider.value);

  // Setup interactions after rendering
  this.setupEventListeners();
}



  // ========== EVENT LISTENERS ==========
  setupEventListeners() {
    // --- Play Button ---
    document.getElementById('play-button').addEventListener('click', () => {
      sfx.sfxButton.currentTime = 0;
      sfx.sfxButton.play();
      this.cleanup();
      this.app.innerHTML = '<canvas id="gameCanvas"></canvas>'; 
      new GameView(this.app).render();
    });

    // --- Tutorial Button ---
    document.getElementById('tutorial-button').addEventListener('click', () => {
      sfx.sfxButton.currentTime = 0;
      sfx.sfxButton.play();
      this.cleanup();
      new TutorialView(this.app).render();
    });

    // --- Scores Button ---
    document.getElementById('scores-button').addEventListener('click', () => {
      sfx.sfxButton.currentTime = 0;
      sfx.sfxButton.play();
      this.cleanup();
      new HighScoresView(this.app).render();
    });

    // --- About Button ---
    document.getElementById('about-button').addEventListener('click', () => {
      sfx.sfxButton.currentTime = 0;
      sfx.sfxButton.play();
      this.cleanup();
      new AboutView(this.app).render();
    });
  }

  // ========== CLEAR SCREEN ==========
cleanup() {
  this.app.innerHTML = '';
  // Remove sound control if present
  const sc = document.getElementById('sound-control-container');
  if (sc) sc.remove();
}}
=======
// ===============================
//        MAIN MENU VIEW
//  Loads main screen with nav
//  and connects button logic
// ===============================

import GameView from './GameView.js';
import TutorialView from './TutorialView.js';
import HighScoresView from './HighScoresView.js';
import AboutView from './AboutView.js';
import music from '../../assets/audio/music/music.js';
import sfx from '../../assets/audio/sfx/sfx.js';  // default import is an object

// ===============================
//      MAIN MENU MUSIC SETUP
// ===============================

music.mainMenuMusic.play();
music.ingameMusic.pause();
music.ingameMusic.currentTime = 0;

// ===============================
//       MAIN MENU VIEW CLASS
// ===============================

export default class MainMenuView {
  constructor(app) {
    this.app = app;
  }

  // ========== RENDER HTML ==========
  render() {
    this.app.innerHTML = `
      <main class="main-menu">
        <nav class="menu-sidebar">
          <button id="play-button" class="menu-button">
            <img src="assets/images/main_menu_section/play_icon.png" alt="Play">
            Play
          </button>
          <button id="tutorial-button" class="menu-button">
            <img src="assets/images/main_menu_section/tutorial_icon.png" alt="Tutorial">
            Tutorial
          </button>
          <button id="scores-button" class="menu-button">
            <img src="assets/images/main_menu_section/high-score_icon.png" alt="Scores">
            Scores
          </button>
          <button id="about-button" class="menu-button">
            <img src="assets/images/main_menu_section/about_icon.png" alt="About">
            About
          </button>
        </nav>
        <div class="menu-main">
          <h1 class="game-title">Eat Wright!</h1>
        </div>
      </main>
    `;

    // Setup interactions after rendering
    this.setupEventListeners();
  }

  // ========== EVENT LISTENERS ==========
  setupEventListeners() {
    // --- Play Button ---
    document.getElementById('play-button').addEventListener('click', () => {
      sfx.sfxButton.currentTime = 0;
      sfx.sfxButton.play();
      this.cleanup();
      new GameView(this.app).render();
    });

    // --- Tutorial Button ---
    document.getElementById('tutorial-button').addEventListener('click', () => {
      sfx.sfxButton.currentTime = 0;
      sfx.sfxButton.play();
      this.cleanup();
      new TutorialView(this.app).render();
    });

    // --- Scores Button ---
    document.getElementById('scores-button').addEventListener('click', () => {
      sfx.sfxButton.currentTime = 0;
      sfx.sfxButton.play();
      this.cleanup();
      new HighScoresView(this.app).render();
    });

    // --- About Button ---
    document.getElementById('about-button').addEventListener('click', () => {
      sfx.sfxButton.currentTime = 0;
      sfx.sfxButton.play();
      this.cleanup();
      new AboutView(this.app).render();
    });
  }

  // ========== CLEAR SCREEN ==========
  cleanup() {
    this.app.innerHTML = '';
  }
}
>>>>>>> f035ecc15a2818ebabc6046d9333b2d4ad01ad14
