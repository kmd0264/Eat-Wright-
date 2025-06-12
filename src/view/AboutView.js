<<<<<<< HEAD
// ===============================
//           ABOUT VIEW
//     Displays About screen UI
// ===============================

import MainMenuView from './MainMenuView.js';
import sfx from '../../assets/audio/sfx/sfx.js';
import music from '../../assets/audio/music/music.js';

export default class AboutView {
  constructor(app) {
    this.app = app;
  }

  // ===============================
  //         RENDER METHOD
  // ===============================
  render() {
    // === Setup Music ===
    music.stopAllMusic();
    music.allScreensMusic.currentTime = 0;
    music.allScreensMusic.play();

    // === Create the About Screen Layout ===
    this.app.innerHTML = `
      <div class="about-screen">
        <button id="home-button" class="home-button">HOME</button>
        <h2 class="about-title">ABOUT</h2>

        <div class="about-box">
          <div class="about-scroll">

            <!-- === Page 1: Game Purpose === -->
            <div class="about-container">
              <div class="about-image" style="background-image: url('assets/images/about_section/right_side_walking.png');"></div>
              <div class="about-content">
                <p><span class="game-name">Eat Wright!</span> is a fun 2D platformer that teaches healthy eating through gameplay.</p>
                <p>Collect nutritious foods to score points!</p>
              </div>
            </div>

            <!-- === Page 2: Learning Benefits === -->
            <div class="about-container">
              <div class="about-image" style="background-image: url('assets/images/about_section/doctor.png');"></div>
              <div class="about-content">
                <p>Stay energized, avoid junk foods, and earn points by making smart food choices.</p>
                <p>Learn and play together!</p>
              </div>
            </div>

            <!-- === Page 3: Audience === -->
            <div class="about-container">
              <div class="about-image gold-ribbon-img" style="background-image: url('assets/images/about_section/gold_ribbon.png');"></div>
              <div class="about-content">
                <p>Perfect for both kids and adults.</p>
                <p>Designed for all ages to learn while having fun!</p>
              </div>
            </div>

            <!-- === Page 4: Final Message === -->
            <div class="about-container">
              <div class="about-image golden-apple-img" style="background-image: url('assets/images/about_section/golden_apple.png');"></div>
              <div class="about-content">
                <p>Always remember, an apple a day keeps the doctor away!</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    `;

    // ===============================
    //      HOME BUTTON LOGIC
    // ===============================
    document.getElementById('home-button').addEventListener('click', () => {
      sfx.sfxButton.currentTime = 0;  
      sfx.sfxButton.play();
      music.stopAllMusic();                
      music.mainMenuMusic.currentTime = 0; 
      music.mainMenuMusic.play();          
      this.app.innerHTML = '';
      new MainMenuView(this.app).render();
    });
  }
}
=======
// ===============================
//           ABOUT VIEW
//     Displays About screen UI
// ===============================

import MainMenuView from './MainMenuView.js';
import sfx from '../../assets/audio/sfx/sfx.js';
import music from '../../assets/audio/music/music.js';

export default class AboutView {
  constructor(app) {
    this.app = app;
  }

  // ===============================
  //         RENDER METHOD
  // ===============================
  render() {
    // === Setup Music ===
    music.stopAllMusic();
    music.allScreensMusic.currentTime = 0;
    music.allScreensMusic.play();

    // === Create the About Screen Layout ===
    this.app.innerHTML = `
      <div class="about-screen">
        <button id="home-button" class="home-button">HOME</button>
        <h2 class="about-title">ABOUT</h2>

        <div class="about-box">
          <div class="about-scroll">

            <!-- === Page 1: Game Purpose === -->
            <div class="about-container">
              <div class="about-image" style="background-image: url('assets/images/about_section/right_side_walking.png');"></div>
              <div class="about-content">
                <p><span class="game-name">Eat Wright!</span> is a fun 2D platformer that teaches healthy eating through gameplay.</p>
                <p>Collect nutritious foods to score points!</p>
              </div>
            </div>

            <!-- === Page 2: Learning Benefits === -->
            <div class="about-container">
              <div class="about-image" style="background-image: url('assets/images/about_section/doctor.png');"></div>
              <div class="about-content">
                <p>Stay energized, avoid junk foods, and earn points by making smart food choices.</p>
                <p>Learn and play together!</p>
              </div>
            </div>

            <!-- === Page 3: Audience === -->
            <div class="about-container">
              <div class="about-image gold-ribbon-img" style="background-image: url('assets/images/about_section/gold_ribbon.png');"></div>
              <div class="about-content">
                <p>Perfect for both kids and adults.</p>
                <p>Designed for all ages to learn while having fun!</p>
              </div>
            </div>

            <!-- === Page 4: Final Message === -->
            <div class="about-container">
              <div class="about-image golden-apple-img" style="background-image: url('assets/images/about_section/golden_apple.png');"></div>
              <div class="about-content">
                <p>Always remember, an apple a day keeps the doctor away!</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    `;

    // ===============================
    //      HOME BUTTON LOGIC
    // ===============================
    document.getElementById('home-button').addEventListener('click', () => {
      sfx.sfxButton.currentTime = 0;  
      sfx.sfxButton.play();
      music.stopAllMusic();                
      music.mainMenuMusic.currentTime = 0; 
      music.mainMenuMusic.play();          
      this.app.innerHTML = '';
      new MainMenuView(this.app).render();
    });
  }
}
>>>>>>> f035ecc15a2818ebabc6046d9333b2d4ad01ad14
