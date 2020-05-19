
export function drawSpaceShip(
    context: CanvasRenderingContext2D, 
    deltaTime: number,
    shipPosX: number, 
    shipPosY: number,
    rotation: number,
    ){
    const size = 60;
    let posX = shipPosX;
    let posY = shipPosY;

    context.save();
    context.translate(posX, posY)
    context.rotate(rotation);
 
    context.beginPath();
    context.moveTo(size/2,0);
    context.lineTo(-size/2,-size/4);
    context.lineTo(-size/5,0);
    context.lineTo(-size/2,size/4);
    context.closePath();
    context.strokeStyle = "white";
    context.lineWidth = 1;
    context.stroke();
    context.restore();
  }
