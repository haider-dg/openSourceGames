document.addEventListener("DOMContentLoaded", () => {
    candyCrushGame();
});

function candyCrushGame() {
    // DOM Elements
    const grid = document.querySelector(".grid");
    const scoreDisplay = document.getElementById("score");
    const timerDisplay = document.getElementById("timer");
    const modeSelection = document.getElementById("modeSelection");
    const endlessButton = document.getElementById("endlessMode");
    const timedButton = document.getElementById("timedMode");
    const changeModeButton = document.getElementById("changeMode");
    const restartOverlay = document.getElementById("restartOverlay");
    const restartButton = document.getElementById("restartButton");
    const finalScoreDisplay = document.getElementById("finalScore");
    const changeModeRestart = document.getElementById("changeModeRestart");

    // localVars for Ads
    const localVars = {
        vState: "game_restart",
        vGameID: "candy_crush_01" // Placeholder ID
    };

    // Game State Variables
    const width = 8;
    const squares = [];
    let score = 0;
    let currentMode = null;
    let timeLeft = 0;
    let gameInterval = null;
    let timerInterval = null;
    let endlessAdInterval = null;
    const candyColors = [
        "url(https://raw.githubusercontent.com/arpit456jain/Amazing-Js-Projects/master/Candy%20Crush/utils/red-candy.png)",
        "url(https://raw.githubusercontent.com/arpit456jain/Amazing-Js-Projects/master/Candy%20Crush/utils/blue-candy.png)",
        "url(https://raw.githubusercontent.com/arpit456jain/Amazing-Js-Projects/master/Candy%20Crush/utils/green-candy.png)",
        "url(https://raw.githubusercontent.com/arpit456jain/Amazing-Js-Projects/master/Candy%20Crush/utils/yellow-candy.png)",
        "url(https://raw.githubusercontent.com/arpit456jain/Amazing-Js-Projects/master/Candy%20Crush/utils/orange-candy.png)",
        "url(https://raw.githubusercontent.com/arpit456jain/Amazing-Js-Projects/master/Candy%20Crush/utils/purple-candy.png)",
    ];

    // Sound Effects
    const matchSound = new Audio("crush_sound.mp3");

    // Background sound logic
    const bgSound = document.getElementById("bg-sound");
    function playBackgroundSound() {
        if (bgSound) {
            bgSound.play().catch(function(error) {
                console.error("Background audio playback failed:", error);
            });
            document.removeEventListener("keydown", playBackgroundSound);
            document.removeEventListener("click", playBackgroundSound);
            document.removeEventListener("touchstart", playBackgroundSound);
        }
    }
    document.addEventListener("keydown", playBackgroundSound);
    document.addEventListener("click", playBackgroundSound);
    document.addEventListener("touchstart", playBackgroundSound);

    // Sound toggle logic
    const soundToggle = document.getElementById("sound-toggle");
    const onIcon = document.getElementById("sound-on-icon");
    const offIcon = document.getElementById("sound-off-icon");

    if (soundToggle && bgSound) {
        soundToggle.addEventListener("click", function () {
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

    function playMatchSound() {
        matchSound.currentTime = 0;
        matchSound.play().catch(e => console.log("Sound play prevented:", e));
    }

    // Create the Game Board
    function createBoard() {
        grid.innerHTML = ""; // Clear existing grid
        squares.length = 0;  // Clear squares array
        for (let i = 0; i < width * width; i++) {
            const square = document.createElement("div");
            square.setAttribute("draggable", true);
            square.setAttribute("id", i);
            let randomColor = Math.floor(Math.random() * candyColors.length);
            square.style.backgroundImage = candyColors[randomColor];
            grid.appendChild(square);
            squares.push(square);
        }
        // Add drag and touch event listeners
        squares.forEach(square => {
            square.addEventListener("dragstart", dragStart);
            square.addEventListener("dragend", dragEnd);
            square.addEventListener("dragover", dragOver);
            square.addEventListener("dragenter", dragEnter);
            square.addEventListener("dragleave", dragLeave);
            square.addEventListener("drop", dragDrop);
            
            // Touch listeners for mobile
            square.addEventListener("touchstart", touchStart, { passive: false });
            square.addEventListener("touchend", touchEnd, { passive: false });
            square.addEventListener("touchmove", touchMove, { passive: false });
        });
        
        // Re-append restart overlay after board creation to keep it on top
        grid.appendChild(restartOverlay);
    }

    // Drag and Drop Functions
    let colorBeingDragged, colorBeingReplaced, squareIdBeingDragged, squareIdBeingReplaced;

    function dragStart() {
        colorBeingDragged = this.style.backgroundImage;
        squareIdBeingDragged = parseInt(this.id);
    }

    function dragOver(e) { e.preventDefault(); }
    function dragEnter(e) { e.preventDefault(); }
    function dragLeave() {}

    function dragDrop() {
        colorBeingReplaced = this.style.backgroundImage;
        squareIdBeingReplaced = parseInt(this.id);
        this.style.backgroundImage = colorBeingDragged;
        squares[squareIdBeingDragged].style.backgroundImage = colorBeingReplaced;
    }

    function dragEnd() {
        let validMoves = [
            squareIdBeingDragged - 1, squareIdBeingDragged - width,
            squareIdBeingDragged + 1, squareIdBeingDragged + width
        ];
        let validMove = validMoves.includes(squareIdBeingReplaced);

        if (squareIdBeingReplaced && validMove) {
            squareIdBeingReplaced = null;
        } else if (squareIdBeingReplaced && !validMove) {
            squares[squareIdBeingReplaced].style.backgroundImage = colorBeingReplaced;
            squares[squareIdBeingDragged].style.backgroundImage = colorBeingDragged;
        } else {
            squares[squareIdBeingDragged].style.backgroundImage = colorBeingDragged;
        }
    }

    // Mobile Touch Handlers
    function touchStart(e) {
        colorBeingDragged = this.style.backgroundImage;
        squareIdBeingDragged = parseInt(this.id);
        // Optional: add a visual hint that it's picked up
        this.style.opacity = "0.7";
    }

    function touchMove(e) {
        // Prevent scrolling while dragging candy
        e.preventDefault();
    }

    function touchEnd(e) {
        this.style.opacity = "1";
        const touch = e.changedTouches[0];
        const target = document.elementFromPoint(touch.clientX, touch.clientY);
        
        if (target && target.parentElement === grid && target.hasAttribute("id")) {
            colorBeingReplaced = target.style.backgroundImage;
            squareIdBeingReplaced = parseInt(target.id);

            // Same drag-and-drop logic applied manually
            if (squareIdBeingDragged !== squareIdBeingReplaced) {
                target.style.backgroundImage = colorBeingDragged;
                squares[squareIdBeingDragged].style.backgroundImage = colorBeingReplaced;
                dragEnd();
            }
        } else {
            // Reset if released outside or on same square
            squares[squareIdBeingDragged].style.backgroundImage = colorBeingDragged;
        }
    }

    // Move Candies Down
    function moveIntoSquareBelow() {
        for (let i = 0; i < width; i++) {
            if (squares[i].style.backgroundImage === "") {
                let randomColor = Math.floor(Math.random() * candyColors.length);
                squares[i].style.backgroundImage = candyColors[randomColor];
            }
        }
        for (let i = 0; i < width * (width - 1); i++) {
            if (squares[i + width].style.backgroundImage === "") {
                squares[i + width].style.backgroundImage = squares[i].style.backgroundImage;
                squares[i].style.backgroundImage = "";
            }
        }
    }

    // Check for Matches
    function checkRowForFour() {
        for (let i = 0; i < 60; i++) {
            if (i % width >= width - 3) continue;
            let rowOfFour = [i, i + 1, i + 2, i + 3];
            let decidedColor = squares[i].style.backgroundImage;
            const isBlank = squares[i].style.backgroundImage === "";
            if (decidedColor && rowOfFour.every(index => squares[index].style.backgroundImage === decidedColor && !isBlank)) {
                score += 4;
                scoreDisplay.innerHTML = score;
                playMatchSound();
                rowOfFour.forEach(index => squares[index].style.backgroundImage = "");
            }
        }
    }

    function checkColumnForFour() {
        for (let i = 0; i < 40; i++) {
            let columnOfFour = [i, i + width, i + 2 * width, i + 3 * width];
            let decidedColor = squares[i].style.backgroundImage;
            const isBlank = squares[i].style.backgroundImage === "";
            if (decidedColor && columnOfFour.every(index => squares[index].style.backgroundImage === decidedColor && !isBlank)) {
                score += 4;
                scoreDisplay.innerHTML = score;
                playMatchSound();
                columnOfFour.forEach(index => squares[index].style.backgroundImage = "");
            }
        }
    }

    function checkRowForThree() {
        for (let i = 0; i < 62; i++) {
            if (i % width >= width - 2) continue;
            let rowOfThree = [i, i + 1, i + 2];
            let decidedColor = squares[i].style.backgroundImage;
            const isBlank = squares[i].style.backgroundImage === "";
            if (decidedColor && rowOfThree.every(index => squares[index].style.backgroundImage === decidedColor && !isBlank)) {
                score += 3;
                scoreDisplay.innerHTML = score;
                playMatchSound();
                rowOfThree.forEach(index => squares[index].style.backgroundImage = "");
            }
        }
    }

    function checkColumnForThree() {
        for (let i = 0; i < 48; i++) {
            let columnOfThree = [i, i + width, i + 2 * width];
            let decidedColor = squares[i].style.backgroundImage;
            const isBlank = squares[i].style.backgroundImage === "";
            if (decidedColor && columnOfThree.every(index => squares[index].style.backgroundImage === decidedColor && !isBlank)) {
                score += 3;
                scoreDisplay.innerHTML = score;
                playMatchSound();
                columnOfThree.forEach(index => squares[index].style.backgroundImage = "");
            }
        }
    }

    // Game Loop
    function gameLoop() {
        checkRowForFour();
        checkColumnForFour();
        checkRowForThree();
        checkColumnForThree();
        moveIntoSquareBelow();
    }

    // Ad Broadcasting Helper
    function broadcastAdMessage(state = localVars.vState) {
        const message = { 
            type: "showInterstitialAd",
            state: state,
            timestamp: Date.now(),
            gameId: localVars.vGameID
        };
        window.parent.postMessage(message, '*');
        // console.log(`Sent: ${JSON.stringify(message)}`);
    }

    // Start the Game
    function startGame(mode) {
        currentMode = mode;
        modeSelection.style.display = "none";
        grid.style.display = "flex";
        scoreDisplay.parentElement.style.display = "flex";
        createBoard();
        score = 0;
        scoreDisplay.innerHTML = score;
        gameInterval = setInterval(gameLoop, 100);

        if (mode === "timed") {
            timeLeft = 120;
            updateTimerDisplay();
            timerInterval = setInterval(() => {
                timeLeft--;
                updateTimerDisplay();
                if (timeLeft <= 0) {
                    clearInterval(timerInterval);
                    endGame();
                }
            }, 1000);
        } else if (mode === "endless") {
            timerDisplay.innerHTML = "";
            // Trigger Ad every 5 minutes (300,000 ms)
            if (endlessAdInterval) clearInterval(endlessAdInterval);
            endlessAdInterval = setInterval(() => {
                if (currentMode === "endless") {
                    // console.log("Endless Mode: 5-minute ad trigger");
                    broadcastAdMessage("endless_periodic");
                }
            }, 300000); 
        }
    }
    function updateTimerDisplay() {
        if (currentMode === "timed") {
            let minutes = Math.floor(timeLeft / 60);
            let seconds = timeLeft % 60;
            timerDisplay.innerHTML = `Time Left: ${minutes}:${seconds.toString().padStart(2, "0")}`;
        } else {
            timerDisplay.innerHTML = "";
        }
    }

    function endGame() {
        clearInterval(gameInterval);
        if (timerInterval) clearInterval(timerInterval);
        if (endlessAdInterval) clearInterval(endlessAdInterval);
        squares.forEach(square => square.setAttribute("draggable", false));
        
        // Show Restart Overlay with final score
        finalScoreDisplay.innerHTML = `Your Score: ${score}`;
        restartOverlay.style.display = "flex";
    }

    function handleRestartClick() {
        broadcastAdMessage();
    }

    window.addEventListener("message", (event) => {
        if (event.data.type === "adSuccessfullyWatched") {
            // console.log('Recieved: ', "Ad Watched");
            restartOverlay.style.display = "none";
            resetGame();
        }
    });

    function resetGame() {
        score = 0;
        scoreDisplay.innerHTML = score;
        startGame(currentMode);
    }

    function changeMode() {
        clearInterval(gameInterval);
        if (currentMode === "timed") clearInterval(timerInterval);
        if (endlessAdInterval) clearInterval(endlessAdInterval);
        grid.style.display = "none";
        scoreDisplay.parentElement.style.display = "none";
        modeSelection.style.display = "flex";
        restartOverlay.style.display = "none";
    }

    endlessButton.addEventListener("click", () => startGame("endless"));
    timedButton.addEventListener("click", () => startGame("timed"));
    changeModeButton.addEventListener("click", changeMode);
    restartButton.addEventListener("click", handleRestartClick);
    changeModeRestart.addEventListener("click", changeMode);
}