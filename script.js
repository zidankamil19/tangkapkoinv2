let playerName = "";
let playerPhone = "";

let score = 0;
let lives = 3;
let level = 1;
let combo = 1;
let bestCombo = 1;
let timeLeft = 60;

let gameRunning = false;

let playerX = 50;

let spawnInterval;
let timerInterval;

/* ELEMENT */

const menuScreen =
document.getElementById("menuScreen");

const gameScreen =
document.getElementById("gameScreen");

const gameOverScreen =
document.getElementById("gameOverScreen");

const leaderboardScreen =
document.getElementById("leaderboardScreen");

const gameArea =
document.getElementById("gameArea");

const player =
document.getElementById("player");

/* START GAME */

function startGame() {

playerName =
    document.getElementById("username").value.trim();

playerPhone =
    document.getElementById("phone").value.trim();


if (playerName.length < 3) {

    alert("Username minimal 3 karakter!");

    return;
}


if (playerPhone.length < 10) {

    alert("Masukkan nomor WhatsApp yang valid!");

    return;
}


resetGame();


document.getElementById("playerName").textContent =
    playerName;


switchScreen(gameScreen);


gameRunning = true;


startTimer();

startSpawner();

}

/* RESET */

function resetGame() {

score = 0;

lives = 3;

level = 1;

combo = 1;

bestCombo = 1;

timeLeft = 60;

playerX = 50;


updateHUD();


player.style.left = "50%";


document.querySelectorAll(".object")
    .forEach(object => object.remove());

}

/* SCREEN */

function switchScreen(screen) {

document.querySelectorAll(".screen")
    .forEach(item => item.classList.remove("active"));

screen.classList.add("active");

}

/* HUD */

function updateHUD() {

document.getElementById("score").textContent =
    score;

document.getElementById("lives").textContent =
    lives;

document.getElementById("timer").textContent =
    timeLeft;

document.getElementById("level").textContent =
    level;

document.getElementById("combo").textContent =
    combo;

}

/* TIMER */

function startTimer() {

clearInterval(timerInterval);


timerInterval = setInterval(() => {

    if (!gameRunning) return;


    timeLeft--;


    updateHUD();


    if (timeLeft <= 0) {

        endGame();
    }


}, 1000);

}

/* PLAYER CONTROL */

document.addEventListener("keydown", function(event) {

if (!gameRunning) return;


if (event.key === "ArrowLeft") {

    movePlayer(-7);
}


if (event.key === "ArrowRight") {

    movePlayer(7);
}

});

document.getElementById("leftBtn")
.addEventListener("click", () => {

movePlayer(-7);

});

document.getElementById("rightBtn")
.addEventListener("click", () => {

movePlayer(7);

});

function movePlayer(direction) {

playerX += direction;


if (playerX < 5) playerX = 5;

if (playerX > 95) playerX = 95;


player.style.left =
    playerX + "%";

}

/* SPAWNER */

function startSpawner() {

clearInterval(spawnInterval);


spawnInterval =
    setInterval(() => {

        if (!gameRunning) return;


        createObject();


        increaseDifficulty();


    }, 700);

}

/* CREATE OBJECT */

function createObject() {

const object =
    document.createElement("div");


object.classList.add("object");


const random =
    Math.random();


let type;


if (random < 0.65) {

    type = "coin";

    object.innerHTML = "🪙";

}

else if (random < 0.85) {

    type = "diamond";

    object.innerHTML = "💎";

}

else {

    type = "bomb";

    object.innerHTML = "💣";

}


object.dataset.type =
    type;


object.style.left =
    Math.random() * 90 + "%";


object.style.top =
    "-50px";


gameArea.appendChild(object);


let position = -50;


const speed =
    4 + (level * 0.8);


const fall =
    setInterval(() => {

        if (!gameRunning) {

            clearInterval(fall);

            object.remove();

            return;
        }


        position += speed;


        object.style.top =
            position + "px";


        checkCollision(
            object,
            fall
        );


        if (
            position >
            gameArea.clientHeight
        ) {

            clearInterval(fall);

            object.remove();


            if (
                object.dataset.type === "coin"
            ) {

                combo = 1;

                updateHUD();
            }
        }


    }, 20);

}

