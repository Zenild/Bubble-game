 // Variables du jeu
let canvas = document.getElementById('game-canvas');
let ctx = canvas.getContext('2d');
let player = { x: 100, y: 100, speedX: 0, speedY: 0, radius: 10 };
let enemies = [];
let score = 0;
let timer = 60;

// Chargement des images
let playerImage = new Image();
playerImage.src = 'player.png';

let enemyImage = new Image();
enemyImage.src = 'enemy.png';

let backgroundImage = new Image();
backgroundImage.src = 'background.png';

// Variable pour suivre le chargement des ressources
let resourcesLoaded = false;

// Créer le joystick après le chargement du contenu de la page
document.addEventListener('DOMContentLoaded', function() {
  let joystick = nipplejs.create({
    zone: document.getElementById('joystick-container'),
    mode: 'static',
    position: { left: '50%', bottom: '20%' },
    color: 'red'
  });

  joystick.on('move', function(evt, data) {
    let speedMultiplier = 0.1;
    player.speedX = Math.cos(data.angle.radian) * data.distance * speedMultiplier;
    player.speedY = Math.sin(data.angle.radian) * data.distance * speedMultiplier;
  });

  joystick.on('end', function(evt) {
    player.speedX = 0;
    player.speedY = 0;
  });
});

// Fonction pour calculer la distance entre deux points
function distance(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

// Fonction pour dessiner le joueur
function drawPlayer() {
  if (playerImage.complete) {
    ctx.drawImage(playerImage, player.x - player.radius, player.y - player.radius, player.radius * 2, player.radius * 2);
  } else {
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.radius, 0, 2 * Math.PI);
    ctx.fillStyle = 'red';
    ctx.fill();
  }
}

// Fonction pour dessiner les ennemis
function drawEnemies() {
  for (let i = 0; i < enemies.length; i++) {
    if (enemyImage.complete) {
      ctx.drawImage(enemyImage, enemies[i].x, enemies[i].y, 40, 40);
    } else {
      ctx.beginPath();
      ctx.rect(enemies[i].x, enemies[i].y, 20, 20);
      ctx.fillStyle = 'black';
      ctx.fill();
    }
  }
}

// Fonction pour dessiner le jeu
function draw() {
  // Dessiner le fond
  if (backgroundImage.complete) {
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
  }

  drawPlayer();
  drawEnemies();

  ctx.font = '24px Arial';
  ctx.fillStyle = 'black';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText(`Score: ${score}`, 10, 10);
  ctx.fillText(`Temps restant: ${Math.floor(timer)}`, 10, 30);
}

// Fonction pour mettre à jour le jeu
function update() {
  player.x += player.speedX;
  player.y += player.speedY;

  // Garder le joueur dans la zone de jeu
  if (player.x + player.radius > canvas.width) {
    player.x = canvas.width - player.radius;
  } else if (player.x - player.radius < 0) {
    player.x = player.radius;
  }
  if (player.y + player.radius > canvas.height) {
    player.y = canvas.height - player.radius;
  } else if (player.y - player.radius < 0) {
    player.y = player.radius;
  }

  for (let i = 0; i < enemies.length; i++) {
    enemies[i].x += 2;
    if (enemies[i].x > canvas.width) {
      enemies.splice(i, 1);
    }
  }

  for (let i = 0; i < enemies.length; i++) {
    if (distance(player.x, player.y, enemies[i].x, enemies[i].y) < player.radius + 10) {
      score++;
      enemies.splice(i, 1);
    }
  }

  if (Math.random() < 0.05) {
    enemies.push({ x: 0, y: Math.random() * canvas.height });
  }

  timer -= 1 / 60;
  if (timer <= 0) {
    alert(`Temps écoulé ! Votre score final est de : ${score}`);
    init();
  }
}

// Fonction pour initialiser le jeu
function init() {
  score = 0;
  timer = 60;
  enemies = [];
  player.x = canvas.width / 2;
  player.y = canvas.height / 2;
  player.speedX = 0;
  player.speedY = 0;
}

// Fonction pour vérifier si toutes les ressources sont chargées
function checkResourcesLoaded() {
  if (playerImage.complete && enemyImage.complete && backgroundImage.complete) {
    resourcesLoaded = true;
    init(); 
    gameLoop();
  }
}

// Appels pour charger les images et vérifier le chargement
playerImage.onload = checkResourcesLoaded;
enemyImage.onload = checkResourcesLoaded;
backgroundImage.onload = checkResourcesLoaded;

// Boucle de jeu
function gameLoop() {
  if (resourcesLoaded) { 
    update();
    draw();
  }
  requestAnimationFrame(gameLoop);
}
