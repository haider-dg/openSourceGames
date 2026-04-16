const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const tileSize = 16;
const corridorScale = 1.25;
const corridorTile = Math.round(tileSize * corridorScale);
const wallSize = tileSize;
const cols = 28;
const rows = 31;

canvas.width = cols * corridorTile;
canvas.height = rows * corridorTile;

const scoreEl = document.getElementById("score");
const livesEl = document.getElementById("lives");
const levelEl = document.getElementById("level");
const restartBtn = document.getElementById("restartBtn");
const nextLevelOverlay = document.getElementById("nextLevelOverlay");
const nextLevelBtn = document.getElementById("nextLevelBtn");

// 0: empty, 1: wall, 2: pellet, 3: power pellet
const levelLayouts = [
  [
    "1111111111111111111111111111",
    "1222222222112222222222222221",
    "1211112112112112112111112121",
    "1311112112112112112111112131",
    "1222222222222222222222222221",
    "1211112111112111112111112121",
    "1222222112222222211222222221",
    "1111112112111112112111111111",
    "0000012112110002112110000000",
    "1111112112111112112111111111",
    "1222222222222112222222222221",
    "1211112111112111112111112121",
    "1222212222222222222222122221",
    "1111212111110001111122111111",
    "0000212110000000000122110000",
    "1111212110111111101122111111",
    "1222222220222222202222222221",
    "1211112112111112112111112121",
    "1222222112222222211222222221",
    "1111112112111112112111111111",
    "0000012112110002112110000000",
    "1111112112111112112111111111",
    "1222222222222222222222222221",
    "1211112111112111112111112121",
    "1311112222222112222222112131",
    "1222222111112111111122222221",
    "1111112112222222212111111111",
    "1222222222112222112222222221",
    "1211111112112112111111112121",
    "1222222222222222222222222221",
    "1111111111111111111111111111",
  ],
  [
    "1111111111111111111111111111",
    "1222222222112222112222222221",
    "1211112112112112112112111121",
    "1322222222222222222222222231",
    "1211112111112111112111112121",
    "1222222112222222211222222221",
    "1111112112111112112111111111",
    "0000012112110002112110000000",
    "1111112112111112112111111111",
    "1222222222222112222222222221",
    "1211112111112111112111112121",
    "1222212222222222222222122221",
    "1111212111110001111122111111",
    "0000212110000000000122110000",
    "1111212110111111101122111111",
    "1222222220222222202222222221",
    "1211112112111112112111112121",
    "1222222112222222211222222221",
    "1111112112111112112111111111",
    "0000012112110002112110000000",
    "1111112112111112112111111111",
    "1222222222222222222222222221",
    "1211112111112111112111112121",
    "1311112222222112222222112131",
    "1222222111112111111122222221",
    "1111112112222222212111111111",
    "1222222222112222112222222221",
    "1211111112112112111111112121",
    "1222222222222222222222222221",
    "1222222222222222222222222221",
    "1111111111111111111111111111",
  ],
];

let map = [];
let pelletsRemaining = 0;
let currentLevel = 0;

// localVars for Ads
let lastAdTime = 0;
const AD_COOLDOWN = 180000; // 3 minutes
const localVars = {
  vState: "game_load",
  vGameID: "pac_man_01"
};
let pendingAdCallback = null;

function broadcastAdMessage(state = localVars.vState) {
  const message = {
    type: "showInterstitialAd",
    state: state,
    timestamp: Date.now(),
    gameId: localVars.vGameID
  };
  window.parent.postMessage(message, "*");
  // console.log(`Sent: ${JSON.stringify(message)}`);
}

function triggerAd(state, callback) {
  const now = Date.now();
  if (now - lastAdTime >= AD_COOLDOWN) {
    pendingAdCallback = callback;
    broadcastAdMessage(state);
  } else {
    if (callback) callback();
  }
}

window.addEventListener("message", (event) => {
  if (event.data.type === "adSuccessfullyWatched") {
    // console.log("Received: Ad Watched");
    lastAdTime = Date.now();
    if (pendingAdCallback) {
      const cb = pendingAdCallback;
      pendingAdCallback = null;
      cb();
    }
  }
});

