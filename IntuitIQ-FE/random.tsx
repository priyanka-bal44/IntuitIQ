// import { ColorPicker, Popover, Slider, Tooltip } from "@mantine/core";
// import { Button } from "../../components/ui/button";
// import { useEffect, useRef, useState } from "react";
// import axios from "axios";
// import Draggable from "react-draggable";
// import { SWATCHES } from "../../constants";
// import { PencilLine, Eraser,Undo2,Redo2 } from "lucide-react";
// import Sidebar from "../../components/Sidebar";
// //import { useCanvasZoom } from "../../lib/zoom/useCanvasZoom"; // Correct import


// interface GeneratedResult {
//     expression: string;
//     answer: string;
// }

// interface Response {
//     expr: string;
//     result: string;
//     assign: boolean;
// }

// export default function Home() {
//     const canvasRef = useRef<HTMLCanvasElement>(null);
    
//     const [isDrawing, setIsDrawing] = useState(false);
//     const [isPencilDropdownOpen, setIsPencilDropdownOpen] = useState(false);
//     const [isEraserDropdownOpen, setIsEraserDropdownOpen] = useState(false);
//     const [color, setColor] = useState("#ffffff");
//     const [reset, setReset] = useState(false);
//     const [dictOfVars, setDictOfVars] = useState({});
//     const [result, setResult] = useState<GeneratedResult>();
//     const [latexPosition, setLatexPosition] = useState({ x: 10, y: 200 });
//     const [latexExpression, setLatexExpression] = useState<Array<string>>([]);
//     const [isEraser, setIsEraser] = useState(false);
//     const [eraserSize, setEraserSize] = useState(10);
//     const [isVisible, setIsVisible] = useState(false);
//     const [textBoxValue, setTextBoxValue] = useState('');

//     // New state for shape drawing
//     const [selectedShape, setSelectedShape] = useState<string | null>(null); // 'rectangle', 'circle', 'line'
//     const [startPoint, setStartPoint] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

//     //undo and redo button
//     const [undoStack, setUndoStack] = useState<string[]>([]);
//     const [redoStack, setRedoStack] = useState<string[]>([]);


//     useEffect(() => {
//         if (latexExpression.length > 0 && window.MathJax) {
//             setTimeout(() => {
//                 window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub]);
//             }, 0);
//         }
//     }, [latexExpression]);

//     useEffect(() => {
//         if (result) {
//             renderLatexToCanvas(result.expression, result.answer);
//         }
//     }, [result]);

//     useEffect(() => {
//         if (reset) {
//             resetCanvas();
//             setLatexExpression([]);
//             setResult(undefined);
//             setDictOfVars({});
//             setReset(false);
//         }
//     }, [reset]);

//     useEffect(() => {
//         const canvas = canvasRef.current;
//         if (canvas) {
//             const ctx = canvas.getContext("2d");
//             if (ctx) {
//                 canvas.width = window.innerWidth;
//                 canvas.height = window.innerHeight - canvas.offsetTop;
//                 ctx.lineCap = "round";
//                 ctx.lineWidth = 3;
//             }
//         }
//         const script = document.createElement("script");
//         script.src =
//             "https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.9/MathJax.js?config=TeX-MML-AM_CHTML";
//         script.async = true;
//         document.head.appendChild(script);
//         script.onload = () => {
//             window.MathJax.Hub.Config({
//                 tex2jax: {
//                     inlineMath: [
//                         ["$", "$"],
//                         ["\\(", "\\)"],
//                     ],
//                 },
//             });
//         };
//         return () => {
//             document.head.removeChild(script);
//         };
//     }, []);

    
//     const renderLatexToCanvas = (expression: string, answer: string) => {
//         // Convert answer to a string and add spaces between characters
//         const spacedExpression = String(expression).split(/(\s+)/).join(' \\: ');
//         const spacedAnswer = String(answer).split(/(\s+)/).join(' \\: ');

//     // Format LaTeX properly
//         const latex = `\\(\\LARGE{${spacedExpression} \\: = \\: ${spacedAnswer}}\\)`;
        
//         // Set the LaTeX expression state
//         setLatexExpression([latex]); // Ensure only one expression is set
    
