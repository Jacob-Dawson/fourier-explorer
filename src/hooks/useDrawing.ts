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
    closePath: boolean;
    setClosePath: (v: boolean | ((prev: boolean) => boolean)) => void;
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
    const [closePath, setClosePath] = useState(true);

    const getPos = useCallback((e: React.MouseEvent | React.TouchEvent): Point | null => {
        if(!canvasRef.current) return null;
        const rect = canvasRef.current.getBoundingClientRect();
        const src = (e as React.TouchEvent).touches
            ? (e as React.TouchEvent).touches[0]
            : (e as React.MouseEvent);
        return { x: src.clientX - rect.left, y: src.clientY - rect.top };
    }, [])

    const startDraw = useCallback((e: React.MouseEvent | React.TouchEvent) => {
        e.preventDefault();
        const pos = getPos(e);
        if(!pos) return;
        setSampledPoints(null);
        setRawPoints([pos]);
        setIsDrawing(true);
    }, [getPos])

    const continueDraw = useCallback((e: React.MouseEvent | React.TouchEvent) => {
        e.preventDefault();
        if(!isDrawing) return;
        const pos = getPos(e);
        if(!pos) return;
        setRawPoints(prev => [...prev, pos]);
    }, [isDrawing, getPos])

    const endDraw = useCallback((e: React.MouseEvent | React.TouchEvent) => {
        e.preventDefault();
        if(!isDrawing) return;
        setIsDrawing(false);
        setRawPoints(prev => {
            if(prev.length < MIN_POINTS) return [];
            const sampled = resamplePath(prev, SAMPLE_COUNT);
            const finalPoints = closePath
                ? [...sampled, sampled[0]]
                : [...sampled, ...[...sampled].reverse()];
            setSampledPoints(finalPoints);
            return prev;
        });
    }, [isDrawing, getPos, closePath])

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
        closePath,
        setClosePath,
        startDraw,
        continueDraw,
        endDraw,
        clear
    };

}