import sfx from '../../assets/audio/sfx/sfx.js';
import music from '../../assets/audio/music/music.js';
import MainMenuView from './MainMenuView.js';


const tutorialSlides = [
  {
    video: "assets/videos/1st_Slide.mp4",
    caption: 'Use the arrow keys and press <kbd><</kbd> to go left and <kbd>></kbd> to go right.',
  },
  {
    video: "assets/videos/2nd_Slide.mp4",
    caption: 'Press <kbd>↑</kbd> to go up and <kbd>↓</kbd> to go down.',
  },
  {
    video: "assets/videos/3rd_Slide.mp4",
    caption: 'Press ""assets/images/game_section/space_bar_icon.png" alt="Spacebar key" class="spacebar-img"/" to jump!', 
  },
];

export default class TutorialView {
  constructor(app) {
    this.app = app;
    this.currentSlide = 0; // keep track of the current slide

    // Only run this when the tutorial screen is first loaded!
    music.stopAllMusic();
    music.allScreensMusic.currentTime = 0;
    music.allScreensMusic.play();
  }

  render() {
    const slide = tutorialSlides[this.currentSlide];

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
        <button id="right-arrow" class="arrow-btn" ${this.currentSlide === tutorialSlides.length-1 ? "disabled" : ""}>&rarr;</button>
      </div>
    </div>
  `;
 
    document.getElementById('home-button').addEventListener('click', () => {
      sfx.sfxButton.currentTime = 0;
      sfx.sfxButton.play();
      music.stopAllMusic();               
      music.mainMenuMusic.currentTime = 0; 
      music.mainMenuMusic.play();          
      this.app.innerHTML = '';
      new MainMenuView(this.app).render();
    });

    const leftArrow = document.getElementById('left-arrow');
    const rightArrow = document.getElementById('right-arrow');

    if (leftArrow) {
      leftArrow.addEventListener('click', () => {
        if (this.currentSlide > 0) {
          this.currentSlide--;
          this.render();
        }
      });
    }
    if (rightArrow) {
      rightArrow.addEventListener('click', () => {
        if (this.currentSlide < tutorialSlides.length - 1) {
          this.currentSlide++;
          this.render();
        }
      });
    }
  }
}
