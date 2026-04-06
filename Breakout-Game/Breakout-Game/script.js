const rulesButton = document.getElementById("rules-btn");
const closeButton = document.getElementById("close-btn");
const rules = document.getElementById("rules");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const color = getComputedStyle(document.documentElement).getPropertyValue(
  "--button-color"
);
const secondaryColor = getComputedStyle(
  document.documentElement
).getPropertyValue("--sidebar-color");
let score = 0;
let lives = 3;
let currentLevel = 0;
let isBallOnPaddle = true;
let isGameOver = false;
let isLevelComplete = false;
const tickSound = new Audio('tick-sound.mp3');

let adSuccessCallback = null;

function broadcastMessage(type, state) {
  const message = { 
    type: type,
    state: state,
    timestamp: Date.now(),
    gameId: "breakout"
  };
  window.parent.postMessage(message, '*');
  console.log(`Sent: ${JSON.stringify(message)}`);
}

window.addEventListener("message", (event) => {
  if (event.data && event.data.type === "adSuccessfullyWatched") {
    console.log("Ad successfully watched message received");
    if (adSuccessCallback) {
      adSuccessCallback();
      adSuccessCallback = null;
    }
  }
});

const brickRowCount = 9;
const brickColumnCount = 5;

const levelDesigns = [
  // Level 1: Full
  [
    [1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1],
  ],
  // Level 2: Checkerboard
  [
    [1, 0, 1, 0, 1],
    [0, 1, 0, 1, 0],
    [1, 0, 1, 0, 1],
    [0, 1, 0, 1, 0],
    [1, 0, 1, 0, 1],
    [0, 1, 0, 1, 0],
    [1, 0, 1, 0, 1],
    [0, 1, 0, 1, 0],
    [1, 0, 1, 0, 1],
  ],
  // Level 3: V-Shape
  [
    [1, 0, 0, 0, 0],
    [0, 1, 0, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 0, 1, 0],
    [0, 0, 0, 0, 1],
    [0, 0, 0, 1, 0],
    [0, 0, 1, 0, 0],
    [0, 1, 0, 0, 0],
    [1, 0, 0, 0, 0],
  ],
  // Level 4: Columns
  [
    [1, 1, 1, 1, 1],
    [0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1],
    [0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1],
    [0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1],
    [0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1],
  ],
  // Level 5: Rows
  [
    [1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1],
  ],
  // Level 6: Pyramid
  [
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1],
    [0, 0, 0, 1, 1],
    [0, 0, 1, 1, 1],
    [0, 1, 1, 1, 1],
    [0, 0, 1, 1, 1],
    [0, 0, 0, 1, 1],
    [0, 0, 0, 0, 1],
    [0, 0, 0, 0, 0],
  ],
  // Level 7: X-Shape
  [
    [1, 0, 0, 0, 1],
    [0, 1, 0, 1, 0],
    [0, 0, 1, 0, 0],
    [0, 1, 0, 1, 0],
    [1, 0, 0, 0, 1],
    [0, 1, 0, 1, 0],
    [0, 0, 1, 0, 0],
    [0, 1, 0, 1, 0],
    [1, 0, 0, 0, 1],
  ],
  // Level 8: Frames
  [
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 1, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 1, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1],
  ],
  // Level 9: Waves
  [
    [1, 1, 0, 0, 0],
    [0, 1, 1, 0, 0],
    [0, 0, 1, 1, 0],
    [0, 0, 0, 1, 1],
    [0, 0, 1, 1, 0],
    [0, 1, 1, 0, 0],
    [1, 1, 0, 0, 0],
    [0, 1, 1, 0, 0],
    [0, 0, 1, 1, 0],
  ],
  // Level 10: Random Pattern
  [
    [1, 0, 1, 0, 1],
    [1, 1, 0, 1, 1],
    [0, 0, 1, 0, 0],
    [1, 1, 0, 1, 1],
    [1, 0, 1, 0, 1],
    [1, 1, 0, 1, 1],
    [0, 0, 1, 0, 0],
    [1, 1, 0, 1, 1],
    [1, 0, 1, 0, 1],
  ],
];

const bricks = [];
function createBricks() {
  const design = levelDesigns[currentLevel % levelDesigns.length];
  for (let i = 0; i < brickRowCount; i++) {
    bricks[i] = [];
    for (let j = 0; j < brickColumnCount; j++) {
      const x = i * (brickInfo.w + brickInfo.padding) + brickInfo.offsetX;
      const y = j * (brickInfo.h + brickInfo.padding) + brickInfo.offsetY;
      bricks[i][j] = { x, y, ...brickInfo, visible: design[i][j] === 1 };
    }
  }
}

