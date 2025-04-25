import { useEffect } from "react";
import Draggable from "react-draggable";

interface CanvasProps {
    canvasRef: React.RefObject<HTMLCanvasElement>;
    isDrawing: boolean;
    setIsDrawing: React.Dispatch<React.SetStateAction<boolean>>;
    color: string;
    isEraser: boolean;
    eraserSize: number;
    brushSize: number;
    selectedTool: string;
    startPos: { x: number; y: number };
    setStartPos: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>;
    latexExpression: string[];
    latexPosition: { x: number; y: number };
    setLatexPosition: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>;
    canvasImage: ImageData | null;
    setCanvasImage: React.Dispatch<React.SetStateAction<ImageData | null>>;
    undoStack: string[];
    setUndoStack: React.Dispatch<React.SetStateAction<string[]>>;
    setRedoStack: React.Dispatch<React.SetStateAction<string[]>>;
    hasSavedState: boolean;
    setHasSavedState: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Canvas({
    canvasRef, isDrawing, setIsDrawing, color, isEraser, eraserSize,
    brushSize, selectedTool, startPos, setStartPos, latexExpression,
    latexPosition, setLatexPosition, canvasImage, setCanvasImage,
    undoStack, setUndoStack, setRedoStack, hasSavedState, setHasSavedState,...props
}: CanvasProps) {
    useEffect(() => {
        if (latexExpression.length > 0 && window.MathJax) {
            setTimeout(() => {
                window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub]);
            }, 0);
        }
    }, [latexExpression]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext("2d");
            if (ctx) {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight - canvas.offsetTop;
                ctx.lineCap = "round";
                ctx.lineWidth = brushSize;
            }
        }
        const script = document.createElement("script");
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.9/MathJax.js?config=TeX-MML-AM_CHTML";
        script.async = true;
        document.head.appendChild(script);
        script.onload = () => { window.MathJax.Hub.Config({ tex2jax: { inlineMath: [["$", "$"], ["\\(", "\\)"]] } }); };
        return () => { document.head.removeChild(script); };
    }, []);

    const saveState = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const state = canvas.toDataURL(); // Save canvas as image
        
        if (undoStack.length === 0 || undoStack[undoStack.length - 1] !== state) {
        setUndoStack((prev) => [...prev, state]);
        setRedoStack([]); // Clear redo when new action is made
        }
    };

    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (canvas) {
            canvas.style.background = "black";
            const ctx = canvas.getContext("2d");

            //Fix: Save the initial state before the first stroke
          if (undoStack.length === 0 || hasSavedState === false) {
             saveState(); // Store the initial empty state
             setHasSavedState(true); // Prevent duplicate saves
          }
            if (ctx) {
                setCanvasImage(ctx.getImageData(0, 0, canvas.width, canvas.height));
                ctx.beginPath();
                ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
                setIsDrawing(true);
                setStartPos({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY });
            }
        }
    };

    const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDrawing) return;
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext("2d");
            if (!hasSavedState) {
                saveState(); 
                setHasSavedState(true); 
            }
            if (ctx) {
                if (isEraser) {
                    ctx.clearRect(
                        e.nativeEvent.offsetX - eraserSize / 2,
                        e.nativeEvent.offsetY - eraserSize / 2,
                        eraserSize,
                        eraserSize
                    );
                }
                else {
                    if (canvasImage) ctx.putImageData(canvasImage, 0, 0);
                    ctx.strokeStyle = color;
                    ctx.lineWidth = brushSize;
                    switch (selectedTool) {
                        case "pencil":
                            ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
                            ctx.stroke();
                            break;
                        case "line":
                            ctx.beginPath();
                            ctx.moveTo(startPos.x, startPos.y);
                            ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
                            ctx.stroke();
                            break;
                        case "square":
                            ctx.strokeRect(
                                startPos.x,
                                startPos.y,
                                e.nativeEvent.offsetX - startPos.x,
                                e.nativeEvent.offsetY - startPos.y
                            );
                            break;
                        case "ellipse":
                            ctx.beginPath();
                            const width = e.nativeEvent.offsetX - startPos.x;
                            const height = e.nativeEvent.offsetY - startPos.y;
                            if (e.shiftKey) {
                                const size = Math.min(Math.abs(width), Math.abs(height));
                                const signX = width < 0 ? -1 : 1;
                                const signY = height < 0 ? -1 : 1;
                                ctx.ellipse(startPos.x, startPos.y, size * signX, size * signY, 0, 0, 2 * Math.PI);
                            } else {
                                ctx.ellipse(startPos.x + width / 2, startPos.y + height / 2, Math.abs(width) / 2, Math.abs(height) / 2, 0, 0, 2 * Math.PI);
                            }
                            ctx.stroke();
                            break;
                        default:
                            break;
                    }
                }
            }
        }
    };

    const stopDrawing = () => {
        if (!isDrawing) return;
        setIsDrawing(false);
        setHasSavedState(false); // Reset to allow saving the next stroke
    
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const newState = canvas.toDataURL();
    
        setUndoStack((prev) => {
            if (prev.length === 0 || prev[prev.length - 1] !== newState) {
                return [...prev.slice(-10), newState]; // Store only last 10 actions
            }
            return prev;
        });
    
        setRedoStack([]); // Clear redo stack when a new action is made
    };

    return (
        
        <div className="flex-grow flex justify-center items-center bg-black">
            <canvas
                ref={canvasRef}
                id="canvas"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseOut={stopDrawing}
            />
            {latexExpression &&
                latexExpression.map((latex, index) => (
                    <Draggable
                        key={index}
                        defaultPosition={latexPosition}
                        onStop={(_, data) => setLatexPosition({ x: data.x, y: data.y })}
                    >
                        <div className="absolute p-2 text-white rounded shadow-md">
                            <div className="latex-content">{latex}</div>
                        </div>
                    </Draggable>
                ))
            }
        </div>
    )
}

