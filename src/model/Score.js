// src/model/Score.js

// Manages the player's current score
// Stores the scores in a localStorage

// The key for saving the scores
const KEY = 'eatwright_highscores';  

// This is the player's current score
const Score = {
  current: 0,   
  
  // Reset the current score to zero
  reset() {
    this.current = 0;
  },

  // Add to the score (This one never goes below zero)
  add(amount) {
    this.current += amount;
    if (this.current < 0) this.current = 0;
  },

  // Get the current score value
  get() {
    return this.current;
  },

  // It saves the current score to the localStorage and keeps the top 5 highest scores
  save() {
    let scores = JSON.parse(localStorage.getItem(KEY) || '[]');
    scores.push({ score: this.current, date: Date.now() });
    scores = scores.sort((a, b) => b.score - a.score).slice(0, 5);
    localStorage.setItem(KEY, JSON.stringify(scores));
  },

  // Retrieve the high scores from the localStorage
  getHighScores() {
    return JSON.parse(localStorage.getItem(KEY) || '[]');
  }
};

export default Score;