//         // Clear the previous drawing and render only one LaTeX expression
//         const canvas = canvasRef.current;
//         if (canvas) {
//             const ctx = canvas.getContext("2d");
//             if (ctx) {
//                 ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear previous answers
    
//                 // Move the LaTeX expression to the **upper left corner**
//                 setLatexPosition({ x: 10, y: 40 }); // Adjust x and y for top-left placement
    
//                 // Ensure MathJax re-renders correctly
//                 setTimeout(() => {
//                     if (window.MathJax) {
//                         window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub]);
//                     }
//                 }, 0);
//             }
//         }
//     };
    
    

//     const resetCanvas = () => {
//         const canvas = canvasRef.current;
//         if (canvas) {
//             const ctx = canvas.getContext("2d");
//             if (ctx) {
//                 ctx.clearRect(0, 0, canvas.width, canvas.height);
//             }
//         }
//     };

//     const toggleVisibility = () => {
//         setIsVisible((prev) => !prev);
//     };

//     const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
//       const canvas = canvasRef.current;
      
//       if (canvas) {
//           canvas.style.background = "black";
//           const ctx = canvas.getContext("2d");
         
//           if (ctx) {
//               ctx.beginPath();
//               ctx.moveTo(e.nativeEvent.offsetX,e.nativeEvent.offsetY)
//               setIsDrawing(true);

//               // Save the starting point for shapes
//               if (selectedShape) {
//                   setStartPoint({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY });
//               }
//           }
//       }
//   };


//     const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
//         if (!isDrawing) {
//             return;
//         }
//         const canvas = canvasRef.current;
       
//         if (canvas) {
//             const ctx = canvas.getContext("2d");
         

//             if (ctx) {
//                 if (isEraser) {
//                     ctx.clearRect(
//                         e.nativeEvent.offsetX - eraserSize / 2,
//                         e.nativeEvent.offsetY - eraserSize / 2,
//                         eraserSize,
//                         eraserSize
//                     );
//                 } else if (selectedShape) {
//                     // Clear the canvas and redraw the shape
//                     ctx.clearRect(0, 0, canvas.width, canvas.height);
//                     ctx.strokeStyle = color;
//                     ctx.lineWidth = 3;

//                     const { x: startX, y: startY } = startPoint;
//                     const endX = e.nativeEvent.offsetX;
//                     const endY = e.nativeEvent.offsetY;

//                     switch (selectedShape) {
//                         case 'rectangle':
//                             ctx.strokeRect(startX, startY, endX - startX, endY - startY);
//                             break;
//                         case 'circle':
//                             const radius = Math.sqrt((endX - startX) ** 2 + (endY - startY) ** 2);
//                             ctx.beginPath();
//                             ctx.arc(startX, startY, radius, 0, 2 * Math.PI);
//                             ctx.stroke();
//                             break;
//                         case 'line':
//                             ctx.beginPath();
//                             ctx.moveTo(startX, startY);
//                             ctx.lineTo(endX, endY);
//                             ctx.stroke();
//                             break;
//                         default:
//                             break;
//                     }
//                 } else {
//                     ctx.strokeStyle = color;
//                     ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY)
//                     ctx.stroke();
//                 }
//             }
//         }
//     };


//     const stopDrawing = () => {
//       setIsDrawing(false);
//       setSelectedShape(null); // Reset shape selection after drawing
  
//       const canvas = canvasRef.current;
//       if (canvas) {
//           const newState = canvas.toDataURL();
//           if (undoStack.length === 0 || undoStack[undoStack.length - 1] !== newState) {
//               setUndoStack((prev) => [...prev, newState]);
//               setRedoStack([]); // Clear redoStack after a new action
//           }
//       }
//   };

//   //shapes drawing adjustment
  
  

//   const handleUndo = () => {
//     if (undoStack.length > 0) {
//         const canvas = canvasRef.current;
//         if (!canvas) return;

//         const ctx = canvas.getContext("2d");
//         if (!ctx) return;

//         // Save current state before undo
//         setRedoStack((prev) => [...prev, canvas.toDataURL()]);

