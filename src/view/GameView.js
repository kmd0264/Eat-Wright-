/* ===============================  
          IMPORT STATEMENTS  
================================== */  
import MainMenuView from './MainMenuView.js';         // Main menu screen handler
import HighScoresView from './HighScoresView.js';     // Scores screen handler
import FoodItem from '../model/FoodItem.js';
import foodTypes from '../model/foodTypes.js';         // Definitions of food items
import sfx from '../../assets/audio/sfx/sfx.js';       // Sound effects
import music from '../../assets/audio/music/music.js'; // Background music
import images from '../../assets/images/images.js';    // Preloaded image references
import Score from '../model/Score.js'
import constants from '../model/constants.js';
import levelData from '../model/levelData.js';

/* ===============================  
          INITIAL SETTINGS  
================================== */  

music.ingameMusic.volume = 0.1;  // Set in-game music volume

// Global toggles for showing/hiding overlays
let funFactToggle = false;
let resultScreenToggle = false;


/* ===============================  
      OVERLAY SCREEN FUNCTIONS  
================================== */  

// ===== RESULT SCREEN OVERLAY (e.g., after game ends) =====
function showOverlayScreen({
  app,
  mainText,
  subText,
  imgSrc,
  imgAlt = '',
  imgExtraClass = "",
  homeAction,
  scoresAction,
  imgClass = ''
}) {

    // REMOVE sound control UI when overlay appears
  const soundControl = document.getElementById('sound-control-container');
  if (soundControl) soundControl.remove();

  app.innerHTML = `
    <div class="game-screen">
      <button id="home-button" class="home-button">HOME</button>
      <button id="scores-button" class="results_scores_button">SCORES</button>
      <div class="result-overlay">
        <p class="result-text"><span class="highlight-yellow-result">${mainText}</span></p>
        <img src="${imgSrc}" alt="${imgAlt}" class="game-result-img ${imgClass}">        
        <p class="end-text" style="font-size:2.5rem;"></p>
        <p class="end-text">${subText}</p>
      </div>
    </div>
  `;

  // HOME button returns to main menu
  document.getElementById('home-button').addEventListener('click', () => {
    sfx.sfxButton.currentTime = 0; 
    sfx.sfxButton.play();
    music.stopAllMusic();              
    music.mainMenuMusic.currentTime = 0;
    music.mainMenuMusic.play();        
    app.innerHTML = '';
    new MainMenuView(app).render();
  });

  // SCORES button opens high score screen
  document.getElementById('scores-button').addEventListener('click', () => {
    sfx.sfxGameEnd.pause();
    sfx.sfxGameEnd.currentTime = 0;

    sfx.sfxButton.currentTime = 0;     
    sfx.sfxButton.play();
    scoresAction(); // Calls whatever logic is passed in
  });
}


// ===== FUN FACT OVERLAY (pre/post gameplay toggle) =====
function showFunFactOverlay(app) {
  music.stopAllMusic();
  music.allScreensMusic.currentTime = 0;
  music.allScreensMusic.play();

  funFactToggle = !funFactToggle;

  let funfactHTML;

  if (funFactToggle) {
    funfactHTML = `
      <button id="home-button" class="home-button">HOME</button>
      <div class="funfact-overlay">
        <p class="funfact-text"><span class="highlight-yellow">Fun Fact:</span> Bananas are nature's energy bar!</p>
        <img src="assets/images/game_section/dancing-banana-happy.gif" alt="Banana Dancing" class="funfact-img"/>
        <p class="start-text">
          <span class="inline-group">
            <span>Ready? Press "</span>
            <img src="assets/images/game_section/space_bar_icon.png" alt="Spacebar key" class="spacebar-img"/>
            <span>" to start!</span>
          </span>
        </p>
      </div>
    `;
  } else {
    funfactHTML = `
      <button id="home-button" class="home-button">HOME</button>
      <div class="funfact-overlay">
        <p class="funfact-text"><span class="highlight-yellow">Fun Fact:</span> Broccoli is both a vegetable and a flower!</p>
        <img src="assets/images/game_section/banana_broccoli_working_out.gif" alt="Banana and Broccoli" class="funfact-img"/>
        <p class="start-text">
          <span class="inline-group">
            <span>Press "</span>
            <img src="assets/images/game_section/space_bar_icon.png" alt="Spacebar key" class="spacebar-img"/>
            <span>" to play again!</span>
          </span>
        </p>
      </div>
    `;
  }

  app.innerHTML = `
    <div class="game-screen">
      ${funfactHTML}
      <div class="game-area">
        <canvas id="gameCanvas"></canvas>
      </div>
    </div>
  `;

  // HOME button logic in Fun Fact overlay
  document.getElementById('home-button').addEventListener('click', () => {
    sfx.sfxGameEnd.pause();
    sfx.sfxGameEnd.currentTime = 0;

    sfx.sfxButton.currentTime = 0; 
    sfx.sfxButton.play();
    music.stopAllMusic();              
    music.mainMenuMusic.currentTime = 0;
    music.mainMenuMusic.play();        
    app.innerHTML = '';
    new MainMenuView(app).render();
  });
}



/* ===============================  
          GAME VIEW CLASS  
================================== */  

export default class GameView {
  constructor(app) {
    this.app = app;

    // Bind the keydown listener to keep "this" context
    this._startListener = this._startListener.bind(this);
  }

  // ===== Entry point to show fun fact and listen for spacebar =====
  render() {
    showFunFactOverlay(this.app);
    document.addEventListener('keydown', this._startListener);
  }

  // ===== When SPACE is pressed, start the game and hide overlays =====
  _startListener(e) {
    if (e.code === 'Space') {
      music.stopAllMusic();
      music.ingameMusic.currentTime = 0;
      music.ingameMusic.play();

      const overlay = document.querySelector('.funfact-overlay');
      const homeBtn = document.getElementById('home-button');

      if (overlay) overlay.style.display = 'none';
      if (homeBtn) homeBtn.style.display = 'none';

      this.startGame(); // Begin game loop/setup
      document.removeEventListener('keydown', this._startListener); // Prevent double triggers
    }
  }

