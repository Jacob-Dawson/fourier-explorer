import { useEffect } from "react";
import type { Point } from "../types";
import { drawGrid, drawStroke, drawSampleDots } from "../utils/canvas";

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
        <div className="absolute inset-0">

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