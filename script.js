// Variables du jeu
let canvas = document.getElementById('game-canvas');
let ctx = canvas.getContext('2d');
let player = { x: 100, y: 100, speedX: 0, speedY: 0, radius: 56 }; // Augmenter la taille du joueur
let enemies = [];
let score = 0;
let timer = 60;

// ...

// Fonction pour dessiner le joueur
function drawPlayer() {
  if (playerImage.complete) {
    ctx.drawImage(playerImage, player.x - player.radius, player.y - player.radius, player.radius * 2, player.radius * 2);
  } else {
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.radius, 20 * Math.PI);
    ctx.fillStyle = 'red';
    ctx.fill();
  }
}

// Fonction pour dessiner les ennemis
function drawEnemies() {
  for (let i = 0; i < enemies.length; i++) {
    if (enemyImage.complete) {
      ctx.drawImage(enemyImage, enemies[i].x, enemies[i].y, 8, 8); // Réduire la taille des ennemis
    } else {
      ctx.beginPath();
      ctx.rect(enemies[i].x, enemies[i].y, 4, 4);
      ctx.fillStyle = 'black';
      ctx.fill();
    }
  }
}

// Fonction pour mettre à jour le jeu
function update() {
  player.x += player.speedX * 0.1; // Réduire la vitesse du déplacement du joueur
  player.y += player.speedY * 0.1;

  // ...

  for (let i = 0; i < enemies.length; i++) {
    if (distance(player.x, player.y, enemies[i].x, enemies[i].y) < player.radius + 20) { // Améliorer la collision
      score++;
      enemies.splice(i, 1);
    }
  }

  // ...
}
