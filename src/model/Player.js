// src/model/Player.js

export default class Player {
  constructor({ x, y, width = 80, height = 60, currentRow = 0 }) {
    // Position and dimensions
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    // Physics & State
    this.speed = 1.5;
    this.velocityY = 0;
    this.isClimbing = false;
    this.isDescending = false;
    this.isDroppingThrough = false;
    this.climbLadder = null;
    this.currentRow = currentRow;
    this.isOnLadder = false;
    this.isClimbingLadder = false;
    this.facing = 'right';
    this.isWalking = false;
    this.isJumping = false;
    this.walkFrame = 0;
    this.walkAnimTimer = 0;
  }

  handleInput(keys) {
    if (keys.left) {
      this.facing = 'left';
      this.isWalking = true;
    } else if (keys.right) {
      this.facing = 'right';
      this.isWalking = true;
    } else {
      this.isWalking = false;
    }
    // Jump flag is managed in update for physics (not here)
  }

  update({ 
    keys, 
    platformTiles, 
    rowBounds, 
    tileHeight,
    ladderTiles, 
    jumpGravity, 
    fallGravity, 
    climbStep, 
    canvasHeight,
    deltaSec,
    doctor,
    doctorRow = 0,
    trashCan = null,
    trashRow = null,
    PLAYER_COLLISION_MARGIN = 8
  }) {
    // Main movement logic (call this from your main update loop)

    // Handle walking input
    this.handleInput(keys);

    if (!this.isClimbing) {
      const moveDist = this.speed * deltaSec * 60;
      // Handle left/right movement with bounds
      if (keys.left) this.x -= moveDist;
      if (keys.right) this.x += moveDist;

      if (this.x < 0) this.x = 0;

      // (Doctor/trash collisions can be managed here if you pass those objects in as args)
      // If needed, block movement based on doctor/trash location as per your main game

      // Gravity
      const grav = (this.velocityY < 0 ? jumpGravity : fallGravity) * deltaSec * 60;
      this.velocityY += grav;
      this.y += this.velocityY * deltaSec * 60;

      // Falling: Snap onto platforms if standing
      const tileUnder = platformTiles.find(t =>
        t.row === this.currentRow &&
        this.x + this.width > t.x &&
        this.x < t.x + tileHeight
      );
      if (this.velocityY > 0 && tileUnder && this.y + this.height >= tileUnder.y) {
        this.y = tileUnder.y - this.height;
        this.velocityY = 0;
      }
      // Simple jump end detection
      this.isJumping = this.velocityY !== 0;
    }

    // Climbing ladder
    if (this.isClimbing && this.climbLadder) {
      if (keys.up) {
        const nextY = this.y - climbStep;
        if (nextY <= this.climbLadder.yStart - 50) {
          this.isClimbing = false;
          this.climbLadder = null;
        } else {
          this.y = nextY;
        }
      }
      if (keys.down) {
        const nextY = this.y + climbStep;
        const bottomY = this.climbLadder.yStart + this.climbLadder.height - this.height;
        if (nextY >= bottomY) {
          this.y = bottomY;
          this.isClimbing = false;
          this.climbLadder = null;
        } else {
          this.y = nextY;
        }
      }
    }

    // Animate walk frame
    if (this.isWalking) {
      this.walkAnimTimer += deltaSec;
      if (this.walkAnimTimer > 0.9) {
        this.walkFrame = 1 - this.walkFrame;
        this.walkAnimTimer = 0;
      }
    } else {
      this.walkFrame = 0;
    }

    // Snap to bottom
    if (this.y + this.height > canvasHeight) {
      this.y = canvasHeight - this.height;
      this.velocityY = 0;
    }
  }

  jump(jumpVelocity = -4) {
    // Only jump if not already moving vertically or climbing
    if (!this.isClimbing && !this.isDescending && this.velocityY === 0) {
      this.velocityY = jumpVelocity;
      this.isJumping = true;
      // Play jump SFX in main game, not here
    }
  }

  startClimb(ladder) {
    this.isClimbing = true;
    this.climbLadder = ladder;
    this.velocityY = 0;
  }

  stopClimb() {
    this.isClimbing = false;
    this.climbLadder = null;
  }

  // -- Drawing --
  draw(ctx, sprites) {
    // sprites: { front, left, right, leftWalk, rightWalk }
    let img = sprites.front;
    if (this.facing === 'left') {
      img = this.isWalking ? sprites.leftWalk[this.walkFrame] : sprites.left;
    } else if (this.facing === 'right') {
      img = this.isWalking ? sprites.rightWalk[this.walkFrame] : sprites.right;
    }
    if (img && img.complete && img.naturalWidth !== 0) {
      ctx.drawImage(img, this.x, this.y, this.width, this.height);
    } else {
      ctx.fillStyle = 'red';
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
  }
}
