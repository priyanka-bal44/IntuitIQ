import React, { useState } from "react";

interface SelectionToolProps {
    canvasRef: React.RefObject<HTMLCanvasElement>;
    selectedTool: string;
}

const SelectionTool: React.FC<SelectionToolProps> = ({ canvasRef, selectedTool }) => {
    const [selectedArea, setSelectedArea] = useState<{ x: number; y: number; width: number; height: number } | null>(
        null
    );
    const [isSelecting, setIsSelecting] = useState(false);
    const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(null);
    const [copiedData, setCopiedData] = useState<ImageData | null>(null);

    const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (selectedTool !== "selection" || !canvasRef.current) return;
        setIsSelecting(true);
        const rect = canvasRef.current.getBoundingClientRect();
        setStartPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isSelecting || !canvasRef.current || !startPos) return;
        const rect = canvasRef.current.getBoundingClientRect();
        const x = Math.min(startPos.x, e.clientX - rect.left);
        const y = Math.min(startPos.y, e.clientY - rect.top);
        const width = Math.abs(e.clientX - rect.left - startPos.x);
        const height = Math.abs(e.clientY - rect.top - startPos.y);
        setSelectedArea({ x, y, width, height });
    };

    const handleMouseUp = () => {
        setIsSelecting(false);
    };

    const handleCopy = () => {
        if (!canvasRef.current || !selectedArea) return;
        const ctx = canvasRef.current.getContext("2d");
        if (!ctx) return;
        const imageData = ctx.getImageData(selectedArea.x, selectedArea.y, selectedArea.width, selectedArea.height);
        setCopiedData(imageData);
    };

    const handlePaste = () => {
        if (!canvasRef.current || !copiedData) return;
        const ctx = canvasRef.current.getContext("2d");
        if (!ctx) return;
        ctx.putImageData(copiedData, selectedArea?.x ?? 0, selectedArea?.y ?? 0);
    };

    return (
        <>
            {selectedTool === "selection" && (
                <>
                    <button onClick={handleCopy} disabled={!selectedArea}>
                        Copy
                    </button>
                    <button onClick={handlePaste} disabled={!copiedData}>
                        Paste
                    </button>
                </>
            )}
            <canvas
                ref={canvasRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                style={{ border: selectedArea ? "2px dashed red" : "none" }}
            />
        </>
    );
};

export default SelectionTool;
