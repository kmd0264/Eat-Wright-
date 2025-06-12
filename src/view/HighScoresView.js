// ===============================
//         HIGH SCORES VIEW
//   Displays stored score data
// ===============================

import sfx from '../../assets/audio/sfx/sfx.js';
import music from '../../assets/audio/music/music.js';
import MainMenuView from './MainMenuView.js';

// ========== OPTIONAL: AUTO CLEAR HIGH SCORES ON HARD REFRESH ==========
// Clears localStorage only if the page was hard refreshed (F5 or ⟳ button)
if (performance && performance.navigation && performance.navigation.type === 1) {
  localStorage.removeItem('eatwright_highscores');
}

// ===============================
//         MAIN CLASS
// ===============================

export default class HighScoresView {
  constructor(app) {
    this.app = app;

    // ========== GET SCORES FROM STORAGE ==========
    const scores = JSON.parse(localStorage.getItem('eatwright_highscores') || '[]');
    while (scores.length < 5) scores.push(null); // Ensure 5 entries

    // ========== FORMAT SCORE ENTRIES ==========
    this.scores = [
      { rank: 1, title: "Golden Apple Ace!", points: scores[0]?.score ?? "—", icon: "gold" },
      { rank: 2, title: "Nutritional Star", points: scores[1]?.score ?? "—", icon: "silver" },
      { rank: 3, title: "Fruit Fanatic", points: scores[2]?.score ?? "—", icon: "bronze" },
      { rank: 4, title: "Future Foodie", points: scores[3]?.score ?? "—" },
      { rank: 5, title: "Healthy Hopeful", points: scores[4]?.score ?? "—" }
    ];
  }

  // ========== RENDER METHOD ==========
  render() {
    // Music handling
    music.stopAllMusic();
    music.allScreensMusic.currentTime = 0;
    music.allScreensMusic.play();

    // ========== BUILD SCREEN ==========
    this.app.innerHTML = `
      <div class="scores-screen">
        <button id="home-button" class="home-button">HOME</button>
        <h2 class="scores-title">SCORES</h2>
        <div class="scores-grid">
        
          <!-- Rank Column -->
          <div class="rank-column">
            <h3>RANK</h3>
            ${this.scores.map((entry, index) => `
              <div class="rank-entry ${entry.icon ? 'has-icon' : ''}" 
                   data-icon="${entry.icon || ''}"
                   style="--order: ${index}">
                ${entry.icon ? '' : entry.rank}
              </div>
            `).join('')}
          </div>

          <!-- Title Column -->
          <div class="title-column">
            <h3>TITLE</h3>
            ${this.scores.map((entry, index) => `
              <div style="--order: ${index}">${entry.title}</div>
            `).join('')}
          </div>

          <!-- Points Column -->
          <div class="points-column">
            <h3>POINTS</h3>
            ${this.scores.map((entry, index) => `
              <div style="--order: ${index}">${entry.points}</div>
            `).join('')}
          </div>

        </div>
      </div>
    `;

    // ========== HOME BUTTON EVENT ==========
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