//         // Get the last saved state
//         const lastState = undoStack[undoStack.length - 1];
//         setUndoStack((prev) => prev.slice(0, -1)); // Remove last state

//         // Restore previous state immediately
//         const img = new Image();
//         img.src = lastState;
//         img.onload = () => {
//             ctx.clearRect(0, 0, canvas.width, canvas.height);
//             ctx.drawImage(img, 0, 0);
//         };
//     }
// };


// const handleRedo = () => {
//   if (redoStack.length > 0) {
//       const canvas = canvasRef.current;
//       if (!canvas) return;

//       const ctx = canvas.getContext("2d");
//       if (!ctx) return;

//       // Save current state before redo
//       setUndoStack((prev) => [...prev, canvas.toDataURL()]);

//       // Get the last redone state
//       const nextState = redoStack[redoStack.length - 1];
//       setRedoStack((prev) => prev.slice(0, -1)); // Remove last state

//       // Restore redone state immediately
//       const img = new Image();
//       img.src = nextState;
//       img.onload = () => {
//           ctx.clearRect(0, 0, canvas.width, canvas.height);
//           ctx.drawImage(img, 0, 0);
//       };
//   }
// };

//     const runRoute = async () => {
//         const canvas = canvasRef.current;
//         if (canvas) {
//             const response = await axios({
//                 method: "post",
//                 url: `${import.meta.env.VITE_API_URL}/image_calculate`,
//                 data: {
//                     image: canvas.toDataURL("image/png"),
//                     dict_of_vars: dictOfVars,
//                 },
//             });
//             const resp = await response.data;
//             resp.data.forEach((data: Response) => {
//                 if (data.assign === true) {
//                     setDictOfVars({
//                         ...dictOfVars,
//                         [data.expr]: data.result,
//                     });
//                 }
//             });
//             const ctx = canvas.getContext("2d");
//             const imageData = ctx!.getImageData(0, 0, canvas.width, canvas.height);
//             let minX = canvas.width,
//                 minY = canvas.height,
//                 maxX = 0,
//                 maxY = 0;
//             for (let y = 0; y < canvas.height; y++) {
//                 for (let x = 0; x < canvas.width; x++) {
//                     const i = (y * canvas.width + x) * 4;
//                     if (imageData.data[i + 3] > 0) {
//                         // If pixel is not transparent
//                         minX = Math.min(minX, x);
//                         minY = Math.min(minY, y);
//                         maxX = Math.max(maxX, x);
//                         maxY = Math.max(maxY, y);
//                     }
//                 }
//             }
//             const centerX = (minX + maxX) / 2;
//             const centerY = (minY + maxY) / 2;
//             setLatexPosition({ x: centerX, y: centerY });
//             resp.data.forEach((data: Response) => {
//                 setTimeout(() => {
//                     setResult({
//                         expression: data.expr,
//                         answer: data.result,
//                     });
//                 }, 1000);
//             });
//         }
//     };

//     const handleRunTextBox = async () => {
//         try {
//             const response = await axios({
//                 method: "post",
//                 url: `${import.meta.env.VITE_API_URL}/text_calculate`,
//                 data: {
//                     question: textBoxValue,
//                 },
//             });
//             const result = response.data.data;
//             renderLatexToCanvas(textBoxValue, result);
//             setTextBoxValue("");
//             toggleVisibility();
//         } catch (error) {
//             console.error("Error running text route:", error);
//         }
//     };

