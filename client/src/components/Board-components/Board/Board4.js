import React, { useState, useEffect, useRef } from 'react';
import './Board.css';
import Controls from '../Controls/Controls';

const Board = () => {
    const canvasRef = useRef(null);
    const parentRef = useRef(null);
    const [ctx, setCtx] = useState({});
    const [drawing, setDrawing] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 });
    const [color, setColor] = useState("#0000ff");
    const [lastPoint, setLastPoint] = useState(0);
    useEffect(() => {
        let canv = canvasRef.current;
        canv.width = parentRef.current.offsetWidth;
        canv.height = parentRef.current.offsetHeight + 300;
        let canvCtx = canv.getContext("2d");
        canvCtx.lineJoin = "round";
        canvCtx.lineCap = "round";
        canvCtx.lineWidth = 3;
        setCtx(canvCtx);
        let offset = canv.getBoundingClientRect();
        setCanvasOffset({ x: parseInt(offset.left), y: parseInt(offset.top) });
    }, [ctx]);

    const handleMouseDown = (e) => {
        setDrawing(true);
        setPosition({
            x: parseInt(e.clientX - canvasOffset.x),
            y: parseInt(e.clientY - canvasOffset.y),
        });
        setLastPoint({ x: e.clientX, y: e.clientY });
    };

    const handleMouseUp = () => {
        setDrawing(false);
    };

    const handleMouseMove = (e) => {
        let mousex = e.clientX - canvasOffset.x;
        let mousey = e.clientY - canvasOffset.y;
        if (drawing) {
            ctx.strokeStyle = color;
            ctx.beginPath();

            ctx.globalAlpha = 1;
            ctx.moveTo(lastPoint.x, lastPoint.y);
            ctx.lineTo(e.clientX, e.clientY);
            ctx.stroke();

            ctx.moveTo(lastPoint.x - 4, lastPoint.y - 4);
            ctx.lineTo(e.clientX - 4, e.clientY - 4);
            ctx.stroke();

            ctx.moveTo(lastPoint.x - 2, lastPoint.y - 2);
            ctx.lineTo(e.clientX - 2, e.clientY - 2);
            ctx.stroke();

            ctx.moveTo(lastPoint.x + 2, lastPoint.y + 2);
            ctx.lineTo(e.clientX + 2, e.clientY + 2);
            ctx.stroke();

            ctx.moveTo(lastPoint.x + 4, lastPoint.y + 4);
            ctx.lineTo(e.clientX + 4, e.clientY + 4);
            ctx.stroke();

            setLastPoint({ x: e.clientX, y: e.clientY });
        }
        setPosition({ x: mousex, y: mousey });
    };



    function handleColor(color) {
        setColor(color);
    };

    return (
        <div className="board" ref={parentRef}>
            <Controls handleColor={handleColor} />
            <canvas
                ref={canvasRef}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
            />
        </div>
    );
};

export default Board;
