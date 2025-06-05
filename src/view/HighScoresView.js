import sfx from '../../assets/audio/sfx/sfx.js';
import music from '../../assets/audio/music/music.js';
import MainMenuView from './MainMenuView.js';

// At the very top of HighScoresView.js, outside the class:
if (performance && performance.navigation && performance.navigation.type === 1) {
    localStorage.removeItem('eatwright_highscores');
}

export default class HighScoresView {
  constructor(app) {
    this.app = app;

    // Get scores from storage, or use dashes if none yet
    const scores = JSON.parse(localStorage.getItem('eatwright_highscores') || '[]');
    // Fill up to 5 with placeholders
    while (scores.length < 5) scores.push(null);

    this.scores = [
      { rank: 1, title: "Golden Apple Ace!", points: scores[0]?.score ?? "—", icon: "gold" },
      { rank: 2, title: "Nutritional Star", points: scores[1]?.score ?? "—", icon: "silver" },
      { rank: 3, title: "Fruit Fanatic", points: scores[2]?.score ?? "—", icon: "bronze" },
      { rank: 4, title: "Future Foodie", points: scores[3]?.score ?? "—" },
      { rank: 5, title: "Healthy Hopeful", points: scores[4]?.score ?? "—" }
    ];
  }

  render() {
    music.stopAllMusic();
    music.allScreensMusic.currentTime = 0;
    music.allScreensMusic.play();
    this.app.innerHTML = `
      <div class="scores-screen">
        <button id="home-button" class="home-button">HOME</button>
        <h2 class="scores-title">SCORES</h2>
        <div class="scores-grid">
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
          <div class="title-column">
            <h3>TITLE</h3>
            ${this.scores.map((entry, index) => `
              <div style="--order: ${index}">${entry.title}</div>
            `).join('')}
          </div>
          <div class="points-column">
            <h3>POINTS</h3>
            ${this.scores.map((entry, index) => `
              <div style="--order: ${index}">${entry.points}</div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    document.getElementById('home-button').addEventListener('click', () => {
      sfx.sfxButton.currentTime = 0;
      sfx.sfxButton.play();
      music.stopAllMusic();                // stop everything!
      music.mainMenuMusic.currentTime = 0; // reset
      music.mainMenuMusic.play();          // play main menu music
      this.app.innerHTML = '';
      new MainMenuView(this.app).render();
    });
  }
}

