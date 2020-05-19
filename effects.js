export const effect: Array<Smoke> = [];

interface Smoke {
    x: number;
    y: number;
    velocityX: number;
    velocityY: number;
    opacity: number;
    speed: number;
    img: HTMLCanvasElement;
}

const redSmoke = createSmokeParticle("red", 80, 80);
const orangeSmoke = createSmokeParticle("darkorange", 80, 80);
const whiteExplosion = createSmokeParticle("white", 80, 80);

//const whiteSmoke = createSmokeParticle("whiteSmoke", 256, 60);

export function createSmokeParticle(
    color: string,
    canvasSize: number,
    particleSize: number
) {
    // izveido attēlu vienai dūmu daļiņai, jo .drawImage() ir daudz ātrāka funkcija
    // nekā beginPath/arc/shadow/fill.
    const canvas = document.createElement("canvas");
    canvas.width = canvasSize;
    canvas.height = canvasSize;

    const context = canvas.getContext("2d");
    context.beginPath();
    context.arc(-10000, 0, particleSize / 5, 0, Math.PI * 2);
    context.fillStyle = "gray";
    context.shadowBlur = particleSize;
    context.shadowOffsetX = 10000 + canvas.width / 2;
    context.shadowOffsetY = canvas.height / 2;
    context.shadowColor = color;
    context.fill();

    return canvas;
}


export function createExplosion(x: number, y: number) {
    for (let i = 0; i < 50; i++) {
        const speed = 10;
        effect.push({
            x: x,
            y: y,
            velocityX: Math.random() * 0.03 * speed - 0.015 * speed, // -0.015 .. 0.015
            velocityY: Math.random() * 0.03 * speed - 0.015 * speed,
            opacity: 1,
            speed: speed,
            img: redSmoke
        });
    }

    for (let i = 0; i < 50; i++) {
        const speed = 8;
        effect.push({
            x: x,
            y: y,
            velocityX: Math.random() * 0.03 * speed - 0.015 * speed, // -0.015 .. 0.015
            velocityY: Math.random() * 0.03 * speed - 0.015 * speed,
            opacity: 1,
            speed: speed,
            img: orangeSmoke
        });
    }
}

export function createAsteroidExplosion(x: number, y: number) {
    for (let i = 0; i < 15; i++) {
        const speed = 15;
        effect.push({
            x: x,
            y: y,
            velocityX: Math.random() * 0.03 * speed - 0.015 * speed, // -0.015 .. 0.015
            velocityY: Math.random() * 0.03 * speed - 0.015 * speed,
            opacity: 1,
            speed: speed,
            img: whiteExplosion
        });
    }
}
//awinbabwe


export function drawEffects(context: CanvasRenderingContext2D, deltaTime: number) {
    for (let i = 0; i < effect.length; i++) {
        const e = effect[i];

        e.x += e.velocityX * deltaTime;
        e.y += e.velocityY * deltaTime;

        e.opacity -= deltaTime * 0.0001 * e.speed;

        if (e.opacity > 0) {
            context.globalAlpha = e.opacity;
            context.drawImage(e.img, e.x - e.img.width / 2, e.y - e.img.width / 2);
        } else {
            effect.splice(i, 1);
            i = i - 1;
        }
    }
    context.globalAlpha = 1;
}