//     return (
//         <>
//             {/* Main Layout */}
//             <div className="flex bg-black h-[calc(100vh-5rem)] overflow-hidden pt-16">
//                 {/* Sidebar */}
//                 <div className="flex flex-col m-auto mx-2 items-center bg-gray-200 border-2 border-indigo-600 p-2 gap-4 rounded-xl">
//                     {/* Pencil Icon */}
//                     <Popover
//                         opened={isPencilDropdownOpen}
//                         onClose={() => setIsPencilDropdownOpen(false)}
//                         position="bottom" withArrow>
//                         <Popover.Target>
//                             <Tooltip label="Pencil" position="left" withArrow>
//                                 <div
//                                     style={{
//                                         display: 'inline-block',
//                                         cursor: 'pointer',
//                                         border: '2px solid #228be6',
//                                         borderRadius: '50%',
//                                         padding: '4px',
//                                         transition: 'all 0.2s ease',
//                                         backgroundColor: '#f8f9fa',
//                                         boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
//                                     }}
//                                     onClick={() => setIsPencilDropdownOpen((o) => !o)}
//                                 >
//                                     <PencilLine
//                                         size={20}
//                                         style={{
//                                             color: '#228be6',
//                                         }}
//                                     />
//                                 </div>
//                             </Tooltip>
//                         </Popover.Target>
//                         <Popover.Dropdown>
//                             <ColorPicker
//                                 format="hex"
//                                 swatches={SWATCHES}
//                                 value={color}
//                                 onChange={setColor}
//                             />
//                         </Popover.Dropdown>
//                     </Popover>
//                     {/* Eraser Button */}
//                     <Popover
//                         opened={isEraserDropdownOpen}
//                         onClose={() => setIsEraserDropdownOpen(false)}
//                         position="bottom" withArrow>
//                         <Popover.Target>
//                             <Tooltip label="Eraser" position="left" withArrow>
//                                 <div
//                                     style={{
//                                         display: 'inline-block',
//                                         cursor: 'pointer',
//                                         border: '2px solid #228be6',
//                                         borderRadius: '50%',
//                                         padding: '4px',
//                                         transition: 'all 0.2s ease',
//                                         backgroundColor: '#f8f9fa',
//                                         boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
//                                     }}
//                                     onClick={() => {
//                                         setIsEraserDropdownOpen((o) => !o)
//                                         setIsEraser(!isEraser)
//                                     }}
//                                 >
//                                     <Eraser
//                                         size={20}
//                                         style={{
//                                             color: '#228be6',
//                                         }}
//                                     />
//                                 </div>
//                             </Tooltip>
//                         </Popover.Target>
//                         <Popover.Dropdown>
//                             <Slider
//                                 color="indigo"
//                                 size="xs"
//                                 w={100}
//                                 value={eraserSize}
//                                 onChange={setEraserSize}
//                             />
//                         </Popover.Dropdown>
//                     </Popover>

//                     {/* Shape Buttons */}
//                     <Tooltip label="Rectangle" position="left" withArrow>
//                         <div
//                             style={{
//                                 display: 'inline-block',
//                                 cursor: 'pointer',
//                                 border: '2px solid #228be6',
//                                 borderRadius: '50%',
//                                 padding: '4px',
//                                 transition: 'all 0.2s ease',
//                                 backgroundColor: selectedShape === 'rectangle' ? '#228be6' : '#f8f9fa',
//                                 boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
//                             }}
//                             onClick={() => setSelectedShape(selectedShape === 'rectangle' ? null : 'rectangle')}
//                         >
//                             <svg
//                                 width="20"
//                                 height="20"
//                                 viewBox="0 0 20 20"
//                                 fill="none"
//                                 stroke={selectedShape === 'rectangle' ? '#ffffff' : '#228be6'}
//                                 strokeWidth="2"
//                             >
//                                 <rect x="2" y="2" width="16" height="16" />
//                             </svg>
//                         </div>
//                     </Tooltip>

//                     <Tooltip label="Circle" position="left" withArrow>
//                         <div
//                             style={{
//                                 display: 'inline-block',
//                                 cursor: 'pointer',
//                                 border: '2px solid #228be6',
//                                 borderRadius: '50%',
//                                 padding: '4px',
//                                 transition: 'all 0.2s ease',
//                                 backgroundColor: selectedShape === 'circle' ? '#228be6' : '#f8f9fa',
//                                 boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
//                             }}
//                             onClick={() => setSelectedShape(selectedShape === 'circle' ? null : 'circle')}
//                         >
//                             <svg
//                                 width="20"
//                                 height="20"
//                                 viewBox="0 0 20 20"
//                                 fill="none"
//                                 stroke={selectedShape === 'circle' ? '#ffffff' : '#228be6'}
//                                 strokeWidth="2"
//                             >
//                                 <circle cx="10" cy="10" r="8" />
//                             </svg>
//                         </div>
//                     </Tooltip>

