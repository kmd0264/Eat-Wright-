// src/main.js

//  This is the app's entry point       
//  Initializes the app when the DOM is fully loaded

// Import the main menu screen view
import MainMenuView from './view/MainMenuView.js';

// Wait until the HTML DOM is fully rendered and loaded
window.addEventListener('DOMContentLoaded', () => {
  // Get the main app container
  const app = document.getElementById('app');

  // Create and render the main menu screen
  new MainMenuView(app).render();

  // Also trigger site scaling now (first load)
  scaleSite();
});

// Responsive scaling for the whole site
function scaleSite() {
  const wrapper = document.getElementById('app-scale-wrapper');
  if (!wrapper) return;
  const baseWidth = 1280;  // set to your intended design width
  const baseHeight = 720;  // set to your intended design height
  const scaleX = window.innerWidth / baseWidth;
  const scaleY = window.innerHeight / baseHeight;
  const scale = Math.min(scaleX, scaleY, 0.8); // or use 0.75 for 75%
  wrapper.style.transform = `scale(${scale})`;
  wrapper.style.transformOrigin = "top left";
  wrapper.style.width = (100 / scale) + "vw";
  wrapper.style.height = (100 / scale) + "vh";
}

window.addEventListener('resize', scaleSite);
