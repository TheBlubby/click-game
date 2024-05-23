const basketballCanvas = document.getElementById("basketballCanvas");
const ctx = basketballCanvas.getContext("2d");

basketballCanvas.width = basketballCanvas.clientWidth;
basketballCanvas.height = basketballCanvas.clientHeight;

const ball = {
    x: basketballCanvas.width / 2,
    y: basketballCanvas.height - 30,
    radius: 15,
    dx: 0,
    dy: 0,
    isDragging: false,
    startX: 0,
    startY: 0
};

const hoop = {
    x: basketballCanvas.width / 2 - 30,
    y: 20,
    width: 60,
    height: 10
};

function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = "orange";
    ctx.fill();
    ctx.closePath();
}

function drawHoop() {
    ctx.fillStyle = "red";
    ctx.fillRect(hoop.x, hoop.y, hoop.width, hoop.height);
}

function clearCanvas() {
    ctx.clearRect(0, 0, basketballCanvas.width, basketballCanvas.height);
}

function updateBall() {
    if (!ball.isDragging) {
        ball.x += ball.dx;
        ball.y += ball.dy;
        ball.dy += 0.5; // Gravity effect

        if (ball.y + ball.radius > basketballCanvas.height) {
            ball.dy = -ball.dy * 0.7; // Bounce effect
            ball.y = basketballCanvas.height - ball.radius;
        }

        if (ball.x + ball.radius > basketballCanvas.width || ball.x - ball.radius < 0) {
            ball.dx = -ball.dx;
        }
    }
}

function draw() {
    clearCanvas();
    drawBall();
    drawHoop();
    updateBall();
}

function startGame() {
    setInterval(draw, 1000 / 60);
}

basketballCanvas.addEventListener("mousedown", (e) => {
    const rect = basketballCanvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const dx = mouseX - ball.x;
    const dy = mouseY - ball.y;
    if (dx * dx + dy * dy <= ball.radius * ball.radius) {
        ball.isDragging = true;
        ball.startX = mouseX;
        ball.startY = mouseY;
    }
});

basketballCanvas.addEventListener("mousemove", (e) => {
    if (ball.isDragging) {
        const rect = basketballCanvas.getBoundingClientRect();
        ball.x = e.clientX - rect.left;
        ball.y = e.clientY - rect.top;
    }
});

basketballCanvas.addEventListener("mouseup", (e) => {
    if (ball.isDragging) {
        const rect = basketballCanvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        ball.dx = (ball.startX - mouseX) / 10;
        ball.dy = (ball.startY - mouseY) / 10;
        ball.isDragging = false;
    }
});

document.addEventListener("DOMContentLoaded", () => {
    startGame();
});
