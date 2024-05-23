const basketballCanvas = document.getElementById("basketballCanvas");
const ctx = basketballCanvas.getContext("2d");

basketballCanvas.width = basketballCanvas.clientWidth;
basketballCanvas.height = basketballCanvas.clientHeight;

const ballImage = new Image();
ballImage.src = "ball.png"; // Зображення м'яча

const ball = {
    x: basketballCanvas.width / 2,
    y: basketballCanvas.height - 100,
    radius: 25,
    dx: 0,
    dy: 0,
    isDragging: false,
    isFlying: false,
    startX: 0,
    startY: 0,
    dragX: 0,
    dragY: 0,
    originX: 0,
    originY: 0
};

const hoop = {
    x: basketballCanvas.width / 2 - 45,
    y: 100,
    width: 90,
    height: 10 // Висота ліній корзини
};

let score = 0;
const scoreElement = document.getElementById("score");

function drawBall() {
    ctx.drawImage(ballImage, ball.x - ball.radius, ball.y - ball.radius, ball.radius * 2, ball.radius * 2);
}

function drawHoop() {
    // Малюємо верхню і нижню лінії корзини
    ctx.fillStyle = 'red';
    ctx.fillRect(hoop.x, hoop.y, hoop.width, hoop.height); // Верхня лінія
    ctx.fillRect(hoop.x, hoop.y + 120, hoop.width, hoop.height); // Нижня лінія (нижче верхньої на 120 пікселів)
}

function clearCanvas() {
    ctx.clearRect(0, 0, basketballCanvas.width, basketballCanvas.height);
}

function updateBall() {
    if (ball.isFlying) {
        ball.x += ball.dx;
        ball.y += ball.dy;
        ball.dy += 0.5; // Gravity effect

        // Перевірка на зіткнення з підлогою
        if (ball.y + ball.radius > basketballCanvas.height) {
            ball.dy = -ball.dy * 0.7; // Bounce effect
            ball.y = basketballCanvas.height - ball.radius;
            setTimeout(resetBall, 3000); // Повернення м'яча на місце через 3 секунди, якщо не потрапив у корзину
        }

        // Перевірка на зіткнення з бічними сторонами
        if (ball.x + ball.radius > basketballCanvas.width || ball.x - ball.radius < 0) {
            ball.dx = -ball.dx * 0.7; // Bounce effect
        }

        // Перевірка на потрапляння в корзину
        if (ball.x > hoop.x && ball.x < hoop.x + hoop.width) {
            // Перевірка на потрапляння зверху в дірку
            if (ball.y - ball.radius < hoop.y + hoop.height &&
                ball.y + ball.radius > hoop.y + hoop.height &&
                ball.dy > 0) {
                ball.isFlying = false; // Зупинка руху м'яча
                score++;
                scoreElement.textContent = score;
                setTimeout(resetBall, 1000); // Повернення м'яча на місце через 1 секунду
                moveHoop();
            }
            // Перевірка на потрапляння в нижню частину корзини
            else if (ball.y + ball.radius > hoop.y + 120 &&
                ball.y - ball.radius < hoop.y + 120 + hoop.height &&
                ball.dy < 0) {
                ball.dy = -ball.dy * 0.7; // Відскок
            }
        }
    }
}

function drawTrajectory() {
    if (ball.isDragging) {
        const trajectoryPoints = calculateTrajectory(ball.x, ball.y, ball.dragX, ball.dragY, 0.5);
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(ball.x, ball.y);
        for (const point of trajectoryPoints) {
            ctx.lineTo(point.x, point.y);
        }
        ctx.strokeStyle = 'blue';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.closePath();
    }
}

function calculateTrajectory(startX, startY, dragX, dragY, gravity) {
    const points = [];
    let x = startX;
    let y = startY;
    let dx = dragX / 10; // Adjusted value for more realistic trajectory
    let dy = dragY / 10; // Adjusted value for more realistic trajectory
    for (let i = 0; i < 60; i++) { // Iterate for a fixed number of steps to draw the trajectory
        x += dx;
        y += dy;
        dy += gravity;
        points.push({ x, y });
        if (y > basketballCanvas.height || x < 0 || x > basketballCanvas.width) break; // Stop if the ball is out of canvas
    }
    return points;
}

function draw() {
    clearCanvas();
    drawBall();
    drawHoop();
    drawTrajectory();
    updateBall();
}

function startGame() {
    setInterval(draw, 1000 / 60);
}

function resetBall() {
    ball.x = basketballCanvas.width / 2;
    ball.y = basketballCanvas.height - 100;
    ball.dx = 0;
    ball.dy = 0;
    ball.isFlying = false;
    ball.isDragging = false;
}

function moveHoop() {
    // Випадкове розташування по всій ширині холста
    hoop.x = Math.random() * (basketballCanvas.width - hoop.width);
}

function getMousePos(canvas, evt) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

function startDrag(mousePos) {
    ball.isDragging = true;
    ball.originX = mousePos.x;
    ball.originY = mousePos.y;
    ball.startX = ball.x;
    ball.startY = ball.y;
    ball.dragX = 0;
    ball.dragY = 0;
}

function moveDrag(mousePos) {
    if (ball.isDragging) {
        ball.dragX = ball.originX - mousePos.x;
        ball.dragY = ball.originY - mousePos.y;
    }
}

function endDrag() {
    if (ball.isDragging) {
        const power = Math.sqrt(ball.dragX ** 2 + ball.dragY ** 2) / 10;
        ball.dx = ball.dragX / 10; // Adjusted value for more realistic trajectory
        ball.dy = ball.dragY / 10; // Adjusted value for more realistic trajectory
        ball.isDragging = false;
        ball.isFlying = true;
    }
}

// Обробка подій миші
basketballCanvas.addEventListener("mousedown", (e) => {
    const mousePos = getMousePos(basketballCanvas, e);
    startDrag(mousePos);
});

document.addEventListener("mousemove", (e) => {
    const mousePos = getMousePos(basketballCanvas, e);
    moveDrag(mousePos);
});

document.addEventListener("mouseup", (e) => {
    endDrag();
});

// Обробка подій дотику
basketballCanvas.addEventListener("touchstart", (e) => {
    e.preventDefault(); // Зупиняємо поведінку прокручування
    const touch = e.touches[0];
    const touchPos = getMousePos(basketballCanvas, touch);
    startDrag(touchPos);
});

document.addEventListener("touchmove", (e) => {
    e.preventDefault(); // Зупиняємо поведінку прокручування
    const touch = e.touches[0];
    const touchPos = getMousePos(basketballCanvas, touch);
    moveDrag(touchPos);
});

document.addEventListener("touchend", (e) => {
    endDrag();
});

document.addEventListener("DOMContentLoaded", () => {
    startGame();
    moveHoop();
});

document.getElementById("backButton").addEventListener("click", () => {
    window.location.href = "../index.html"; // Посилання на головну сторінку з вибором ігор
});