const pacman = {
  x: 1,
  y: 29,
  dirX: 0,
  dirY: 0,
  nextDirX: 0,
  nextDirY: 0,
  speed: 8,
  radius: tileSize * 0.6,
};

let ghosts = [];

const ghostColors = ["#ff4b4b", "#4bc6ff", "#ffb8de", "#ffb847", "#00ffde", "#ff4500"];

function createGhost(id) {
  // Start in ghost house area (center) - keep them in row 14 where it's empty
  return {
    x: 13 + (id % 3), // Spread them out horizontally a bit
    y: 14,
    dirX: id % 2 === 0 ? 1 : -1,
    dirY: 0,
    color: ghostColors[id % ghostColors.length]
  };
}

let score = 0;
let lives = 3;
let gameOver = false;
let lastTime = 0;
let gameTime = 0;

let audioCtx = null;
let backgroundOsc = null;
let backgroundGain = null;
let backgroundInterval = null;
let backgroundStarted = false;

function getAudioContext() {
  if (audioCtx) return audioCtx;
  const Ctx = window.AudioContext || window.webkitAudioContext;
  if (!Ctx) return null;
  audioCtx = new Ctx();
  return audioCtx;
}

function startBackgroundSound() {
  if (backgroundStarted) return;
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    ctx.resume();
    backgroundOsc = ctx.createOscillator();
    backgroundGain = ctx.createGain();
    backgroundOsc.connect(backgroundGain);
    backgroundGain.connect(ctx.destination);
    backgroundOsc.type = "sawtooth";
    backgroundOsc.frequency.setValueAtTime(200, ctx.currentTime);
    backgroundGain.gain.setValueAtTime(0.04, ctx.currentTime);
    backgroundOsc.start(ctx.currentTime);
    backgroundStarted = true;
    backgroundInterval = setInterval(() => {
      if (!backgroundOsc || !ctx) return;
      const t = Date.now() / 1000;
      const freq = 180 + 130 * Math.sin(t * 0.85);
      backgroundOsc.frequency.setTargetAtTime(freq, ctx.currentTime, 0.08);
    }, 80);
  } catch (_) {}
}

function playPelletSound() {
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    ctx.resume();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "square";
    osc.frequency.setValueAtTime(680, ctx.currentTime);
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.06);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.06);
  } catch (_) {}
}

function playDeathSound() {
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    ctx.resume();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(220, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(55, ctx.currentTime + 0.6);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.6);
  } catch (_) {}
}

function initMap() {
  map = [];
  pelletsRemaining = 0;
  const layout = levelLayouts[currentLevel % levelLayouts.length];
  for (let r = 0; r < rows; r++) {
    const row = [];
    for (let c = 0; c < cols; c++) {
      let val = Number(layout[r][c]);
      if (val === 2 || val === 3) pelletsRemaining++;
      row.push(val);
    }
    map.push(row);
  }
}

function resetEntities() {
  pacman.x = 1;
  pacman.y = 29;
  pacman.dirX = 0;
  pacman.dirY = 0;
  pacman.nextDirX = 0;
  pacman.nextDirY = 0;
  lastTime = 0; // Reset timing to prevent massive delta after pause/reset

  ghosts = [];
  const ghostCount = 2 + currentLevel;
  for (let i = 0; i < ghostCount; i++) {
    ghosts.push(createGhost(i));
  }
}

function restartGame() {
    score = 0;
    lives = 3;
    currentLevel = 0;
    gameOver = false;
    nextLevelOverlay.classList.add("hidden");
    initMap();
    resetEntities();
    updateUI();
}

function startNextLevel() {
  currentLevel++;
  gameOver = false;
  nextLevelOverlay.classList.add("hidden");
  initMap();
  resetEntities();
  updateUI();
}

function updateUI() {
  scoreEl.textContent = score;
  livesEl.textContent = lives;
  levelEl.textContent = currentLevel + 1;
}

function isWall(col, row) {
  if (row < 0 || row >= rows || col < 0 || col >= cols) return true;
  return map[row][col] === 1;
}

function trySetDirection(dx, dy) {
  pacman.nextDirX = dx;
  pacman.nextDirY = dy;
}

