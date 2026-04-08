const inputEl = document.querySelector("input");
const guessEl = document.querySelector(".guess");
const checkBtnEl = document.querySelector("button");
const remainingChancesTextEl = document.querySelector(".chances");
const remainingChancesEl = document.querySelector(".chance");
const restartBtnEl = document.querySelector(".restartBtn");
const winCountEl = document.getElementById("winCount");
const lossCountEl = document.getElementById("lossCount");

let randomNumber = Math.floor(Math.random() * 100);
let totalChances = 10;
let guessesThisGame = 0;
let gameEnded = false;

// Sounds
const winSound = new Audio("level-complete.mp3");
const lossSound = new Audio("fail.mp3");

function playSound(audio) {
    const bgSound = document.getElementById("bg-sound");
    if (bgSound && bgSound.muted) return;
    audio.currentTime = 0;
    audio.play().catch(e => console.log("Sound play prevented:", e));
}

// Statistics
let won = parseInt(localStorage.getItem("guessing_won") || "0");
let lost = parseInt(localStorage.getItem("guessing_lost") || "0");
let gamesPlayed = parseInt(localStorage.getItem("guessing_games_played") || "0");

const updateStatsUI = () => {
    winCountEl.textContent = won;
    lossCountEl.textContent = lost;
};

updateStatsUI();

// localVars for Ads
let lastAdTime = 0;
const AD_COOLDOWN = 180000; // 3 minutes
const localVars = {
    vState: "ingame_milestone",
    vGameID: "number_guessing_01"
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
    console.log(`Sent: ${JSON.stringify(message)}`);
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
        console.log("Received: Ad Watched");
        lastAdTime = Date.now();
        if (pendingAdCallback) {
            const cb = pendingAdCallback;
            pendingAdCallback = null;
            cb();
        }
    }
});

const handleGameOver = (isWin) => {
    gameEnded = true;
    inputEl.disabled = true;
    checkBtnEl.classList.add("hidden");
    restartBtnEl.classList.remove("hidden");
    
    gamesPlayed++;
    localStorage.setItem("guessing_games_played", gamesPlayed);

    if (isWin) {
        won++;
        localStorage.setItem("guessing_won", won);
        playSound(winSound);
    } else {
        lost++;
        localStorage.setItem("guessing_lost", lost);
        playSound(lossSound);
    }
    updateStatsUI();
};

checkBtnEl.addEventListener("click", () => {
    if (gameEnded) return;
    
    let inputValue = inputEl.value;
    if (inputValue === "" || isNaN(inputValue)) {
        guessEl.textContent = "Your number is invalid.";
        guessEl.style.color = "red";
        return;
    }

    totalChances--;
    guessesThisGame++;
   
    if (inputValue == randomNumber) {
        guessEl.textContent = "Hurrah...! Congratulations😍, You won the game.";
        guessEl.style.color = "green";
        handleGameOver(true);
    } else if (totalChances === 0) {
        inputEl.value = "";
        guessEl.textContent = "Oops...! Bad luck😥, You lost the game.";
        guessEl.style.color = "red";
        remainingChancesTextEl.textContent = "No chances left";
        handleGameOver(false);
    } else {
        remainingChancesEl.textContent = totalChances;
        if (inputValue > randomNumber) {
            guessEl.textContent = "Your Guess is High👍.";
        } else {
            guessEl.textContent = "Your Guess is low👎.";
        }
        guessEl.style.color = "#1446a0";
    }

    // Removed ad trigger from here
});

restartBtnEl.addEventListener("click", () => {
    // Trigger ad every 3 rounds
    if (gamesPlayed > 0 && gamesPlayed % 3 === 0) {
        triggerAd("milestone_3_rounds", () => {
            window.location.reload();
        }, true);
    } else {
        window.location.reload();
    }
});

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
                document.removeEventListener("keydown", playBackgroundSound);
            }).catch(function (error) {
                console.log("Background audio playback failed or prevented:", error);
            });
        }
    }

    document.addEventListener("click", playBackgroundSound);
    document.addEventListener("touchstart", playBackgroundSound);
    document.addEventListener("keydown", playBackgroundSound);

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