canvas.width = 800;
canvas.height = 600;

// Elements
const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  size: 10,
  speed: 4,
  dx: 4,
  dy: -4,
};

const paddle = {
  x: canvas.width / 2 - 40,
  y: canvas.height - 20,
  w: 80,
  h: 10,
  speed: 8,
  dx: 0,
};

const brickInfo = {
  w: 70,
  h: 20,
  padding: 10,
  offsetX: 45,
  offsetY: 60,
  visible: true,
};

createBricks();

// Create Elements
function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
  ctx.fillStyle = secondaryColor;
  ctx.fill();
  ctx.closePath();
}

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddle.x, paddle.y, paddle.w, paddle.h);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.closePath();
  // document.getElementById("next-level-btn").classList.add("show");
}

function drawScore() {
  ctx.font = '20px "Balsamiq Sans"';
  ctx.fillStyle = secondaryColor;
  ctx.fillText(`Score: ${score}`, canvas.width - 100, 30);
  ctx.fillText(`Lives: ${lives}`, 20, 30);
  ctx.fillText(`Level: ${currentLevel + 1}`, canvas.width / 2 - 40, 30);
}

function drawBricks() {
  bricks.forEach((column) => {
    column.forEach((brick) => {
      ctx.beginPath();
      ctx.rect(brick.x, brick.y, brick.w, brick.h);
      ctx.fillStyle = brick.visible ? color : "transparent";
      ctx.fill();
      ctx.closePath();
    });
  });
}

function draw() {
  // clear
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // draw
  drawBall();
  drawPaddle();
  drawScore();
  drawBricks();
}

// Animate Elements
function movePaddle() {
  paddle.x += paddle.dx;

  if (paddle.x + paddle.w > canvas.width) paddle.x = canvas.width - paddle.w;
  if (paddle.x < 0) paddle.x = 0;

  // Release ball on movement
  if (isBallOnPaddle && paddle.dx !== 0) {
    isBallOnPaddle = false;
  }
}

function moveBall() {
  if (isGameOver || isLevelComplete) return;

  if (isBallOnPaddle) {
    ball.x = paddle.x + paddle.w / 2;
    ball.y = paddle.y - ball.size;
    return;
  }

  ball.x += ball.dx;
  ball.y += ball.dy;
  // wall collision
  if (ball.x + ball.size > canvas.width || ball.x - ball.size < 0) {
    // right and left
    ball.dx *= -1;
  }
  if (ball.y - ball.size < 0) {
    // top
    ball.dy *= -1;
  }

  // paddle
  if (
    ball.x - ball.size > paddle.x &&
    ball.x + ball.size < paddle.x + paddle.w &&
    ball.y + ball.size > paddle.y
  ) {
    // Determine where the ball hit the paddle
    let collidePoint = ball.x - (paddle.x + paddle.w / 2);
    // Normalize to -1 to 1
    let normalizedCollidePoint = collidePoint / (paddle.w / 2);
    
    // Set new dx based on hit position
    ball.dx = normalizedCollidePoint * ball.speed * 1.5;
    ball.dy = -ball.speed;
  }
  // bricks
  bricks.forEach((column) => {
    column.forEach((brick) => {
      if (brick.visible) {
        if (
          ball.x - ball.size > brick.x && // left brick side check
          ball.x + ball.size < brick.x + brick.w && // right brick side check
          ball.y + ball.size > brick.y && // top brick side check
          ball.y - ball.size < brick.y + brick.h // bottom brick side check
        ) {
          ball.dy *= -1;
          brick.visible = false;
          tickSound.currentTime = 0;
          tickSound.play();
          increaseScore();
        }
      }
    });
  });

  // ball miss
  if (ball.y + ball.size > canvas.height) {
    lives--;
    if (lives > 0) {
      resetBallOnPaddle();
    } else {
      isGameOver = true;
      startReviveTimer();
    }
  }
}

function resetBallOnPaddle() {
  isBallOnPaddle = true;
  ball.dx = 4;
  ball.dy = -4;
}

function increaseScore() {
  score++;
  if (isLevelCleared()) {
    isLevelComplete = true;
    document.getElementById("next-level-btn").classList.add("show");
  }
}

function isLevelCleared() {
  return bricks.every((column) => column.every((brick) => !brick.visible));
}

function showAllBricks() {
  createBricks(); // Reload bricks based on level design
}

// Handle Key Events
function keyDown(e) {
  if (e.key === "Right" || e.key === "ArrowRight") paddle.dx = paddle.speed;
  else if (e.key === "Left" || e.key === "ArrowLeft") paddle.dx = -paddle.speed;
}

