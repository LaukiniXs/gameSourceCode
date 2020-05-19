import isPointInside from "point-in-polygon";

import { drawSpaceShip } from "./drawSpaceShip";
import {
    createExplosion,
    drawEffects,
    createAsteroidExplosion,
    effect,
    createSmokeParticle
} from "./effects";


//        isPointInside([129, 100], polygon.map(function(relativeCoords) { return [ relativeCoords[0] + asX, relativeCoords[1] + asY ] })),

//        );


const canvas = document.createElement("canvas");
document.body.appendChild(canvas);
canvas.style.background = "black";
canvas.style.outline = "2px solid green";
canvas.style.margin = "12px 50px";
canvas.width = 1000;
canvas.height = 580;
canvas.style.position = "absolute";

let onfocus = true;

window.onblur = function () {
    onfocus = false;
}
window.onfocus = function () {
    onfocus = true;
}

const shipThurst = createSmokeParticle("lime", 20, 20);
const context = canvas.getContext("2d");
let keysPressed: string[] = [];
let previousTime = 0;
let shipRotation = 0;
let velocity = 0;
let velocityX = 0;
let velocityY = 0;
let shipPosX = 500;
let shipPosY = 300;
let shipDead = 0;
let aSize = 40;
let score = 0;
let highscore = 0;


interface iBullet {
    bulletPosX: number;
    bulletPosY: number;
    bulletAngle: number;
    bulletVelocity: number;
    size: number;
}

interface iAsteroid {
    asteroidPosX: number;
    asteroidPosY: number;
    aVelocityX: number,
    aVelocityY: number,
    asteroidSize: number;

    points: Array<[number, number]>;
}

const bullets: Array<iBullet> = [];
const asteroids: Array<iAsteroid> = [];

document.addEventListener("mousedown", function() {

       const bgmusic = document.getElementById("backgroundMusic") as HTMLAudioElement;

       bgmusic.volume = 0.02;
       bgmusic.play();
});

document.onkeydown = function (event) {
    if (keysPressed.indexOf(event.key) === -1) {
        keysPressed.push(event.key);
    }
};
document.onkeyup = function (event) {
    const idx = keysPressed.indexOf(event.key);

    if (idx > -1) {
        keysPressed.splice(idx, 1);
    }
};


canvas.onmousedown = function (event) {
    if (shipDead === 0) {
        bullets.push({
            bulletPosX: shipPosX + Math.cos(shipRotation) * 30,
            bulletPosY: shipPosY + Math.sin(shipRotation) * 30,
            bulletAngle: shipRotation,
            bulletVelocity: velocity,
            size: 3,
        });
    }
};


document.getElementById("play-btn").addEventListener("click", function () {
    document.getElementById("splash").style.display = "none";
    window.setInterval(function () {
        if (onfocus === false) {
            return;
        }
        asteroids.push({
            asteroidPosX: -20,
            asteroidPosY: Math.random() * 500,
            aVelocityX: 2 * Math.random() * 9 + 10,
            aVelocityY: (Math.random() * 5) - 2.5,
            asteroidSize: aSize,
            points:
                [[0, -aSize],
                [aSize / 3 + Math.round((Math.random() * 10) - 5), -aSize / 1.2 + Math.round((Math.random() * 10) - 5)],
                [aSize / 2 + Math.round((Math.random() * 10) - 5), -aSize / 2 + Math.round((Math.random() * 10) - 5)],
                [aSize / 1.2 + Math.round((Math.random() * 10) - 5), -aSize / 3 + Math.round((Math.random() * 10) - 5)],
                [aSize, 0],
                [aSize / 1.2 + Math.round((Math.random() * 10) - 5), aSize / 3 + Math.round((Math.random() * 10) - 5)],
                [aSize / 2 + Math.round((Math.random() * 10) - 5), aSize / 2 + Math.round((Math.random() * 10) - 5)],
                [aSize / 3 + Math.round((Math.random() * 10) - 5), aSize / 1.2 + Math.round((Math.random() * 10) - 5)],
                [0, aSize],
                [-aSize / 3 + Math.round((Math.random() * 10) - 5), aSize / 1.2 + Math.round((Math.random() * 10) - 5)],//wtf
                [-aSize / 2 + Math.round((Math.random() * 10) - 5), aSize / 2 + Math.round((Math.random() * 10) - 5)],
                [-aSize / 1.2 + Math.round((Math.random() * 10) - 5), aSize / 3 + Math.round((Math.random() * 10) - 5)],
                [-aSize, 0],
                [-aSize / 1.2 + Math.round((Math.random() * 10) - 5), -aSize / 3 + Math.round((Math.random() * 10) - 5)],
                [-aSize / 2 + Math.round((Math.random() * 10) - 5), -aSize / 2 + Math.round((Math.random() * 10) - 5)],
                [-aSize / 3 + Math.round((Math.random() * 10) - 5), -aSize / 1.2 + Math.round((Math.random() * 10) - 5)]],
        });
        if (shipDead === 0) {
            score += 5;
        }
    }, 1000);



    window.requestAnimationFrame(renderLoop);
});