/* COLLISION */

function checkCollision(object, fall) {

const playerRect =
    player.getBoundingClientRect();

const objectRect =
    object.getBoundingClientRect();


if (

    objectRect.bottom >
    playerRect.top

    &&

    objectRect.top <
    playerRect.bottom

    &&

    objectRect.right >
    playerRect.left

    &&

    objectRect.left <
    playerRect.right

) {


    const type =
        object.dataset.type;


    if (type === "coin") {

        score += 10 * combo;

        combo++;

    }


    else if (type === "diamond") {

        score += 50 * combo;

        combo += 2;

    }


    else if (type === "bomb") {

        lives--;

        combo = 1;

        player.style.filter =
            "drop-shadow(0 0 20px red)";

        setTimeout(() => {

            player.style.filter =
                "drop-shadow(0 0 10px #00ffff)";

        }, 300);


        if (lives <= 0) {

            clearInterval(fall);

            object.remove();

            endGame();

            return;
        }

    }


    if (combo > bestCombo) {

        bestCombo = combo;
    }


    updateHUD();


    clearInterval(fall);

    object.remove();
}

}

/* DIFFICULTY */

function increaseDifficulty() {

level =
    Math.floor(score / 150) + 1;


updateHUD();

}

/* END GAME */

function endGame() {

if (!gameRunning) return;


gameRunning = false;


clearInterval(spawnInterval);

clearInterval(timerInterval);


saveScore();


document.getElementById("resultName")
    .textContent =
    playerName;


document.getElementById("finalScore")
    .textContent =
    score;


document.getElementById("finalLevel")
    .textContent =
    level;


document.getElementById("bestCombo")
    .textContent =
    bestCombo;


switchScreen(gameOverScreen);

}

/* SAVE SCORE */

function saveScore() {

let leaderboard =
    JSON.parse(
        localStorage.getItem(
            "neonDashLeaderboard"
        )
    ) || [];


leaderboard.push({

    username:
        playerName,

    score:
        score,

    level:
        level,

    date:
        new Date().toLocaleDateString()

});


leaderboard.sort(
    (a, b) =>
    b.score - a.score
);


leaderboard =
    leaderboard.slice(0, 10);


localStorage.setItem(

    "neonDashLeaderboard",

    JSON.stringify(
        leaderboard
    )
);

}

/* LEADERBOARD */

function openLeaderboard() {

const leaderboard =

    JSON.parse(

        localStorage.getItem(
            "neonDashLeaderboard"
        )

    ) || [];


const list =
    document.getElementById(
        "leaderboardList"
    );


list.innerHTML = "";


if (
    leaderboard.length === 0
) {

    list.innerHTML =
        "<p>Belum ada pemain 🥲</p>";

}


leaderboard.forEach(
    (player, index) => {


        list.innerHTML += `

        <div class="rank-item">

            <div class="rank-left">

                <div class="rank-number">

                    #${index + 1}

                </div>

                <div>

                    <div class="rank-name">

                        ${player.username}

                    </div>

                    <small>
                        Level ${player.level}
                    </small>

                </div>

            </div>


            <div class="rank-score">

                ${player.score}

            </div>

        </div>

        `;

    }
);


switchScreen(
    leaderboardScreen
);

}

/* RESTART */

function restartGame() {

resetGame();


switchScreen(
    gameScreen
);


gameRunning = true;


startTimer();

startSpawner();

}

/* BACK MENU */

function backMenu() {

gameRunning = false;


clearInterval(
    spawnInterval
);


clearInterval(
    timerInterval
);


switchScreen(
    menuScreen
);

  }