  // ===== Core game setup begins here =====
  startGame() {
    // Ensure music is set correctly
    music.mainMenuMusic.pause();
    music.mainMenuMusic.currentTime = 0;
    music.ingameMusic.currentTime = 0;
    music.ingameMusic.play();
    Score.reset();

    // === Canvas setup ===
    const canvas = document.getElementById('gameCanvas');
    canvas.width = 1280;
    canvas.height = 720;
    canvas.style.width = '100%';
    canvas.style.height = 'auto';

    // === SOUND CONTROL UI (copy & paste this block) ===
    let existingSoundControl = document.getElementById('sound-control-container');
    if (existingSoundControl) existingSoundControl.remove();

    const soundControl = document.createElement('div');
    soundControl.id = 'sound-control-container';
    soundControl.className = 'sound-control-container';

    soundControl.innerHTML = `
      <button id="sound-icon-btn" class="sound-icon-btn">
        <img src="assets/images/main_menu_section/sound_icon.png" alt="Sound" class="sound-icon-img" id="sound-icon-img">
      </button>
      <div id="sound-slider-panel" class="sound-slider-panel">
        <input type="range" id="volume-slider" class="volume-slider" min="0" max="1" step="0.01" value="${music.ingameMusic.volume || 0.1}">
      </div>
    `;
    document.body.appendChild(soundControl);

    const soundBtn = document.getElementById('sound-icon-btn');
    const sliderPanel = document.getElementById('sound-slider-panel');
    const volumeSlider = document.getElementById('volume-slider');
    const soundIconImg = document.getElementById('sound-icon-img');

    const muteIconPath = "assets/images/main_menu_section/sound_icon_mute.png";
    const soundIconPath = "assets/images/main_menu_section/sound_icon.png";

    let sliderTimeout;
    let previousVolume = volumeSlider.value > 0 ? volumeSlider.value : 0.5;

    function updateSoundIcon(volume) {
      if (parseFloat(volume) <= 0) {
        soundIconImg.src = muteIconPath;
        soundIconImg.alt = "Muted";
      } else {
        soundIconImg.src = soundIconPath;
        soundIconImg.alt = "Sound";
      }
    }
    function showSlider() {
      clearTimeout(sliderTimeout);
      sliderPanel.style.display = 'block';
      sliderPanel.style.opacity = '1';
    }
    function hideSlider() {
      sliderPanel.style.opacity = '0';
      sliderTimeout = setTimeout(() => { sliderPanel.style.display = 'none'; }, 200);
    }

    soundBtn.addEventListener('mouseenter', showSlider);
    sliderPanel.addEventListener('mouseenter', showSlider);
    soundBtn.addEventListener('mouseleave', () => {
      sliderTimeout = setTimeout(hideSlider, 200);
    });
    sliderPanel.addEventListener('mouseleave', () => {
      sliderTimeout = setTimeout(hideSlider, 200);
    });
    soundBtn.addEventListener('click', (e) => {
      if (sliderPanel.style.display === 'block') {
        // Mute/unmute toggle
        if (parseFloat(volumeSlider.value) > 0) {
          previousVolume = volumeSlider.value; // Save last non-zero volume
          volumeSlider.value = 0;
        } else {
          volumeSlider.value = previousVolume || 0.5;
        }
        volumeSlider.dispatchEvent(new Event('input')); // Sync everything!
        e.stopPropagation();
      } else {
        showSlider();
        e.stopPropagation();
      }
    });
    volumeSlider.addEventListener('input', (e) => {
      const volume = parseFloat(e.target.value);
      Object.values(music).forEach(m => {
        if (m instanceof Audio) m.volume = volume;
      });
      Object.values(sfx).forEach(s => {
        if (s instanceof Audio) s.volume = volume;
      });
      updateSoundIcon(volume);
    });

    // Set icon correctly on load:
    updateSoundIcon(volumeSlider.value);


    const usableHeight = canvas.height - constants.topPadding - constants.bottomPadding;
    const app = this.app;
    const keys = { left: false, right: false, down: false };

    if (!canvas) return console.error('Canvas #gameCanvas not found');

    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    
    
    // === Platform calculation (slopes etc.) ===
    const numRows = levelData.tilemap.length;
    const verticalSpacing = usableHeight / (numRows - 1);
    const slopeStep = 1;
    const platformTiles = [];

    levelData.tilemap.forEach((row, rowIndex) => {
      const baseY = constants.topPadding + rowIndex * verticalSpacing;
      let slope = rowIndex % 2 === 0 ? slopeStep : -slopeStep;

      if (rowIndex === levelData.tilemap.length - 1) slope = 0;

      for (let col = 0; col < row.length; col++) {
        if (row[col] === '=') {
          platformTiles.push({
            row: rowIndex,
            x: col * constants.tileSize,
            y: baseY + col * slope
          });
        }
      }
    });



/* ===============================  
          LADDER TILE SETUP  
================================== */  

const ladderTiles = [];

levelData.ladderMap.forEach((row, rowIndex) => {
  const baseY = (rowIndex + 1) * verticalSpacing;

  for (let col = 0; col < row.length; col++) {
    if (row[col] === 'H') {
      const width = constants.tileSize * 0.5;
      let height = constants.tileSize * 2.3;

      // === Individual ladder height adjustments (hand-tuned) ===
      if (rowIndex === 1 && col === 2)  height = constants.tileSize * 0.7;
      if (rowIndex === 1 && col === 6)  height = constants.tileSize * 2.25;
      if (rowIndex === 1 && col === 14) height = constants.tileSize * 2;
      if (rowIndex === 2 && col === 4)  height = constants.tileSize * 0.7;
      if (rowIndex === 2 && col === 10) height = constants.tileSize * 2.75;
      if (rowIndex === 3 && col === 6)  height = constants.tileSize * 2.3;
      if (rowIndex === 3 && col === 16) height = constants.tileSize * 0.7;
      if (rowIndex === 4 && col === 9)  height = constants.tileSize * 0.7;
      if (rowIndex === 4 && col === 14) height = constants.tileSize * 2.45;

      // === Calculate x/y positions and manually tweak for alignment ===
      let x = col * constants.tileSize + (constants.tileSize - width) / 2;
      let y = baseY - height;

      if (rowIndex === 1 && col === 2)   { x += 10;   y += -95; }
      if (rowIndex === 1 && col === 6)   { x += 100;  y += 9; }
      if (rowIndex === 1 && col === 14)  { x -= 10;   y += 1; }
      if (rowIndex === 2 && col === 10)  { x += 5;    y += 25; }
      if (rowIndex === 2 && col === 4)   { x += 5;    y += -100; }
      if (rowIndex === 3 && col === 6)   { x += 10;   y += 10; }
      if (rowIndex === 3 && col === 16)  { x += 10;   y += -80; }
      if (rowIndex === 4 && col === 9)   { x += 10;   y += -105; }
      if (rowIndex === 4 && col === 14)  { x += 10;   y += 1; }

      // === Push to ladder tile list ===
      ladderTiles.push({
        row: rowIndex,
        xStart: x,
        xEnd: x + width,
        yStart: y,
        width,
        height
      });
    }
  }
});


/* ===============================  
          PLAYER & OBJECT SETUP  
================================== */

// === Calculate row boundaries for collision or movement limits ===
const rowBounds = {};
platformTiles.forEach(t => {
  if (!rowBounds[t.row]) {
    rowBounds[t.row] = { min: t.x, max: t.x + constants.tileSize };
  } else {
    rowBounds[t.row].min = Math.min(rowBounds[t.row].min, t.x);
    rowBounds[t.row].max = Math.max(rowBounds[t.row].max, t.x + constants.tileSize);
  }
});

// === Trash Can Constants ===
const TRASH_CAN_WIDTH = 33;
const TRASH_CAN_HEIGHT = 48;
const TRASH_CAN_SIZE = 47;  // Used for collision/visuals
const TRASH_ROW = 4;

// === Trash Can Positioning ===
const trashPlatformTiles = platformTiles.filter(t => t.row === TRASH_ROW);
const trashCanX = canvas.width - TRASH_CAN_WIDTH;
const trashCanY = trashPlatformTiles[0].y - TRASH_CAN_HEIGHT;

// === Player Start Tile (bottom row platform) ===
const bottomRow = levelData.tilemap.length - 1;
const startTile = platformTiles.find(t => t.row === bottomRow);

// === Player Constants ===
const PLAYER_WIDTH = 80;
const PLAYER_HEIGHT = 60;

// === Initialize Player Object ===
const player = {
  x: startTile.x + 30,
  y: startTile.y - PLAYER_HEIGHT,
  width: PLAYER_WIDTH,
  height: PLAYER_HEIGHT,
  speed: 1.5,
  velocityY: 0,
  isClimbing: false,
  isDescending: false,
  isDroppingThrough: false,
  climbLadder: null,
  currentRow: bottomRow,
  isOnLadder: false,
  isClimbingLadder: false,
  facing: 'right',
  isWalking: false,
  isJumping: false,
  walkFrame: 0,
  walkAnimTimer: 0,
};

/* ===============================  
         MOVEMENT & COLLISION  
================================== */

// === Physics Constants for Movement ===
const jumpGravity = 0.1;       // Upward gravity when jumping
const fallGravity = 0.1;       // Downward gravity when falling
const climbStep = 5;           // Pixels moved per climb step

// === Top Platform Fallback for Player Reference ===
const topRowTile = platformTiles.find(t => t.row === 0) || platformTiles[0];

// === Collision Detection Margins ===
const PLAYER_COLLISION_MARGIN = 8;  // Buffer around player for more forgiving collision
const FOOD_COLLISION_MARGIN = 8;    // Margin for detecting food pickup
const TRASH_COLLISION_MARGIN = 8;   // Margin for trash can collision
const DOCTOR_COLLISION_MARGIN = 8;  // Margin for NPC collision (e.g., doctor)
const APPLE_COLLISION_MARGIN = 8;   // Margin for golden apple win condition



/* ===============================  
         DOCTOR CHARACTER  
================================== */

// === Dimensions ===
const DOCTOR_WIDTH = 60;  
const DOCTOR_HEIGHT = 80; 

// === Position the doctor on the top platform row ===
const doctor = {
  x: topRowTile.x + 30,
  y: topRowTile.y + constants.tileHeight - DOCTOR_HEIGHT,
  width: DOCTOR_WIDTH,
  height: DOCTOR_HEIGHT
};

// === Get the specific platform tile the doctor is standing on ===
const doctorTile = platformTiles.find(
  t => t.row === 0 && doctor.x >= t.x && doctor.x < t.x + constants.tileSize
);


/* ===============================  
         GOLDEN APPLE  
================================== */

// === Dimensions ===
const GOLDEN_APPLE_WIDTH = 30;
const GOLDEN_APPLE_HEIGHT = 30;

// === Calculate position for the golden apple (about 1.5 tiles right of the doctor) ===
const goldenAppleX = doctorTile.x + constants.tileSize * 1.5 + (constants.tileSize - GOLDEN_APPLE_WIDTH) / 2;
const goldenAppleY = doctor.y - 10;

// === Golden Apple Object ===
const goldenApple = {
  x: doctor.x + (DOCTOR_WIDTH - GOLDEN_APPLE_WIDTH) / 2,   // horizontally centered on doctor
  y: doctor.y - GOLDEN_APPLE_HEIGHT - 8,                   // positioned just above doctor
  width: GOLDEN_APPLE_WIDTH,
  height: GOLDEN_APPLE_HEIGHT,
  collected: false
};


/* ===============================  
           FOOD SYSTEM  
================================== */

// === Food Tracking === //
const foodItems = [];
let lastFoodTime = 0;
let doctorIsThrowing = false;

// Draw all food items (healthy and junk foods)
foodItems.forEach((food) => {
  // If the food has a loaded image, draw it as an image
  if (food.img && food.img.complete && food.img.naturalWidth !== 0) {
    ctx.drawImage(food.img, food.x, food.y, food.width, food.height);
  } else {
    // Otherwise, fallback to a colored box (green = healthy, yellow = junk)
    ctx.fillStyle = food.type === "healthy" ? "green" : "yellow";
    ctx.fillRect(food.x, food.y, food.width, food.height);
  }
});


/* ===============================  
       PLAYER LADDER CONTROLS  
================================== */

// === Helper: Find platform on current row where player stands ===
function findTile(row) {
  return platformTiles.find(t =>
    t.row === row &&
    player.x + player.width > t.x &&
    player.x < t.x + constants.tileSize
  );
}

// === Helper: Find ladder the player is currently on ===
function findLadder() {
  const cx = player.x + player.width / 2;
  return ladderTiles.find(l =>
    l.row === player.currentRow &&
    cx >= l.xStart && cx <= l.xEnd &&
    player.y + player.height > l.yStart &&
    player.y < l.yStart + l.height
  );
}

// === Ladder Descend Margin Constants ===
const descendMarginX = 30; 
const descendMarginY = 24;

// === Key Handling for Ladder Movement ===
document.addEventListener('keydown', e => {
  if (e.code === 'ArrowLeft') keys.left = true;
  if (e.code === 'ArrowRight') keys.right = true;
  if (e.code === 'ArrowDown') keys.down = true;
  if (e.code === 'ArrowUp') keys.up = true;

  const cx = player.x + player.width / 2;

  // 🔼 Climb up from top of ladder to platform above
  if (
    e.code === 'ArrowUp' &&
    !player.isClimbing &&
    !player.isDescending &&
    player.velocityY === 0
  ) {
    const ladder = ladderTiles.find(l =>
      l.row === player.currentRow &&
      cx >= l.xStart - descendMarginX && cx <= l.xEnd + descendMarginX &&
      (player.y + player.height) >= l.yStart - descendMarginY &&  
      (player.y + player.height) <= l.yStart + descendMarginY    
    );
    if (ladder) {
      const above = platformTiles.find(t =>
        t.row === player.currentRow - 1 &&
        cx >= t.x && cx < t.x + constants.tileSize
      );
      if (above) {
        player.currentRow--;
        player.y = above.y - player.height;
        player.isClimbing = false;
        player.climbLadder = null;
        return;
      }
    }
  }

  // 🔽 Climb down from top of ladder
  if (
    e.code === 'ArrowDown' &&
    !player.isClimbing &&
    !player.isDescending &&
    player.velocityY === 0
  ) {
    const playerFeetY = player.y + player.height;
    const ladder = ladderTiles.find(l =>
      cx >= l.xStart - 10 && cx <= l.xEnd + 10 &&
      Math.abs(playerFeetY - l.yStart) <= 8
    );

    const platformBelow = platformTiles.find(t =>
      t.row === player.currentRow + 1 &&
      cx > t.x && cx < t.x + constants.tileSize
    );

    if (ladder && platformBelow) {
      player.isClimbing = true;
      player.climbLadder = ladder;
      player.x = ladder.xStart + (ladder.width - player.width) / 2;

      // Adjust positioning at top edge
      if (player.y + player.height <= ladder.yStart + 2) {
        player.y = ladder.yStart - player.height + 2;
      }
      return;
    }
  }

  // ⬆⬇ Begin climbing from middle of ladder
  if (
    (e.code === 'ArrowUp' || (e.code === 'ArrowDown' && player.currentRow !== levelData.tilemap.length - 1)) &&
    !player.isClimbing &&
    !player.isDescending
  ) {
    const cy = player.y + player.height / 2;
    const ladder = ladderTiles.find(l =>
      l.row === player.currentRow &&
      cx >= l.xStart - 6 && cx <= l.xEnd + 6 &&
      cy >= l.yStart && cy <= l.yStart + l.height
    );
    if (ladder) {
      player.isClimbing = true;
      player.climbLadder = ladder;
      player.velocityY = 4;
      return;
    }
  }

  // 🔁 Move while on ladder
  if ((e.code === 'ArrowUp' || e.code === 'ArrowDown') && player.isClimbing && player.climbLadder) {
    if (e.code === 'ArrowUp') {
      const nextY = player.y - climbStep;
      if (nextY <= player.climbLadder.yStart - 50) {
        const above = findTile(player.currentRow - 1);
        if (above) {
          player.currentRow--;
          player.y = Math.min(player.y, above.y - player.height);
          player.isClimbing = false;
          player.climbLadder = null;
        }
      } else {
        player.y = nextY;
      }
    }

    if (e.code === 'ArrowDown') {
      const bottomY = player.climbLadder.yStart + player.climbLadder.height - player.height;
      const overshootMargin = -10;
      const nextY = player.y + climbStep;

      if (nextY >= bottomY - overshootMargin) {
        const below = findTile(player.currentRow + 1);
        if (below) {
          player.y = Math.max(player.y, below.y - player.height);
          player.currentRow++;
          player.isClimbing = false;
          player.climbLadder = null;
        }
      } else {
        player.y = nextY;
      }
    }

    return;
  }

/* ===============================  
     PLAYER JUMP AND MOVEMENT  
================================== */

// 🔼 JUMP — only when not climbing, descending, or mid-air
if (
  e.code === 'Space' &&
  !player.isClimbing &&
  !player.isDescending &&
  player.velocityY === 0
) {
  player.velocityY = -4;

  sfx.sfxJump.pause();
  sfx.sfxJump.currentTime = 0;
  sfx.sfxJump.play();
}
});

// 🔁 KEY RELEASE HANDLER
document.addEventListener('keyup', e => {
  if (e.code === 'ArrowLeft') keys.left = false;
  if (e.code === 'ArrowRight') keys.right = false;
  if (e.code === 'ArrowDown') keys.down = false;
  if (e.code === 'ArrowUp') keys.up = false;
});

/* ===============================  
         MAIN UPDATE LOOP  
================================== */

let lastTime = 0;

const update = (time = 0) => {
  const deltaSec = (time - lastTime) / 500; // Normalize frame time
  lastTime = time;

  // If not climbing, allow platform walking
  if (!player.isClimbing) {
    const moveDist = player.speed * deltaSec * 60;
    const bounds = rowBounds[player.currentRow];

    // 🟡 Descending logic while on ladder
    if (player.isDescending && player.climbLadder) {
      player.y += climbStep * deltaSec * 2;

      const bottomReached =
        player.y + player.height >=
        player.climbLadder.yStart + player.climbLadder.height;

      if (bottomReached) {
        const below = platformTiles.find(t =>
          t.row === player.currentRow + 1 &&
          player.x + player.width / 2 >= t.x &&
          player.x + player.width / 2 < t.x + constants.tileSize
        );

        if (below) {
          player.currentRow++;
          player.y = below.y - player.height;
        }

        player.isDescending = false;
        player.climbLadder = null;
      }
    }

/* ===============================  
      COLLISIONS: DOCTOR & TRASH  
================================== */

// 🔴 DOCTOR COLLISION — only on top row
// Only block if player's feet are at the same height as the doctor (so you can jump over!)
let doctorBlock = false;
if (
  player.currentRow === 0 && // Only on top row
  player.y + player.height > doctor.y && player.y < doctor.y + doctor.height // Only if Y overlaps doctor sprite
) {
  // Doctor block positions
  const doctorBlockLeft = doctor.x + doctor.width * 0.20;  // 25% in from left
  const doctorBlockRight = doctor.x + doctor.width * 0.20; // 25% in from right
  const feetZoneTop = doctor.y + doctor.height * 0.5;      // Lower half of doctor
  const feetZoneBottom = doctor.y + doctor.height;
  const verticallyAligned =
    player.y + player.height > feetZoneTop &&
    player.y < feetZoneBottom;

  // ▶️ Block moving right into doctor (from left)
  if (
    keys.right &&
    verticallyAligned &&
    player.x + player.width <= doctorBlockLeft &&
    player.x + player.width + moveDist > doctorBlockLeft
  ) {
    doctorBlock = true;
    player.x = doctorBlockLeft - player.width;
  }

  // ◀️ Block moving left into doctor (from right)
  if (
    keys.left &&
    verticallyAligned &&
    player.x >= doctorBlockRight &&
    player.x - moveDist < doctorBlockRight
  ) {
    doctorBlock = true;
    player.x = doctorBlockRight;
  }
}




// 🗑️ TRASH CAN COLLISION — only on trash row
// Place *after* the top surface code above
let trashBlock = false;
const trashBlockLeft = trashCanX + TRASH_CAN_WIDTH * 0.85;
const trashBlockRight = trashCanX + TRASH_CAN_WIDTH * 0.15;
const feetZoneTop = trashCanY + TRASH_CAN_HEIGHT * 0.5;
const feetZoneBottom = trashCanY + TRASH_CAN_HEIGHT;
const verticallyAligned =
  player.y + player.height > feetZoneTop &&
  player.y < feetZoneBottom;

// Block rightward movement into can
if (
  keys.right &&
  verticallyAligned &&
  player.x + player.width <= trashBlockLeft &&
  player.x + player.width + moveDist > trashBlockLeft
) {
  trashBlock = true;
  player.x = trashBlockLeft - player.width;
}

// Block leftward movement into can
if (
  keys.left &&
  verticallyAligned &&
  player.x >= trashBlockRight &&
  player.x - moveDist < trashBlockRight
) {
  trashBlock = true;
  player.x = trashBlockRight;
}






// Returns the leftmost platform tile in the given row
function getLeftmostTile(row) {
  const tiles = platformTiles.filter(t => t.row === row); // Get all tiles in the specified row
  if (!tiles.length) return null; // If none found, return null
  return tiles.reduce((a, b) => (a.x < b.x ? a : b)); // Return the tile with the smallest x (furthest left)
}

// Move player left if not blocked by doctor or trash can
if (keys.left && !doctorBlock && !trashBlock) {
  player.x -= moveDist;
}

// After all movement, make sure player never goes past the left wall
if (player.x < 0) {
  player.x = 0;
}

// Returns the rightmost platform tile in the given row
function getRightmostTile(row) {
  const tiles = platformTiles.filter(t => t.row === row); // Get all tiles in the specified row
  if (!tiles.length) return null; // If none found, return null
  return tiles.reduce((a, b) => (a.x > b.x ? a : b)); // Return the tile with the largest x (furthest right)
}


// --- Normal movement with bounds ---
// Move player right if not blocked by doctor or trash can
if (keys.right && !doctorBlock && !trashBlock) {
  player.x += moveDist;
  // Make sure player doesn't go past the right edge of the screen
  player.x = Math.min(canvas.width - player.width, player.x); 
}

// If player is on the trash can row, don't let them go past the trash can
if (player.currentRow === TRASH_ROW) {
  const maxPlayerX = trashCanX + TRASH_CAN_WIDTH - player.width; // Calculate right boundary
  if (player.x > maxPlayerX) {
    player.x = maxPlayerX; // Clamp player position to just before trash can
  }
}

// PLATFORM SUPPORT/FALL CHECK
// Find the platform tile directly under the player on their current row
const tileUnderPlayer = platformTiles.find(t =>
  t.row === player.currentRow &&
  player.x + player.width > t.x &&
  player.x < t.x + constants.tileSize
);

// Check if player is at the far left wall
const atLeftWall = player.x <= 1; 

// If there is no platform under the player (and not climbing or falling already), start falling
if (!tileUnderPlayer && !player.isClimbing && player.velocityY === 0 && !atLeftWall) {
  player.velocityY = 1;
}

// If enough time has passed since last food drop, spawn new food
if (time - lastFoodTime > constants.foodCooldown) {
  const newFood = FoodItem.spawnFood(doctor, foodTypes);
  foodItems.push(newFood);
  doctorIsThrowing = true;
  setTimeout(() => { doctorIsThrowing = false; }, 300);
  lastFoodTime = time;
}

// Apply gravity: upward when jumping, downward when falling
const grav = (player.velocityY < 0 ? jumpGravity : fallGravity) * deltaSec * 60;
player.velocityY += grav;
player.y += player.velocityY * deltaSec * 60;

// If player is falling (velocity > 0), check for landing on any lower platform
if (player.velocityY > 0) {
  // 1️⃣ First, check for landing on the trash can
  if (
    player.currentRow === TRASH_ROW &&
    (player.x + player.width / 2) > (trashCanX + 4) &&
    (player.x + player.width / 2) < (trashCanX + TRASH_CAN_WIDTH - 4) &&
    (player.y + player.height) <= trashCanY && // coming from above
    (player.y + player.height + player.velocityY * deltaSec * 60) >= trashCanY // would land this frame
  ) {
    player.y = trashCanY - player.height;
    player.velocityY = 0;
    player.currentRow = TRASH_ROW;
  } else {
    // 2️⃣ Otherwise, check for platform landing as usual
    for (let r = player.currentRow; r <= bottomRow; r++) {
      const land = findTile(r);
      if (land && player.y + player.height >= land.y) {
        player.currentRow = r;
        player.y = land.y - player.height; // Snap player on top of the platform
        player.velocityY = 0;              // Stop falling
        break;
      }
    }
  }
}


// --- If the player is moving upward (jumping) ---
if (player.velocityY < 0) {
  // Find the platform tile directly above the current row
  const above = findTile(player.currentRow - 1);
  // If there is a platform above and the player's head hits it
  if (above && player.y <= above.y + constants.tileHeight) {
    player.y = above.y + constants.tileHeight; // Move the player just below the platform above
    player.velocityY = 0;            // Stop upward movement (cancel jump)
  }
}}


// 🔻 ADD THIS SAFETY BLOCK BELOW 🔻
// Make sure the player doesn't fall below the bottom row platform
if (player.currentRow === bottomRow) {
  // Find the platform tile directly under the player
  const tile = platformTiles.find(t =>
    t.row === player.currentRow &&
    player.x + player.width > t.x &&
    player.x < t.x + constants.tileSize
  );
  // If the player sinks below the platform (e.g., from gravity), snap them back on top
  if (tile && player.y + player.height > tile.y) {
    player.y = tile.y - player.height;
    player.velocityY = 0; // Stop any falling
  }
  // If the player somehow goes past the bottom of the canvas, force them back in bounds
  if (player.y + player.height > canvas.height) {
    player.y = canvas.height - player.height;
    player.velocityY = 0;
  }
}

// If climbing and holding down, move down the ladder
if (player.isClimbing && keys.down && player.climbLadder) {
  player.y += climbStep * deltaSec * 0; // Move player down the ladder (value is 0, so not moving)
  // If the player has gone past the bottom of the ladder, snap them to the end, exit climbing
  if (player.y + player.height > player.climbLadder.yStart + player.climbLadder.height) {
      player.y = player.climbLadder.yStart + player.climbLadder.height - player.height;
      player.isClimbing = false;
      player.currentRow++;
      player.climbLadder = null;
  }
}


// --- Food logic --- //
foodItems.forEach(food => {
  // Get the horizontal center of the food for collision checks
  const centerX = food.x + food.width / 2;

  // Find the platform tile directly under the food
  const tileUnder = platformTiles.find(p =>
    centerX > p.x &&
    centerX < p.x + constants.tileSize &&
    Math.abs((p.y) - (food.y + food.height)) <= 16
  );

  // 1️⃣ If the food is on the trash row, make it slide right toward the trash can
  if (tileUnder && tileUnder.row === TRASH_ROW) {
    food.falling = false; // Not falling anymore, just sliding
    food.velocityX = Math.abs(food.velocityX); // Always move right

    // If the food has reached or passed the trash can, stop it and mark for removal
    if (food.x + food.width >= trashCanX) {
      food.x = trashCanX;
      food._remove = true; 
    } else {
      // Otherwise, keep sliding the food right and keep it on top of the platform
      food.x += food.velocityX;
      food.y = tileUnder.y - food.height;
    }
    return; // No further logic needed for food on trash row
  }

// --- All other rows: normal food logic ---

// 2️⃣ Check if there is a ladder under the food on this platform
let ladderHere = null;
if (tileUnder) {
  ladderHere = ladderTiles.find(l =>
    l.row === tileUnder.row &&
    centerX >= l.xStart &&
    centerX <= l.xEnd
  );
}

// 3️⃣ Decide if food should fall through the ladder (random chance, not on row 3)
if (!food.falling && tileUnder) {
  if (ladderHere) {
    // On some rows, randomly let the food fall through the ladder
    if (tileUnder.row !== 3) { // Row 3 blocks ladder drops
      const ladderCenter = ladderHere.xStart + ladderHere.width / 2;
      if (food.decidedLadder !== ladderCenter) {
        food.decidedLadder = ladderCenter;
        food.willFallThisLadder = Math.random() < 0.35; // 35% chance to fall
      }
      if (food.willFallThisLadder) {
        food.falling = true;      // Start falling!
        food.decidedLadder = null;
      }
    } else {
      // Never fall through ladders on row 3 (hard block)
      food.willFallThisLadder = false;
      food.decidedLadder = null;
    }
  } else {
    // No ladder: reset decision
    food.decidedLadder = null;
  }
}

// 4️⃣ Slide food left/right on the platform until it reaches an edge
if (!food.falling && tileUnder) {
  const currentRow = tileUnder.row;
  const { min, max } = rowBounds[currentRow];
  const nextX = food.x + food.velocityX;

  // If next move would put food outside platform bounds, drop it
  if (nextX < min || nextX + food.width > max) {
    food.falling = true; // Start falling off platform
    food.x = nextX < min ? min : max - food.width; // Clamp to edge
    food.decidedLadder = null;
  } else {
    // Otherwise, slide the food and keep it above the platform
    food.x = nextX;
    food.y = tileUnder.y - food.height;
  }
}

// 5️⃣ Falling logic: drop food down until it lands on the next platform
if (food.falling || !tileUnder) {
  food.falling = true; // Set falling state
  const fallSpeed = 2 + Math.random() * 1; // Add randomness to fall speed

  // Find the next platform directly below the food
  const nextPlatform = platformTiles
    .filter(p =>
      centerX > p.x &&
      centerX < p.x + constants.tileSize &&
      p.y > food.y + food.height
    )
    .sort((a, b) => a.y - b.y)[0];

  // If the food would land on this frame, snap it to the platform and reverse direction
  if (nextPlatform && food.y + food.height + fallSpeed >= nextPlatform.y) {
    food.y = nextPlatform.y - food.height;
    food.falling = false;        // Stop falling, now sliding
    food.velocityX *= -1;        // Reverse slide direction for realism
    food.decidedLadder = null;
  } else {
    // Otherwise, keep falling down
    food.y += fallSpeed;
  }
}

// Remove food if inside trash can collision
if (
  tileUnder &&                                // There is a platform tile under the food
  tileUnder.row === TRASH_ROW &&              // The platform is the trash can row
  food.x <= trashCanX + TRASH_CAN_WIDTH &&    // The left side of the food is before the right edge of the trash can
  food.x + food.width >= trashCanX &&         // The right side of the food is after the left edge of the trash can
  food.y + food.height >= trashCanY &&        // The bottom of the food is below the top of the trash can
  food.y <= trashCanY + TRASH_CAN_HEIGHT      // The top of the food is above the bottom of the trash can
) {
  food._remove = true;                        // Mark this food to be removed
}
});

// Actually remove all food marked for deletion
for (let i = foodItems.length - 1; i >= 0; i--) {
  if (foodItems[i]._remove) foodItems.splice(i, 1);
}

// === Player sprite facing & animation state ===
if (keys.left) {
  // Player is moving left
  player.facing = 'left';
  player.isWalking = true;
} else if (keys.right) {
  // Player is moving right
  player.facing = 'right';
  player.isWalking = true;
} else {
  // Player is not walking (idle)
  player.isWalking = false;
}

// Is the player currently jumping? (true if moving vertically)
player.isJumping = player.velocityY !== 0;

// === Walking animation frame logic ===
if (player.isWalking) {
  // Advance the walk animation timer
  player.walkAnimTimer += deltaSec;
  // Change walk frame every 0.9 "units" of timer
  if (player.walkAnimTimer > 0.9) {
    player.walkFrame = 1 - player.walkFrame; // Toggle between frame 0 and 1
    player.walkAnimTimer = 0;
  }
} else {
  // Not walking, use idle frame
  player.walkFrame = 0;
}

// Redraw everything on the canvas
drawScene();

    
// --- GAME WIN CHECK ---
// Check if the player has collected the golden apple
if (
  !goldenApple.collected && // Only if not already collected
  (player.x + PLAYER_COLLISION_MARGIN) < (goldenApple.x + goldenApple.width - APPLE_COLLISION_MARGIN) && // Player's left edge inside apple
  (player.x + player.width - PLAYER_COLLISION_MARGIN) > (goldenApple.x + APPLE_COLLISION_MARGIN) &&    // Player's right edge inside apple
  (player.y + PLAYER_COLLISION_MARGIN) < (goldenApple.y + goldenApple.height - APPLE_COLLISION_MARGIN) && // Player's top inside apple
  (player.y + player.height - PLAYER_COLLISION_MARGIN) > (goldenApple.y + APPLE_COLLISION_MARGIN) // Player's bottom inside apple
) {
  goldenApple.collected = true;         // Mark apple as collected
   Score.save();            // Save the score

  // ---- STOP GAMEPLAY MUSIC! ----
  music.ingameMusic.pause();
  music.ingameMusic.currentTime = 0;

  // Play the golden apple SFX
  sfx.sfxGoldenApple.currentTime = 0;
  sfx.sfxGoldenApple.play();

  // When the sound ends, show the game over/result screen
  sfx.sfxGoldenApple.onended = () => {
    this._showGameOverOverlay(Score.get());
  };
  return; // Skip the rest of the update this frame
}

// --- FOOD PICKUP CHECK ---
// Loop backwards through all food items to check for collision
for (let i = foodItems.length - 1; i >= 0; i--) {
  const food = foodItems[i];

  // Check if player collides with the food item (using margin for a forgiving hitbox)
  if (
    (player.x + PLAYER_COLLISION_MARGIN) < (food.x + food.width - FOOD_COLLISION_MARGIN) &&
    (player.x + player.width - PLAYER_COLLISION_MARGIN) > (food.x + FOOD_COLLISION_MARGIN) &&
    (player.y + PLAYER_COLLISION_MARGIN) < (food.y + food.height - FOOD_COLLISION_MARGIN) &&
    (player.y + player.height - PLAYER_COLLISION_MARGIN) > (food.y + FOOD_COLLISION_MARGIN)
  ) {
    // If it's healthy food, add points
    if (food.type === 'healthy') {
      Score.add(25);
    } else if (food.type === 'junk') {
      Score.add(-50); // Score.add() handles negative and lower-bound
    }
    // Play the collect food sound
    sfx.sfxCollectFoods.pause();
    sfx.sfxCollectFoods.currentTime = 0;
    sfx.sfxCollectFoods.play();

    // Remove the food from the array right away
    foodItems.splice(i, 1);
  }
}

// Continue the game loop
requestAnimationFrame(update);
}


function drawScene() {
  // Fill the background with a dark color
  ctx.fillStyle = '#1C1C1C';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // --- Draw all platform tiles using their image ---
  platformTiles.forEach(t => {
    ctx.drawImage(images.platformImg, t.x, t.y, constants.tileSize, constants.tileHeight);
  });

  // --- Draw each ladder using the image, tiled vertically to fill ladder height ---
  ladderTiles.forEach(l => {
    const tileW = 27;      // Original ladder tile image width
    const tileH = 52;      // Original ladder tile image height
    const scaleW = l.width; // Scale ladder width if needed
    let yDraw = l.yStart;   // Where to start drawing vertically
    let hLeft = l.height;   // How much ladder height is left to draw

    // Keep drawing ladder tiles until we've filled the whole ladder height
    while (hLeft > 0) {
      const drawH = Math.min(tileH, hLeft); // Only draw what's needed
      ctx.drawImage(
        images.ladderImg,
        0, 0, tileW, drawH,   // Source (image) crop
        l.xStart, yDraw, scaleW, drawH // Destination on canvas
      );
      yDraw += drawH;
      hLeft -= drawH;
    }
  });

  // --- Figure out which player sprite/image to use before drawing (handled below) ---
  let playerImgToDraw;


// --- Select the correct player sprite image based on current direction and movement ---
// If the player is facing left
if (player.facing === 'left') {
  if (player.isWalking) {
    // Use left-walking animation frame (walkFrame toggles the sprite)
    playerImgToDraw = images.playerLeftWalkingImgs[player.walkFrame];
  } else {
    // Use left-standing sprite when idle
    playerImgToDraw = images.playerLeftStandingImg;
  }
// If the player is facing right
} else if (player.facing === 'right') {
  if (player.isWalking) {
    // Use right-walking animation frame
    playerImgToDraw = images.playerRightWalkingImgs[player.walkFrame];
  } else {
    // Use right-standing sprite when idle
    playerImgToDraw = images.playerRightStandingImg;
  }
// If the player is not specifically facing left or right, show the front-standing sprite
} else {
  playerImgToDraw = images.playerFrontStandingImg;
}



// Only draw player sprite if image is loaded, otherwise fallback to a red rectangle
if (playerImgToDraw && playerImgToDraw.complete && playerImgToDraw.naturalWidth !== 0) {
  ctx.drawImage(playerImgToDraw, player.x, player.y, player.width, player.height);
} else {
  // Draw player as a red box if sprite not available
  ctx.fillStyle = 'red';
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

// --- Draw doctor character ---
// If the doctor is in the process of throwing food, use the throwing image (if loaded)
if (doctorIsThrowing) {
  if (images.doctorThrowingImg.complete && images.doctorThrowingImg.naturalWidth !== 0) {
    ctx.drawImage(images.doctorThrowingImg, doctor.x, doctor.y, doctor.width, doctor.height);
  } else {
    // Draw a dark blue rectangle as fallback if image not loaded
    ctx.fillStyle = 'darkblue';
    ctx.fillRect(doctor.x, doctor.y, doctor.width, doctor.height);
  }
} else {
  // If the doctor is idle, use the standing image (if loaded)
  if (images.doctorStandingImg.complete && images.doctorStandingImg.naturalWidth !== 0) {
    ctx.drawImage(images.doctorStandingImg, doctor.x, doctor.y, doctor.width, doctor.height);
  } else {
    // Draw a blue rectangle as fallback if image not loaded
    ctx.fillStyle = 'blue';
    ctx.fillRect(doctor.x, doctor.y, doctor.width, doctor.height);
  }
}

// --- Draw golden apple if it hasn't been collected yet ---
if (!goldenApple.collected) {
  if (images.goldenAppleImg.complete && images.goldenAppleImg.naturalWidth !== 0) {
    ctx.drawImage(images.goldenAppleImg, goldenApple.x, goldenApple.y, goldenApple.width, goldenApple.height);
  } else {
    // Draw a gold rectangle as fallback if image not loaded
    ctx.fillStyle = 'gold';
    ctx.fillRect(goldenApple.x, goldenApple.y, goldenApple.width, goldenApple.height);
  }
}

// Always draw the trash can image at its position
ctx.drawImage(images.trashCanImg, trashCanX, trashCanY, TRASH_CAN_WIDTH, TRASH_CAN_HEIGHT);


// Draw the player's score in the top-right corner
// Uses monospace font, white color, and always shows 4 digits (e.g. 0025)
ctx.font = '45px Silkscreen, monospace';
ctx.textAlign = 'right';
ctx.fillStyle = '#fff';
ctx.fillText(Score.get().toString().padStart(4, '0'), canvas.width - 24, 48);

// Draw all food items (healthy and junk foods)
foodItems.forEach((food) => {
  // If the food has a loaded image, draw it as an image
  if (food.img && food.img.complete && food.img.naturalWidth !== 0) {
    ctx.drawImage(food.img, food.x, food.y, food.width, food.height);
  } else {
    // Otherwise, fallback to a colored box (green = healthy, yellow = junk)
    ctx.fillStyle = food.type === "healthy" ? "green" : "yellow";
    ctx.fillRect(food.x, food.y, food.width, food.height);
  }
});
}

// Schedule the next frame of the game loop
requestAnimationFrame(update);
}


// === Game over screen toggles between two screens ===
_showGameOverOverlay(score) {
  // Reset and play the "game end" sound effect
  sfx.sfxGameEnd.currentTime = 0;
  sfx.sfxGameEnd.play();

  // If the player's score is 0, always show the "Try Again" screen
  if (score === 0) {
    showOverlayScreen({
      app: this.app,
      mainText: "Try Again!",
      subText: `<br>Eat healthy foods to score points!`,
      imgSrc: "assets/images/game_section/angry_red_apple.gif", // Animated angry apple
      imgExtraClass: "result-img result-img--small",
      imgAlt: "Angry Apple",
      imgClass: "result-img--angry-apple",
      homeAction: () => {
        // Go back to main menu when HOME is clicked
        this.app.innerHTML = '';
        new MainMenuView(this.app).render();
      },
      scoresAction: () => {
        // Go to high scores screen when SCORES is clicked
        new HighScoresView(this.app).render();
      }
    });
    return; // End here if lost
  }

  // For a win (score > 0), toggle between two celebration screens for variety!
  resultScreenToggle = !resultScreenToggle;

  if (resultScreenToggle) {
    // 1st win screen: "Healthy Choice!" with a dancing golden apple gif
    showOverlayScreen({
      app: this.app,
      mainText: "Healthy Choice!",
      subText: `Your points: <span class="highlight-yellow">${score}</span>`,
      imgSrc: "assets/images/game_section/dancing_golden_apple.gif",
      imgAlt: "Golden Apple Dancing",
      imgClass: "result-img--golden-apple",
      homeAction: () => {
        this.app.innerHTML = '';
        new MainMenuView(this.app).render();
      },
      scoresAction: () => {
        new HighScoresView(this.app).render();
      }
    });
  } else {
    // 2nd win screen: "Eggtastic Effort!" with a dancing egg gif
    showOverlayScreen({
      app: this.app,
      mainText: "Eggtastic Effort!",
      subText: `<br>Your points: <span class="highlight-yellow">${score}</span>`,
      imgSrc: "assets/images/game_section/dancing_egg.gif",
      imgAlt: "Dancing Egg",
      imgClass: "result-img--small",
      homeAction: () => {
        this.app.innerHTML = '';
        new MainMenuView(this.app).render();
      },
      scoresAction: () => {
        new HighScoresView(this.app).render();
      }
    });
  }}}
=======
import MainMenuView from './MainMenuView.js';
import HighScoresView from './HighScoresView.js';
import foodTypes from '../model/foodTypes.js';
import sfx from '../../assets/audio/sfx/sfx.js';
import music from '../../assets/audio/music/music.js';
import images from '../../assets/images/images.js';
import { tilemap, ladderMap } from '../model/levelData.js';
import { foodFallSpeed, fallMultiplier, foodCooldown, tileSize, tileHeight, boxHeight, topPadding, bottomPadding } from '../model/constants.js';

music.ingameMusic.volume = 0.1;      
let funFactToggle = false;
let resultScreenToggle = false;

function showOverlayScreen({
  app,
  mainText,
  subText,
  imgSrc,
  imgAlt = '',
  imgExtraClass = "",
  homeAction,
  scoresAction,
  imgClass = ''
}) {
  app.innerHTML = `
    <div class="game-screen">
      <button id="home-button" class="home-button">HOME</button>
      <button id="scores-button" class="results_scores_button">SCORES</button>
      <div class="result-overlay">
        <p class="result-text"><span class="highlight-yellow-result">${mainText}</span></p>
          <img src="${imgSrc}" alt="${imgAlt}" class="game-result-img ${imgClass}">        
          <p class="end-text" style="font-size:2.5rem;"></p>
          <p class="end-text" ...>${subText}</p>
      </div>
    </div>
  `;
  document.getElementById('home-button').addEventListener('click', () => {
  sfx.sfxButton.currentTime = 0; 
  sfx.sfxButton.play();
  music.stopAllMusic();              
  music.mainMenuMusic.currentTime = 0;
  music.mainMenuMusic.play();        

    app.innerHTML = '';
    new MainMenuView(app).render();
  });
    document.getElementById('scores-button').addEventListener('click', () => {
    sfx.sfxGameEnd.pause();
    sfx.sfxGameEnd.currentTime = 0;

    sfx.sfxButton.currentTime = 0;     
    sfx.sfxButton.play();
    scoresAction();
  });
  }

function showFunFactOverlay(app) {
  music.stopAllMusic();
  music.allScreensMusic.currentTime = 0;
  music.allScreensMusic.play();
  funFactToggle = !funFactToggle;
  let funfactHTML;
  if (funFactToggle) {
    funfactHTML = `
      <button id="home-button" class="home-button">HOME</button>
      <div class="funfact-overlay">
        <p class="funfact-text"><span class="highlight-yellow">Fun Fact:</span> Bananas are nature's energy bar!</p>
        <img src="assets/images/game_section/dancing-banana-happy.gif" alt="Banana Dancing" class="funfact-img"/>
        <p class="start-text">
          <span class="inline-group">
            <span>Ready? Press "</span>
            <img src="assets/images/game_section/space_bar_icon.png" alt="Spacebar key" class="spacebar-img"/>
            <span>" to start!</span>
          </span>
        </p>
      </div>
    `;
  } else {
    funfactHTML = `
      <button id="home-button" class="home-button">HOME</button>
      <div class="funfact-overlay">
        <p class="funfact-text"><span class="highlight-yellow">Fun Fact:</span> Broccoli is both a vegetable and a flower!</p>
        <img src="assets/images/game_section/banana_broccoli_working_out.gif" alt="Banana and Broccoli" class="funfact-img"/>
        <p class="start-text">
          <span class="inline-group">
            <span>Press "</span>
            <img src="assets/images/game_section/space_bar_icon.png" alt="Spacebar key" class="spacebar-img"/>
            <span>" to play again!</span>
          </span>
        </p>
      </div>
    `;
  }

  app.innerHTML = `
    <div class="game-screen">
      ${funfactHTML}
      <div class="game-area">
        <canvas id="gameCanvas"></canvas>
      </div>
    </div>
  `;

    document.getElementById('home-button').addEventListener('click', () => {
    sfx.sfxGameEnd.pause();
    sfx.sfxGameEnd.currentTime = 0;

    sfx.sfxButton.currentTime = 0; 
    sfx.sfxButton.play();
    music.stopAllMusic();              
    music.mainMenuMusic.currentTime = 0;
    music.mainMenuMusic.play();        

    app.innerHTML = '';
    new MainMenuView(app).render();
  });
  }

export default class GameView {
  constructor(app) {
    this.app = app;
    this._startListener = this._startListener.bind(this);
  }

