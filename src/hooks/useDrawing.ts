import { useState, useRef, useCallback } from "react";
import type { Point } from "../types";
import { resamplePath } from "../utils/resample";

const SAMPLE_COUNT = 256;
const MIN_POINTS = 20;

interface UseDrawingReturn {
    canvasRef: React.RefObject<HTMLCanvasElement | null>;
    rawPoints: Point[];
    sampledPoints: Point[] | null;
    isDrawing: boolean;
    startDraw: (e: React.MouseEvent | React.TouchEvent) => void;
    continueDraw: (e: React.MouseEvent | React.TouchEvent) => void;
    endDraw: (e: React.MouseEvent | React.TouchEvent) => void;
    clear: () => void;
}

export function useDrawing(): UseDrawingReturn{

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [rawPoints, setRawPoints] = useState<Point[]>([]);
    const [sampledPoints, setSampledPoints] = useState<Point[] | null>(null);
    const [isDrawing, setIsDrawing] = useState(false);

    const getPos = useCallback((e: React.MouseEvent | React.TouchEvent): Point => {
        const rect = canvasRef.current!.getBoundingClientRect();
        const src = (e as React.TouchEvent).touches
            ? (e as React.TouchEvent).touches[0]
            : (e as React.MouseEvent);
        return { x: src.clientX - rect.left, y: src.clientY - rect.top };
    }, [])

    const startDraw = useCallback((e: React.MouseEvent | React.TouchEvent) => {
        e.preventDefault();
        setSampledPoints(null);
        setRawPoints([getPos(e)]);
        setIsDrawing(true);
    }, [getPos])

    const continueDraw = useCallback((e: React.MouseEvent | React.TouchEvent) => {
        e.preventDefault();
        if(!isDrawing) return;
        setRawPoints(prev => [...prev, getPos(e)]);
    }, [isDrawing, getPos])

    const endDraw = useCallback((e: React.MouseEvent | React.TouchEvent) => {
        e.preventDefault();
        if(!isDrawing) return;
        setIsDrawing(false);
        setRawPoints(prev => {
            if(prev.length < MIN_POINTS) return [];
            const sampled = resamplePath(prev, SAMPLE_COUNT);
            setSampledPoints(sampled);
            return prev;
        });
    }, [isDrawing, getPos])

    const clear = useCallback(() => {
        setRawPoints([]);
        setSampledPoints(null);
        setIsDrawing(false);
    }, []);

    return {
        canvasRef,
        rawPoints,
        sampledPoints,
        isDrawing,
        startDraw,
        continueDraw,
        endDraw,
        clear
    };

}