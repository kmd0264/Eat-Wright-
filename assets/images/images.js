// assets/images.js

// Loads and organizes all the images used in Eat Wright! 
// Contains the platform, doctor, trash, golden apple and player images.

// Platform
export const platformImg = new Image();
platformImg.src = 'assets/images/tileset/platform.png';

// Ladder
export const ladderImg = new Image();
ladderImg.src = 'assets/images/tileset/ladder.png';

// Doctor
export const doctorStandingImg = new Image();
doctorStandingImg.src = 'assets/images/tileset/doctor_standing.png';

export const doctorThrowingImg = new Image();
doctorThrowingImg.src = 'assets/images/tileset/doctor_throwing.png';

// Trash
export const trashCanImg = new Image();
trashCanImg.src = 'assets/images/tileset/trash.png';

// Golden apple
export const goldenAppleImg = new Image();
goldenAppleImg.src = 'assets/images/tileset/golden_apple.png';

// Player
export const playerFrontStandingImg = new Image();
playerFrontStandingImg.src = 'assets/images/wright/front_standing.png';

export const playerLeftStandingImg = new Image();
playerLeftStandingImg.src = 'assets/images/wright/left_side_standing.png';

export const playerLeftWalkingImgs = [new Image(), new Image()];
playerLeftWalkingImgs[0].src = 'assets/images/wright/left_side_walking.png';
playerLeftWalkingImgs[1].src = 'assets/images/wright/left_side_walking_1.png';

export const playerRightStandingImg = new Image();
playerRightStandingImg.src = 'assets/images/wright/right_side_standing.png';

export const playerRightWalkingImgs = [new Image(), new Image()];
playerRightWalkingImgs[0].src = 'assets/images/wright/right_side_walking.png';
playerRightWalkingImgs[1].src = 'assets/images/wright/right_side_walking_1.png';

// Export as default object
const images = {
  platformImg,
  ladderImg,
  doctorStandingImg,
  doctorThrowingImg,
  trashCanImg,
  goldenAppleImg,
  playerFrontStandingImg,
  playerLeftStandingImg,
  playerLeftWalkingImgs,
  playerRightStandingImg,
  playerRightWalkingImgs
};

export default images;