function renderLoop(time: number) {
    window.requestAnimationFrame(renderLoop);

    if (previousTime === 0) {
        previousTime = time;
    }

    if(shipDead != 0){
        document.getElementById("gameover").style.display = "block";
        document.getElementById("gameover").style.zIndex = "20";
        }

    const shipWasDead = shipDead !== 0;
    let deltaTime = time - previousTime;
    previousTime = time;

    if (onfocus === false) {
        return;
    }
    if(shipDead === 0){
    if (keysPressed.includes("a")) {
        shipRotation -= 0.07 * deltaTime / 16;
    }
    if (keysPressed.includes("d")) {
        shipRotation += 0.07 * deltaTime / 16;
    }
    if (keysPressed.includes("w")) {
        velocityX += 3 * Math.cos(shipRotation) * deltaTime / 16;
        velocityY += 3 * Math.sin(shipRotation) * deltaTime / 16;
        createShipThrust(shipPosX + Math.cos(shipRotation) * -20,shipPosY + Math.sin(shipRotation) * -20);
    }
    // if (keysPressed.includes("s")) {
    //        velocityX -= 2 * Math.cos(shipRotation) * deltaTime / 16;
    //        velocityY -= 2 * Math.sin(shipRotation) * deltaTime / 16;
    // }
    }




    velocity = Math.sqrt(velocityX ** 2 + velocityY ** 2);

    velocityX = Math.min(250, Math.max(-250, velocityX));
    velocityY = Math.min(250, Math.max(-250, velocityY));

    if (shipPosX >= 1031) {
        shipPosX = -25;
    }
    if (shipPosX <= -26) {
        shipPosX = 1030;
    }
    if (shipPosY >= 611) {
        shipPosY = -27;
    }
    if (shipPosY <= -28) {
        shipPosY = 610;
    }

    if (shipDead === 0) {
        shipPosX += (velocityX / 50) * deltaTime / 16;
        shipPosY += (velocityY / 50) * deltaTime / 16;
    }

    context.clearRect(0, 0, canvas.width, canvas.height);
    if (shipDead === 0) {
        for (let i = 0; i < asteroids.length; i++) {
            let collisionPointX1 = shipPosX + Math.cos(shipRotation) * 30;
            let collisionPointY1 = shipPosY + Math.sin(shipRotation) * 30;
            let collisionPointX2 = shipPosX + Math.cos(shipRotation + Math.PI + 0.5) * 33;
            let collisionPointY2 = shipPosY + Math.sin(shipRotation + Math.PI + 0.5) * 33;
            let collisionPointX3 = shipPosX + Math.cos(shipRotation + Math.PI - 0.5) * 33;
            let collisionPointY3 = shipPosY + Math.sin(shipRotation + Math.PI - 0.5) * 33;
            let collisionPointX4 = (collisionPointX1 + collisionPointX3) / 2;
            let collisionPointY4 = (collisionPointY1 + collisionPointY3) / 2;
            let collisionPointX5 = (collisionPointX1 + collisionPointX2) / 2;
            let collisionPointY5 = (collisionPointY1 + collisionPointY2) / 2;
            
            let a = asteroids[i];

            if (isPointInside([collisionPointX1 - a.asteroidPosX, collisionPointY1 - a.asteroidPosY], a.points) === true) {
                shipDead = time;
                createAsteroidExplosion(asteroids[i].asteroidPosX,asteroids[i].asteroidPosY)
                asteroids.splice(i, 1);
                i = i - 1;
            }
            if (isPointInside([collisionPointX2 - a.asteroidPosX, collisionPointY2 - a.asteroidPosY], a.points) === true) {
                shipDead = time;
                createAsteroidExplosion(asteroids[i].asteroidPosX,asteroids[i].asteroidPosY)
                asteroids.splice(i, 1);
                i = i - 1;
            }
            if (isPointInside([collisionPointX3 - a.asteroidPosX, collisionPointY3 - a.asteroidPosY], a.points) === true) {
                shipDead = time;
                createAsteroidExplosion(asteroids[i].asteroidPosX,asteroids[i].asteroidPosY)
                asteroids.splice(i, 1);
                i = i - 1;
            }
            if (isPointInside([collisionPointX4 - a.asteroidPosX, collisionPointY4 - a.asteroidPosY], a.points) === true) {
                shipDead = time;
                createAsteroidExplosion(asteroids[i].asteroidPosX,asteroids[i].asteroidPosY)
                asteroids.splice(i, 1);
                i = i - 1;
            }
            if (isPointInside([collisionPointX5 - a.asteroidPosX, collisionPointY5 - a.asteroidPosY], a.points) === true) {
                shipDead = time;
                createAsteroidExplosion(asteroids[i].asteroidPosX,asteroids[i].asteroidPosY)
                asteroids.splice(i, 1);
                i = i - 1;
            }
        }
    }

    drawBullets(time, deltaTime);

    for (let i = 0; i < asteroids.length; i++) {
        if (asteroids[i].asteroidPosX <= canvas.width + 30) {
            drawAsteroid(asteroids[i], time, deltaTime);
        } else {
            asteroids.splice(i, 1);
            i = i - 1;
        }
    }

    for (let a = 0; a < asteroids.length; a++) {
        for (let b = 0; b < bullets.length; b++) {
            
            if (isPointInside([bullets[b].bulletPosX - asteroids[a].asteroidPosX, bullets[b].bulletPosY - asteroids[a].asteroidPosY], asteroids[a].points) === true) {
                createAsteroidExplosion(asteroids[a].asteroidPosX, asteroids[a].asteroidPosY);
                asteroids.splice(a, 1);
                bullets.splice(b, 1);
                a = a - 1;
                score += 10;
                
                break;
            }
        }
    }

    if (shipDead === 0) {
        drawSpaceShip(context, deltaTime, shipPosX, shipPosY, shipRotation);
    } else if (!shipWasDead) {
        createExplosion(shipPosX, shipPosY);
    }

    drawEffects(context, deltaTime);

    context.fillStyle = "white";
    context.font = "16px Arial";
    context.fillText("Score: " + score.toString(), 20, 25);

}

