import { useEffect, useRef } from "react";
import type { FreqComponent } from "../types";

interface EpicycleCanvasProps{
    components: FreqComponent[];
    isPlaying: boolean;
    speed: number;
    circleCount: number;
    showCircles: boolean;
}

export default function EpicycleCanvas({
    components,
    isPlaying,
    speed,
    circleCount,
    showCircles
}: EpicycleCanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const rafRef = useRef<number>(0);
    const timeRef = useRef<number>(0);
    const trailRef = useRef<{x: number; y: number}[]>([]);

    // Resize canvas to fill parent
    useEffect(() => {
        const canvas = canvasRef.current;
        if(!canvas) return;
        const resize = () => {
            const parent = canvas.parentElement;
            if(!parent) return;
            const { width, height } = parent.getBoundingClientRect();
            canvas.width = width;
            canvas.height = height;
            // Clear trail on resize to avoid glitchy jumps
            trailRef.current = [];
        };
        resize();
        window.addEventListener("resize", resize);
        return () => window.removeEventListener("resize", resize);
    }, []);

    // Main animation loop
    useEffect(() => {
        const canvas = canvasRef.current;
        if(!canvas) return;
        const ctx = canvas.getContext("2d");
        if(!ctx) return;
        const N = components.length;
        // Only use as many circles as requested
        const active = components.slice(0, circleCount);

        const draw = () => {
            const { width, height } = canvas;
            ctx.clearRect(0,0,width,height);
            
            // Background grid
            ctx.strokeStyle = "rgba(34,211,238,0.04)";
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

            // Epicycle Chain
            // Start at canvas center
            let x = width/2;
            let y = height/2;

            for(const c of active){

                const prevX = x;
                const prevY = y;

                // Each component rotates at its own frequency
                const angle = c.freq * timeRef.current * (2 * Math.PI/N) + c.phase;
                x += c.amp * Math.cos(angle);
                y += c.amp * Math.sin(angle);

                if(showCircles){

                    // Draw the orbit circle
                    ctx.beginPath();
                    ctx.arc(prevX, prevY, c.amp, 0, Math.PI*2);
                    ctx.strokeStyle = "rgba(34,211,238,0.08)";
                    ctx.lineWidth = 1;
                    ctx.stroke();

                    // Draw the arm
                    ctx.beginPath();
                    ctx.moveTo(prevX, prevY);
                    ctx.lineTo(x, y);
                    ctx.strokeStyle = "rgba(34,211,238,0.25)";
                    ctx.lineWidth = 1;
                    ctx.stroke();

                    // Draw a dot at the tip
                    ctx.beginPath();
                    ctx.arc(x, y, 2, 0, Math.PI*2);
                    ctx.fillStyle = "rgba(34,211,238,0.5)";
                    ctx.fill();

                }

            }

            // Trail
            // The final tip position traces out the reconstructed shape
            trailRef.current.push({x, y});

            // Keep trail length to one full cycle worth of points
            if(trailRef.current.length > N){

                trailRef.current.shift();

            }

            if(trailRef.current.length > 1){

                const trail = trailRef.current;
                const len = trail.length;
 
                for(let i = 1; i < len; i++){

                    const t = i / len;
                    const opacity = t * t;

                    ctx.beginPath();
                    ctx.moveTo(trail[i-1].x, trail[i-1].y);
                    ctx.lineTo(trail[i].x, trail[i].y);
                    ctx.strokeStyle = `rgba(34,211,238,${opacity}`;
                    ctx.lineWidth = 1 + t * 1.5;
                    ctx.lineJoin = "round";
                    ctx.lineCap = "round";
                    ctx.shadowColor = "#22d3ee";
                    ctx.shadowBlur = t * 8;
                    ctx.stroke();

                }
                
                ctx.shadowBlur = 0;

            }

            // Draw a bright dot at the very tip
            ctx.beginPath();
            ctx.arc(x, y, 3, 0, Math.PI*2);
            ctx.fillStyle = "#22d3ee";
            ctx.shadowColor = "#22d3ee";
            ctx.shadowBlur = 10;
            ctx.fill();
            ctx.shadowBlur = 0;

            // Advance Time
            if(isPlaying){
                timeRef.current += speed;
            }

            rafRef.current = requestAnimationFrame(draw);
        };

        rafRef.current = requestAnimationFrame(draw);
        return () => cancelAnimationFrame(rafRef.current);

        // recreate the loop whenever these change
    }, [components, isPlaying, speed, circleCount, showCircles]);

    // Clear trail when circle count changes so it doesnt glitch
    useEffect(() => {
        trailRef.current = [];
        timeRef.current = 0;
    }, [components, circleCount, speed]);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full"
        />
    );
}