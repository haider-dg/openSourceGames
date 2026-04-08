// Wait till the browser is ready to render the game (avoids glitches)
window.requestAnimationFrame(function () {
  new GameManager(4, KeyboardInputManager, HTMLActuator, LocalStorageManager);

  // Background sound logic
  var bgSound = document.getElementById("bg-sound");
  if (bgSound) {
    var playSound = function () {
      bgSound.play().catch(function (error) {
        console.error("Audio playback failed:", error);
      });
      document.removeEventListener("keydown", playSound);
      document.removeEventListener("click", playSound);
    };
    document.addEventListener("keydown", playSound);
    document.addEventListener("click", playSound);
  }

  // Sound toggle logic
  var soundToggle = document.getElementById("sound-toggle");
  var onIcon = document.getElementById("sound-on-icon");
  var offIcon = document.getElementById("sound-off-icon");

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
});
