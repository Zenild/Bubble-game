// Variables du jeu
let canvas = document.getElementById('game-canvas');
let ctx = canvas.getContext('2d');
let player = { x: 100, y: 100, speedX: 0, speedY: 0, radius: 10 };
let enemies = [];
let score = 0;
let timer = 60;

// Créer le joystick après le chargement du contenu de la page
document.addEventListener('DOMContentLoaded', function() {
  let joystick = nipplejs.create({
    zone: document.getElementById('joystick-container'),
    mode: 'static', // Ou 'dynamic' 
    position: { left: '50%', bottom: '20%' }, 
    color: 'red' 
  });

  // Écouter les événements du joystick
  joystick.on('move', function(evt, data) {
    player.speedX = Math.cos(data.angle.radian) * data.distance * 0.05;
    player.speedY = Math.sin(data.angle.radian) * data.distance * 0.05; 
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
  ctx.beginPath();
  ctx.arc(player.x, player.y, player.radius, 0, 2 * Math.PI);
  ctx.fillStyle = 'red';
  ctx.fill();
}

// Fonction pour dessiner les ennemis
function drawEnemies() {
  for (let i = 0; i < enemies.length; i++) {
    ctx.beginPath();
    ctx.rect(enemies[i].x, enemies[i].y, 20, 20);
    ctx.fillStyle = 'black';
    ctx.fill();
  }
}

// Fonction pour mettre à jour le jeu
function update() {
  // Mise à jour du joueur
  player.x += player.speedX;
  player.y += player.speedY;

  // Rebond sur les bords du canvas
  if (player.x + player.radius > canvas.width || player.x - player.radius < 0) {
    player.speedX = -player.speedX;
  }
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
    if (distance(player.x, player.y, enemies[i].x, enemies[i].y) < player.radius + 10) {
      score++;
      enemies.splice(i, 1);
    }
  }

  // Ajout d'ennemis
  if (Math.random() < 0.05) {
    enemies.push({ x: 0, y: Math.random() * canvas.height });
  }

  // Mise à jour du timer
  timer -= 1 / 60;
  if (timer <= 0) {
    alert(`Temps écoulé ! Votre score final est de : ${score}`);
    init(); 
  }
}

// Fonction pour dessiner le jeu
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPlayer();
  drawEnemies();
  ctx.font = '24px Arial';
  ctx.fillStyle = 'black';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText(`Score: ${score}`, 10, 10);
  ctx.fillText(`Temps restant: ${Math.floor(timer)}`, 10, 30);
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

// Boucle de jeu
function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

// Initialiser le jeu et démarrer la boucle de jeu
init();
gameLoop();
