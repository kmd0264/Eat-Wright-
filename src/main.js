// ===============================
//          ENTRY POINT
//  Initializes the app when the
//  DOM is fully loaded
// ===============================

// Import the main menu screen view
import MainMenuView from './view/MainMenuView.js';

// Wait until the HTML DOM is fully parsed and loaded
window.addEventListener('DOMContentLoaded', () => {
  // Get the main app container
  const app = document.getElementById('app');

  // Create and render the main menu screen
  new MainMenuView(app).render();
});
