const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");
const controls = document.querySelectorAll(".controls i");

const gameOverOverlay = document.getElementById("gameOverOverlay");
const finalScoreEl = document.getElementById("finalScore");
const reviveSection = document.getElementById("reviveSection");
const reviveBtn = document.getElementById("reviveBtn");
const reviveTimerEl = document.getElementById("reviveTimer");
const restartBtn = document.getElementById("restartBtn");

let gameOver = false;
let foodX, foodY;
let snakeX = 5, snakeY = 5;
let velocityX = 0, velocityY = 0;
let snakeBody = [];
let setIntervalId;
let score = 0;
let consecutiveLosses = 0;

// Sounds
const eatSound = new Audio("click_sound.mp3");
const hitSound = new Audio("hit-sound.mp3");
const soundToggle = document.getElementById("sound-toggle");
const soundIcon = document.getElementById("sound-icon");
const bgSound = document.getElementById("bg-sound");

function playBackgroundSound() {
    if (bgSound) {
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
        e.stopPropagation();
        if (bgSound.muted) {
            bgSound.muted = false;
            soundIcon.className = "fa-solid fa-volume-high";
        } else {
            bgSound.muted = true;
            soundIcon.className = "fa-solid fa-volume-xmark";
        }
    });
}

function playSound(audio) {
    if (bgSound && bgSound.muted) return; // Respect global mute
    audio.currentTime = 0;
    audio.play().catch(e => console.log("Sound play prevented:", e));
}

// localVars for Ads
let lastAdTime = 0;
const AD_COOLDOWN = 180000; // 3 minutes
const localVars = {
    vState: "game_over",
    vGameID: "snake_game_01"
};
let pendingAdCallback = null;

// Getting high score from the local storage
let highScore = localStorage.getItem("snake-high-score") || 0;
highScoreElement.innerText = `High Score: ${highScore}`;

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
    
    // console.log(`Ad Trigger: state=${state}, cooldownActive=${isCooldownActive}, bypass=${bypassCooldown}`);
    
    if (bypassCooldown || !isCooldownActive) {
        pendingAdCallback = callback;
        broadcastAdMessage(state);
    } else {
        // console.log("Ad Trigger: Skipping due to cooldown");
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

const updateFoodPosition = () => {
    // Passing a random 1 - 30 value as food position
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
    // ensure food is not on snake body
    for (let i = 0; i < snakeBody.length; i++) {
        if (snakeBody[i][0] === foodX && snakeBody[i][1] === foodY) {
            updateFoodPosition();
            break;
        }
    }
}

let countdownInterval;
const handleGameOver = () => {
    clearInterval(setIntervalId);
    consecutiveLosses++;
    gameOver = true;
    finalScoreEl.innerText = score;
    gameOverOverlay.classList.remove("hidden");

    if (score >= 5) {
        reviveSection.classList.remove("hidden");
        let timeLeft = 5;
        reviveTimerEl.innerText = timeLeft;
        clearInterval(countdownInterval);
        countdownInterval = setInterval(() => {
            timeLeft--;
            reviveTimerEl.innerText = timeLeft;
            if (timeLeft <= 0) {
                clearInterval(countdownInterval);
                reviveSection.classList.add("hidden");
            }
        }, 1000);
    } else {
        reviveSection.classList.add("hidden");
    }
}

const resetGame = () => {
    gameOver = false;
    score = 0;
    snakeX = 5, snakeY = 5;
    velocityX = 0, velocityY = 0;
    snakeBody = [];
    scoreElement.innerText = `Score: ${score}`;
    gameOverOverlay.classList.add("hidden");
    updateFoodPosition();
    setIntervalId = setInterval(initGame, 100);
}

const reviveSnake = () => {
    // console.log("Revive: Executing Revival");
    gameOver = false;
    // Safe area (center)
    snakeX = 15;
    snakeY = 15;
    
    // Spawn as a line to the left of the head (if possible)
    // grid is 30x30. Head at 15. Body at 16, 17, 18 ...
    for (let i = 0; i < snakeBody.length; i++) {
        // We trail to the right (x increases) to keep it simple, 
        // as long as it doesn't hit the wall (30)
        let trailX = Math.min(snakeX + i, 30);
        snakeBody[i] = [trailX, snakeY];
    }
    
    velocityX = 0;
    velocityY = 0;
    gameOverOverlay.classList.add("hidden");
    clearInterval(setIntervalId);
    setIntervalId = setInterval(initGame, 100);
}

reviveBtn.addEventListener("click", () => {
    // console.log("Revive: Button Clicked");
    clearInterval(countdownInterval); // Stop the timer once clicked
    triggerAd("revive", reviveSnake, true); // Bypass cooldown for revive
});

const changeDirection = e => {
    // Prevent scrolling with arrow keys
    if(["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
    }

    // Changing velocity value based on key press
    if(e.key === "ArrowUp" && velocityY != 1) {
        velocityX = 0;
        velocityY = -1;
    } else if(e.key === "ArrowDown" && velocityY != -1) {
        velocityX = 0;
        velocityY = 1;
    } else if(e.key === "ArrowLeft" && velocityX != 1) {
        velocityX = -1;
        velocityY = 0;
    } else if(e.key === "ArrowRight" && velocityX != -1) {
        velocityX = 1;
        velocityY = 0;
    }
}

// Calling changeDirection on each key click and passing key dataset value as an object
controls.forEach(button => button.addEventListener("click", () => changeDirection({ key: button.dataset.key, preventDefault: () => {} })));

const initGame = () => {
    if(gameOver) return handleGameOver();
    let html = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;

    // Checking if the snake hit the food
    if(snakeX === foodX && snakeY === foodY) {
        updateFoodPosition();
        snakeBody.push([foodY, foodX]); // Pushing food position to snake body array
        score++; // increment score by 1
        playSound(eatSound);
        highScore = score >= highScore ? score : highScore;
        localStorage.setItem("snake-high-score", highScore);
        scoreElement.innerText = `Score: ${score}`;
        highScoreElement.innerText = `High Score: ${highScore}`;
    }
    // Updating the snake's head position based on the current velocity
    snakeX += velocityX;
    snakeY += velocityY;
    
    // Shifting forward the values of the elements in the snake body by one
    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1];
    }
    snakeBody[0] = [snakeX, snakeY]; // Setting first element of snake body to current snake position

    // Checking if the snake's head is out of wall, if so setting gameOver to true
    if(snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
        playSound(hitSound);
        return gameOver = true;
    }

    for (let i = 0; i < snakeBody.length; i++) {
        // Adding a div for each part of the snake's body
        html += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
        
        // Checking if the snake head hit the body
        // FIX: Only trigger game over if the snake is actually moving (velocityX/Y !== 0)
        // This prevents immediate death upon revive when the body is stacked.
        if (i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]) {
            if (velocityX !== 0 || velocityY !== 0) {
                if (!gameOver) playSound(hitSound);
                gameOver = true;
            }
        }
    }
    playBoard.innerHTML = html;
}

restartBtn.addEventListener("click", () => {
    if (consecutiveLosses >= 3) {
        console.log("Restart: Milestone Reached (3 losses)");
        consecutiveLosses = 0;
        triggerAd("restart_after_losses", resetGame, true); // Bypass cooldown for milestone
    } else {
        resetGame();
    }
});

updateFoodPosition();
setIntervalId = setInterval(initGame, 100);
document.addEventListener("keydown", changeDirection);