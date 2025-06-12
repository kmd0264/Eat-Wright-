<<<<<<< HEAD
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
    caption: 'Press the "<img src="assets/images/tutorial_section/arrow-top.png" alt="up_button"/>" to climb up and "<img src="assets/images/tutorial_section/arrow-bottom.png" alt="down_button"/>" to go down the ladders.',
  },
  {
    video: "assets/videos/3rd_Slide.mp4",
    caption: 'Press the "<img src="assets/images/tutorial_section/space_bar_icon.png" alt="spacebar_button">" to jump.',
  },



{
foodBox: `
  <div class="tutorial-foods-slide">
    <div class="food-groups-row">
      <!-- Healthy Foods -->
      <div class="food-group">
        <div class="foods-label healthy-label">HEALTHY FOODS</div>
        <div class="foods-list foods-list-grid">
          <div class="food-item"><img src="assets/images/healthy_foods/Apple.png" alt="Apple"/><div class="food-item-label">Apple</div></div>
          <div class="food-item"><img src="assets/images/healthy_foods/Avocado.png" alt="Avocado"/><div class="food-item-label">Avocado</div></div>
          <div class="food-item"><img src="assets/images/healthy_foods/Banana.png" alt="Banana"/><div class="food-item-label">Banana</div></div>
          <div class="food-item"><img src="assets/images/healthy_foods/Eggs.png" alt="Eggs"/><div class="food-item-label">Eggs</div></div>
          <div class="food-item"><img src="assets/images/healthy_foods/Fish.png" alt="Fish"/><div class="food-item-label">Fish</div></div>
          <div class="food-item"><img src="assets/images/healthy_foods/Lemon.png" alt="Lemon"/><div class="food-item-label">Lemon</div></div>
          <div class="food-item"><img src="assets/images/healthy_foods/Orange.png" alt="Orange"/><div class="food-item-label">Orange</div></div>
          <div class="food-item"><img src="assets/images/healthy_foods/Pear.png" alt="Pear"/><div class="food-item-label">Pear</div></div>
          <div class="food-item"><img src="assets/images/healthy_foods/Pineapple.png" alt="Pineapple"/><div class="food-item-label">Pineapple</div></div>
          <div class="food-item"><img src="assets/images/healthy_foods/Strawberry.png" alt="Strawberry"/><div class="food-item-label">Strawberry</div></div>
        </div>
      </div>
      <!-- Junk Foods -->
      <div class="food-group">
        <div class="foods-label junk-label">JUNK FOODS</div>
        <div class="foods-list foods-list-grid">
          <div class="food-item"><img src="assets/images/junk_foods/Burger.png" alt="Burger"/><div class="food-item-label">Burger</div></div>
          <div class="food-item"><img src="assets/images/junk_foods/Cake_red_velvet.png" alt="Cake"/><div class="food-item-label">Cake</div></div>
          <div class="food-item"><img src="assets/images/junk_foods/Chicken_leg.png" alt="Chicken"/><div class="food-item-label">Chicken</div></div>
          <div class="food-item"><img src="assets/images/junk_foods/French_fries.png" alt="Fries"/><div class="food-item-label">Fries</div></div>
          <div class="food-item"><img src="assets/images/junk_foods/Hotdog.png" alt="Hotdog"/><div class="food-item-label">Hotdog</div></div>
          <div class="food-item"><img src="assets/images/junk_foods/Pie_pumpkin.png" alt="Pie"/><div class="food-item-label">Pie</div></div>
          <div class="food-item"><img src="assets/images/junk_foods/Pizza.png" alt="Pizza"/><div class="food-item-label">Pizza</div></div>
          <div class="food-item"><img src="assets/images/junk_foods/Pretzel.png" alt="Pretzel"/><div class="food-item-label">Pretzel</div></div>
          <div class="food-item"><img src="assets/images/junk_foods/Soda.png" alt="Soda"/><div class="food-item-label">Soda</div></div>
          <div class="food-item"><img src="assets/images/junk_foods/Tiramisu.png" alt="Tiramisu"/><div class="food-item-label">Tiramisu</div></div>
        </div>
      </div>
    </div>
  </div>
  `,
  foodCaption: `
    Meet the healthy and junk foods you'll encounter in the game!
  `
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

  let slideContent = "";

  if (slide.video) {
    // For video slides: video + caption in .tutorial-box
    slideContent = `
      <div class="tutorial-box">
        <video autoplay loop muted playsinline>
          <source src="${slide.video}" type="video/mp4">
          Your browser does not support the video tag.
        </video>
        <div class="tutorial-video-caption">${slide.caption || ""}</div>
      </div>
    `;
  } else if (slide.foodBox) {
    // For food slide: food box + caption both in .tutorial-box
    slideContent = `
      <div class="tutorial-box">
        ${slide.foodBox}
        <div class="tutorial-video-caption">${slide.foodCaption || ""}</div>
      </div>
    `;
  }

  // Render the screen
  this.app.innerHTML = `
    <div class="tutorial-screen">
      <button id="home-button" class="home-button">HOME</button>
      <div class="tutorial-title">Tutorial</div>
      <div class="tutorial-arrows">
        <button id="left-arrow" class="arrow-btn" ${this.currentSlide === 0 ? "disabled" : ""}>&larr;</button>
        ${slideContent}
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
=======
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
>>>>>>> f035ecc15a2818ebabc6046d9333b2d4ad01ad14