  render() {
  showFunFactOverlay(this.app);
  document.addEventListener('keydown', this._startListener);
}

  _startListener(e) {
    if (e.code === 'Space') {
      music.stopAllMusic();
      music.ingameMusic.currentTime = 0;
      music.ingameMusic.play();
      const overlay = document.querySelector('.funfact-overlay');
      const homeBtn = document.getElementById('home-button');
      if (overlay) overlay.style.display = 'none';
      if (homeBtn) homeBtn.style.display = 'none';
      this.startGame();
      document.removeEventListener('keydown', this._startListener);
    }
  }

  startGame() {
    music.mainMenuMusic.pause();
    music.mainMenuMusic.currentTime = 0;
    music.ingameMusic.currentTime = 0;
    music.ingameMusic.play();
    const canvas = document.getElementById('gameCanvas');
    const app = this.app;
    const keys = { left: false, right: false, down: false };
    if (!canvas) return console.error('Canvas #gameCanvas not found');

    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    canvas.width = 1280;
    canvas.height = 720;
    canvas.style.width = '100%';
    canvas.style.height = 'auto';
    const numRows = tilemap.length;
    const usableHeight = canvas.height - topPadding - bottomPadding;
    const verticalSpacing = usableHeight / (numRows - 1);
    const slopeStep = 1;

    const platformTiles = [];
    tilemap.forEach((row, rowIndex) => {
    const baseY = topPadding + rowIndex * verticalSpacing;
    let slope = rowIndex % 2 === 0 ? slopeStep : -slopeStep;
    if (rowIndex === tilemap.length - 1) slope = 0;
    for (let col = 0; col < row.length; col++) {
      if (row[col] === '=') {
        platformTiles.push({ row: rowIndex, x: col * tileSize, y: baseY + col * slope });
      }
    }
  });

    const ladderTiles = [];
    ladderMap.forEach((row, rowIndex) => {
      const baseY = (rowIndex + 1) * verticalSpacing;
      for (let col = 0; col < row.length; col++) {
        if (row[col] === 'H') {
          const width = tileSize * 0.5;
          let height = tileSize * 2.3;
          if (rowIndex === 1 && col === 2) height = tileSize * 0.7;
          if (rowIndex === 1 && col === 6) height = tileSize * 2.25;
          if (rowIndex === 1 && col === 14) height = tileSize * 2;
          if (rowIndex === 2 && col === 4) height = tileSize * 0.7;
          if (rowIndex === 2 && col === 10) height = tileSize * 2.75;
          if (rowIndex === 3 && col === 6) height = tileSize * 2.3;
          if (rowIndex === 3 && col === 16) height = tileSize * 0.7;
          if (rowIndex === 4 && col === 9) height = tileSize * 0.7;
          if (rowIndex === 4 && col === 14) height = tileSize * 2.45;

          let x = col * tileSize + (tileSize - width) / 2;
          let y = baseY - height;
          if (rowIndex === 1 && col === 2)  { x += 10;  y += -95; }
          if (rowIndex === 1 && col === 6)  { x += 100;  y += 9; }
          if (rowIndex === 1 && col === 14) { x -= 10; y += 1; }
          if (rowIndex === 2 && col === 10) { x += 5;  y += 25; }
          if (rowIndex === 2 && col === 4) { x += 5;  y += -100; }
          if (rowIndex === 3 && col === 6) { x += 10;  y += 10; } 
          if (rowIndex === 3 && col === 16) { x += 10;  y += -80; } 
          if (rowIndex === 4 && col === 9) { x += 10;  y += -105; } 
          if (rowIndex === 4 && col === 14) { x += 10;  y += 1; } 


          ladderTiles.push({ row: rowIndex, xStart: x, xEnd: x + width, yStart: y, width, height });
        }
      }
    });

    const rowBounds = {};
    platformTiles.forEach(t => {
      if (!rowBounds[t.row]) rowBounds[t.row] = { min: t.x, max: t.x + tileSize };
      else {
        rowBounds[t.row].min = Math.min(rowBounds[t.row].min, t.x);
        rowBounds[t.row].max = Math.max(rowBounds[t.row].max, t.x + tileSize); 
      }
    });

    const TRASH_CAN_WIDTH = 33;
    const TRASH_CAN_HEIGHT = 48;
    const TRASH_CAN_SIZE = 47;
    const TRASH_ROW = 4;
    const trashPlatformTiles = platformTiles.filter(t => t.row === TRASH_ROW);
    const trashCanX = Math.max(...trashPlatformTiles.map(t => t.x)) + tileSize - TRASH_CAN_WIDTH;
    const trashCanY = trashPlatformTiles[0].y - TRASH_CAN_HEIGHT;   
    const bottomRow = tilemap.length - 1;
    const startTile = platformTiles.find(t => t.row === bottomRow);

    const PLAYER_WIDTH = 80;
    const PLAYER_HEIGHT = 60;

    const player = {
      x: startTile.x + 30,
      y: startTile.y - PLAYER_HEIGHT,
      width: PLAYER_WIDTH,
      height: PLAYER_HEIGHT,
      speed: 1.5,
      velocityY: 0,
      isClimbing: false,
      isDescending: false,
      isDroppingThrough: false,
      climbLadder: null,
      currentRow: bottomRow,
      isOnLadder: false,
      isClimbingLadder: false,
      facing: 'right',
      isWalking: false,
      isJumping: false,
      walkFrame: 0,
      walkAnimTimer: 0,
      isJumping: false,
    };

    const jumpGravity = 0.1;
    const fallGravity = 0.1;
    const climbStep = 5;
    const topRowTile = platformTiles.find(t => t.row === 0) || platformTiles[0];
    const PLAYER_COLLISION_MARGIN = 8;
    const FOOD_COLLISION_MARGIN = 8;
    const TRASH_COLLISION_MARGIN = 8;
    const DOCTOR_COLLISION_MARGIN = 8;
    const APPLE_COLLISION_MARGIN = 8;

    // Doctor's dimensions and properties
    const DOCTOR_WIDTH = 60;  
    const DOCTOR_HEIGHT = 80; 

    const doctor = {
      x: topRowTile.x + 30,
      y: topRowTile.y + tileHeight - DOCTOR_HEIGHT,
      width: DOCTOR_WIDTH,
      height: DOCTOR_HEIGHT
    };

        // Find the platform where the doctor is standing (row 0)
    const doctorTile = platformTiles.find(
      t => t.row === 0 && doctor.x >= t.x && doctor.x < t.x + tileSize
    );

    // Golden Apple's dimensions and properties
    const GOLDEN_APPLE_WIDTH = 30;
    const GOLDEN_APPLE_HEIGHT = 30;


    // Place golden apple 1.5 platforms to the right of the doctor
    const goldenAppleX = doctorTile.x + tileSize * 1.5 + (tileSize - GOLDEN_APPLE_WIDTH) / 2;
    const goldenAppleY = doctor.y - 10;

    // Golden Apple Object
    const goldenApple = {
      x: doctor.x + (DOCTOR_WIDTH - GOLDEN_APPLE_WIDTH) / 2,   
      y: doctor.y - GOLDEN_APPLE_HEIGHT - 8,                   
      width: GOLDEN_APPLE_WIDTH,
      height: GOLDEN_APPLE_HEIGHT,
      collected: false
    };

    // Food Items
    const foodItems = [];
    let lastFoodTime = 0;
    let score = 0;
    let doctorIsThrowing = false;

    function spawnFood() {
      // Pick a random food object
      const foodObj = foodTypes[Math.floor(Math.random() * foodTypes.length)];

      const spawnX = doctor.x + doctor.width * 0.88; 
      const spawnY = doctor.y + doctor.height - 28; 

      const newFood = {
        x: spawnX,
        y: spawnY,
        width: 25,     
        height: 25,
        type: foodObj.type,    
        img: foodObj.img,     
        name: foodObj.name,
        velocityX: 0.5 + Math.random() * 0.5,
        falling: false,
        decidedLadder: null
      };
      foodItems.push(newFood);
      doctorIsThrowing = true;
      setTimeout(() => { doctorIsThrowing = false; }, 300);
    }

    // Check player-food collisions
    foodItems.forEach((food) => {
      if (food.img && food.img.complete && food.img.naturalWidth !== 0) {
        ctx.drawImage(food.img, food.x, food.y, food.width, food.height);
      } else {
        ctx.fillStyle = food.isHealthy ? "green" : "yellow";
        ctx.fillRect(food.x, food.y, food.width, food.height);
      }
  });

    // Finds the platform tile at the given row where the player is currently standing
    function findTile(row) {
      return platformTiles.find(t =>
        t.row === row &&
        player.x + player.width > t.x &&
        player.x < t.x + tileSize
      );
    }
    function findLadder() {
      const cx = player.x + player.width / 2;
      return ladderTiles.find(l =>
        l.row === player.currentRow &&
        cx >= l.xStart && cx <= l.xEnd &&
        player.y + player.height > l.yStart &&
        player.y < l.yStart + l.height
      );
    }

    // 🟢 MAIN LADDER DESCEND HANDLER
    const descendMarginX = 30; 
    const descendMarginY = 24;

  document.addEventListener('keydown', e => {
  if (e.code === 'ArrowLeft') keys.left = true;
  if (e.code === 'ArrowRight') keys.right = true;
  if (e.code === 'ArrowDown') keys.down = true;
  if (e.code === 'ArrowUp') keys.up = true;

  const cx = player.x + player.width / 2;

  // --- At the top of a ladder: UP to climb onto platform ---
  if (
    e.code === 'ArrowUp' &&
    !player.isClimbing &&
    !player.isDescending &&
    player.velocityY === 0
  ) {

const ladder = ladderTiles.find(l =>
  l.row === player.currentRow &&
  cx >= l.xStart - descendMarginX && cx <= l.xEnd + descendMarginX &&
  (player.y + player.height) >= l.yStart - descendMarginY &&  
  (player.y + player.height) <= l.yStart + descendMarginY    
);
    if (ladder) {
      const above = platformTiles.find(t =>
        t.row === player.currentRow - 1 &&
        cx >= t.x && cx < t.x + tileSize
      );
      if (above) {
        player.currentRow--;
        player.y = above.y - player.height;
        player.isClimbing = false;
        player.climbLadder = null;
        return;
      }
    }
  }

  // --- At the top of a ladder: DOWN to go down (already working) ---
if (
  e.code === 'ArrowDown' &&
  !player.isClimbing &&
  !player.isDescending &&
  player.velocityY === 0
) {
  const cx = player.x + player.width / 2;
  const playerFeetY = player.y + player.height;
  const ladder = ladderTiles.find(l =>
  cx >= l.xStart - 10 && cx <= l.xEnd + 10 && 
  Math.abs(playerFeetY - l.yStart) <= 8 
);

  // Only descend if there is a platform in the row BELOW
  const platformBelow = platformTiles.find(t =>
    t.row === player.currentRow + 1 &&
    cx > t.x &&
    cx < t.x + tileSize
  );

  if (ladder && platformBelow) {
    player.isClimbing = true;
    player.climbLadder = ladder;
    player.x = ladder.xStart + (ladder.width - player.width) / 2;
        if (player.y + player.height <= ladder.yStart + 2) {
      player.y = ladder.yStart - player.height + 2;
    }
    return;
  }
}

  // --- Start climbing if inside ladder body ---
  if (
    (
      e.code === 'ArrowUp' ||
      (e.code === 'ArrowDown' && player.currentRow !== tilemap.length - 1)
    ) &&
    !player.isClimbing &&
    !player.isDescending
  ) {
    const cy = player.y + player.height / 2;
    const ladder = ladderTiles.find(l =>
      l.row === player.currentRow &&
      cx >= l.xStart - 6 && cx <= l.xEnd + 6 &&
      cy >= l.yStart && cy <= l.yStart + l.height
    );
    if (ladder) {
      player.isClimbing = true;
      player.climbLadder = ladder;
      player.velocityY = 4;
      return;
    }
  }

  // --- Move up/down while on ladder ---
  if ((e.code === 'ArrowUp' || e.code === 'ArrowDown') && player.isClimbing && player.climbLadder) {
    if (e.code === 'ArrowUp') {
      const nextY = player.y - climbStep;
      if (nextY <= player.climbLadder.yStart - 50) { 
  const above = findTile(player.currentRow - 1);
  if (above) {
    player.currentRow--;
    player.y = Math.min(player.y, above.y - player.height);
    player.isClimbing = false;
    player.climbLadder = null;
      }
    } else {
      player.y = nextY;
    }

    }
    if (e.code === 'ArrowDown') {
      const bottomY = player.climbLadder.yStart + player.climbLadder.height - player.height;
      const overshootMargin = -10; 
      const nextY = player.y + climbStep;
      if (nextY >= bottomY - overshootMargin) {
        const below = findTile(player.currentRow + 1);
        if (below) {
          player.y = Math.max(player.y, below.y - player.height);
          player.currentRow++;
          player.isClimbing = false;
          player.climbLadder = null;
        }
      } else {
        player.y = nextY;
      }

          }
          return;
        }

    // --- JUMP (if not climbing/descending) ---
    if (e.code === 'Space' && !player.isClimbing && !player.isDescending && player.velocityY === 0) {
      player.velocityY = -4;

      sfx.sfxJump.pause();
      sfx.sfxJump.currentTime = 0;
      sfx.sfxJump.play();
      }
    });


    document.addEventListener('keyup', e => {
      if (e.code === 'ArrowLeft') keys.left = false;
      if (e.code === 'ArrowRight') keys.right = false;
      if (e.code === 'ArrowDown') keys.down = false;
      if (e.code === 'ArrowUp') keys.up = false;
      // 
    });

    let lastTime = 0;
    const update = (time = 0) => {
      const deltaSec = (time - lastTime) / 500;
      lastTime = time;

      // If climbing ladder
      if (!player.isClimbing) {
        const moveDist = player.speed * deltaSec * 60;
        const bounds = rowBounds[player.currentRow];

        // If descending ladder
        if (player.isDescending && player.climbLadder) {
          player.y += climbStep * deltaSec * 2;
          if (player.y + player.height >= player.climbLadder.yStart + player.climbLadder.height) {
            const below = platformTiles.find(t =>
              t.row === player.currentRow + 1 &&
              player.x + player.width/2 >= t.x &&
              player.x + player.width/2 < t.x + tileSize
            );
            if (below) {
              player.currentRow++;
              player.y = below.y - player.height;
            }
            player.isDescending = false;
            player.climbLadder = null;
          }
        }

        // --- Doctor collision (top row only) ---
        let doctorBlock = false;
        if (player.currentRow === 0) {
          // Wall collision (left/right)
          if (keys.right && player.x + player.width <= doctor.x && player.x + player.width + moveDist > doctor.x) {
            if (
              player.y + player.height > doctor.y &&
              player.y < doctor.y + doctor.height
            ) {
              doctorBlock = true;
              player.x = doctor.x - player.width; 
            }
          }
          if (keys.left && player.x >= doctor.x + doctor.width && player.x - moveDist < doctor.x + doctor.width) {
            if (
              player.y + player.height > doctor.y &&
              player.y < doctor.y + doctor.height
            ) {
              doctorBlock = true;
              player.x = doctor.x + doctor.width; 
            }
          }
          // Platform collision (stand on top)
          if (
            player.x + player.width > doctor.x &&
            player.x < doctor.x + doctor.width &&
            player.y + player.height <= doctor.y + 10 && 
            player.y + player.height + player.velocityY * deltaSec * 60 >= doctor.y
          ) {
            player.y = doctor.y - player.height;
            player.velocityY = 0;
            player.currentRow = 0;
          }
        }

        // --- Trash can collision (bottom row only) ---
        let trashBlock = false;
        if (player.currentRow === TRASH_ROW) {
          // Wall collision (left/right)
          if (keys.right && player.x + player.width <= trashCanX && player.x + player.width + moveDist > trashCanX) {
            if (
              player.y + player.height > trashCanY &&
              player.y < trashCanY + TRASH_CAN_SIZE
            ) {
              trashBlock = true;
              player.x = trashCanX - player.width; 
            }
          }
          if (keys.left && player.x >= trashCanX + TRASH_CAN_SIZE && player.x - moveDist < trashCanX + TRASH_CAN_SIZE) {
            if (
              player.y + player.height > trashCanY &&
              player.y < trashCanY + TRASH_CAN_SIZE
            ) {
              trashBlock = true;
              player.x = trashCanX + TRASH_CAN_SIZE; 
            }
          }
          // Platform collision (stand on top)
          const isOnTopOfTrash = (
            (player.x + PLAYER_COLLISION_MARGIN) < (trashCanX + TRASH_CAN_SIZE - TRASH_COLLISION_MARGIN) &&
            (player.x + player.width - PLAYER_COLLISION_MARGIN) > (trashCanX + TRASH_COLLISION_MARGIN) &&
            Math.abs((player.y + player.height) - trashCanY) < 10 && 
            player.velocityY >= 0
          );
          if (isOnTopOfTrash) {
            player.y = trashCanY - player.height;
            player.velocityY = 0;
            player.currentRow = TRASH_ROW;
          }
        }

        function getLeftmostTile(row) {
          const tiles = platformTiles.filter(t => t.row === row);
          if (!tiles.length) return null;
          return tiles.reduce((a, b) => (a.x < b.x ? a : b));
        }

        // MOVE LEFT
        if (keys.left && !doctorBlock && !trashBlock) {
          player.x -= moveDist;
        }

        // AFTER ALL MOVEMENT, SNAP TO WALL (ALWAYS!)
        if (player.x < 0) {
          player.x = 0;
        }

        // Helper to get the rightmost tile on the row
        function getRightmostTile(row) {
          const tiles = platformTiles.filter(t => t.row === row);
          if (!tiles.length) return null;
          return tiles.reduce((a, b) => (a.x > b.x ? a : b));
        }

        // --- Normal movement with bounds ---
        if (keys.right && !doctorBlock && !trashBlock) {
          player.x += moveDist;
          player.x = Math.min(canvas.width - player.width, player.x); 
        }

        // PLATFORM SUPPORT/FALL CHECK
        const tileUnderPlayer = platformTiles.find(t =>
          t.row === player.currentRow &&
          player.x + player.width > t.x &&
          player.x < t.x + tileSize
        );

        // Always block falling if at the left wall!
        const atLeftWall = player.x <= 1; 

        if (!tileUnderPlayer && !player.isClimbing && player.velocityY === 0 && !atLeftWall) {
          player.velocityY = 1;
        }


        if (time - lastFoodTime > foodCooldown) {
          spawnFood();
          lastFoodTime = time;
        }

        const grav = (player.velocityY < 0 ? jumpGravity : fallGravity) * deltaSec * 60;
        player.velocityY += grav;
        player.y += player.velocityY * deltaSec * 60;

        if (player.velocityY > 0) {
          for (let r = player.currentRow; r <= bottomRow; r++) {
            const land = findTile(r);
            if (land && player.y + player.height >= land.y) {
              player.currentRow = r;
              player.y = land.y - player.height;
              player.velocityY = 0;
              break;
            }
          }
        }

        if (player.velocityY < 0) {
          const above = findTile(player.currentRow - 1);
          if (above && player.y <= above.y + tileHeight) {
            player.y = above.y + tileHeight;
            player.velocityY = 0;
          }
        }
      }

      // 🔻 ADD THIS SAFETY BLOCK BELOW 🔻
      if (player.currentRow === bottomRow) {
        const tile = platformTiles.find(t =>
          t.row === player.currentRow &&
          player.x + player.width > t.x &&
          player.x < t.x + tileSize
        );
        if (tile && player.y + player.height > tile.y) {
          player.y = tile.y - player.height;
          player.velocityY = 0;
        }
        if (player.y + player.height > canvas.height) {
          player.y = canvas.height - player.height;
          player.velocityY = 0;
        }
      }

      // If climbing and holding down, move down the ladder
      if (player.isClimbing && keys.down && player.climbLadder) {
        player.y += climbStep * deltaSec * 0;
        if (player.y + player.height > player.climbLadder.yStart + player.climbLadder.height) {
            player.y = player.climbLadder.yStart + player.climbLadder.height - player.height;
            player.isClimbing = false;
            player.currentRow++;
            player.climbLadder = null;
        }
    }

      // --- Food logic --- //
    foodItems.forEach(food => {
      const centerX = food.x + food.width / 2;
      const tileUnder = platformTiles.find(p =>
        centerX > p.x &&
        centerX < p.x + tileSize &&
        Math.abs((p.y) - (food.y + food.height)) <= 16
      );

      // 1️⃣ NEW: On TRASH_ROW, slide right toward trash can
      if (tileUnder && tileUnder.row === TRASH_ROW) {
        food.falling = false;
        food.velocityX = Math.abs(food.velocityX); 

        if (food.x + food.width >= trashCanX) {
          food.x = trashCanX;
          food._remove = true; 
        } else {
          food.x += food.velocityX;
          food.y = tileUnder.y - food.height;
        }
        return; 
      }

      // --- All other rows: normal food logic ---
      let ladderHere = null;
      if (tileUnder) {
        ladderHere = ladderTiles.find(l =>
          l.row === tileUnder.row &&
          centerX >= l.xStart &&
          centerX <= l.xEnd
        );
      }
      if (!food.falling && tileUnder) {
        if (ladderHere) {
          if (tileUnder.row !== 3) {
            const ladderCenter = ladderHere.xStart + ladderHere.width / 2;
            if (food.decidedLadder !== ladderCenter) {
              food.decidedLadder = ladderCenter;
              food.willFallThisLadder = Math.random() < 0.35;
            }
            if (food.willFallThisLadder) {
              food.falling = true;
              food.decidedLadder = null;
            }
          } else {
            food.willFallThisLadder = false;
            food.decidedLadder = null;
          }
        } else {
          food.decidedLadder = null;
        }
      }
      if (!food.falling && tileUnder) {
        const currentRow = tileUnder.row;
        const { min, max } = rowBounds[currentRow];
        const nextX = food.x + food.velocityX;
        if (nextX < min || nextX + food.width > max) {
          food.falling = true;
          food.x = nextX < min ? min : max - food.width;
          food.decidedLadder = null;
        } else {
          food.x = nextX;
          food.y = tileUnder.y - food.height;
        }
      }
      if (food.falling || !tileUnder) {
        food.falling = true;
        const fallSpeed = 1 + Math.random() * 2;
        const nextPlatform = platformTiles
          .filter(p =>
            centerX > p.x &&
            centerX < p.x + tileSize &&
            p.y > food.y + food.height
          )
          .sort((a, b) => a.y - b.y)[0];
        if (nextPlatform && food.y + food.height + fallSpeed >= nextPlatform.y) {
          food.y = nextPlatform.y - food.height;
          food.falling = false;
          food.velocityX *= -1;
          food.decidedLadder = null;
        } else {
          food.y += fallSpeed;
        }
      }

          // Remove food if inside trash can collision
          if (
            tileUnder &&
            tileUnder.row === TRASH_ROW &&
            food.x <= trashCanX + TRASH_CAN_WIDTH &&
            food.x + food.width >= trashCanX &&
            food.y + food.height >= trashCanY &&
            food.y <= trashCanY + TRASH_CAN_HEIGHT
          ) {
            food._remove = true;
          }
        });
        for (let i = foodItems.length - 1; i >= 0; i--) {
          if (foodItems[i]._remove) foodItems.splice(i, 1);
        }


        // === Player sprite facing & animation state ===
        if (keys.left) {
          player.facing = 'left';
          player.isWalking = true;
        } else if (keys.right) {
          player.facing = 'right';
          player.isWalking = true;
        } else {
          player.isWalking = false;
        }

        player.isJumping = player.velocityY !== 0;

        // Walk animation frame logic
        if (player.isWalking) {
          player.walkAnimTimer += deltaSec;
          if (player.walkAnimTimer > 0.9) {
            player.walkFrame = 1 - player.walkFrame;
            player.walkAnimTimer = 0;
          }
        } else {
          player.walkFrame = 0;
        }
      drawScene();
      
      // --- GAME WIN CHECK ---
      // Check if player collects the golden apple
      if (
        !goldenApple.collected &&
        (player.x + PLAYER_COLLISION_MARGIN) < (goldenApple.x + goldenApple.width - APPLE_COLLISION_MARGIN) &&
        (player.x + player.width - PLAYER_COLLISION_MARGIN) > (goldenApple.x + APPLE_COLLISION_MARGIN) &&
        (player.y + PLAYER_COLLISION_MARGIN) < (goldenApple.y + goldenApple.height - APPLE_COLLISION_MARGIN) &&
        (player.y + player.height - PLAYER_COLLISION_MARGIN) > (goldenApple.y + APPLE_COLLISION_MARGIN)
      ) {
        goldenApple.collected = true;
        saveEatWrightScore(score);

        // ---- STOP GAMEPLAY MUSIC! ----
        music.ingameMusic.pause();
        music.ingameMusic.currentTime = 0;

        // Play the result SFX
        sfx.sfxGoldenApple.currentTime = 0;
        sfx.sfxGoldenApple.play();

        // Option 1: Use the 'ended' event for best sync
        sfx.sfxGoldenApple.onended = () => {
          this._showGameOverOverlay(score);
        };
        return; 
      }

      for (let i = foodItems.length - 1; i >= 0; i--) {
        const food = foodItems[i];
        if (
          (player.x + PLAYER_COLLISION_MARGIN) < (food.x + food.width - FOOD_COLLISION_MARGIN) &&
          (player.x + player.width - PLAYER_COLLISION_MARGIN) > (food.x + FOOD_COLLISION_MARGIN) &&
          (player.y + PLAYER_COLLISION_MARGIN) < (food.y + food.height - FOOD_COLLISION_MARGIN) &&
          (player.y + player.height - PLAYER_COLLISION_MARGIN) > (food.y + FOOD_COLLISION_MARGIN)
        ) {
          if (food.type === 'healthy') {
            score += 25;
          } else if (food.type === 'junk') {
            score -= 25;
            if (score < 0) score = 0;
          }
          // Play SFX only here, only once per food
          sfx.sfxCollectFoods.pause();
          sfx.sfxCollectFoods.currentTime = 0;
          sfx.sfxCollectFoods.play();

          // Remove food immediately
          foodItems.splice(i, 1);
        }
      }
      requestAnimationFrame(update);
    }





function drawScene() {
  ctx.fillStyle = '#1C1C1C';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw platforms with image
  platformTiles.forEach(t => {
    ctx.drawImage(images.platformImg, t.x, t.y, tileSize, tileHeight);
  });

  // Draw ladders with image ONLY if loaded, otherwise use a fallback color
ladderTiles.forEach(l => {
  const tileW = 27; 
  const tileH = 52; 
  const scaleW = l.width; 
  let yDraw = l.yStart;
  let hLeft = l.height;

  // Draw tiles until the full ladder height is covered
  while (hLeft > 0) {
    const drawH = Math.min(tileH, hLeft);
    ctx.drawImage(
      images.ladderImg,
      0, 0, tileW, drawH,  
      l.xStart, yDraw, scaleW, drawH 
    );
    yDraw += drawH;
    hLeft -= drawH;
  }
});

let playerImgToDraw;

// JUMPING? (prioritise jump pose if you have one) 
if (player.facing === 'left') {
  if (player.isWalking) {
    playerImgToDraw = images.playerLeftWalkingImgs[player.walkFrame];
  } else {
    playerImgToDraw = images.playerLeftStandingImg;
  }
} else if (player.facing === 'right') {
  if (player.isWalking) {
    playerImgToDraw = images.playerRightWalkingImgs[player.walkFrame];
  } else {
    playerImgToDraw = images.playerRightStandingImg;
  }
} else {
  playerImgToDraw = images.playerFrontStandingImg;
}


// Only draw if loaded, otherwise fallback to rectangle
if (playerImgToDraw && playerImgToDraw.complete && playerImgToDraw.naturalWidth !== 0) {
  ctx.drawImage(playerImgToDraw, player.x, player.y, player.width, player.height);
} else {
  ctx.fillStyle = 'red';
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

// Draw doctor using image
if (doctorIsThrowing) {
  // Doctor is throwing food
  if (images.doctorThrowingImg.complete && images.doctorThrowingImg.naturalWidth !== 0) {
    ctx.drawImage(images.doctorThrowingImg, doctor.x, doctor.y, doctor.width, doctor.height);
  } else {
    // fallback: draw a rectangle if image not loaded yet
    ctx.fillStyle = 'darkblue';
    ctx.fillRect(doctor.x, doctor.y, doctor.width, doctor.height);
  }
} else {
  // Doctor is standing idle
  if (images.doctorStandingImg.complete && images.doctorStandingImg.naturalWidth !== 0) {
    ctx.drawImage(images.doctorStandingImg, doctor.x, doctor.y, doctor.width, doctor.height);
  } else {
    // fallback: draw a rectangle if image not loaded yet
    ctx.fillStyle = 'blue';
    ctx.fillRect(doctor.x, doctor.y, doctor.width, doctor.height);
  }
}

// --- Draw golden apple as an image ---
if (!goldenApple.collected) {
  if (images.goldenAppleImg.complete && images.goldenAppleImg.naturalWidth !== 0) {
    ctx.drawImage(images.goldenAppleImg, goldenApple.x, goldenApple.y, goldenApple.width, goldenApple.height);
  } else {
    ctx.fillStyle = 'gold';
    ctx.fillRect(goldenApple.x, goldenApple.y, goldenApple.width, goldenApple.height);
  }
}

ctx.drawImage(images.trashCanImg, trashCanX, trashCanY, TRASH_CAN_WIDTH, TRASH_CAN_HEIGHT);

  // Draw the score (top right, white, 4 digits, monospace)
  ctx.font = '45px Silkscreen, monospace';
  ctx.textAlign = 'right';
  ctx.fillStyle = '#fff';
  ctx.fillText(score.toString().padStart(4, '0'), canvas.width - 24, 48);

foodItems.forEach((food) => {
  if (food.img.complete && food.img.naturalWidth !== 0) {
    ctx.drawImage(food.img, food.x, food.y, food.width, food.height);
  } else {
    ctx.fillStyle = food.type === 'healthy' ? 'green' : 'yellow';
    ctx.fillRect(food.x, food.y, food.width, food.height);
  }

  // Collision: Only trigger SFX when player collects food
  if (
    (player.x + PLAYER_COLLISION_MARGIN) < (food.x + food.width - FOOD_COLLISION_MARGIN) &&
    (player.x + player.width - PLAYER_COLLISION_MARGIN) > (food.x + FOOD_COLLISION_MARGIN) &&
    (player.y + PLAYER_COLLISION_MARGIN) < (food.y + food.height - FOOD_COLLISION_MARGIN) &&
    (player.y + player.height - PLAYER_COLLISION_MARGIN) > (food.y + FOOD_COLLISION_MARGIN)
  ) {
    if (food.type === 'healthy') {
      score += 25;
    } else if (food.type === 'junk') {
      score -= 25;
      if (score < 0) score = 0;
    }
    food._remove = true;
    sfx.sfxCollectFoods.pause();
    sfx.sfxCollectFoods.currentTime = 0;
    sfx.sfxCollectFoods.play();
  }
});
}
    requestAnimationFrame(update);
  }

 // === Game over screen toggles between two screens ===
 _showGameOverOverlay(score) {
  sfx.sfxGameEnd.currentTime = 0;
  sfx.sfxGameEnd.play();
  // Always show this screen if score is 0
  if (score === 0) {
    showOverlayScreen({
      app: this.app,
      mainText: "Try Again!",
      subText: `<br>Eat healthy foods to score points!`,
      imgSrc: "assets/images/game_section/angry_red_apple.gif",
      imgExtraClass: "result-img result-img--small",
      imgAlt: "Angry Apple",
      imgClass: "result-img--angry-apple",
      homeAction: () => {
        this.app.innerHTML = '';
        new MainMenuView(this.app).render();
      },
      scoresAction: () => {
        new HighScoresView(this.app).render();
      }
    });
    return; 
  }

  // Otherwise, toggle between the 2 result screens
  resultScreenToggle = !resultScreenToggle;
  if (resultScreenToggle) {
    showOverlayScreen({
      app: this.app,
      mainText: "Healthy Choice!",
      subText: `Your points: <span class="highlight-yellow">${score}</span>`,
      imgSrc: "assets/images/game_section/dancing_golden_apple.gif",
      imgAlt: "Golden Apple Dancing",
      imgClass: "result-img--golden-apple",
      homeAction: () => {
        this.app.innerHTML = '';
        new MainMenuView(this.app).render();
      },
      scoresAction: () => {
        new HighScoresView(this.app).render();
      }
    });
  } else {
    showOverlayScreen({
      app: this.app,
      mainText: "Eggtastic Effort!",
      subText: `<br>Your points: <span class="highlight-yellow">${score}</span>`,
      imgSrc: "assets/images/game_section/dancing_egg.gif",
      imgAlt: "Dancing Egg",
      imgClass: "result-img--small",
      homeAction: () => {
        this.app.innerHTML = '';
        new MainMenuView(this.app).render();
      },
      scoresAction: () => {
        new HighScoresView(this.app).render();
      }
    });
  }
}
}

// ========== OUTSIDE THE CLASS ==========
export function saveEatWrightScore(score) {
  let scores = JSON.parse(localStorage.getItem('eatwright_highscores') || '[]');
  scores.push({ score, date: Date.now() });
  scores = scores.sort((a, b) => b.score - a.score).slice(0, 5);
  localStorage.setItem('eatwright_highscores', JSON.stringify(scores));
}
>>>>>>> f035ecc15a2818ebabc6046d9333b2d4ad01ad14
