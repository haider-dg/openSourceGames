const screens = document.querySelectorAll(".screen");
const chooseInsectButtons = document.querySelectorAll(".choose-insect-btn");
const startButton = document.getElementById("start-btn");
const gameContainer = document.getElementById("game-container");
const timeElement = document.getElementById("time");
const scoreElement = document.getElementById("score");
const message = document.getElementById("message");
const soundToggle = document.getElementById("sound-toggle");
const onIcon = document.getElementById("sound-on-icon");
const offIcon = document.getElementById("sound-off-icon");
const bgSound = document.getElementById("bg-sound");

function playBackgroundSound() {
  if (bgSound) {
    bgSound.volume = 0.7; // Set volume to 70%
    bgSound.play().then(() => {
      document.removeEventListener("keydown", playBackgroundSound);
      document.removeEventListener("click", playBackgroundSound);
      document.removeEventListener("touchstart", playBackgroundSound);
      window.removeEventListener("load", playBackgroundSound);
    }).catch(function (error) {
      console.log("Background audio playback failed or prevented:", error);
    });
  }
}

document.addEventListener("keydown", playBackgroundSound);
document.addEventListener("click", playBackgroundSound);
document.addEventListener("touchstart", playBackgroundSound);
window.addEventListener("load", playBackgroundSound);
playBackgroundSound();

if (soundToggle && bgSound) {
  soundToggle.addEventListener("click", function (e) {
    if (bgSound.muted) {
      bgSound.muted = false;
      onIcon.style.display = "block";
      offIcon.style.display = "none";
    } else {
      bgSound.muted = true;
      onIcon.style.display = "none";
      offIcon.style.display = "block";
    }
  });
}
let seconds = 0;
let score = 0;
let selectedInsect = {};

// localVars for Ads
let lastAdTime = 0;
const AD_COOLDOWN = 120000; // 2 minutes
const localVars = {
  vState: "game_load",
  vGameID: "insect_catch_01"
};
let pendingAdCallback = null;

startButton.addEventListener("click", () => screens[0].classList.add("up"));

function broadcastAdMessage(state = localVars.vState) {
  const message = {
    type: "showInterstitialAd",
    state: state,
    timestamp: Date.now(),
    gameId: localVars.vGameID
  };
  window.parent.postMessage(message, "*");
  console.log(`Sent: ${JSON.stringify(message)}`);
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
    console.log("Received: Ad Watched");
    lastAdTime = Date.now();
    if (pendingAdCallback) {
      const cb = pendingAdCallback;
      pendingAdCallback = null;
      cb();
    }
  }
});

const increaseScore = () => {
  score++;
  // if (score > 19) message.classList.add("visible");
  scoreElement.innerHTML = `Score: ${score}`;
};

const addInsects = () => {
  setTimeout(createInsect, 1000);
  setTimeout(createInsect, 1500);
};

const catchInsect = function () {
  increaseScore();
  this.classList.add("caught");
  setTimeout(() => this.remove, 2000);
  addInsects();
};

const getRandomLocation = () => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const x = Math.random() * (width - 200) + 100;
  const y = Math.random() * (height - 200) + 100;
  return { x, y };
};

const createInsect = () => {
  const insect = document.createElement("div");
  insect.classList.add("insect");
  const { x, y } = getRandomLocation();
  insect.style.top = `${y}px`;
  insect.style.left = `${x}px`;
  insect.innerHTML = `<img src="${selectedInsect.src}" 
  alt="${selectedInsect.alt}" 
  style="transform: rotate(${Math.random() * 360}deg)" />`;
  insect.addEventListener("click", catchInsect);
  gameContainer.appendChild(insect);
};

const increaseTime = () => {
  let m = Math.floor(seconds / 60);
  let s = seconds % 60;
  m = m < 10 ? `0${m}` : m;
  s = s < 10 ? `0${s}` : s;
  timeElement.innerHTML = `Time: ${m}:${s}`;
  seconds++;
};

const startGame = () => setInterval(increaseTime, 1000);

chooseInsectButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const image = button.querySelector("img");
    const src = image.getAttribute("src");
    const alt = image.getAttribute("alt");
    selectedInsect = { src, alt };
    screens[1].classList.add("up");
    setTimeout(createInsect, 1000);
    startGame();
  });
});

// Initial trigger on load
triggerAd("game_load");

// Periodic trigger every 2 minutes
setInterval(() => {
  triggerAd("periodic_ad");
}, 120000);
