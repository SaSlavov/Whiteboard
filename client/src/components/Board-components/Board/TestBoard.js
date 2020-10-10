import React, { useState, useEffect, useRef } from 'react';
import './Board.css';
import Controls from '../Controls/Controls';

const DrawingBoard = () => {
    const canvasRef = useRef(null);
    const parentRef = useRef(null);
    const [ctx, setCtx] = useState({});
    const [drawing, setDrawing] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 });
    const [color, setColor] = useState("#0000ff");
    const [tool, setTool] = useState('');
    const [points, setPoints] = useState([]);
    const [lastPoint, setLastPoint] = useState({ x: 30, y: 30 });
    const [density, setDensity] = useState(50);
    const [memory, setMemory] = useState([])
    const [toolsUsed, setTools] = useState([])
    let data;
    // console.log(newCanvas)
    // console.log(memory, 'something', points)
    

    useEffect(() => {
        let canv = canvasRef.current;
        canv.width = parentRef.current.offsetWidth;
        canv.height = parentRef.current.offsetHeight + 300;
        let canvCtx = canv.getContext("2d");
        canvCtx.lineJoin = "round";
        canvCtx.lineCap = "round";
        setCtx(canvCtx);
        let offset = canv.getBoundingClientRect();
        setCanvasOffset({ x: parseInt(offset.left), y: parseInt(offset.top) });
    }, [ctx]);

    const getRandomInt = (min, max) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    const handleMouseDown = (e) => {
        setDrawing(true);
        // (tool === 'Ink') && setPoints([...points, { x: e.clientX, y: e.clientY }]);
        setLastPoint({ x: e.clientX, y: e.clientY });
        setPosition({
            x: parseInt(e.clientX - canvasOffset.x),
            y: parseInt(e.clientY - canvasOffset.y),
        });
    };

    const handleMouseUp = () => {
        const updatedMemory = memory.slice()
        updatedMemory.push([points])
        setMemory(updatedMemory)

        setPoints([])
        // setMemory(data)
        setDrawing(false);

        // (tool === 'Ink') && setPoints([]);
    };


    const handleMouseMove = (e) => {
        let mousex = e.clientX - canvasOffset.x;
        let mousey = e.clientY - canvasOffset.y;
        // console.log(mousex, mousey)
        // console.log( e.clientX,e.clientY)

        if (drawing) {
            if (tool === 'Brush') {
                // console.log('Painting with Brush');
                // setTools(toolsUsed.push('brush'))
                setPoints([...points, { tool: 'brush',points:{x: position.x, y: position.y} }]);
                ctx.shadowBlur = 0;
                ctx.strokeStyle = color;
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.moveTo(position.x, position.y);
                ctx.lineTo(mousex, mousey);
                ctx.stroke();
                // console.log(memory, 'something', points)
                // const updatedMemory = memory.slice()
                // updatedMemory.push(points)
                // setMemory(updatedMemory)

            } else if (tool === 'Dots') {
                // console.log('Painting with Dots');
                // setPoints([...points, { x: position.x, y: position.y }]);
                setPoints([...points,  {tool: 'dots',points:{x: position.x, y: position.y}} ]);

                ctx.strokeStyle = color;
                ctx.lineWidth = 10;
                // ctx.lineJoin = ctx.lineCap = 'round';
                ctx.shadowBlur = 10;
                ctx.shadowColor = 'rgb(0, 0, 0)';
                ctx.beginPath();
                ctx.moveTo(position.x, position.y);
                ctx.lineTo(mousex, mousey);
                ctx.stroke();
                // setTools(toolsUsed.push('dots'))

            } else if (tool === 'Ink') {
                ctx.lineWidth = 3;
                ctx.shadowBlur = 3;
                ctx.shadowColor = color;
                ctx.strokeStyle = color;
                // setPoints([...points, { x: e.clientX + 8, y: e.clientY }]);
                // setPoints([...points, { x: position.x, y: position.y }]);
                setPoints([...points,  {tool: 'ink',points:{x: position.x, y: position.y}} ]);

                ctx.beginPath();
                // ctx.moveTo(points[0].x, points[0].y);
                for (let i = 1; i < points.length; i++) {
                    ctx.lineTo(points[i].points.x, points[i].points.y);
                }
                ctx.stroke();
                // setTools(toolsUsed.push('ink'))

            } else if (tool === 'Calligraph') {
                // setPoints([...points, { x: position.x, y: position.y }]);
                setPoints([...points,  {tool: 'calligraphy',points:{x: position.x, y: position.y}} ]);
                // data = [...points,  {tool: 'calligraphy',points:{x: position.x, y: position.y}} ];
                
                ctx.shadowBlur = 0;
                ctx.lineWidth = 3;
                ctx.strokeStyle = color;
                ctx.beginPath();

                // ctx.globalAlpha = 1;
                // ctx.moveTo(lastPoint.x, lastPoint.y);
                ctx.moveTo(lastPoint.x, lastPoint.y);
                ctx.lineTo(e.clientX, e.clientY);
                ctx.stroke();
                setPoints([...points,  {tool: 'calligraphy',points:{x: position.x, y: position.y}} ]);


                ctx.moveTo(lastPoint.x - 4, lastPoint.y - 4);
                ctx.lineTo(e.clientX - 4, e.clientY - 4);
                ctx.stroke();
                setPoints([...points,  {tool: 'calligraphy',points:{x: position.x, y: position.y}} ]);


                ctx.moveTo(lastPoint.x - 2, lastPoint.y - 2);
                ctx.lineTo(e.clientX - 2, e.clientY - 2);
                ctx.stroke();
                setPoints([...points,  {tool: 'calligraphy',points:{x: position.x, y: position.y}} ]);


                ctx.moveTo(lastPoint.x + 2, lastPoint.y + 2);
                ctx.lineTo(e.clientX + 2, e.clientY + 2);
                ctx.stroke();
                setPoints([...points,  {tool: 'calligraphy',points:{x: position.x, y: position.y}} ]);


                ctx.moveTo(lastPoint.x + 4, lastPoint.y + 4);
                ctx.lineTo(e.clientX + 4, e.clientY + 4);
                ctx.stroke();
                setPoints([...points,  {tool: 'calligraphy',points:{x: position.x, y: position.y}} ]);

                // setPoints([...points, { x: e.clientX + 4, y: e.clientY + 4 }]);


                setLastPoint({ x: e.clientX, y: e.clientY });
                // setTools(toolsUsed.push('calligraphy'))


            } else if (tool === 'Spray') {
                // setPoints([...points, { x: position.x, y: position.y }]);
                setPoints([...points,  {tool: 'spray',points:{x: position.x, y: position.y}} ]);

                ctx.shadowBlur = 0;
                ctx.lineWidth = 10;
                ctx.fillStyle = color;
                ctx.strokeStyle = color;
                for (let i = density; i--;) {
                    let radius = 20;
                    let offsetX = getRandomInt(-radius, radius);
                    let offsetY = getRandomInt(-radius, radius);
                    ctx.fillRect(e.clientX + offsetX, e.clientY + offsetY, 1, 1);
                }
                // setTools(toolsUsed.push('spray'))


            } else {
                setTool('Brush');
            }

        };

        setPosition({ x: mousex, y: mousey });
    };

    function handleColor(color) {
        setColor(color);
    };

    const selectTool = (tool) => {
        setTool(tool);
        const allTools = toolsUsed
        allTools.push(tool)
        setTools(allTools)
        // console.log(tool);
    };

    const brush = (canvas) => {
        console.log('in2')
        ctx.shadowBlur = 0;
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.beginPath();
        canvas.map((currentDrawing) => {
            // ctx.moveTo(currentDrawing[0][0].points.x, currentDrawing[0][0].points.y);
            console.log(currentDrawing)
            ctx.moveTo(currentDrawing[0].points.x, currentDrawing[0].points.y);
            // ctx.lineTo(currentDrawing.points.x, currentDrawing.points.y);
            currentDrawing.map((currentPoints) => {
                ctx.lineTo(currentPoints.points.x, currentPoints.points.y);
            })

        })

        ctx.stroke();
    }

    const dots = (canvas) => {
        ctx.strokeStyle = color;
        ctx.lineWidth = 10;
        ctx.shadowBlur = 10;
        ctx.shadowColor = 'rgb(0, 0, 0)';
        ctx.beginPath();
        canvas.map((currentDrawing) => {
            console.log((currentDrawing))
            ctx.moveTo(currentDrawing[0].points.x, currentDrawing[0].points.y);
            // ctx.lineTo(currentDrawing.points.x, currentDrawing.points.y);

            currentDrawing.map((currentPoints) => {
                ctx.lineTo(currentPoints.points.x, currentPoints.points.y);
            })

        })

        ctx.stroke();
    }

    const ink = (canvas) => {
        ctx.lineWidth = 3;
        ctx.shadowBlur = 3;
        ctx.shadowColor = color;
        ctx.strokeStyle = color;
        ctx.beginPath();
        canvas.map((currentDrawing) => {
            console.log((currentDrawing))
            ctx.moveTo(currentDrawing[0].points.x, currentDrawing[0].points.y);

            currentDrawing.map((currentPoints) => {
                ctx.lineTo(currentPoints.points.x, currentPoints.points.y);
            })

        })

        ctx.stroke();
    }

    const calligraphy = (canvas) => {
        ctx.shadowBlur = 0;
        ctx.lineWidth = 3;
        ctx.strokeStyle = color;
        ctx.beginPath()
        ctx.globalAlpha = 1;

        canvas.map((currentDrawing) => {
            ctx.moveTo(currentDrawing[0].points.x, currentDrawing[0].points.y);
            console.log(currentDrawing)
            currentDrawing.map((currentPoints) => {
                // ctx.lineTo(currentPoints.points.x, currentPoints.points.y);

                // ctx.moveTo(currentPoints.points.x - 1, currentPoints.points.y - 1);
                ctx.lineTo(currentPoints.points.x, currentPoints.points.y);
                ctx.stroke();

                ctx.moveTo((currentPoints.points.x - 1) + 4, (currentPoints.points.y - 1) + 4);
                ctx.lineTo(currentPoints.points.x - 4, currentPoints.points.y - 4);
                ctx.stroke();

                ctx.moveTo((currentPoints.points.x - 1) - 2, (currentPoints.points.y - 1) - 2);
                ctx.lineTo(currentPoints.points.x - 2, currentPoints.points.y - 2);
                ctx.stroke();

                ctx.moveTo((currentPoints.points.x - 1) + 2, (currentPoints.points.y - 1) + 2);
                ctx.lineTo(currentPoints.points.x + 2, currentPoints.points.y + 2);
                ctx.stroke();

                ctx.moveTo((currentPoints.points.x - 1) + 4, (currentPoints.points.y - 1) + 4);
                ctx.lineTo(currentPoints.points.x + 4, currentPoints.points.y + 4);
                ctx.stroke();

                // setLastPoint({ x: currentPoints.points.x, y: currentPoints.points.y });
            })

        })

        // ctx.stroke();
    }

    const spray = (canvas) => {
        ctx.shadowBlur = 0;
        ctx.lineWidth = 10;
        ctx.fillStyle = color;
        ctx.strokeStyle = color;

        canvas.map((currentDrawing) => {
            ctx.moveTo(currentDrawing[0].points.x, currentDrawing[0].points.y);
            currentDrawing.map((currentPoints) => {
                // ctx.lineTo(currentPoints.x, currentPoints.y);
                for (let i = density; i--;) {
                    let radius = 20;
                    let offsetX = getRandomInt(-radius, radius);
                    let offsetY = getRandomInt(-radius, radius);
                    ctx.fillRect(currentPoints.points.x + offsetX, currentPoints.points.y + offsetY, 1, 1);
                }
            })

        })

        ctx.stroke();
        
    }

    const handleLoad = () => {
        console.log('loading')
        const loadedCanvas = JSON.parse(localStorage.getItem('canvas'))
        console.log('loaded')
        console.log(loadedCanvas)
        // console.log(loadedCanvas[0][0][0].tool)
        

        if (!loadedCanvas) {
            return
        }
        loadedCanvas.map(currentDrawing => {
            console.log(currentDrawing[0][0])
            // if(currentDrawing[0][0].tool === 'brush') {
            //     console.log('in')
            //     brush(currentDrawing)
            // }
            if(currentDrawing[0][0].tool === 'dots') {
                console.log('in dots')
                dots(currentDrawing)
            }
            if(currentDrawing[0][0].tool === 'ink') {
                console.log('in ink')
                ink(currentDrawing)
            }
            if(currentDrawing[0][0].tool === 'calligraphy') {
                calligraphy(currentDrawing)
            }
            if(currentDrawing[0][0].tool === 'spray') {
                spray(currentDrawing)
            }
        })
        
        // brush(loadedCanvas)
        setMemory(loadedCanvas)

    }

    return (
        <div className="board" ref={parentRef}>
            <Controls handleColor={handleColor} selectTool={selectTool} memory={memory} handleLoad={handleLoad} />
            <canvas
                ref={canvasRef}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
            />
        </div>
    );
};

export default DrawingBoard;



// (tool === 'Calligraph') {
//     ctx.shadowBlur = 0;
//     ctx.lineWidth = 3;
//     ctx.strokeStyle = color;
//     ctx.beginPath();

//     ctx.globalAlpha = 4;
//     ctx.moveTo(lastPoint.x, lastPoint.y);
//     ctx.lineTo(e.clientX, e.clientY);
//     ctx.stroke();

//     ctx.moveTo(lastPoint.x - 4, lastPoint.y - 4);
//     ctx.lineTo(e.clientX - 4, e.clientY - 4);
//     ctx.stroke();

//     ctx.moveTo(lastPoint.x - 2, lastPoint.y - 2);
//     ctx.lineTo(e.clientX - 2, e.clientY - 2);
//     ctx.stroke();

//     ctx.moveTo(lastPoint.x + 2, lastPoint.y + 2);
//     ctx.lineTo(e.clientX + 2, e.clientY + 2);
//     ctx.stroke();

//     ctx.moveTo(lastPoint.x + 4, lastPoint.y + 4);
//     ctx.lineTo(e.clientX + 4, e.clientY + 4);
//     ctx.stroke();

//     setLastPoint({ x: e.clientX, y: e.clientY });

// }