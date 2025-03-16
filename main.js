let canvas = document.getElementById('minCanvas');
let c = canvas.getContext('2d');
canvas.width = innerWidth / 1.5;
canvas.height = innerHeight - 40;

let keyPressed = {};
let speed = 20;
let counter = 0;
let playerHeadCenterX = 208;
let playerHeadCenterY = canvas.height - 263;
let playerHeadRadius = 26;
let gameStart = false;
let ball = {
    posX: 200,
    posY: 100,
    radius: 70,
    vx: 0,
    vy: 0,
    dx: 0,
    dy: 1, 
};

const badeBall = new Image();
badeBall.src = 'badeball.png'
const spiller2 = new Image();
spiller2.src = 'spillerMove2.png'


function drawBall(x, y, radius) {
    c.beginPath();
    c.arc(x, y, radius, 0, Math.PI * 2, false);
    c.stroke();
}


function wallAndFloorStatements() {
    if (ball.posX - ball.radius < 0 || ball.posX + ball.radius > canvas.width){
        ball.vx = -ball.vx;
    }
    if (ball.posY + ball.radius > canvas.height){
        ball.vy = 0;
        ball.vx = 0;
        ball.posY = canvas.height - ball.radius;
    }
}


function gravityCalculation() {
        ball.vy += ball.dy;
        ball.posY += ball.vy;
        ball.posX += ball.vx; 

}

function drawScore() {
    c.font = '20px Arial'; 
    c.fillStyle = 'black'; 
    c.fillText('Score: ' + counter, 10, 30);
}


function headingCalculation() {
    const badeBallSize = 145;
    const spillerSize = 545;
    
    c.drawImage(badeBall, ball.posX-70, ball.posY-72, badeBallSize, badeBallSize);
    c.drawImage(spiller2, playerHeadCenterX - 493, playerHeadCenterY - 132, spillerSize + 400, spillerSize)
    gravityCalculation();

    let dxCenterBallAndHead = ball.posX - playerHeadCenterX;
    let dyCenterBallAndHead = ball.posY - playerHeadCenterY;
    let distanceBetweenCenters = Math.sqrt(dxCenterBallAndHead**2 + dyCenterBallAndHead**2);


    let playerMovingSideways = keyPressed['ArrowLeft'] || keyPressed['ArrowRight'];
    let playerDirection = 0;
    if (keyPressed['ArrowLeft']) playerDirection = -1;
    if (keyPressed['ArrowRight']) playerDirection = 1;

    if (distanceBetweenCenters < (ball.radius + playerHeadRadius)) {
        counter++;
        let overlap = (ball.radius + playerHeadRadius) - distanceBetweenCenters;
        let angle = Math.atan2(dyCenterBallAndHead, dxCenterBallAndHead);
        ball.posX += (overlap + 1) * Math.cos(angle); 
        ball.posY += (overlap + 1) * Math.sin(angle);

        let nx = dxCenterBallAndHead / distanceBetweenCenters;
        let ny = dyCenterBallAndHead / distanceBetweenCenters;

        console.log(Math.sqrt(nx**2+ny**2));

        let vDotN = ball.vx * nx + ball.vy * ny;

        ball.vx -= 2.1 * vDotN * nx;
        ball.vy -= 2.1 * vDotN * ny;

        if (playerMovingSideways) {
            let pushForce = 7;
            ball.vx += pushForce * playerDirection;

            if (ball.vy > -5) { 
                ball.vy -= 2;
            }
        }

        let minSpeed = 2;
        let speed = Math.sqrt(ball.vx * ball.vx + ball.vy * ball.vy);
        if (speed < minSpeed) {
            ball.vx = minSpeed * Math.cos(angle);
            ball.vy = minSpeed * Math.sin(angle);
        }
    }

    if (keyPressed['ArrowLeft']){ 
        playerHeadCenterX -= speed;
    }
    if (keyPressed['ArrowRight']){
        playerHeadCenterX += speed;
    }

}


function animate() {
    c.clearRect(0, 0, canvas.width, canvas.height);
    requestAnimationFrame(animate);
    headingCalculation();
    wallAndFloorStatements();
    drawScore();
}


document.addEventListener('keydown', (event) => {
    keyPressed[event.key] = true;
});

document.addEventListener('keyup', (event) => {
    keyPressed[event.key] = false;
});