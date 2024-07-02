let canvas = document.getElementById('game-canvas');
let ctx = canvas.getContext('2d');
let player = { x: 100, y: 100, speedX: 0, speedY: 0, radius: 10 };
let enemies = [];
let score = 0;
let timer = 60; // 1 minute

let playerImage = new Image();
playerImage.src = 'player.png'; // Remplacez par le chemin de votre image de joueur

let enemyImage = new Image();
enemyImage.src = 'enemy.png'; // Remplacez par le chemin de votre image d'ennemi

let backgroundImage = new Image();
backgroundImage.src = 'background.png'; // Remplacez par le chemin de votre image de fond

function distance(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

function drawPlayer() {
  ctx.drawImage(playerImage, player.x, player.y, player.radius * 2, player.radius * 2);
}

function drawEnemies() {
  for (let i = 0; i < enemies.length; i++) {
    ctx.drawImage(enemyImage, enemies[i].x, enemies[i].y, 50, 50); // Taille de l'ennemi : 50x50
  }
}

function update() {
  // Mise à jour du joueur
  player.x += player.speedX;
  player.y += player.speedY;

  if (player.x + player.radius > canvas.width || player.x - player.radius < 0) {
    player.speedX = -player.speedX;
  }
  
  // ...

  if (player.y + player.radius > canvas.height || player.y - player.radius < 0) {
    player.speedY = -player.speedY;
  }

  // Mise à jour des ennemis
  for (let i = 0; i < enemies.length; i++) {
    enemies[i].x += 2;
    if (enemies[i].x > canvas.width) {
      enemies.splice(i, 1);
    }
  }

  // Vérification des collisions
  for (let i = 0; i < enemies.length; i++) {
    if (distance(player.x, player.y, enemies[i].x, enemies[i].y) < player.radius + 25) { // Rayon de collision : 25
      score++;
      enemies.splice(i, 1);
    }
  }

  // Ajout d'ennemis infinis
  if (Math.random() < 0.1) {
    enemies.push({ x: 0, y: Math.random() * canvas.height });
  }

  // Mise à jour du timer
  timer -= 1 / 60;
  if (timer <= 0) {
    alert(`Bravo avec : ${score} déjà je sais que vous pouvez faire mieux !`);
    init(); // Recommence le jeu avec le score à 0
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
  drawPlayer();
  drawEnemies();
  ctx.font = '24px Arial';
  ctx.fillStyle = 'black';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText(`Score: ${score}`, 10, 10);
  ctx.fillText(`Temps restant: ${Math.floor(timer)}`, 10, 30);
}

function init() {
  score = 0;
  timer = 60;
  enemies = [];
  player.x = 100;
  player.y = 100;
  player.speedX = 0;
  player.speedY = 0;
  setInterval(update, 16);
  setInterval(draw, 16);
}

init(); // Initialise le jeu pour la première fois

canvas.addEventListener('touchstart', (event) => {
  player.speedX = (event.touches[0].clientX - player.x) * 0.8; // Réduit le déplacement du player
  player.speedY = (event.touches[0].clientY - player.y) * 0.8; // Réduit le déplacement du player
});

canvas.addEventListener('touchmove', (event) => {
  player.x = event.touches[0].clientX;
  player.y = event.touches[0].clientY;
});

canvas.addEventListener('touchend', () => {
  player.speedX = 0;
  player.speedY = 0;
});