//                     <Tooltip label="Line" position="left" withArrow>
//                         <div
//                             style={{
//                                 display: 'inline-block',
//                                 cursor: 'pointer',
//                                 border: '2px solid #228be6',
//                                 borderRadius: '50%',
//                                 padding: '4px',
//                                 transition: 'all 0.2s ease',
//                                 backgroundColor: selectedShape === 'line' ? '#228be6' : '#f8f9fa',
//                                 boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
//                             }}
//                             onClick={() => setSelectedShape(selectedShape === 'line' ? null : 'line')}
//                         >
//                             <svg
//                                 width="20"
//                                 height="20"
//                                 viewBox="0 0 20 20"
//                                 fill="none"
//                                 stroke={selectedShape === 'line' ? '#ffffff' : '#228be6'}
//                                 strokeWidth="2"
//                             >
//                                 <line x1="2" y1="10" x2="18" y2="10" />
//                             </svg>
//                         </div>
//                     </Tooltip>
//                 </div>

//                 {/* Drawer */}
//                 <Sidebar />

//                 {/* Canvas Area */}
//                 <div className="flex-grow flex justify-center items-center bg-black">
//                     <canvas
//                         ref={canvasRef}
//                         id="canvas"
//                         onMouseDown={startDrawing}
//                         onMouseMove={draw}
//                         onMouseUp={stopDrawing}
//                         onMouseOut={stopDrawing}
                       
//                     />
//                     {/* Latex Elements */}
//                     {latexExpression &&
//                         latexExpression.map((latex, index) => (
//                             <Draggable
//                                 key={index}
//                                 defaultPosition={latexPosition}
//                                 onStop={(e, data) => setLatexPosition({ x: data.x, y: data.y })}
//                             >
//                                 <div className="absolute p-2 text-white rounded shadow-md">
//                                     <div className="latex-content">{latex}</div>
//                                 </div>
//                             </Draggable>
//                         ))}
//                 </div>
//             </div>

//             {/* Footer Section */}
//         <div className="flex justify-end items-center p-3 bg-gray-100 border-t border-gray-300">
//               <div className="flex space-x-4">
//             <Button onClick={handleUndo} disabled={undoStack.length === 0}>
//             <Undo2 className="w-5 h-5 mr-2 " /> 
//             </Button>
//             <Button onClick={handleRedo} disabled={redoStack.length === 0}>
//             <Redo2 className="w-5 h-5 mr-2" /> 
//              </Button>
//         </div>
//                 <Button className="mx-4" onClick={toggleVisibility}>Text Box</Button>
//                 {isVisible && (
//                     <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70">
//                         <div className="bg-white p-4 rounded-lg shadow-lg w-1/2 h-1/2">
//                             <textarea
//                                 value={textBoxValue}
//                                 onChange={(e) => setTextBoxValue(e.target.value)}
//                                 className="w-full h-4/5 p-4 border border-gray-300 rounded-lg resize-none"
//                                 placeholder="Enter your question here..."
//                             />
//                             <div className="flex justify-between">
//                                 <Button
//                                     onClick={toggleVisibility}
//                                     className="mt-2 bg-red-600 text-white"
//                                 >
//                                     Close
//                                 </Button>
//                                 <div>
//                                     <Button
//                                         onClick={() => {
//                                             setTextBoxValue('')
//                                         }}
//                                         className="mt-2 mx-4 bg-black text-white"
//                                     >
//                                         Reset
//                                     </Button>
//                                     <Button
//                                         onClick={handleRunTextBox}
//                                         className="mt-2 bg-green-600 text-white"
//                                     >
//                                         Run
//                                     </Button>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 )}
//                 <Button
//                     onClick={() => setReset(true)}
//                     className="mr-4 bg-red-600 text-white"
//                     variant="default"
//                 >
//                     Reset
//                 </Button>
//                 <Button
//                     onClick={runRoute}
//                     className="bg-green-600 text-white"
//                     variant="default"
//                 >
//                     Run
//                 </Button>
//             </div>
//         </>
//     );
// }