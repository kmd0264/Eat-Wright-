class Game {
  constructor() {
    this.view = new GameView();
    this.player = new Player(this.view);  // Pass GameView to Player
    this.setupInput();
    this.loop();
  }

  setupInput() {
    // Jump on spacebar
    document.addEventListener("keydown", (e) => {
      if (e.code === "Space") this.player.jump();
    });
  }

  loop() {
    this.player.update();
    this.view.render(this.player);
    requestAnimationFrame(() => this.loop());
  }
}
