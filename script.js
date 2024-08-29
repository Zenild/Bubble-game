let canvas = document.getElementById('game-canvas');
let ctx = canvas.getContext('2d');
let player = { x: 100, y: 100, speedX: 0, speedY: 0, radius: 20 };
let enemies = [];
let bombs = [];
let stars = [];
let score = 0;
let timer = 60;

let music = new Audio('bubbleSong.mp3');
const musicDuration = 180 * 1000; 
music.addEventListener('ended', function() {
  music.currentTime = 0;
  music.play();
});

let lastBombSpawn = 0;
let bombSpawnInterval = 10000;
let lastStarSpawn = 0;
let starSpawnInterval = 12000; 

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

let resourcesLoaded = false;
let lastTime = 0;
const fps = 60;
const frameInterval = 1000 / fps;

document.addEventListener('DOMContentLoaded', function () {
  let joystick = nipplejs.create({
    zone: document.getElementById('joystick-container'),
    mode: 'static',
    position: { left: '50%', bottom: '20%' },
    color: 'green',
  });

  joystick.on('move', function (evt, data) {
    let speedMultiplier = 0.1;
    player.speedX = Math.cos(data.angle.radian) * data.distance * speedMultiplier;
    player.speedY = -Math.sin(data.angle.radian) * data.distance * speedMultiplier;
  });

  joystick.on('end', function (evt) {
    player.speedX = 0;
    player.speedY = 0;
  });
});

function distance(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

function drawPlayer() {
  if (playerImage.complete) {
    ctx.drawImage(playerImage, player.x - player.radius, player.y - player.radius, player.radius * 3, player.radius * 3);
  } else {
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.radius, 0, 2 * Math.PI);
    ctx.fillStyle = 'red';
    ctx.fill();
  }
}

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

function draw() {
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

function update(deltaTime) {
  player.x += player.speedX * (deltaTime / 16);
  player.y += player.speedY * (deltaTime / 16);

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
    enemies[i].x += 2 * (deltaTime / 16);
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

  if (Math.random() < 0.05 * (deltaTime / 16)) {
    enemies.push({ x: 0, y: Math.random() * canvas.height });
  }

  let now = Date.now();
  if (now - lastBombSpawn > bombSpawnInterval) {
    let bombY = Math.random() * canvas.height;
    for (let i = 0; i < 3; i++) {
      bombs.push({ x: 0, y: bombY });
    }
    lastBombSpawn = now;
  }

  for (let i = 0; i < bombs.length; i++) {
    bombs[i].x += 2 * (deltaTime / 16);
    if (bombs[i].x > canvas.width) {
      bombs.splice(i, 1);
    }
  }

  for (let i = 0; i < bombs.length; i++) {
    if (distance(player.x, player.y, bombs[i].x, bombs[i].y) < player.radius + 15) {
      score -= 10;
      bombs.splice(i, 1);
    }
  }

  if (now - lastStarSpawn > starSpawnInterval) {
    stars.push({ x: 0, y: Math.random() * canvas.height });
    lastStarSpawn = now;
  }

  for (let i = 0; i < stars.length; i++) {
    stars[i].x += 2 * (deltaTime / 16);
    if (stars[i].x > canvas.width) {
      stars.splice(i, 1);
    }
  }

  for (let i = 0; i < stars.length; i++) {
    if (distance(player.x, player.y, stars[i].x, stars[i].y) < player.radius + 15) {
      score += 5;
      stars.splice(i, 1);
    }
  }

  timer -= deltaTime / 1000;
  if (timer <= 0) {
    endGame();
  }
}

function endGame() {
  music.pause();

  Swal.fire({
    title: 'Temps écoulé !',
    text: `Votre score final est de : ${score}`,
    icon: 'info',
    input: 'text',
    inputPlaceholder: 'Entrez votre nom',
    confirmButtonText: 'Enregistrer',
    showCancelButton: true,
    cancelButtonText: 'Annuler',
  }).then((result) => {
    if (result.isConfirmed) {
      let playerName = result.value;
      saveScore(playerName, score);
    }
    timer = 60;
    init();
  });
}

function saveScore(playerName, score) {
  if (playerName.trim() === "") {
    alert("Veuillez entrer un nom de joueur valide.");
    return;
  }
  fetch('https://charmed-slug-43732.upstash.io/set/' + playerName, {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer AarUAAIjcDE3ZGZmOWFlYWMzM2Q0ZTYyYTY0NzExZGM0YjI4ZmVfY3AxMA',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ value: score }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Erreur HTTP! Statut: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log('Score enregistré avec succès:', data);
      window.location.href = 'leaderboard.html';
    })
    .catch((error) => {
      console.error('Erreur lors de l\'enregistrement du score:', error);
      alert("Une erreur est survenue lors de l'enregistrement du score. Veuillez réessayer.");
    });
}

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
  lastBombSpawn = 0;
  lastStarSpawn = 0;
  music.play(); 
}

function checkResourcesLoaded() {
  if (playerImage.complete && enemyImage.complete && backgroundImage.complete && bombImage.complete && starImage.complete) {
    resourcesLoaded = true;
    init();
    gameLoop();
  }
}

playerImage.onload = checkResourcesLoaded;
enemyImage.onload = checkResourcesLoaded;
backgroundImage.onload = checkResourcesLoaded;
bombImage.onload = checkResourcesLoaded;
starImage.onload = checkResourcesLoaded;

function gameLoop(currentTime) {
  if (!lastTime) lastTime = currentTime;
  let deltaTime = currentTime - lastTime;

  if (deltaTime >= frameInterval) {
    if (resourcesLoaded) {
      update(deltaTime);
      draw();
    }
    lastTime = currentTime - (deltaTime % frameInterval);
  }
  
  requestAnimationFrame(gameLoop);
}

// Initialisation du jeu
checkResourcesLoaded();
