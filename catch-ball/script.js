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
        const gameContainer = document.querySelector(".game-container");
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
