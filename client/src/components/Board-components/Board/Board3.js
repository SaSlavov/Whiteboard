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
    const [points, setPoints] = useState([]);

    useEffect(() => {
        let canv = canvasRef.current;
        canv.width = parentRef.current.offsetWidth;
        canv.height = parentRef.current.offsetHeight + 300;
        let canvCtx = canv.getContext("2d");
        canvCtx.lineJoin = "round";
        canvCtx.lineCap = "round";
        // canvCtx.lineWidth = 3;
        setCtx(canvCtx);

        ctx.lineWidth = 3;
        ctx.shadowBlur = 3;
        ctx.shadowColor = color; //'rgb(0, 0, 0)';

        let offset = canv.getBoundingClientRect();
        setCanvasOffset({ x: parseInt(offset.left), y: parseInt(offset.top) });
    }, [ctx]);

    const handleMouseDown = (e) => {
        setDrawing(true);
        setPoints([...points, { x: e.clientX, y: e.clientY }]);
        setPosition({
            x: parseInt(e.clientX - canvasOffset.x),
            y: parseInt(e.clientY - canvasOffset.y),
        });
    };

    const handleMouseUp = () => {
        setDrawing(false);
        setPoints([]);
    };

    const handleMouseMove = (e) => {
        let mousex = e.clientX - canvasOffset.x;
        let mousey = e.clientY - canvasOffset.y;
        if (drawing) {
            ctx.strokeStyle = color;
            setPoints([...points, { x: e.clientX+8, y: e.clientY }]);
            ctx.beginPath();
            ctx.moveTo(points[0].x, points[0].y);
            for (let i = 1; i < points.length; i++) {
                ctx.lineTo(points[i].x, points[i].y);
            }
            ctx.stroke();
        }
        // setPosition({ x: mousex, y: mousey });
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