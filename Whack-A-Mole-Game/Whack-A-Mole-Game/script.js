const holes = document.querySelectorAll(".hole");
const scoreBoard = document.querySelector(".score");
const moles = document.querySelectorAll(".mole");
const button = document.querySelector("#start");
let lastHole;
let timeUp = false;
let score = 0;
let gamesPlayed = 0;

// localVars for Ads
let lastAdTime = 0;
const AD_COOLDOWN = 180000; // 3 minutes
const localVars = {
  vState: "game_start", 
  vGameID: "whack_a_mole_01"
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

function triggerAd(state, callback, bypassCooldown = false) {
  const now = Date.now();
  const isCooldownActive = (now - lastAdTime < AD_COOLDOWN);
  if (bypassCooldown || !isCooldownActive) {
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

function randomTime(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

function randomHole(holes) {
  const idx = Math.floor(Math.random() * holes.length);
  const hole = holes[idx];

  if (hole === lastHole) {
    return randomHole(holes);
  }

  lastHole = hole;
  return hole;
}

function peep() {
  const time = randomTime(200, 1000);
  const hole = randomHole(holes);
  hole.classList.add("up");
  setTimeout(() => {
    hole.classList.remove("up");
    if (!timeUp) peep();
  }, time);
}

function runGame() {
  scoreBoard.textContent = 0;
  timeUp = false;
  score = 0;
  button.style.visibility = "hidden";
  peep();
  setTimeout(() => {
    timeUp = true;
    gamesPlayed++;
    button.innerHTML = "Try again?";
    button.style.visibility = "visible";
  }, 10000);
}

function startGame() {
  // Trigger ad every 3rd round (starting from 3rd round)
  if (gamesPlayed > 0 && gamesPlayed % 3 === 0) {
    triggerAd("milestone_3_rounds", runGame, true);
  } else {
    runGame();
  }
}

function bonk(e) {
  if (!e.isTrusted) return;
  score++;
  this.classList.remove("up");
  scoreBoard.textContent = score;
}

moles.forEach((mole) => mole.addEventListener("click", bonk));

// Background Sound Logic
(function () {
  const bgSound = document.getElementById("bg-sound");
  const soundToggle = document.getElementById("sound-toggle");
  const onIcon = document.getElementById("sound-on-icon");
  const offIcon = document.getElementById("sound-off-icon");

  function playBackgroundSound() {
    if (bgSound) {
      bgSound.play().then(() => {
        document.removeEventListener("click", playBackgroundSound);
        document.removeEventListener("touchstart", playBackgroundSound);
      }).catch(function (error) {
        console.log("Background audio playback failed or prevented:", error);
      });
    }
  }

  document.addEventListener("click", playBackgroundSound);
  document.addEventListener("touchstart", playBackgroundSound);

  if (soundToggle && bgSound) {
    soundToggle.addEventListener("click", function (e) {
      e.stopPropagation();
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
})();