function handleInput() {
  const centerCol = Math.round(pacman.x);
  const centerRow = Math.round(pacman.y);
  const offsetX = Math.abs(pacman.x - centerCol);
  const offsetY = Math.abs(pacman.y - centerRow);
  const aligned = offsetX < 0.35 && offsetY < 0.35;
  const stopped = pacman.dirX === 0 && pacman.dirY === 0;

  if (aligned || stopped) {
    const targetCol = centerCol + pacman.nextDirX;
    const targetRow = centerRow + pacman.nextDirY;
    if (!isWall(targetCol, targetRow)) {
      pacman.dirX = pacman.nextDirX;
      pacman.dirY = pacman.nextDirY;
    }
  }
}

function movePacman(deltaSeconds) {
  handleInput();
  const speedPerFrame = pacman.speed * deltaSeconds;
  let newX = pacman.x + pacman.dirX * speedPerFrame;
  let newY = pacman.y + pacman.dirY * speedPerFrame;

  if (newX < 0) newX = cols - 1;
  if (newX > cols - 1) newX = 0;

  const nextCol = Math.round(newX);
  const nextRow = Math.round(newY);

  if (isWall(nextCol, nextRow)) {
    const dx = pacman.dirX;
    const dy = pacman.dirY;
    pacman.dirX = 0;
    pacman.dirY = 0;
    pacman.x = nextCol - dx;
    pacman.y = nextRow - dy;
    return;
  }

  pacman.x = newX;
  pacman.y = newY;

  const col = Math.round(pacman.x);
  const row = Math.round(pacman.y);
  if (map[row] && (map[row][col] === 2 || map[row][col] === 3)) {
    playPelletSound();
    if (map[row][col] === 2) score += 10;
    if (map[row][col] === 3) score += 50;
    map[row][col] = 0;
    pelletsRemaining--;
    updateUI();

    if (pelletsRemaining <= 0) {
      gameOver = true;
      setTimeout(() => {
        nextLevelOverlay.classList.remove("hidden");
      }, 500);
    }
  }
}

function moveGhost(ghost, deltaSeconds) {
  const speed = (6 + currentLevel * 0.2) * deltaSeconds;
  let newX = ghost.x + ghost.dirX * speed;
  let newY = ghost.y + ghost.dirY * speed;

  const nextCol = Math.round(newX);
  const nextRow = Math.round(newY);

  if (isWall(nextCol, nextRow)) {
    // Snap to center of current tile
    ghost.x = Math.round(ghost.x);
    ghost.y = Math.round(ghost.y);
    
    const dirs = [
      { x: 1, y: 0 },
      { x: -1, y: 0 },
      { x: 0, y: 1 },
      { x: 0, y: -1 },
    ];
    
    // Filter out directions that lead directly into a wall from the snapped position
    const valid = dirs.filter(d => !isWall(ghost.x + d.x, ghost.y + d.y));
    
    if (valid.length > 0) {
      const choice = valid[Math.floor(Math.random() * valid.length)];
      ghost.dirX = choice.x;
      ghost.dirY = choice.y;
    }
    return;
  }

  ghost.x = newX;
  ghost.y = newY;

  // Tunnel wrap
  if (ghost.x < 0) ghost.x = cols - 1;
  if (ghost.x > cols - 1) ghost.x = 0;
}

function distance(a, b) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

function checkCollisions() {
  for (const ghost of ghosts) {
    if (distance(ghost, pacman) < 0.7) {
      playDeathSound();
      lives--;
      updateUI();
      if (lives <= 0) {
        gameOver = true;
        setTimeout(() => alert("Game Over!"), 100);
      }
      resetEntities();
      break;
    }
  }
}

