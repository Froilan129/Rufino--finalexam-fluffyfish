const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const restartBtn = document.getElementById('restartBtn');
const offlineNotice = document.getElementById('offlineNotice');
const bgMusic = document.getElementById('bgMusic');
const flapSound = document.getElementById('flapSound');
const scoreSound = document.getElementById('scoreSound');

let frames = 0;
let score = 0;
let fish = {
  x: 50,
  y: 150,
  width: 32,
  height: 32,
  image: new Image(),
  gravity: 0.7,
  lift: -10,
  velocity: 0,
  update: function () {
    this.velocity += this.gravity;
    this.y += this.velocity;
  },
  swim: function () {
    this.velocity = this.lift;
    flapSound.play();
  },
  draw: function () {
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }
};
fish.image.src = 'assets/bangus.png'; // Adjust the path as necessary

let pipes = [];

function createPipe() {
  let gap = 100;
  let topHeight = Math.floor(Math.random() * 200) + 20;
  pipes.push({
    x: canvas.width,
    y: 0,
    width: 30,
    height: topHeight,
    gap: gap
  });
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  fish.update();
  fish.draw();

  for (let i = 0; i < pipes.length; i++) {
    let p = pipes[i];
    ctx.fillStyle = "#0F0";
    ctx.fillRect(p.x, p.y, p.width, p.height);
    ctx.fillRect(p.x, p.height + p.gap, p.width, canvas.height - p.height - p.gap);

    p.x -= 2;

    // Collision detection for pipes
    if (
      fish.x < p.x + p.width &&
      fish.x + fish.width > p.x &&
      (fish.y < p.height || fish.y > p.height + p.gap)
    ) {
      gameOver();
    }

    // Increment score when passing pipes
    if (p.x + p.width === fish.x) {
      score++;
      scoreSound.play();
      scoreDisplay.innerText = "Score: " + score;
    }
  }

  // Gravity edge check for fish
  if (fish.y + fish.height >= canvas.height || fish.y < 0) {
    gameOver();
  }

  frames++;
  if (frames % 100 === 0) {
    createPipe();
  }

  if (!gameOverFlag) requestAnimationFrame(draw);
}

let gameOverFlag = false;

function gameOver() {
  gameOverFlag = true;
  restartBtn.style.display = 'inline-block';
  bgMusic.pause();
}

function restartGame() {
  fish.y = 150;
  fish.velocity = 0;
  pipes = [];
  frames = 0;
  score = 0;
  scoreDisplay.innerText = "Score: 0";
  restartBtn.style.display = 'none';
  gameOverFlag = false;
  bgMusic.currentTime = 0;
  bgMusic.play();
  draw();
}

document.addEventListener('keydown', e => {
  if (e.code === 'Space') fish.swim();
});
restartBtn.addEventListener('click', restartGame);

// Internet detection
function updateOnlineStatus() {
  if (navigator.onLine) {
    offlineNotice.style.display = 'none';
  } else {
    offlineNotice.style.display = 'block';
  }
}
window.addEventListener('online', updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);

// Start game
updateOnlineStatus();
bgMusic.play();
createPipe();
draw();
