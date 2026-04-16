const player = document.getElementById("player");
const video = document.getElementById("video-element");
const playPauseBtn = document.getElementById("play-pause-btn");
const progressContainer = document.getElementById("progress-container");
const progressCurrent = document.getElementById("progress-current");
const progressKnob = document.getElementById("progress-knob");
const currentTimeEl = document.getElementById("current-time");
const durationEl = document.getElementById("duration");
const muteBtn = document.getElementById("mute-btn");
const volumeSlider = document.getElementById("volume-slider");
const fullscreenBtn = document.getElementById("fullscreen-btn");
const leftSeek = document.getElementById("left-seek");
const middleSection = document.getElementById("middle-section");
const rightSeek = document.getElementById("right-seek");
const centerFeedback = document.getElementById("center-feedback");
const SkipBack = document.getElementById("skip-back");
const SkipForward = document.getElementById("skip-forward");
// const middleControls = document.getElementById("middle-controls");
// Helper to format time
function formatTime(seconds) {
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);
  return `${min}:${sec < 10 ? "0" : ""}${sec}`;
}

// Toggle Play/Pause
function togglePlay() {
  if (video.paused) {
    video.play();
    player.classList.remove("paused");
    updateIcon(playPauseBtn, "pause");
    showCenterFeedback("play");
    showHideMiddleButtons("hide");
  } else {
    video.pause();
    player.classList.add("paused");
    updateIcon(playPauseBtn, "play");
    showCenterFeedback("pause");
    showHideMiddleButtons("show");
  }
}

const showHideMiddleButtons = (state = "show") => {
  if (state === "show") {
    centerFeedback.style.display = "flex";
    SkipBack.style.display = "flex";
    SkipForward.style.display = "flex";
  } else {
    setTimeout(() => {
      centerFeedback.style.display = "none";
      SkipBack.style.display = "none";
      SkipForward.style.display = "none";
    }, 500);
  }
};

SkipBack.addEventListener("click", (e) => {
  e.preventDefault();
  console.log("Skip button pressed: ", "Backward");
});
SkipForward.addEventListener("click", (e) => {
  e.preventDefault();
  console.log("Skip button pressed: ", "Forward");
});

function updateIcon(button, iconName) {
  const icon = button.querySelector("i, svg, [data-lucide]");
  if (icon) {
    icon.setAttribute("data-lucide", iconName);
    lucide.createIcons();
  }
}

function showCenterFeedback(iconName) {
  const icon = centerFeedback.querySelector("i, svg, [data-lucide]");
  if (icon) {
    icon.setAttribute("data-lucide", iconName);
    lucide.createIcons();
  }
  centerFeedback.classList.remove("animate");
  void centerFeedback.offsetWidth; // Trigger reflow
  centerFeedback.classList.add("animate");
}

// Update Progress
function updateProgress() {
  const percent = (video.currentTime / video.duration) * 100;
  progressCurrent.style.width = `${percent}%`;
  progressKnob.style.left = `${percent - 1}%`;
  currentTimeEl.textContent = formatTime(video.currentTime);
}

// Set Progress on click
function setProgress(e) {
  const newTime = (e.offsetX / progressContainer.offsetWidth) * video.duration;
  video.currentTime = newTime;
}

// Seek functionality
function handleSeek(amount, zone) {
  console.log(`Seeking ${amount}s`);
  if (isNaN(video.duration)) {
    console.warn("Video duration not loaded yet");
    return;
  }
  video.currentTime = Math.min(
    Math.max(0, video.currentTime + amount),
    video.duration,
  );

  // Show indicator
  zone.classList.add("active");
  setTimeout(() => {
    zone.classList.remove("active");
  }, 600);
}

// Volume
function handleVolume() {
  video.volume = volumeSlider.value;
  if (video.volume === 0) {
    updateIcon(muteBtn, "volume-x");
  } else if (video.volume < 0.5) {
    updateIcon(muteBtn, "volume-1");
  } else {
    updateIcon(muteBtn, "volume-2");
  }
}

function toggleMute() {
  if (video.muted) {
    video.muted = false;
    volumeSlider.value = video.volume;
    handleVolume();
  } else {
    video.muted = true;
    updateIcon(muteBtn, "volume-x");
    volumeSlider.value = 0;
  }
}

// Fullscreen
function toggleFullscreen() {
  if (!document.fullscreenElement) {
    player.requestFullscreen().catch((err) => {
      alert(
        `Error attempting to enable full-screen mode: ${err.message} (${err.name})`,
      );
    });
  } else {
    document.exitFullscreen();
  }
}

// Event Listeners
playPauseBtn.addEventListener("click", togglePlay);
video.addEventListener("click", togglePlay); // Also allow clicking video to play/pause

// Seek zones click listeners
leftSeek.addEventListener("click", togglePlay);
middleSection.addEventListener("click", togglePlay);
rightSeek.addEventListener("click", togglePlay);

video.addEventListener("timeupdate", updateProgress);
video.addEventListener("loadedmetadata", () => {
  durationEl.textContent = formatTime(video.duration);
  // Ensure subtitles are showing if they exist
  if (video.textTracks.length > 0) {
    video.textTracks[0].mode = "showing";
  }
});

progressContainer.addEventListener("click", setProgress);

volumeSlider.addEventListener("input", handleVolume);
muteBtn.addEventListener("click", toggleMute);

fullscreenBtn.addEventListener("click", toggleFullscreen);

// Ripple effect for double clicking
function createRipple(e) {
  const rect = player.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  const ripple = document.createElement("span");
  ripple.className = "ripple";

  // Size based on player width
  const size = Math.max(player.offsetWidth, player.offsetHeight) * 0.2;
  ripple.style.width = ripple.style.height = `${size}px`;
  ripple.style.left = `${x - size / 2}px`;
  ripple.style.top = `${y - size / 2}px`;

  player.appendChild(ripple);

  ripple.addEventListener("animationend", () => {
    ripple.remove();
  });
}

leftSeek.addEventListener("dblclick", (e) => {
  e.stopPropagation();
  createRipple(e);
  handleSeek(-10, leftSeek);
});
rightSeek.addEventListener("dblclick", (e) => {
  e.stopPropagation();
  createRipple(e);
  handleSeek(10, rightSeek);
});

// Keyboard controls
document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    e.preventDefault();
    togglePlay();
  } else if (e.code === "ArrowRight") {
    handleSeek(10, rightSeek);
  } else if (e.code === "ArrowLeft") {
    handleSeek(-10, leftSeek);
  }
});

player.classList.add("paused");

const track = document.getElementById("captionTrack");
const toggleBtn = document.getElementById("cc-btn");

async function initCaptions() {
  const captionUrl = track.getAttribute("src");

  try {
    const response = await fetch(captionUrl);

    if (!response.ok) throw new Error("File not found");

    toggleBtn.disabled = false;

    let visible = true;
    toggleBtn.onclick = () => {
      visible = !visible;
      track.track.mode = visible ? "showing" : "hidden";
      toggleBtn.title = visible ? "Hide Captions" : "Show Captions";
    };
  } catch (error) {
    toggleBtn.disabled = true;
    toggleBtn.title = "captions are not available";
    toggleBtn.style.opacity = "0.5";

    const videoContainer = document.querySelector(".video-container");
    if (videoContainer) {
      const msg = document.createElement("div");
      msg.style.color = "red";
      msg.style.fontSize = "12px";
      videoContainer.appendChild(msg);
    }
  }
}

initCaptions();