function keyUp(e) {
  if (
    e.key === "Right" ||
    e.key === "ArrowRight" ||
    e.key === "Left" ||
    e.key === "ArrowLeft"
  ) {
    paddle.dx = 0;
  }
}

// Update Canvas
function update() {
  // update
  movePaddle();
  moveBall();
  // draw
  draw();
  requestAnimationFrame(update);
}

// Touch Controls
function handleTouch(e) {
  const touch = e.touches[0];
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const touchX = (touch.clientX - rect.left) * scaleX;
  
  paddle.x = touchX - paddle.w / 2;
  
  // Keep paddle within bounds
  if (paddle.x < 0) paddle.x = 0;
  if (paddle.x + paddle.w > canvas.width) paddle.x = canvas.width - paddle.w;
  
  // Release ball if it's on the paddle
  if (isBallOnPaddle) {
    isBallOnPaddle = false;
  }
}

// Event Listeners
document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);

canvas.addEventListener("touchstart", (e) => {
  e.preventDefault();
  handleTouch(e);
}, { passive: false });

canvas.addEventListener("touchmove", (e) => {
  e.preventDefault();
  handleTouch(e);
}, { passive: false });
rulesButton.addEventListener("click", () => rules.classList.add("show"));
closeButton.addEventListener("click", () => rules.classList.remove("show"));

const restartButton = document.querySelector("#restart-btn") || document.createElement("button");
restartButton.id = "restart-btn";
restartButton.className = "btn restart-btn";
restartButton.innerText = "Restart Game";
document.querySelector(".canvas-container").appendChild(restartButton);

const nextLevelButton = document.createElement("button");
nextLevelButton.id = "next-level-btn";
nextLevelButton.className = "btn next-level-btn";
nextLevelButton.innerText = "Next Level";
document.querySelector(".canvas-container").appendChild(nextLevelButton);

const reviveButton = document.createElement("button");
reviveButton.id = "revive-btn";
reviveButton.className = "btn revive-btn";
document.querySelector(".canvas-container").appendChild(reviveButton);

let reviveInterval;

restartButton.addEventListener("click", resetGame);
nextLevelButton.addEventListener("click", nextLevel);
reviveButton.addEventListener("click", reviveGame);

function nextLevel() {
  const proceedToNextLevel = () => {
    currentLevel++;
    isLevelComplete = false;
    createBricks();
    resetBallOnPaddle();
    nextLevelButton.classList.remove("show");
  };

  // Show ad on alternate levels (2, 4, 6...)
  if ((currentLevel + 1) % 2 === 0) {
    adSuccessCallback = proceedToNextLevel;
    broadcastMessage("showInterstitialAd", "OnBeforeStartLevel");
  } else {
    proceedToNextLevel();
  }
}

function resetGame() {
  const proceedToReset = () => {
    score = 0;
    lives = 3;
    currentLevel = 0;
    isGameOver = false;
    isLevelComplete = false;
    clearInterval(reviveInterval);
    createBricks();
    resetBallOnPaddle();
    restartButton.classList.remove("show");
    restartButton.classList.remove("with-revive");
    nextLevelButton.classList.remove("show");
    reviveButton.classList.remove("show");
  };

  // Show ad on alternate levels (2, 4, 6...) when restarting
  if ((currentLevel + 1) % 2 === 0) {
    adSuccessCallback = proceedToReset;
    broadcastMessage("showInterstitialAd", "OnBeforeStartLevel");
  } else {
    proceedToReset();
  }
}

function startReviveTimer() {
  let timeLeft = 5;
  reviveButton.innerText = `Revive (${timeLeft}s)`;
  reviveButton.classList.add("show");
  restartButton.classList.add("show");
  restartButton.classList.add("with-revive");

  clearInterval(reviveInterval);
  reviveInterval = setInterval(() => {
    timeLeft--;
    reviveButton.innerText = `Revive (${timeLeft}s)`;
    if (timeLeft <= 0) {
      clearInterval(reviveInterval);
      reviveButton.classList.remove("show");
      restartButton.classList.remove("with-revive");
    }
  }, 1000);
}

function reviveGame() {
  adSuccessCallback = () => {
    clearInterval(reviveInterval);
    lives = 2;
    isGameOver = false;
    isLevelComplete = false;
    resetBallOnPaddle();
    reviveButton.classList.remove("show");
    restartButton.classList.remove("show");
    restartButton.classList.remove("with-revive");
  };
  broadcastMessage("showRewardedAd", "GameOver");
}

// Init
update();
