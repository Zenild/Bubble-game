let canvas = document.getElementById('game-canvas');
let ctx = canvas.getContext('2d');
let player = { x: 100, y: 100, speedX: 0, speedY: 0, radius: 20 };
let enemies = [];
let bombs = [];
let stars = [];
let clockUps = [];
let miniBombs = [];
let score = 0;
let timer = 60;
let gameSpeed = 1;

let music = new Audio('bubbleSong.mp3');
const musicDuration = 180 * 1000; 
music.addEventListener('ended', function() {
  music.currentTime = 0;
  music.play();
});

let lastBombSpawn = 10000;
let bombSpawnInterval = 10000;
let lastStarSpawn = 0;
let starSpawnInterval = 12000; 
let lastClockUpSpawn = 0;
let clockUpSpawnInterval = 15000;
let lastMiniBombSpawn = 0;
let miniBombSpawnInterval = 8000;

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

let clockUpImage = new Image();
clockUpImage.src = 'horloge_up.png';

let miniBombImage = new Image();
miniBombImage.src = 'minibombe.png';

let resourcesLoaded = false;
let lastTime = 0;
const fps = 60;
const frameInterval = 1000 / fps;

// Sons
let enemySound = new Audio('enemy_sound.mp3');
let bombSound = new Audio('bomb_sound.mp3');
let miniBombSound = new Audio('mini_bomb_sound.mp3');
let clockUpSound = new Audio('clock_up_sound.mp3');
let starSound = new Audio('star_sound.mp3');

enemySound.preload();
bombSound.preload();
miniBombSound.preload();
clockUpSound.preload();
starSound.preload();

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
    ctx.arc(player.x, player.y, player.radius, 0, 1 * Math.PI);
    ctx.fillStyle = 'red';
    ctx.fill();
  }
}

function drawEnemies() {
  for (let i = 0; i < enemies.length; i++) {
    if (enemyImage.complete) {
      ctx.drawImage(enemyImage, enemies[i].x, enemies[i].y, 22, 22);
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
      ctx.rect(stars[i].x, stars[i].y, 25, 25);
      ctx.fillStyle = 'gold';
      ctx.fill();
    }
  }
}

function drawClockUps() {
  for (let i = 0; i < clockUps.length; i++) {
    if (clockUpImage.complete) {
      ctx.drawImage(clockUpImage, clockUps[i].x, clockUps[i].y, 25, 25);
    } else {
      ctx.beginPath();
      ctx.rect(clockUps[i].x, clockUps[i].y, 20, 20);
      ctx.fillStyle = 'blue';
      ctx.fill();
    }
  }
}

function drawMiniBombs() {
  for (let i = 0; i < miniBombs.length; i++) {
    if (miniBombImage.complete) {
      ctx.drawImage(miniBombImage, miniBombs[i].x, miniBombs[i].y, 20, 20);
    } else {
      ctx.beginPath();
      ctx.rect(miniBombs[i].x, miniBombs[i].y, 15, 15);
      ctx.fillStyle = 'orange';
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
  drawClockUps();
  drawMiniBombs();

  ctx.font = '24px Arial';
  ctx.fillStyle = 'black';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText(`Score: ${score}`, 10, 10);
  ctx.fillText(`Temps restant: ${Math.floor(timer)}`, 10, 30);
  ctx.fillText(`Vitesse: ${gameSpeed.toFixed(2)}x`, 10, 50);
}

function update(deltaTime) {
  gameSpeed = 1 + (60 - timer) / 120; // Augmentation progressive de la vitesse

  player.x += player.speedX * (deltaTime / 16) * gameSpeed;
  player.y += player.speedY * (deltaTime / 16) * gameSpeed;

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
    enemies[i].x += 2 * (deltaTime / 16) * gameSpeed;
    if (enemies[i].x > canvas.width) {
      enemies.splice(i, 1);
    }
  }

  for (let i = 0; i < enemies.length; i++) {
    if (distance(player.x, player.y, enemies[i].x, enemies[i].y) < player.radius + 10) {
      score++;
      enemies.splice(i, 1);
      enemySound.play(); // Joue le son de l'ennemi
    }
  }

  if (Math.random() < 0.05 * (deltaTime / 16) * gameSpeed) {
    enemies.push({ x: 0, y: Math.random() * canvas.height });
  }

  let now = Date.now();
  if (now - lastBombSpawn > bombSpawnInterval / gameSpeed) {
    let bombY = Math.random() * canvas.height;
    for (let i = 0; i < 3; i++) {
      bombs.push({ x: 0, y: bombY });
    }
    lastBombSpawn = now;
  }

  for (let i = 0; i < bombs.length; i++) {
    bombs[i].x += 2 * (deltaTime / 16) * gameSpeed;
    if (bombs[i].x > canvas.width) {
      bombs.splice(i, 1);
    }
  }

  for (let i = 0; i < bombs.length; i++) {
    if (distance(player.x, player.y, bombs[i].x, bombs[i].y) < player.radius + 15) {
      score -= 7;
      bombs.splice(i, 1);
            bombSound.play(); // Joue le son de la bombe
    }
  }

  if (Math.random() < 0.01 * (deltaTime / 16) * gameSpeed) {
    let starY = Math.random() * canvas.height;
    stars.push({ x: 0, y: starY });
  }

  for (let i = 0; i < stars.length; i++) {
    stars[i].x += 2 * (deltaTime / 16) * gameSpeed;
    if (stars[i].x > canvas.width) {
      stars.splice(i, 1);
    }
  }

  for (let i = 0; i < stars.length; i++) {
    if (distance(player.x, player.y, stars[i].x, stars[i].y) < player.radius + 15) {
      score += 5;
      stars.splice(i, 1);
      starSound.play(); // Joue le son de l'étoile
    }
  }

  if (Math.random() < 0.005 * (deltaTime / 16) * gameSpeed) {
    let clockUpY = Math.random() * canvas.height;
    clockUps.push({ x: 0, y: clockUpY });
  }

  for (let i = 0; i < clockUps.length; i++) {
    clockUps[i].x += 2 * (deltaTime / 16) * gameSpeed;
    if (clockUps[i].x > canvas.width) {
      clockUps.splice(i, 1);
    }
  }

  for (let i = 0; i < clockUps.length; i++) {
    if (distance(player.x, player.y, clockUps[i].x, clockUps[i].y) < player.radius + 15) {
      timer += 10;
      clockUps.splice(i, 1);
      clockUpSound.play(); // Joue le son de l'horloge up
    }
  }

  if (Math.random() < 0.02 * (deltaTime / 16) * gameSpeed) {
    let miniBombY = Math.random() * canvas.height;
    miniBombs.push({ x: 0, y: miniBombY });
  }

  for (let i = 0; i < miniBombs.length; i++) {
    miniBombs[i].x += 2 * (deltaTime / 16) * gameSpeed;
    if (miniBombs[i].x > canvas.width) {
      miniBombs.splice(i, 1);
    }
  }

  for (let i = 0; i < miniBombs.length; i++) {
    if (distance(player.x, player.y, miniBombs[i].x, miniBombs[i].y) < player.radius + 10) {
      score -= 3;
      miniBombs.splice(i, 1);
      miniBombSound.play(); // Joue le son de la mini-bombe
    }
  }

  timer -= deltaTime / 1000;
  if (timer < 0) {
    timer = 0;
  }
}

function main() {
  let now = Date.now();
  let deltaTime = now - lastTime;
  lastTime = now;

  update(deltaTime);
  draw();

  requestAnimationFrame(main);
}

main();
