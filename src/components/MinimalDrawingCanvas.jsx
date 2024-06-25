import React, { useEffect, useState, useRef } from 'react';

const MinimalDrawingCanvas = ({ canvasRef, lines, setLines, color, isErasing }) => {
    const [isDrawing, setIsDrawing] = useState(false);
    const [currentLine, setCurrentLine] = useState([]);
    const canvasContainerRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        context.fillStyle = 'white';
        context.fillRect(0, 0, canvas.width, canvas.height);
        drawAllLines(lines, canvas);

        const container = canvasContainerRef.current;

        container.addEventListener('touchstart', startDrawing, { passive: false });
        container.addEventListener('touchmove', draw, { passive: false });
        container.addEventListener('touchend', endDrawing, { passive: false });

        return () => {
            container.removeEventListener('touchstart', startDrawing);
            container.removeEventListener('touchmove', draw);
            container.removeEventListener('touchend', endDrawing);
        };
    }, [lines]);

    const startDrawing = (event) => {
        event.preventDefault();
        const { x, y } = getCoordinates(event, canvasRef.current);
        setIsDrawing(true);
        if (!isErasing) {
            setCurrentLine([{ x, y }]);
        } else {
            erasePoints(x, y);
        }
    };

    const endDrawing = (event) => {
        event.preventDefault();
        setIsDrawing(false);
        if (!isErasing) {
            setLines({
                ...lines,
                [color]: [...lines[color], { points: currentLine }]
            });
            setCurrentLine([]);
        }
        canvasRef.current.getContext('2d').beginPath();
    };

    const draw = (event) => {
        event.preventDefault();
        if (!isDrawing) return;
        const { x, y } = getCoordinates(event, canvasRef.current);
        if (!isErasing) {
            const newCurrentLine = [...currentLine, { x, y }];
            setCurrentLine(newCurrentLine);
            drawAllLines({
                ...lines,
                [color]: [...lines[color], { points: newCurrentLine }]
            }, canvasRef.current);
        } else {
            erasePoints(x, y);
        }
    };

    const erasePoints = (x, y) => {
        const eraserSize = 5;
        const newLines = { red: [], yellow: [], green: [] };

        Object.keys(lines).forEach(color => {
            lines[color].forEach(line => {
                let newLine = [];
                line.points.forEach(point => {
                    const pointX = point.x * canvasRef.current.width;
                    const pointY = point.y * canvasRef.current.height;
                    if (Math.hypot(pointX - x, pointY - y) > eraserSize) {
                        newLine.push(point);
                    } else {
                        if (newLine.length > 0) {
                            newLines[color].push({ points: newLine });
                            newLine = [];
                        }
                    }
                });
                if (newLine.length > 0) {
                    newLines[color].push({ points: newLine });
                }
            });
        });

        setLines(newLines);
        drawAllLines(newLines, canvasRef.current);
    };

    const drawAllLines = (lines, canvas) => {
        const context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);
        Object.keys(lines).forEach(color => {
            lines[color].forEach(line => {
                if (line.points.length > 0) {
                    context.strokeStyle = color;
                    context.beginPath();
                    const startX = line.points[0].x * canvas.width;
                    const startY = line.points[0].y * canvas.height;
                    context.moveTo(startX, startY);
                    for (let i = 1; i < line.points.length; i++) {
                        const pointX = line.points[i].x * canvas.width;
                        const pointY = line.points[i].y * canvas.height;
                        context.lineTo(pointX, pointY);
                    }
                    context.stroke();
                }
            });
        });
    };

    const getCoordinates = (event, canvas) => {
        const rect = canvas.getBoundingClientRect();
        const x = (event.touches ? event.touches[0].clientX - rect.left : event.clientX - rect.left) / canvas.width;
        const y = (event.touches ? event.touches[0].clientY - rect.top : event.clientY - rect.top) / canvas.height;
        return { x, y };
    };

    return (
        <div ref={canvasContainerRef}>
            <canvas
                ref={canvasRef}
                width={800}
                height={600}
                style={{ border: '1px solid black' }}
                onMouseDown={startDrawing}
                onMouseUp={endDrawing}
                onMouseMove={draw}
                onTouchStart={startDrawing}
                onTouchEnd={endDrawing}
                onTouchMove={draw}
            />
        </div>
    );
};

export default MinimalDrawingCanvas;
