const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const Color = {
    black: "#000000",
    green: "#1f8b24",
    red: "#c81d25",
};

const bgImg = new Image();
bgImg.crossOrigin = "anonymous";
bgImg.src = "https://thumbs.dreamstime.com/b/textured-grass-vertical-american-football-field-illustration-eps-file-contains-transparencies-63252174.jpg";

const finishImg = new Image();
finishImg.crossOrigin = "anonymous";
finishImg.src = "https://static.vecteezy.com/system/resources/thumbnails/002/082/517/small/black-and-white-checkered-header-simple-chessboard-abstract-square-texture-vector.jpg";

let assetsLoaded = 0;
bgImg.onload = () => { assetsLoaded++; render(); };
finishImg.onload = () => { assetsLoaded++; render(); };

let tries = [];
let triesLimit = 5;
let wins = 0;
let losses = 0;
let restarts = 0;

let radius = 20;
let signal = signalSquare();
let player = createPlayer(radius);
let isMoving = false;
let time = 8000;
let signalTimer = null;

let mode = "start"; // start, playing, won, lost, results, deleted

function askInt(message, fallback, min, max) {
    const value = parseInt(prompt(message, String(fallback)), 10);
    if (Number.isNaN(value)) return fallback;
    return Math.max(min, Math.min(max, value));
}

function askText(message, fallback) {
    const value = prompt(message, fallback);
    return (value == null || value.trim() === "") ? fallback : value.trim();
}

triesLimit = askInt("Enter Maximum Tries (Default 5; Max 75):", 5, 1, 75);
radius = askInt("Player icon Size (Limit 50):", 20, 1, 50);

const difficulty = askText("Difficulty level (easy, medium, hard):", "medium").toLowerCase();
if (difficulty === "easy") {
    time = randInt(10000, 12000);
} else if (difficulty === "hard") {
    time = randInt(4000, 6000);
} else {
    time = randInt(7000, 9000);
}

function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createPlayer(radius) {
    return {
        x: canvas.width / 2,
        y: canvas.height - radius,
        radius: radius,
        color: Color.black,
    };
}

function signalSquare() {
    return {
        x: 0,
        y: 0,
        w: 50,
        h: 56,
        color: Color.black,
    };
}

function stopTimer() {
    if (signalTimer !== null) {
        clearInterval(signalTimer);
        signalTimer = null;
    }
}

function startTimer() {
    stopTimer();
    signalTimer = setInterval(colorSwitch, time);
}

function colorSwitch() {
    if (signal.color === Color.green) {
        signal.color = Color.red;
    } else {
        signal.color = Color.green;
    }
    render();
}

