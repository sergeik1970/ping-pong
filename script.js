const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d")
ctx.fillStyle = "rgb(228, 164, 87)"

const grid = 15;
const paddleHeight = grid * 5;
const maxPaddleY = canvas.height - grid - paddleHeight;

const leftCounter = document.querySelector("#leftCounter");
const rightCounter = document.querySelector("#rightCounter");

let ballSpeed = 7;
let paddleSpeed = 7;
let difficulty = 2.5;

//Создаем объекты ракеток

const leftPaddle = {
    x: grid * 2,
    y: canvas.height / 2 - paddleHeight / 2,
    width: grid,
    height: paddleHeight,
    dy: 0
}

const rightPaddle = {
    x: canvas.width - grid * 3,
    y: canvas.height / 2 - paddleHeight / 2,
    width: grid,
    height: paddleHeight,
    dy: 0
}

// Создаем объект мяч

const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    width: grid,
    height: grid,
    dx: -ballSpeed,
    dy: ballSpeed,
    isResetted: false
}

// Очищаем canvas
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
}

// Отрисовка ракеток

function renderPaddle(paddle) {
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

// Отрисовка мяча

function renderBall() {
    ctx.fillRect(ball.x, ball.y, ball.width, ball.height);
}

// Движение мяча
function moveBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;
}

// Отрисовка игрового поля

function renderCanvas() {
    ctx.fillRect(0, 0, canvas.width, grid);//верхняя граница
    ctx.fillRect(0, canvas.height - grid, canvas.width, grid); // нижняя граница

    // разделительная линия
    for (let i = grid; i < canvas.height - grid; i += grid * 2) {
        ctx.fillRect(canvas.width / 2, i, grid, grid)

    }
}

// Движение ракеток
function movePaddles() {
    leftPaddle.y += leftPaddle.dy;
    rightPaddle.y += rightPaddle.dy;
}

// Столкновение мяча со стенами
function collideWallsWithBall() {
    if (ball.y < grid) {
        ball.y = grid
        ball.dy = -ball.dy;
    }

    else if (ball.y > canvas.height - grid * 2) {
        ball.y = canvas.height - grid * 2;
        ball.dy = -ball.dy;
    }

}

// Столкновение ракеток со стенами
function collideWallsWithPaddle(paddle) {
    if (paddle.y < grid) {
        paddle.y = grid;
    }

    else if (paddle.y > maxPaddleY) {
        paddle.y = maxPaddleY;
    }
}

// Столкновение предметов
function isCollides(object1, object2) {
    const width1 = object1.x + object1.width;
    const width2 = object2.x + object2.width;
    const height1 = object1.y + object1.height;
    const height2 = object2.y + object2.height;
    return object1.x < width2
        && object2.x < width1
        && object1.y < height2
        && object2.y < height1;
}

// Столкновение мяча и ракетки

function collidePaddlesWithBall() {
    if (isCollides(ball, rightPaddle)) {
        ball.dx = -ball.dx;
        ball.x = rightPaddle.x - ball.width
        rightCounter.textContent = parseInt(rightCounter.textContent) + 1
    }

    else if (isCollides(ball, leftPaddle)) {
        ball.dx = -ball.dx;
        ball.x = leftPaddle.x + leftPaddle.width
        leftCounter.textContent = parseInt(leftCounter.textContent) + 1
    }
}

// если есть второй игрок
function secondPlayer() {
    document.addEventListener("keydown", (event) => {
        console.log(event)
        if (event.key == "ArrowUp") {
            rightPaddle.dy = -paddleSpeed;
        }
        else if (event.key == "ArrowDown") {
            rightPaddle.dy = paddleSpeed
        }
    });

    document.addEventListener("keyup", (event) => {
        if (event.key == "ArrowUp" || event.key == "ArrowDown") {
            rightPaddle.dy = 0;
        }
    })
}


// Искусственный интелект для правой ракетки
function aiControl() {
    // направление движения
    let direction = 0;

    if (ball.x > canvas.width / 2) {
        if (ball.y < rightPaddle.y) {
            direction = -1;
            // перемещаемся в сторону мяча
            rightPaddle.y += paddleSpeed * direction - difficulty
        }

        else if (ball.y > rightPaddle.y + paddleHeight) {
            direction = 1;
            // перемещаемся в сторону мяча
            rightPaddle.y += paddleSpeed * direction + difficulty
        }

        // Возвращаемся на центр
        if (rightPaddle.y < canvas.height / 2) {
            direction = -1
        }
    }
}

//   Сброс игры если мяч улетел
function resetGame() {
    if ((ball.x < 0 || ball.x > canvas.width) && !ball.isResetted) {
        if (ball.x < 0) {
            leftCounter.textContent = 0;
        }
        else if (ball.x > canvas.width) {
            rightCounter.textContent = 0;
        }
        ball.isResetted = true;

        // Возвращаем мяч на центр
        setTimeout(() => {
            ball.x = canvas.width / 2;
            ball.y = canvas.height / 2;
            ball.isResetted = false;
        }, 1000)
    }

}


// Основной цикл программы

function loop() {

    clearCanvas()
    renderCanvas();
    renderPaddle(leftPaddle);
    renderPaddle(rightPaddle);
    renderBall();
    moveBall();
    movePaddles();
    collideWallsWithBall();
    collideWallsWithPaddle(leftPaddle);
    collideWallsWithPaddle(rightPaddle);

    collidePaddlesWithBall()

    secondPlayer()

    if (useAi == true) {
        aiControl()
    }
    resetGame()



    //переключаем кадр
    requestAnimationFrame(loop);
}

let useAi = false

// Диалоговое окно
alert("Эта игра доступна только на компьютере!")
const numberOfPlayers = confirm("Включить версию для одного игрока?")
if (numberOfPlayers === true) {
    // Как удалить secondPlayer и добавить aiControl?
    alert("Теперь Вы играете с искусственным интелектом)")
    useAi = true
}

// Отслеживаем нажатия на кнопки управления

document.addEventListener("keydown", (event) => {
    console.log(event)
    if (event.key == "w" || event.key == "ц") {
        leftPaddle.dy = -paddleSpeed;
    }
    else if (event.key == "s" || event.key == "ы") {
        leftPaddle.dy = paddleSpeed
    }
});

document.addEventListener("keyup", (event) => {
    if (event.key == "w" || event.key == "s" || event.key == "ц" || event.key == "ы") {
        leftPaddle.dy = 0;
    }
})


// запускаем цикл

requestAnimationFrame(loop);