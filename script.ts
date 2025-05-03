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
let bird = {
  x: 50,
  y: 150,
  width: 20,
  height: 20,
  gravity: 1.5,
  lift: -12,
  velocity: 0,
  update: function () {
    this.velocity += this.gravity;
    this.y += this.velocity;
  },
  flap: function () {
    this.velocity = this.lift;
    flapSound.play();
  }
};

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
  bird.update();
  ctx.fillStyle = "#FF0";
  ctx.fillRect(bird.x, bird.y, bird.width, bird.height);

  for (let i = 0; i < pipes.length; i++) {
    let p = pipes[i];
    ctx.fillStyle = "#0F0";
    ctx.fillRect(p.x, p.y, p.width, p.height);
    ctx.fillRect(p.x, p.height + p.gap, p.width, canvas.height - p.height - p.gap);

    p.x -= 2;

    // Collision
    if (
      bird.x < p.x + p.width &&
      bird.x + bird.width > p.x &&
      (bird.y < p.height || bird.y > p.height + p.gap)
    ) {
      gameOver();
    }

    // Score
    if (p.x + p.width === bird.x) {
      score++;
      scoreSound.play();
      scoreDisplay.innerText = "Score: " + score;
    }
  }

  // Gravity edge check
  if (bird.y + bird.height >= canvas.height || bird.y < 0) {
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
  bird.y = 150;
  bird.velocity = 0;
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
  if (e.code === 'Space') bird.flap();
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