function drawBullets(time: number, deltaTime: number) {
    for (let i = 0; i < bullets.length; i++) {
        let b = bullets[i];
        drawSingleBullet(b, time, deltaTime);

        if (b.bulletPosX >= canvas.width + 20
            || b.bulletPosX <= - 20
            || b.bulletPosY >= canvas.height + 20
            || b.bulletPosY <= - 20
        ) {
            bullets.splice(i, 1);
            i = i - 1;
        }
    }
}

function drawSingleBullet(bullet: iBullet, time: number, deltaTime: number, ) {

    const size = bullet.size;

    const bulletPosX = bullet.bulletPosX;
    const bulletPosY = bullet.bulletPosY;
    const bulletAngle = bullet.bulletAngle;

    bullet.bulletPosX += Math.cos(bulletAngle) * deltaTime / 16 * 10; //velocityX/50;
    bullet.bulletPosY += Math.sin(bulletAngle) * deltaTime / 16 * 10; //velocityY/50;

    context.beginPath();
    context.moveTo(bulletPosX - 1, bulletPosY - 1);
    context.lineTo(bulletPosX + 1, bulletPosY - 1);
    context.lineTo(bulletPosX + 1, bulletPosY + 1);
    context.lineTo(bulletPosX - 1, bulletPosY + 1);
    context.closePath();
    context.strokeStyle = "red";
    context.lineWidth = 2;
    context.stroke();
}

function drawAsteroid(asteroid: iAsteroid, time: number, deltaTime: number, ) {
    const size = asteroid.asteroidSize;

    const asteroidPosX = asteroid.asteroidPosX;
    const asteroidPosY = asteroid.asteroidPosY;

    const aVelocityX = asteroid.aVelocityX * deltaTime / 10;
    const aVelocityY = asteroid.aVelocityY * deltaTime / 10;

    asteroid.asteroidPosX += aVelocityX / 6;
    asteroid.asteroidPosY += aVelocityY / 2;

    const points = asteroid.points;

    context.beginPath();
    context.moveTo(asteroidPosX + points[0][0], asteroidPosY + points[0][1]);

    for (let i = 0; i < points.length; i++) {
        context.lineTo(asteroidPosX + points[i][0], asteroidPosY + points[i][1]);
    }

    context.closePath();

    context.strokeStyle = "white";
    context.lineWidth = 2;
    context.stroke();

    context.fillStyle = "#111";
    context.fill();

}
function createShipThrust(x: number, y: number) {
    for (let i = 0; i < 10; i++) {
        const speed = 1;
        effect.push({
            x: x,
            y: y,
            velocityX: Math.cos(shipRotation + Math.random() * 0.4 - 0.2) * -1/3 * speed, // -0.015 .. 0.015
            velocityY: Math.sin(shipRotation + Math.random() * 0.4 - 0.2) * -1/3 * speed,
            opacity: 0.5,
            speed: speed,
            img: shipThurst
        });
    }
}
