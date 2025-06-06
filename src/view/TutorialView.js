// ===============================
//      TUTORIAL SCREEN VIEW
// ===============================

import sfx from '../../assets/audio/sfx/sfx.js';
import music from '../../assets/audio/music/music.js';
import MainMenuView from './MainMenuView.js';

// ===============================
//       TUTORIAL SLIDES 
// ===============================

const tutorialSlides = [
  {
    video: "assets/videos/1st_Slide.mp4",
    caption: 'Press the "<img src="assets/images/tutorial_section/arrow-left.png" alt="left_button"/>" to go left and "<img src="assets/images/tutorial_section/arrow-right.png" alt="right_button"/>" to go right.',
  },
  {
    video: "assets/videos/2nd_Slide.mp4",
    caption: 'Press the "<img src="assets/images/tutorial_section/arrow-top.png" alt="up_button"/>" to climb up and "<img src="assets/images/tutorial_section/arrow-bottom.png" alt="down_button"/>" to go down.',
  },
  {
    video: "assets/videos/3rd_Slide.mp4",
    caption: 'Press the "<img src="assets/images/tutorial_section/space_bar_icon.png" alt="spacebar_button">" to jump.',
  },
  {
    video: "assets/videos/4th_Slide.mp4",
    caption: 'Healthy foods "<img src="assets/images/tutorial_section/Banana.png" alt="banana">" are worth 25 points.',
  },
  {
    video: "assets/videos/5th_Slide.mp4",
    caption: 'Avoid junk foods "<img src="assets/images/tutorial_section/French_fries.png" alt="french_fries">", it lowers your score by 50 points!',
  },
  {
    video: "assets/videos/6th_Slide.mp4",
    caption: 'Reach the “Golden Apple <img src="assets/images/tutorial_section/golden_apple.png" alt="golden_apple">" to complete the game!',
  },
];


// ===============================
//       TUTORIAL VIEW CLASS
// ===============================

export default class TutorialView {
  constructor(app) {
    this.app = app;
    this.currentSlide = 0;

    // Stop other music and start tutorial BGM
    music.stopAllMusic();
    music.allScreensMusic.currentTime = 0;
    music.allScreensMusic.play();
  }

  render() {
    const slide = tutorialSlides[this.currentSlide];

    // ========== Render the tutorial screen layout ==========
    this.app.innerHTML = `
      <div class="tutorial-screen">
        <button id="home-button" class="home-button">HOME</button>
        <div class="tutorial-title">Tutorial</div>
        <div class="tutorial-arrows">
          <button id="left-arrow" class="arrow-btn" ${this.currentSlide === 0 ? "disabled" : ""}>&larr;</button>
          <div class="tutorial-box">
            <video autoplay loop muted playsinline>
              <source src="${slide.video}" type="video/mp4">
              Your browser does not support the video tag.
            </video>
            ${slide.caption ? `<div class="tutorial-video-caption">${slide.caption}</div>` : ""}
          </div>
          <button id="right-arrow" class="arrow-btn" ${this.currentSlide === tutorialSlides.length - 1 ? "disabled" : ""}>&rarr;</button>
        </div>
      </div>
    `;

    // ========== HOME BUTTON FUNCTIONALITY ==========
    document.getElementById('home-button').addEventListener('click', () => {
      sfx.sfxButton.currentTime = 0;
      sfx.sfxButton.play();
      music.stopAllMusic();
      music.mainMenuMusic.currentTime = 0;
      music.mainMenuMusic.play();

      // Navigate back to Main Menu
      this.app.innerHTML = '';
      new MainMenuView(this.app).render();
    });

    // ========== ARROW NAVIGATION FUNCTIONALITY ==========
    const leftArrow = document.getElementById('left-arrow');
    const rightArrow = document.getElementById('right-arrow');

    if (leftArrow) {
      leftArrow.addEventListener('click', () => {
        if (this.currentSlide > 0) {
          this.currentSlide--;
          this.render(); // re-render the updated slide
        }
      });
    }

    if (rightArrow) {
      rightArrow.addEventListener('click', () => {
        if (this.currentSlide < tutorialSlides.length - 1) {
          this.currentSlide++;
          this.render(); // re-render the updated slide
        }
      });
    }
  }
}
