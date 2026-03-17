const wordElement = document.getElementById("word");
const wrongLettersElement = document.getElementById("wrong-letters");
const playAgainButton = document.getElementById("play-button");
const popup = document.getElementById("popup-container");
const notification = document.getElementById("notification-container");
const finalMessage = document.getElementById("final-message");
const finalMessageRevealWord = document.getElementById(
  "final-message-reveal-word"
);
const figureParts = document.querySelectorAll(".figure-part");

const words = [
  "adventure",
  "building",
  "calendar",
  "decoration",
  "education",
  "furniture",
  "garden",
  "hospital",
  "island",
  "journey",
  "kitchen",
  "library",
  "mountain",
  "notebook",
  "ocean",
  "painting",
  "question",
  "rainbow",
  "stadium",
  "telephone",
  "umbrella",
  "vacation",
  "weather",
  "yellow",
  "zebra",
  "balloon",
  "chocolate",
  "diamond",
  "elephant",
  "festival",
  "galaxy",
  "holiday",
  "iceberg",
  "jungle",
  "kangaroo",
  "lemonade",
  "morning",
  "nightmare",
  "orchard",
  "pyramid",
  "quiet",
  "river",
  "sunlight",
  "treasure",
  "universe",
  "village",
  "whisper",
  "xylophone",
  "yesterday",
  "zodiac",
];

// localVars for Ads
let lastAdTime = 0;
const AD_COOLDOWN = 180000; // 3 minutes
const localVars = {
  vState: "game_restart",
  vGameID: "hangman_01"
};
let pendingAdCallback = null;
let selectedWord = words[Math.floor(Math.random() * words.length)];

let playable = true;

const correctLetters = [];
const wrongLetters = [];

function displayWord() {
  wordElement.innerHTML = `
    ${selectedWord
      .split("") // to array
      .map(
        (letter) => `
    <span class="letter">
    ${correctLetters.includes(letter) ? letter : ""}
    </span>
    `
      )
      .join("")} 
    `; // to string
  const innerWord = wordElement.innerText.replace(/\n/g, "");
  if (innerWord === selectedWord) {
    finalMessage.innerText = "Congratulations! You won! 😃";
    finalMessageRevealWord.innerText = "";
    popup.style.display = "flex";
    playable = false;
  }
}

function updateWrongLettersElement() {
  wrongLettersElement.innerHTML = `
  ${wrongLetters.length > 0 ? "<p>Wrong</p>" : ""}
  ${wrongLetters.map((letter) => `<span>${letter}</span>`)}
  `;
  figureParts.forEach((part, index) => {
    const errors = wrongLetters.length;
    index < errors
      ? (part.style.display = "block")
      : (part.style.display = "none");
  });
  if (wrongLetters.length === figureParts.length) {
    finalMessage.innerText = "Unfortunately you lost. 😕";
    finalMessageRevealWord.innerText = `...the word was: ${selectedWord}`;
    popup.style.display = "flex";
    playable = false;
  }
}

function showNotification() {
  notification.classList.add("show");
  setTimeout(() => {
    notification.classList.remove("show");
  }, 2000);
}

window.addEventListener("keypress", (e) => {
  if (playable) {
    const letter = e.key.toLowerCase();
    if (letter >= "a" && letter <= "z") {
      if (selectedWord.includes(letter)) {
        if (!correctLetters.includes(letter)) {
          correctLetters.push(letter);
          displayWord();
        } else {
          showNotification();
        }
      } else {
        if (!wrongLetters.includes(letter)) {
          wrongLetters.push(letter);
          updateWrongLettersElement();
        } else {
          showNotification();
        }
      }
    }
  }
});

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
    callback();
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

function resetGame() {
  playable = true;
  correctLetters.splice(0);
  wrongLetters.splice(0);
  selectedWord = words[Math.floor(Math.random() * words.length)];
  displayWord();
  updateWrongLettersElement();
  popup.style.display = "none";
}

playAgainButton.addEventListener("click", () => {
  triggerAd("play_again", resetGame);
});

// Init
displayWord();
