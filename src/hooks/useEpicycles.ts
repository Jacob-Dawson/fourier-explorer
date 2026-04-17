import { useState, useCallback, useEffect } from "react";

interface UseEpicyclesReturn {
    isPlaying: boolean;
    speed: number;
    circleCount: number;
    showCircles: boolean;
    play: () => void;
    pause: () => void;
    setSpeed: (s: number) => void;
    setCircleCount: (n: number) => void;
    toggleCircles: () => void;
}

export function useEpicycles(maxCircles: number): UseEpicyclesReturn{

    const [isPlaying, setIsPlaying] = useState(true);
    const [speed, setSpeed] = useState(1);
    const [circleCount, setCircleCount] = useState(maxCircles);
    const [showCircles, setShowCircles] = useState(true);

    const play = useCallback(() => setIsPlaying(true), []);
    const pause = useCallback(() => setIsPlaying(false), []);
    const toggleCircles = useCallback(() => setShowCircles(p => !p), []);

    useEffect(() => {

        setCircleCount(maxCircles)

    }, [maxCircles])

    return {
        isPlaying,
        speed,
        circleCount,
        showCircles,
        play,
        pause,
        setSpeed,
        setCircleCount,
        toggleCircles
    };

}