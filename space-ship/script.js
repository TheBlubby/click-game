const spaceCanvas = document.getElementById("spaceCanvas");
const ctx = spaceCanvas.getContext("2d");

spaceCanvas.width = spaceCanvas.clientWidth;
spaceCanvas.height = spaceCanvas.clientHeight;

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
    ctx.fillStyle = "blue";
    ctx.fillRect(spaceship.x, spaceship.y, spaceship.width, spaceship.height);
}

function drawMeteors() {
    ctx.fillStyle = "gray";
    meteors.forEach((meteor) => {
        ctx.fillRect(meteor.x, meteor.y, meteor.width, meteor.height);
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
    ctx.clearRect(0, 0, spaceCanvas.width, spaceCanvas.height);
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

document.addEventListener("DOMContentLoaded", () => {
    startGame();
});
