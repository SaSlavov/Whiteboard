import React, { useState, useEffect, useRef, useContext } from 'react';
import './DrawingBoard.css';
import { BASE_URL } from '../../../common/constants';
import Controls from '../Controls/Controls';
import { writeText } from '../../Utils/Text-utils/text-utils'
import Chat from '../../Pages/Chat/Chat';
import AllUsers from '../../Pages/Chat/AllUsers';
import AuthContext from '../../../providers/AuthContext';


const DrawingBoard = (props) => {
    const canvasRef = useRef(null);
    const parentRef = useRef(null);
    const [ctx, setCtx] = useState({});
    const [drawing, setDrawing] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 });
    const [color, setColor] = useState("#000000");
    const [tool, setTool] = useState('');
    const [points, setPoints] = useState([]);
    const [lastPoint, setLastPoint] = useState({ x: 30, y: 30 });
    const [density, setDensity] = useState(50);
    const [memory, setMemory] = useState([]);
    const [toolsUsed, setTools] = useState([]);
    const [drawingInfo, setDrawingInfo] = useState([]);
    const [currentBoard, setCurrentBoard] = useState(null);
    const [selectedBoard, setSelectedBoard] = useState(+props.location.pathname.split('/').pop())
    const [inputText, setInputText] = useState('')
    const [positionOfText, setPositionOfText] = useState(null)
    const [fontSize, setFontSize] = useState(18)
    const [fontStyle, setFontStyle] = useState(undefined)
    const [chatRoom, setChatRoom] = useState(null)
    const [isChatVisible, setIsChatVisible] = useState(false)
    const [areUsersVisible, setAreUsersVisible] = useState(false)
    const [topic, setTopic] = useState(null)
    const [chatReceiver, setReceiver] = useState(null)

    let tempTopic = ''

    const { user } = useContext(AuthContext);

    if (!user) {
        props.history.push("/login")
    };
    useEffect(() => {
        if (!topic) {
            return
        }
        let canv = canvasRef.current;
        canv.width = window.innerWidth
        canv.height = window.innerHeight - 73
        let canvCtx = canv.getContext("2d");
        canvCtx.lineJoin = "round";
        canvCtx.lineCap = "round";
        setCtx(canvCtx);
        let offset = canv.getBoundingClientRect();
        setCanvasOffset({ x: parseInt(offset.left), y: parseInt(offset.top) });
    }, [topic]);

    const inputTopic = (e) => {
            tempTopic = e.target.value
    }

    const createBoard = () => {
        if (selectedBoard) {
            return
        };
        
        fetch(`${BASE_URL}/boards`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
            },
            body: JSON.stringify({
                topic: tempTopic,
                drawing: memory
            }),
        })
            .then(r => r.json())
            .then(res => {
                setTopic(tempTopic);
                setCurrentBoard(res);
            })
    };

    const getRandomInt = (min, max) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    const handleMouseDown = (e) => {
        setDrawing(true);
        setLastPoint({ x: e.clientX + 5, y: e.clientY - 70 });
        setPosition({
            x: parseInt(e.clientX - canvasOffset.x),
            y: parseInt(e.clientY - canvasOffset.y),
        });
    };

    const handleMouseUp = (e) => {
        const currentDrawingInfo = drawingInfo.slice()
        currentDrawingInfo.push({
            tool: tool,
            color: color,
            points: points,
        });
        const updatedMemory = memory.slice();
        updatedMemory.push(currentDrawingInfo);
        setMemory(updatedMemory);
        handleSave(updatedMemory);
        setPoints([]);
        setDrawing(false);
        setLastPoint({ x: e.clientX + 5, y: e.clientY - 70 });

        if (tool === 'Text') {
            setPositionOfText({ x: position.x, y: position.y })
        }
    };

    const handleSave = (updatedMemory) => {
        fetch(`${BASE_URL}/boards/${currentBoard}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
            },
            body: JSON.stringify(updatedMemory),
        })
            .then(r => r.json())
            .then(res => {
                setCurrentBoard(res.id);
            })
            .catch(err => console.log(err))
    };

    const handleMouseMove = (e) => {
        let mousex = e.clientX - canvasOffset.x;
        let mousey = e.clientY - canvasOffset.y;
        if (drawing) {
            switch (tool) {
                case 'Brush':
                    setPoints([...points, { x: position.x, y: position.y }]);

                    ctx.shadowBlur = 0;
                    ctx.strokeStyle = color;
                    ctx.lineWidth = 3;
                    ctx.beginPath();
                    ctx.moveTo(position.x, position.y);
                    ctx.lineTo(mousex, mousey);
                    ctx.stroke();
                    break;

                case 'Dots':
                    setPoints([...points, { x: position.x, y: position.y }]);
                    ctx.strokeStyle = color;
                    ctx.lineWidth = 10;
                    ctx.shadowBlur = 10;
                    ctx.shadowColor = 'rgb(0, 0, 0)';
                    ctx.beginPath();
                    ctx.moveTo(position.x, position.y);
                    ctx.lineTo(mousex, mousey);
                    ctx.stroke();
                    break;

                case 'Ink':
                    setPoints([...points, { x: position.x, y: position.y }]);
                    ctx.lineWidth = 3;
                    ctx.shadowBlur = 3;
                    ctx.shadowColor = color;
                    ctx.strokeStyle = color;
                    ctx.beginPath();
                    for (let i = 1; i < points.length; i++) {
                        ctx.lineTo(points[i].x, points[i].y);
                    }
                    ctx.stroke();
                    break;

                case 'Calligraph':
                    setPoints([...points, { x: position.x, y: position.y }]);
                    ctx.shadowBlur = 0;
                    ctx.lineWidth = 3;
                    ctx.strokeStyle = color;

                    ctx.globalAlpha = 1;

                    ctx.beginPath();
                    ctx.moveTo(lastPoint.x, lastPoint.y);
                    ctx.lineTo(e.clientX + 5, e.clientY - 70);
                    ctx.stroke();

                    ctx.moveTo(lastPoint.x - 4, lastPoint.y - 4);
                    ctx.lineTo(e.clientX + 5 - 4, e.clientY - 70 - 4);
                    ctx.stroke();

                    ctx.moveTo(lastPoint.x - 2, lastPoint.y - 2);
                    ctx.lineTo(e.clientX + 5 - 2, e.clientY - 70 - 2);
                    ctx.stroke();

                    ctx.moveTo(lastPoint.x + 2, lastPoint.y + 2);
                    ctx.lineTo(e.clientX + 5 + 2, e.clientY - 70 + 2);
                    ctx.stroke();

                    ctx.moveTo(lastPoint.x + 4, lastPoint.y + 4);
                    ctx.lineTo(e.clientX + 5 + 4, e.clientY - 70 + 4);
                    ctx.stroke();

                    setLastPoint({ x: e.clientX + 5, y: e.clientY - 70 });
                    break;

                case 'Spray':
                    setPoints([...points, { x: position.x, y: position.y }]);
                    ctx.shadowBlur = 0;
                    ctx.lineWidth = 10;
                    ctx.fillStyle = color;
                    ctx.strokeStyle = color;
                    let radius = 20;
                    for (let i = density; i--;) {
                        let offsetX = getRandomInt(-radius, radius);
                        let offsetY = getRandomInt(-radius, radius);
                        ctx.fillRect(e.clientX + 5 + offsetX, e.clientY - 70 + offsetY, 1, 1);
                    };
                    break;

                default:
                    setTool('Brush');
                    break;
            };
        };
        setPosition({ x: mousex, y: mousey });
    };

    const handleColor = (color) => {
        setColor(color);
    };

    const selectTool = (tool) => {
        setTool(tool);
        const allTools = toolsUsed;
        allTools.push(tool);
        setTools(allTools);
    };

    const inputTyping = (e) => {
        if (e.key === 'Enter') {
            writeText(ctx, {
                text: inputText,
                x: position.x,
                y: position.y
            },
                {
                    fontStyle: fontStyle,
                    fontSize: fontSize,
                    color: color
                })
            setPositionOfText(null);

            const currentDrawingInfo = drawingInfo.slice()
            currentDrawingInfo.push({
                tool: tool,
                color: color,
                points: {
                    fontStyle: fontStyle,
                    fontSize: fontSize,
                    color: color,
                    text: inputText,
                    x: position.x,
                    y: position.y
                },
            })

            const updatedMemory = memory.slice()
            updatedMemory.push(currentDrawingInfo)
            setMemory(updatedMemory)
            handleSave(updatedMemory)
            setPoints([])
            setFontSize(18)
            setFontStyle(undefined)
            return
        }

        setInputText(e.target.value)
    }


    return (
        <div>
            {!topic
                ? <div className="create-topic">
                    <p>Boards' topic</p>
                    <input className="topic-input" onChange={(e) => inputTopic(e)}></input>
                    <button className="topic-btn" onClick={() => createBoard()}>Create</button>
                </div>
                : <div className="board"
                    ref={parentRef}>
                    <Controls
                        handleColor={handleColor}
                        selectTool={selectTool}
                    />
                    <canvas
                        className="canvas"
                        ref={canvasRef}
                        onMouseDown={handleMouseDown}
                        onMouseUp={handleMouseUp}
                        onMouseMove={handleMouseMove}
                    />
                    {tool === 'Text' && positionOfText && <div className="draftjs" style={{ left: positionOfText.x + 'px', top: positionOfText.y + 'px' }}>
                        <div className="font-size">
                            <select id="font" defaultValue="18" onChange={(e) => setFontSize(e.target.value)}>
                                <option value="6">6pt</option>
                                <option value="12">12pt</option>
                                <option value="18">18pt</option>
                                <option value="24">24pt</option>
                                <option value="30">30pt</option>
                            </select>
                        </div>
                        <div className="font-style">
                            <select id="font-style" onChange={(e) => setFontStyle(e.target.value)}>
                                <option value="normal">normal</option>
                                <option value="italic">italic</option>
                                <option value="bold">bold</option>
                            </select>
                        </div>
                        <textarea className="input-text" style={{ color: color, fontStyle: fontStyle, fontSize: `${fontSize}px` }} onKeyUp={(e) => inputTyping(e)}></textarea>
                    </div>
                    }
                    {areUsersVisible && <AllUsers setChatRoom={setChatRoom} setIsChatVisible={setIsChatVisible} setReceiver={setReceiver}/>}
                    {isChatVisible && chatRoom && <Chat roomId={chatRoom} setIsChatVisible={setIsChatVisible} chatReceiver={chatReceiver}/>}
                    {!isChatVisible && <a className="chat-btn" onClick={() => setAreUsersVisible(areUsersVisible ? false : true)}><svg className="chat-icon" height="40" width="40" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512.001 512.001"><linearGradient id="a" gradientUnits="userSpaceOnUse" x1="307.491" y1="216.705" x2="554.651" y2="-30.455" gradientTransform="matrix(1.0039 0 0 -1.0039 .192 516.56)"><stop offset="0" stopColor="#a7f3ce" /><stop offset="1" stopColor="#61db99" /></linearGradient><path d="M340.366 164.133c93.488-1.428 169.792 72.153 171.602 165.634.266 13.725-1.106 27.084-3.932 39.898-4.786 21.697-7.631 43.776-7.631 65.995v42.948c0 6.58-5.334 11.914-11.914 11.914h-42.948c-22.219 0-44.298 2.845-65.995 7.631-12.813 2.826-26.172 4.198-39.897 3.932-93.48-1.809-167.061-78.111-165.635-171.597 1.391-91.25 75.101-164.961 166.35-166.355z" fill="url(#a)" /><linearGradient id="b" gradientUnits="userSpaceOnUse" x1="388.399" y1="135.803" x2="283.418" y2="240.773" gradientTransform="matrix(1.0039 0 0 -1.0039 .192 516.56)"><stop offset="0" stopColor="#61db99" stopOpacity="0" /><stop offset="1" stopColor="#009e74" /></linearGradient><path d="M340.366 164.133c93.488-1.428 169.792 72.153 171.602 165.634.266 13.725-1.106 27.084-3.932 39.898-4.786 21.697-7.631 43.776-7.631 65.995v42.948c0 6.58-5.334 11.914-11.914 11.914h-42.948c-22.219 0-44.298 2.845-65.995 7.631-12.813 2.826-26.172 4.198-39.897 3.932-93.48-1.809-167.061-78.111-165.635-171.597 1.391-91.25 75.101-164.961 166.35-166.355z" fill="url(#b)" /><linearGradient id="c" gradientUnits="userSpaceOnUse" x1="129.97" y1="332.774" x2="390.92" y2="71.824" gradientTransform="matrix(1.0039 0 0 -1.0039 .192 516.56)"><stop offset="0" stopColor="#62e1fb" /><stop offset="1" stopColor="#00a2f3" /></linearGradient><path d="M209.098 9.909C95.204 8.169 2.245 97.81.039 211.696c-.323 16.719 1.348 32.996 4.792 48.606 5.83 26.432 9.296 53.331 9.296 80.4v52.322c0 8.016 6.498 14.515 14.515 14.515h52.322c27.068 0 53.967 3.466 80.4 9.296 15.61 3.443 31.886 5.115 48.605 4.791 113.884-2.205 203.525-95.161 201.789-209.053-1.696-111.167-91.494-200.967-202.66-202.664z" fill="url(#c)" /><linearGradient id="d" gradientUnits="userSpaceOnUse" x1="179.038" y1="218.193" x2="41.644" y2="355.583" gradientTransform="matrix(1.0039 0 0 -1.0039 .192 516.56)"><stop offset="0" stopColor="#00a2f3" stopOpacity="0" /><stop offset="1" stopColor="#0075cd" /></linearGradient><path d="M132.193 204.739c-5.816-6.18-14.048-10.061-23.206-10.061-17.613 0-31.891 14.278-31.891 31.891 0 9.157 3.88 17.389 10.061 23.206l68.794 68.794c5.817 6.18 14.049 10.061 23.206 10.061 17.613 0 31.891-14.278 31.891-31.891 0-9.157-3.881-17.389-10.061-23.206l-68.794-68.794z" fill="url(#d)" /><circle cx="108.986" cy="226.565" r="31.891" fill="#fff" /><linearGradient id="e" gradientUnits="userSpaceOnUse" x1="268.872" y1="218.196" x2="131.482" y2="355.586" gradientTransform="matrix(1.0039 0 0 -1.0039 .192 516.56)"><stop offset="0" stopColor="#00a2f3" stopOpacity="0" /><stop offset="1" stopColor="#0075cd" /></linearGradient><path d="M222.383 204.739c-5.816-6.18-14.048-10.061-23.206-10.061-17.613 0-31.891 14.278-31.891 31.891 0 9.157 3.88 17.389 10.061 23.206l68.794 68.794c5.817 6.18 14.049 10.061 23.206 10.061 17.613 0 31.891-14.278 31.891-31.891 0-9.157-3.881-17.389-10.061-23.206l-68.794-68.794z" fill="url(#e)" /><circle cx="199.178" cy="226.565" r="31.891" fill="#fff" /><linearGradient id="f" gradientUnits="userSpaceOnUse" x1="358.71" y1="218.195" x2="221.32" y2="355.584" gradientTransform="matrix(1.0039 0 0 -1.0039 .192 516.56)"><stop offset="0" stopColor="#00a2f3" stopOpacity="0" /><stop offset="1" stopColor="#0075cd" /></linearGradient><path d="M312.572 204.739c-5.816-6.18-14.048-10.061-23.206-10.061-17.613 0-31.891 14.278-31.891 31.891 0 9.157 3.881 17.389 10.061 23.206l68.794 68.794c5.817 6.18 14.049 10.061 23.206 10.061 17.613 0 31.891-14.278 31.891-31.891 0-9.157-3.881-17.389-10.061-23.206l-68.794-68.794z" fill="url(#f)" /><circle cx="289.371" cy="226.565" r="31.891" fill="#fff" /></svg></a>}
                </div>
            }
        </div>
    );
};

export default DrawingBoard;
