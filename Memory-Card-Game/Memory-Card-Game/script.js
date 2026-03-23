const cards = document.querySelectorAll(".card");
const scoreTag = document.getElementById("score");
const levelTag = document.getElementById("level");
const restartOverlay = document.getElementById("restartOverlay");
const restartBtn = document.getElementById("restartBtn");

let matched = 0;
let score = 0;
let level = 1;
let cardOne, cardTwo;
let disableDeck = false;

// Sounds
const winSound = new Audio("level-complete.mp3");

function playSound(audio) {
    audio.currentTime = 0;
    audio.play().catch(e => console.log("Sound play prevented:", e));
}

// localVars for Ads
let lastAdTime = 0;
const AD_COOLDOWN = 180000; // 3 minutes
const localVars = {
    vState: "game_restart",
    vGameID: "memory_card_01"
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

function flipCard({target: clickedCard}) {
    if(cardOne !== clickedCard && !disableDeck) {
        clickedCard.classList.add("flip");
        if(!cardOne) {
            return cardOne = clickedCard;
        }
        cardTwo = clickedCard;
        disableDeck = true;
        let cardOneImg = cardOne.querySelector(".back-view img").src,
        cardTwoImg = cardTwo.querySelector(".back-view img").src;
        matchCards(cardOneImg, cardTwoImg);
    }
}

function matchCards(img1, img2) {
    if(img1 === img2) {
        matched++;
        score += 50;
        scoreTag.innerText = score;
        if(matched == 8) {
            playSound(winSound);
            setTimeout(() => {
                restartOverlay.classList.remove("hidden");
            }, 500);
        }
        cardOne.removeEventListener("click", flipCard);
        cardTwo.removeEventListener("click", flipCard);
        cardOne = cardTwo = "";
        return disableDeck = false;
    }
    setTimeout(() => {
        cardOne.classList.add("shake");
        cardTwo.classList.add("shake");
    }, 400);

    setTimeout(() => {
        cardOne.classList.remove("shake", "flip");
        cardTwo.classList.remove("shake", "flip");
        cardOne = cardTwo = "";
        disableDeck = false;
    }, 1200);
}

function shuffleCard() {
    matched = 0;
    disableDeck = false;
    cardOne = cardTwo = "";
    let arr = [1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 6, 7, 8];
    arr.sort(() => Math.random() > 0.5 ? 1 : -1);
    cards.forEach((card, i) => {
        card.classList.remove("flip");
        let imgTag = card.querySelector(".back-view img");
        imgTag.src = `images/img-${arr[i]}.png`;
        card.addEventListener("click", flipCard);
    });
}

function nextLevel() {
    level++;
    levelTag.innerText = level;
    restartOverlay.classList.add("hidden");
    shuffleCard();
}

restartBtn.addEventListener("click", () => {
    triggerAd("play_again", nextLevel);
});

shuffleCard();