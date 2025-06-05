import GameView from './GameView.js';
import TutorialView from './TutorialView.js';
import HighScoresView from './HighScoresView.js';
import AboutView from './AboutView.js';
import music from '../../assets/audio/music/music.js';
import sfx from '../../assets/audio/sfx/sfx.js';  // default import is an object

music.mainMenuMusic.play();
music.ingameMusic.pause();
music.ingameMusic.currentTime = 0;

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

    // call this AFTER the HTML is rendered
    this.setupEventListeners();
  }

  setupEventListeners() {
    document.getElementById('play-button').addEventListener('click', () => {
      sfx.sfxButton.currentTime = 0;
      sfx.sfxButton.play();
      this.cleanup();
      new GameView(this.app).render();
    });

    document.getElementById('tutorial-button').addEventListener('click', () => {
      sfx.sfxButton.currentTime = 0;
      sfx.sfxButton.play();
      this.cleanup();
      new TutorialView(this.app).render();
    });

    document.getElementById('scores-button').addEventListener('click', () => {
      sfx.sfxButton.currentTime = 0;
      sfx.sfxButton.play();
      this.cleanup();
      new HighScoresView(this.app).render();
    });

    document.getElementById('about-button').addEventListener('click', () => {
      sfx.sfxButton.currentTime = 0;
      sfx.sfxButton.play();
      this.cleanup();
      new AboutView(this.app).render();
    });
  }

  cleanup() {
    this.app.innerHTML = '';
  }
}
