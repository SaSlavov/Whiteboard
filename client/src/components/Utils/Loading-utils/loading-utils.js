
export const brush = (canvas, ctx) => {
    ctx.shadowBlur = 0;
    ctx.lineWidth = 3;
    ctx.beginPath();
    canvas.map((currentDrawing) => {
        ctx.strokeStyle = currentDrawing.color;
        ctx.moveTo(currentDrawing.points[0].x, currentDrawing.points[0].y);
        currentDrawing.points.map((currentPoints) => ctx.lineTo(currentPoints.x, currentPoints.y))
    })
    ctx.stroke();
}

export const dots = (canvas, ctx) => {
    ctx.lineWidth = 10;
    ctx.shadowBlur = 10;
    ctx.shadowColor = 'rgb(0, 0, 0)';
    ctx.beginPath();
    canvas.map((currentDrawing) => {
        ctx.strokeStyle = currentDrawing.color;
        ctx.moveTo(currentDrawing.points.x, currentDrawing.points.y);
        currentDrawing.points.map((currentPoints) => {
            ctx.lineTo(currentPoints.x, currentPoints.y);
        })
    })
    ctx.stroke();
}

export const ink = (canvas, ctx) => {
    ctx.lineWidth = 3;
    ctx.shadowBlur = 3;
    ctx.beginPath();
    canvas.map((currentDrawing) => {
        ctx.strokeStyle = currentDrawing.color;
        ctx.shadowColor = currentDrawing.color;
        ctx.moveTo(currentDrawing.points.x, currentDrawing.points.y);
        currentDrawing.points.map((currentPoints) => {
            ctx.lineTo(currentPoints.x, currentPoints.y);
            ctx.stroke();
            return;
        })
    })
    ctx.stroke();
}

export const calligraphy = (canvas, ctx) => {
    canvas.map((currentDrawing) => {
        currentDrawing.points.map((currentPoints) => {
            ctx.shadowBlur = 0;
            ctx.lineWidth = 3;
            ctx.beginPath()
            ctx.globalAlpha = 1;
            ctx.strokeStyle = currentDrawing.color;
            ctx.moveTo(currentDrawing.points.x, currentDrawing.points.y);
            ctx.lineTo(currentPoints.x, currentPoints.y);
            ctx.stroke();

            ctx.moveTo(currentPoints.x - 1, currentPoints.y - 1);
            ctx.lineTo(currentPoints.x, currentPoints.y);
            ctx.stroke();

            ctx.moveTo((currentPoints.x - 1) + 4, (currentPoints.y - 1) + 4);
            ctx.lineTo(currentPoints.x - 4, currentPoints.y - 4);
            ctx.stroke();

            ctx.moveTo((currentPoints.x - 1) - 2, (currentPoints.y - 1) - 2);
            ctx.lineTo(currentPoints.x - 2, currentPoints.y - 2);
            ctx.stroke();

            ctx.moveTo((currentPoints.x - 1) + 2, (currentPoints.y - 1) + 2);
            ctx.lineTo(currentPoints.x + 2, currentPoints.y + 2);
            ctx.stroke();

            ctx.moveTo((currentPoints.x - 1) + 4, (currentPoints.y - 1) + 4);
            ctx.lineTo(currentPoints.x + 4, currentPoints.y + 4);
            ctx.stroke();

            ctx.stroke();
        })
    })
}

export const spray = (canvas, ctx, getRandomInt) => {
    ctx.shadowBlur = 0;
    ctx.lineWidth = 10;
    const density = 50;
    canvas.map((currentDrawing) => {
        ctx.strokeStyle = currentDrawing.color;
        ctx.fillStyle = currentDrawing.color;
        ctx.moveTo(currentDrawing.points.x, currentDrawing.points.y);
        currentDrawing.points.map((currentPoints) => {
            for (let i = density; i--;) {
                let radius = 20;
                let offsetX = getRandomInt(-radius, radius);
                let offsetY = getRandomInt(-radius, radius);
                ctx.fillRect(currentPoints.x + offsetX, currentPoints.y + offsetY, 1, 1);
            }
            return;
        })
    })
    ctx.stroke();
}