function drawMap() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const val = map[r][c];
      const x = c * corridorTile;
      const y = r * corridorTile;
      if (val === 1) {
        const wallX = x + (corridorTile - wallSize) / 2;
        const wallY = y + (corridorTile - wallSize) / 2;
        ctx.fillStyle = "#001b4d";
        ctx.fillRect(wallX, wallY, wallSize, wallSize);
        ctx.strokeStyle = "#0ff";
        ctx.lineWidth = 2;
        ctx.strokeRect(wallX + 2, wallY + 2, wallSize - 4, wallSize - 4);
      } else {
        ctx.fillStyle = "#000016";
        ctx.fillRect(x, y, corridorTile, corridorTile);
        if (val === 2) {
          ctx.fillStyle = "#ffd966";
          ctx.beginPath();
          ctx.arc(x + corridorTile / 2, y + corridorTile / 2, 2, 0, Math.PI * 2);
          ctx.fill();
        } else if (val === 3) {
          ctx.fillStyle = "#ffd966";
          ctx.beginPath();
          ctx.arc(x + corridorTile / 2, y + corridorTile / 2, 4, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
  }
}

function drawPacman() {
  const px = pacman.x * corridorTile + corridorTile / 2;
  const py = pacman.y * corridorTile + corridorTile / 2;
  const angleOffset = pacman.dirX === 1 ? 0 : pacman.dirX === -1 ? Math.PI : pacman.dirY === -1 ? -Math.PI / 2 : pacman.dirY === 1 ? Math.PI / 2 : 0;
  const chompSpeed = 18;
  const mouthOpen = 0.08 + 0.28 * (0.5 + 0.5 * Math.sin(gameTime * chompSpeed));
  ctx.fillStyle = "#ffd966";
  ctx.beginPath();
  ctx.moveTo(px, py);
  ctx.arc(px, py, corridorTile * 0.6, angleOffset + mouthOpen, angleOffset + Math.PI * 2 - mouthOpen);
  ctx.closePath();
  ctx.fill();
}

function drawGhost(ghost) {
  const gx = (Math.round(ghost.x) * corridorTile) + corridorTile / 2;
  const gy = (Math.round(ghost.y) * corridorTile) + corridorTile / 2;
  const r = corridorTile * 0.6;
  ctx.fillStyle = ghost.color;
  ctx.beginPath();
  ctx.arc(gx, gy, r, Math.PI, 0);
  ctx.lineTo(gx + r, gy + r);
  ctx.lineTo(gx - r, gy + r);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#fff";
  ctx.beginPath();
  ctx.arc(gx - r / 3, gy - r / 4, r / 4, 0, Math.PI * 2);
  ctx.arc(gx + r / 3, gy - r / 4, r / 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#000";
  ctx.beginPath();
  ctx.arc(gx - r / 3, gy - r / 4, r / 8, 0, Math.PI * 2);
  ctx.arc(gx + r / 3, gy - r / 4, r / 8, 0, Math.PI * 2);
  ctx.fill();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawMap();
  drawPacman();
  ghosts.forEach(drawGhost);
}

function loop(timestamp) {
  if (!lastTime) {
    lastTime = timestamp;
    requestAnimationFrame(loop);
    return;
  }
  
  const delta = (timestamp - lastTime) / 1000;
  lastTime = timestamp;

  // If delta is too large (e.g., after a tab switch or ad), skip this frame
  if (delta > 0.1) {
    requestAnimationFrame(loop);
    return;
  }

  gameTime = timestamp / 1000;
  if (!gameOver) {
    movePacman(delta);
    ghosts.forEach((g) => moveGhost(g, delta));
    checkCollisions();
  }
  draw();
  requestAnimationFrame(loop);
}

document.addEventListener("keydown", (e) => {
  startBackgroundSound();
  switch (e.key) {
    case "ArrowUp": case "w": case "W": e.preventDefault(); trySetDirection(0, -1); break;
    case "ArrowDown": case "s": case "S": e.preventDefault(); trySetDirection(0, 1); break;
    case "ArrowLeft": case "a": case "A": e.preventDefault(); trySetDirection(-1, 0); break;
    case "ArrowRight": case "d": case "D": e.preventDefault(); trySetDirection(1, 0); break;
  }
});

restartBtn.addEventListener("click", () => {
    startBackgroundSound();
    triggerAd("play_again", restartGame);
});

nextLevelBtn.addEventListener("click", () => {
    triggerAd("next_level", startNextLevel);
});

initMap();
resetEntities();
updateUI();
requestAnimationFrame(loop);

// Initial ad trigger
triggerAd("game_load");

