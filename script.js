let score = 0;

document.addEventListener("DOMContentLoaded", () => {
    const ball = document.getElementById("ball");
    const scoreBoard = document.getElementById("score");

    ball.addEventListener("click", () => {
        score++;
        scoreBoard.textContent = score;
        moveBall();
    });

    function moveBall() {
        const gameContainer = document.querySelector("#catchBall");
        const containerWidth = gameContainer.clientWidth;
        const containerHeight = gameContainer.clientHeight;
        const ballDiameter = ball.clientWidth;

        const randomX = Math.random() * (containerWidth - ballDiameter);
        const randomY = Math.random() * (containerHeight - ballDiameter);

        ball.style.left = `${randomX}px`;
        ball.style.top = `${randomY}px`;
    }

    moveBall();
});

function showGame(gameId) {
    document.querySelectorAll('.game-container').forEach(container => {
        container.style.display = 'none';
    });
    document.getElementById(gameId).style.display = 'flex';
}

// Space Ship Game
const spaceCanvas = document.getElementById("spaceCanvas");
const ctxSpace = spaceCanvas.getContext("2d");
spaceCanvas.width = 800;
spaceCanvas.height = 600;

const spaceship = {
    x: spaceCanvas.width / 2 - 25,
    y: spaceCanvas.height - 60,
    width: 50,
    height: 50,
    dx: 0
};

const meteors = [];
const meteorFrequency = 1000;
let meteorSpeed = 2;
let gameInterval;

document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
        spaceship.dx = -5;
    } else if (e.key === "ArrowRight") {
        spaceship.dx = 5;
    }
});

document.addEventListener("keyup", (e) => {
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        spaceship.dx = 0;
    }
});

function drawSpaceship() {
    ctxSpace.fillStyle = "blue";
    ctxSpace.fillRect(spaceship.x, spaceship.y, spaceship.width, spaceship.height);
}

function drawMeteors() {
    ctxSpace.fillStyle = "gray";
    meteors.forEach((meteor) => {
        ctxSpace.fillRect(meteor.x, meteor.y, meteor.width, meteor.height);
    });
}

function updateSpaceship() {
    spaceship.x += spaceship.dx;
    if (spaceship.x < 0) {
        spaceship.x = 0;
    }
    if (spaceship.x + spaceship.width > spaceCanvas.width) {
        spaceship.x = spaceCanvas.width - spaceship.width;
    }
}

function updateMeteors() {
    meteors.forEach((meteor, index) => {
        meteor.y += meteorSpeed;
        if (meteor.y > spaceCanvas.height) {
            meteors.splice(index, 1);
        }
    });
}

function createMeteor() {
    const meteor = {
        x: Math.random() * (spaceCanvas.width - 30),
        y: -30,
        width: 30,
        height: 30
    };
    meteors.push(meteor);
}

function clearCanvas() {
    ctxSpace.clearRect(0, 0, spaceCanvas.width, spaceCanvas.height);
}

function updateGame() {
    clearCanvas();
    drawSpaceship();
    drawMeteors();
    updateSpaceship();
    updateMeteors();
}

function startGame() {
    gameInterval = setInterval(() => {
        updateGame();
        createMeteor();
    }, meteorFrequency);
}

document.getElementById("spaceShip").addEventListener("click", () => {
    startGame();
});

// Basketball Game
const basketballCanvas = document.getElementById("basketballCanvas");
const ctxBasketball = basketballCanvas.getContext("2d");
basketballCanvas.width = 800;
basketballCanvas.height = 600;

const hoop = {
    x: basketballCanvas.width - 150,
    y: 100,
    width: 100,
    height: 10
};

const ball = {
    x: basketballCanvas.width / 2,
    y: basketballCanvas.height - 30,
    radius: 15,
    dx: 0,
    dy: 0
};

let isDragging = false;

basketballCanvas.addEventListener("mousedown", (e) => {
    const rect = basketballCanvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    if (
        mouseX > ball.x - ball.radius &&
        mouseX < ball.x + ball.radius &&
        mouseY > ball.y - ball.radius &&
        mouseY < ball.y + ball.radius
    ) {
        isDragging = true;
    }
});

basketballCanvas.addEventListener("mousemove", (e) => {
    if (isDragging) {
        const rect = basketballCanvas.getBoundingClientRect();
        ball.x = e.clientX - rect.left;
        ball.y = e.clientY - rect.top;
    }
});

basketballCanvas.addEventListener("mouseup", () => {
    isDragging = false;
    ball.dx = (hoop.x + hoop.width / 2 - ball.x) * 0.1;
    ball.dy = (hoop.y - ball.y) * 0.1;
});

function drawHoop() {
    ctxBasketball.fillStyle = "orange";
    ctxBasketball.fillRect(hoop.x, hoop.y, hoop.width, hoop.height);
}

function drawBasketball() {
    ctxBasketball.beginPath();
    ctxBasketball.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctxBasketball.fillStyle = "brown";
    ctxBasketball.fill();
    ctxBasketball.closePath();
}

function updateBasketball() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    if (
        ball.x + ball.radius > hoop.x &&
        ball.x - ball.radius < hoop.x + hoop.width &&
        ball.y - ball.radius < hoop.y + hoop.height &&
        ball.y + ball.radius > hoop.y
    ) {
        ball.dx = 0;
        ball.dy = 0;
        ball.x = basketballCanvas.width / 2;
        ball.y = basketballCanvas.height - 30;
    }
}

function clearBasketballCanvas() {
    ctxBasketball.clearRect(0, 0, basketballCanvas.width, basketballCanvas.height);
}

function updateBasketballGame() {
    clearBasketballCanvas();
    drawHoop();
    drawBasketball();
    updateBasketball();
}

function startBasketballGame() {
    setInterval(updateBasketballGame, 1000 / 60);
}

document.getElementById("basketball").addEventListener("click", () => {
    startBasketballGame();
});
