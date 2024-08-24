// Variables du jeu
let canvas = document.getElementById('game-canvas');
let ctx = canvas.getContext('2d');
let player = { x: 100, y: 100, speedX: 0, speedY: 0, radius: 20 };
let enemies = [];
let bombs = [];
let stars = [];
let score = 0;
let timer = 60;

// Ajout de la musique
let music = new Audio('bubbleSong.mp3');
const musicDuration = 180 * 1000; // 180 secondes en millisecondes
music.addEventListener('ended', function() {
  // Relancez la musique à l'infini
  music.currentTime = 0;
  music.play();
});

// Variables pour gérer l'apparition des bombes et étoiles
let lastBombSpawn = 0;
let bombSpawnInterval = 10000; // 10 secondes en millisecondes
let lastStarSpawn = 0;
let starSpawnInterval = 12000; // 12 secondes en millisecondes

// Chargement des images
let playerImage = new Image();
playerImage.src = 'player.png';

let enemyImage = new Image();
enemyImage.src = 'enemy.png';

let backgroundImage = new Image();
backgroundImage.src = 'background.png';

let bombImage = new Image();
bombImage.src = 'bomb.png';

let starImage = new Image();
starImage.src = 'star.png';

// Variable pour suivre le chargement des ressources
let resourcesLoaded = false;

// Créer le joystick après le chargement du contenu de la page
document.addEventListener('DOMContentLoaded', function () {
  let joystick = nipplejs.create({
    zone: document.getElementById('joystick-container'),
    mode: 'static',
    position: { left: '50%', bottom: '20%' },
    color: 'green',
  });

  joystick.on('move', function (evt, data) {
    let speedMultiplier = 0.2;
    player.speedX =
      Math.cos(data.angle.radian) * data.distance * speedMultiplier;
    player.speedY =
      -Math.sin(data.angle.radian) * data.distance * speedMultiplier;
  });

  joystick.on('end', function (evt) {
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
    ctx.drawImage(
      playerImage,
      player.x - player.radius,
      player.y - player.radius,
      player.radius * 3,
      player.radius * 3
    );
    function countdown() {
  timer--; // Décrémenter le temps de 1 seconde
  document.getElementById("timer").innerHTML = `Temps restant : ${time} seconde(s)`; // Mise à jour du texte du timer

  if (timer <= 0) {
    // Si le temps arrive à 0, afficher le message "Temps écoulé"
    document.getElementById("message").innerHTML = "Temps écoulé";
  } else {
    // Sinon, relancer la fonction countdown après 1 seconde
    setTimeout(countdown, 1000);
  }
}

// Lancer la fonction countdown pour la première fois
countdown();
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

// Fonction pour dessiner les bombes
function drawBombs() {
  for (let i = 0; i < bombs.length; i++) {
    if (bombImage.complete) {
      ctx.drawImage(bombImage, bombs[i].x, bombs[i].y, 30, 30);
    } else {
      ctx.beginPath();
      ctx.rect(bombs[i].x, bombs[i].y, 20, 20);
      ctx.fillStyle = 'yellow';
      ctx.fill();
    }
  }
}

// Fonction pour dessiner les étoiles
function drawStars() {
  for (let i = 0; i < stars.length; i++) {
    if (starImage.complete) {
      ctx.drawImage(starImage, stars[i].x, stars[i].y, 30, 30);
    } else {
      ctx.beginPath();
      ctx.rect(stars[i].x, stars[i].y, 20, 20);
      ctx.fillStyle = 'gold';
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
  drawBombs();
  drawStars();

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

  // Mettre à jour les ennemis
  for (let i = 0; i < enemies.length; i++) {
    enemies[i].x += 2;
    if (enemies[i].x > canvas.width) {
      enemies.splice(i, 1);
    }
  }

  // Gestion des collisions avec les ennemis
  for (let i = 0; i < enemies.length; i++) {
    if (distance(player.x, player.y, enemies[i].x, enemies[i].y) < player.radius + 10) {
      score++;
      enemies.splice(i, 1);
    }
  }

  // Apparition aléatoire des ennemis
  if (Math.random() < 0.05) {
    enemies.push({ x: 0, y: Math.random() * canvas.height });
  }

  // Apparition des bombes (3 bombes toutes les 10 secondes)
  let now = Date.now();
  if (now - lastBombSpawn > bombSpawnInterval) {
    let bombY = Math.random() * canvas.height;
    for (let i = 0; i < 3; i++) {
      bombs.push({ x: 0, y: bombY });
    }
    lastBombSpawn = now;
  }

  // Mettre à jour la position des bombes
  for (let i = 0; i < bombs.length; i++) {
    bombs[i].x += 2; // Déplacement vers la droite
    if (bombs[i].x > canvas.width) {
      bombs.splice(i, 1);
    }
  }

  // Gestion des collisions avec les bombes
  for (let i = 0; i < bombs.length; i++) {
    if (distance(player.x, player.y, bombs[i].x, bombs[i].y) < player.radius + 15) {
      score -= 10;
      bombs.splice(i, 1);
    }
  }

  // Apparition des étoiles (1 étoile toutes les 12 secondes)
  if (now - lastStarSpawn > starSpawnInterval) {
    stars.push({ x: 0, y: Math.random() * canvas.height });
    lastStarSpawn = now;
  }

  // Mettre à jour la position des étoiles
  for (let i = 0; i < stars.length; i++) {
    stars[i].x += 2; // Déplacement vers la droite
    if (stars[i].x > canvas.width) {
      stars.splice(i, 1);
    }
  }

  // Gestion des collisions avec les étoiles
  for (let i = 0; i < stars.length; i++) {
    if (distance(player.x, player.y, stars[i].x, stars[i].y) < player.radius + 15) {
      score += 5;
      stars.splice(i, 1);
    }
  }

  // Décompte du timer et fin du jeu
  timer -= 1 / 60;
  if (timer <= 0) {
    // Remplacer alert par Swal.fire
    Swal.fire({
      title: 'Temps écoulé !',
      text: `Votre score final est de : ${score}`,
      icon: 'info',
      confirmButtonText: 'Rejouer'
    }).then((result) => {
      if (result.isConfirmed) {
        init(); 
      }
    });
  }
}

// Fonction pour initialiser le jeu
function init() {
  score = 0;
  timer = 60;
  enemies = [];
  bombs = [];
  stars = [];
  player.x = canvas.width / 2;
  player.y = canvas.height / 2;
  player.speedX = 0;
  player.speedY = 0;
  lastBombSpawn = 0; // Réinitialiser le timer des bombes
  lastStarSpawn = 0; // Réinitialiser le timer des étoiles
  music.play();
}

// Fonction pour vérifier si toutes les ressources sont chargées
function checkResourcesLoaded() {
  if (
    playerImage.complete &&
    enemyImage.complete &&
    backgroundImage.complete &&
    bombImage.complete &&
    starImage.complete
  ) {
    resourcesLoaded = true;
    init();
    gameLoop();
  }
}

// Appels pour charger les images et vérifier le chargement
playerImage.onload = checkResourcesLoaded;
enemyImage.onload = checkResourcesLoaded;
backgroundImage.onload = checkResourcesLoaded;
bombImage.onload = checkResourcesLoaded;
starImage.onload = checkResourcesLoaded;

// Boucle de jeu
function gameLoop() {
  if (resourcesLoaded) {
    update();
    draw();
  }
  requestAnimationFrame(gameLoop);
}
