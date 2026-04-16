(function () {
  "use strict";

  const $ = (s) => document.querySelector(s);
  const $$ = (s) => document.querySelectorAll(s);

  console.log("Script loaded");

  const LEVELS = {
    easy: 3,
    medium: 4,
    hard: 5,
  };

  let state = {
    level: "easy",
    size: 4,
    grid: [],
    emptyIndex: 0,
    moves: 0,
    currentImageUrl: "",
  };

  $$(".level-btn").forEach((btn) => {
    btn.addEventListener("click", () => startGame(btn.dataset.level));
  });

  function startGame(level) {
    console.log(level, "button clicked");
    state.level = level;
    state.size = LEVELS[level];
    $("#levelScreen").classList.add("hidden");
    $("#gameScreen").classList.remove("hidden");
    // $("#levelBadge").textContent = level.charAt(0).toUpperCase() + level.slice(1);
    // startNewGame();
  }
})();
