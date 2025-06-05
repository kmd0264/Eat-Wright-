import MainMenuView from './view/MainMenuView.js';

window.addEventListener('DOMContentLoaded', () => {
  const app = document.getElementById('app');
  new MainMenuView(app).render();
});
