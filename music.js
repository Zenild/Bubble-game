let music = new Audio('bubbleSong.mp3');
const musicDuration = 180 * 1000; 
music.addEventListener('ended', function() {
  music.currentTime = 0;
  music.play();
});

function playMusic() {
  music.play();
}

function stopMusic() {
  music.pause();
}

// ... reste du code ...

function init() {
  // ...
  playMusic(); // Jouer la musique lorsque le jeu démarre
}

function endGame() {
  // ...
  stopMusic(); // Arrêter la musique lorsque le jeu se termine
}