function drawWhiteBackground() {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawFieldBackground() {
    if (assetsLoaded >= 2) {
        ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
    } else {
        ctx.fillStyle = "#8ccf7a";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
}

function finishLine() {
    if (assetsLoaded >= 2) {
        ctx.drawImage(finishImg, 50, 0, canvas.width - 50, 56);
    } else {
        ctx.fillStyle = "#ddd";
        ctx.fillRect(50, 0, canvas.width - 50, 56);
        ctx.strokeStyle = "#000";
        ctx.beginPath();
        ctx.moveTo(50, 0);
        ctx.lineTo(canvas.width, 0);
        ctx.stroke();
    }
}

function drawSignal() {
    ctx.fillStyle = signal.color;
    ctx.fillRect(signal.x, signal.y, signal.w, signal.h);
    ctx.strokeStyle = "#000";
    ctx.strokeRect(signal.x, signal.y, signal.w, signal.h);
}

function drawPlayer() {
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
    ctx.fillStyle = player.color;
    ctx.fill();
}

function drawText(text, x, y, size = 20, color = Color.black, align = "left") {
    ctx.fillStyle = color;
    ctx.font = `${size}px Arial`;
    ctx.textAlign = align;
    ctx.fillText(text, x, y);
}

function scoreText() {
    drawText(`Wins: ${wins}  Losses: ${losses}  Restarts: ${restarts}`, 200, 25, 14, Color.black);
    drawText("Red Light, Green Light Game", 10, 25, 14, Color.black);
}

function startText() {
    const cx = canvas.width / 2;
    drawText("Press s to Start", cx, canvas.height / 4 - 50, 24, Color.black, "center");
    drawText("Press t to See Results", cx, canvas.height / 4, 24, Color.black, "center");
    drawText("Press q to Quit", cx, canvas.height / 4 + 50, 24, Color.black, "center");
    drawText("Press r to Restart", cx, canvas.height / 4 + 100, 24, Color.black, "center");
    drawText("Press w to Move", cx, canvas.height / 4 + 150, 24, Color.black, "center");
    drawText("If You Move On Red,", cx, canvas.height / 4 + 200, 24, Color.black, "center");
    drawText("You lose", cx, canvas.height / 4 + 250, 24, Color.black, "center");
    drawText(`Every ${triesLimit} Attempts,`, cx, canvas.height / 4 + 300, 24, Color.black, "center");
    drawText("Your game will restart", cx, canvas.height / 4 + 350, 24, Color.black, "center");
}

function restartText() {
    drawText("Press s to Start Again", canvas.width / 2, canvas.height / 2, 24, Color.black, "center");
}

function wonText() {
    drawText("You Won", canvas.width / 2, canvas.height / 2, 24, Color.black, "center");
    drawText("Press s to Start Again", canvas.width / 2, canvas.height / 2 + 50, 20, Color.black, "center");
}

function lostText() {
    drawText("You Lost", canvas.width / 2, canvas.height / 2, 24, Color.black, "center");
    drawText("Press s to Start Again", canvas.width / 2, canvas.height / 2 + 50, 20, Color.black, "center");
}

function deletionText() {
    drawText(`You Have Played ${triesLimit} times`, canvas.width / 2, canvas.height / 3 + 50, 20, Color.black, "center");
    drawText("Your attempts are now deleted", canvas.width / 2, canvas.height / 3 + 100, 20, Color.black, "center");
    drawText("Press s to start again", canvas.width / 2, canvas.height / 3 + 150, 20, Color.black, "center");
}

function renderResultsList() {
    let xPosition = 25;
    let yPosition = 50;

    if (tries.length > 0) {
        for (let i = 0; i < tries.length; i++) {
            drawText(`Play ${i + 1}: ${tries[i]}`, xPosition, yPosition, 14, Color.black);
            yPosition += 18;
            if (yPosition > canvas.height - 60) {
                yPosition = 50;
                xPosition += 150;
            }
        }
        drawText("Press s to Start Again", canvas.width / 2, canvas.height - 25, 20, Color.black, "center");
    } else {
        drawText("No Attempts made", canvas.width / 2, canvas.height / 2 - 50, 24, Color.black, "center");
        restartText();
    }
}

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    switch(mode) {

        case "start":
            drawWhiteBackground();
            scoreText();
            startText();
            break;

        case "playing":
            drawFieldBackground();
            finishLine();
            drawSignal();
            drawPlayer();
            break;

        case "won":
            drawWhiteBackground();
            wonText();
            scoreText();
            break;

        case "lost":
            drawWhiteBackground();
            lostText();
            scoreText();
            break;

        case "quit":
            drawWhiteBackground();
            restartText();
            break;

        case "results":
            drawWhiteBackground();
            scoreText();
            renderResultsList();
            break;

        case "deleted":
            drawWhiteBackground();
            deletionText();
            scoreText();
            break;
    }
}

function checkNumberOfTries(limit) {
    if (tries.length >= limit) {
        stopTimer();
        signal.color = Color.black;
        tries = [];
        wins = 0;
        losses = 0;
        restarts = 0;
        mode = "deleted";
        render();
    }
}

function startRound() {
    if (tries.length >= triesLimit) {
        checkNumberOfTries(triesLimit);
        return;
    }
    mode = "playing";
    signal.color = Color.green;
    player.x = canvas.width / 2;
    player.y = canvas.height - radius;
    isMoving = false;
    startTimer();
    render();
}
function restartGame() {
    if (tries.length >= triesLimit) {
        checkNumberOfTries(triesLimit);
        return;
    }

    stopTimer();
    signal.color = Color.black;
    tries.push("Restart");
    restarts++;
    mode = "start";
    render();
    checkNumberOfTries(triesLimit);
}

function lostGame() {
    stopTimer();
    signal.color = Color.black;
    tries.push("Lost");
    losses++;
    mode = "lost";
    render();
    checkNumberOfTries(triesLimit);
}

function wonGame() {
    stopTimer();
    signal.color = Color.black;
    tries.push("Won");
    wins++;
    mode = "won";
    render();
    checkNumberOfTries(triesLimit);
}

function isMovingWait() {
    if (isMoving === true && signal.color === Color.red) {
        lostGame();
    }
}

function lostGameDelayCheck() {
    setTimeout(isMovingWait, 400);
}

function movePlayer() {
    if (mode !== "playing") return;

    player.y -= 1;
    isMoving = true;
    render();

    if (player.y < 50) {
        wonGame();
        return;
    }

    if (signal.color === Color.red) {
        lostGameDelayCheck();
    }
}

function showResults() {
    stopTimer();
    signal.color = Color.black;
    mode = "results";
    render();
}

function quitGame() {
    stopTimer();

    wins = 0;
    losses = 0;
    restarts = 0;
    tries = [];

    signal.color = Color.black;

    mode = "quit";

    render();
}

function keyDown(e) {
    const key = e.key.toLowerCase();

    if (key === "s") {
        startRound();
    } else if (key === "w") {
        movePlayer();
    } else if (key === "r") {
        restartGame();
    } else if (key === "q") {
        quitGame();
    } else if (key === "t") {
        showResults();
    }

    if (signal.color === Color.black && mode === "start") {
        player.x = canvas.width / 2;
        player.y = canvas.height - radius;
    }
}

function keyUp() {
    isMoving = false;
}

window.addEventListener("keydown", keyDown);
window.addEventListener("keyup", keyUp);

render();
