import { useEffect } from "react";
import type { Point } from "../types";

interface CanvsasProps{
    canvasRef: React.RefObject<HTMLCanvasElement | null>;
    rawPoints: Point[];
    sampledPoints: Point[] | null;
    isDrawing: boolean;
    onMouseDown: (e: React.MouseEvent) => void;
    onMouseMove: (e: React.MouseEvent) => void;
    onMouseUp: (e: React.MouseEvent) => void;
    onMouseLeave: (e: React.MouseEvent) => void;
    onTouchStart: (e: React.TouchEvent) => void;
    onTouchMove: (e: React.TouchEvent) => void;
    onTouchEnd: (e: React.TouchEvent) => void;
}


// Canvas Dawing Helpers

function drawGrid(canvas: HTMLCanvasElement){

    const ctx = canvas.getContext("2d")!;
    const { width, height } = canvas;
    ctx.clearRect(0, 0, width, height);

    ctx.strokeStyle = "rgba(251,191,36,0.06)";
    ctx.lineWidth = 1;
    const step = 40;
    for(let x = 0; x <= width; x += step){

        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();

    }

    for(let y = 0; y <= height; y += step){

        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();

    }

    ctx.strokeStyle = "rgba(251,191,36,0.15)";
    ctx.setLineDash([4, 6]);
    ctx.beginPath();
    ctx.moveTo(width / 2, 0);
    ctx.lineTo(width / 2, height);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, height/2);
    ctx.lineTo(width, height/2);
    ctx.stroke();

    ctx.setLineDash([]);

}

function drawStroke(canvas: HTMLCanvasElement, pts: Point[]){

    const ctx = canvas.getContext("2d")!;
    ctx.strokeStyle = "#fbbf24";
    ctx.lineWidth = 2.5;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.shadowColor = "#fbbf24";
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);

    for(let i = 1; i < pts.length; i++){

        ctx.lineTo(pts[i].x, pts[i].y);
        
    }

    ctx.stroke();
    ctx.shadowBlur = 0;

}

function drawSampleDots(canvas: HTMLCanvasElement, pts: Point[]){

    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "rgba(251,191,36,0.45)";
    pts.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI *2);
        ctx.fill();
    });

}

// Component

export default function Canvas({
    canvasRef,
    rawPoints,
    sampledPoints,
    isDrawing,
    onMouseDown,
    onMouseMove,
    onMouseUp,
    onMouseLeave,
    onTouchStart,
    onTouchMove,
    onTouchEnd
}: CanvsasProps){

    // Resize canvas to fill its parent

    useEffect(() => {

        const canvas = canvasRef.current!;
        const resize = () => {
            const { width, height } = canvas.parentElement!.getBoundingClientRect();
            canvas.width = width;
            canvas.height = height;
            drawGrid(canvas);
        };
        resize();
        window.addEventListener("resize", resize);
        return () => window.removeEventListener("resize", resize);
    }, [canvasRef]);

    // Redraw whenever points change

    useEffect(() => {

        const canvas = canvasRef.current!;
        if(!canvas) return;
        drawGrid(canvas);

        if(sampledPoints && !isDrawing){

            // Show the clean resampled path with dots

            drawStroke(canvas, sampledPoints);
            drawSampleDots(canvas, sampledPoints);

        } else if (rawPoints.length > 1){

            // Show the live stroke while drawing

            drawStroke(canvas, rawPoints);

        }

    }, [canvasRef, rawPoints, sampledPoints, isDrawing]);

    return (
        <div className="flex-1 relative overflow-hidden">

            {/*Hint shown when canvas is empty*/}
            {rawPoints.length === 0 && !isDrawing && (
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
                    <div className="text-center space-y-2">
                        <p className="text-3xl opacity-10">✦</p>
                        <p className="text-xs tracking-[0.3em] uppercase text-amber-400/20">
                            Draw anything here
                        </p>
                        <p className="text-[10px] text-amber-400/10 tracking-widest">
                            letters · shapes · spirals · squiggles
                        </p>
                    </div>
                </div>
            )}

            {/* Sample count badge shown after drawing */}
            {sampledPoints && !isDrawing && (
                <div className="absolute bottom-5 right-5 z-10 text-[9px] tracking-widest uppercase text-amber-400/40 flex items-center gap-2">
                    <span className="inline-block w-2 h-2 rounded-full bg-amber-400/50" />
                    {sampledPoints.length} sample points
                </div>
            )}

            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full touch-none cursor-crosshair"
                onMouseDown={onMouseDown}
                onMouseMove={onMouseMove}
                onMouseUp={onMouseUp}
                onMouseLeave={onMouseLeave}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
            />

        </div>
    );

}