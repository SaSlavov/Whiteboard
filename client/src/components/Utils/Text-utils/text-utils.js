export const writeText = (ctx, info, style = {},) => {
    const { text, x, y } = info;
    const {  fontSize = '20', fontStyle = 'normal', fontFamily = 'Arial', color = 'black', textAlign = 'left', textBaseline = 'top' } = style;
    
    ctx.beginPath();
    ctx.font = `${fontStyle && fontStyle} ` + fontSize + 'pt ' + fontFamily;
    ctx.textAlign = textAlign;
    ctx.textBaseline = textBaseline;
    ctx.fillStyle = color;
    ctx.fillText(text, x, y);
    ctx.stroke();
    
    return
}