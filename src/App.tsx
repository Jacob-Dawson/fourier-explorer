import { useState, useEffect } from "react";
import type { FreqComponent, Phase } from "./types";
import { computeDFT } from "./utils/dft";
import { useDrawing } from "./hooks/useDrawing";
import { useEpicycles } from "./hooks/useEpicycles";
import Canvas from "./components/Canvas";
import Sidebar from "./components/Sidebar";
import Spectrum from "./components/Spectrum";
import EpicycleCanvas from "./components/EpicycleCanvas";

export default function App() {

  const [phase, setPhase] = useState<Phase>("draw");
  const [dftResult, setDftResult] = useState<FreqComponent[] | null>(null);

  const {
    canvasRef,
    rawPoints,
    sampledPoints,
    isDrawing,
    startDraw,
    continueDraw,
    endDraw,
    clear
  } = useDrawing();

  const {
    isPlaying,
    speed,
    circleCount,
    showCircles,
    play,
    pause,
    setSpeed,
    setCircleCount,
    toggleCircles
  } = useEpicycles(dftResult?.length ?? 256)

  // When a new path is finished, advance to ready

  useEffect(() => {

    if(sampledPoints) setPhase("ready");

  }, [sampledPoints]);

  const handleRunDFT = () => {
    if(!sampledPoints) return;
    const result = computeDFT(sampledPoints);
    setDftResult(result);
    setPhase("dft");
  };

  const handleAnimate = () => {

    setPhase("animate");

  }

  const handleClear = () => {
    clear();
    setDftResult(null);
    setPhase("draw");
  }

  const stepNumber = 
    phase === "animate" ? "03" :
    phase === "dft" ? "02" : "01";

  const stepLabel = 
    phase === "animate" ? "Animating" :
    phase === "dft" ? "DFT Computed" :
    phase === "ready" ? "Path Ready" : "Draw Mode";
  
  return (
    <div
      style={{ fontFamily: "'DM Mono', 'Courier New', monospace"}}
      className="flex flex-col h-screen w-full bg-[#0a0a0f] text-amber-400 select-none overflow-hidden"
    >
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-3 border-b border-amber-400/10">
        <div className="flex items-center gap-3">
            <div className="flex gap-1">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-amber-400"
                    style={{ opacity: 0.3 + i * 0.2}}
                  />
                ))}
            </div>
            <span className="text-xs tracking-[0.25em] uppercase text-amber-400/60">
                Fourier Transform Explorer
            </span>
        </div>

        <div className="flex items-center gap-6 text-[10px] tracking-widest uppercase text-amber-400/40">
            <span>
              Step{" "}
              <span className="text-amber-400 font-bold">
                  {stepNumber}
              </span>
              {" / "}04
            </span>
            <span>
                {stepLabel}
            </span>
        </div>
      </header>

      {/* Main layout */}
      <div className="flex flex-1 min-h-0">
        <Sidebar
          phase={phase}
          isDrawing={isDrawing}
          rawPointCount={rawPoints.length}
          sampledPointCount={sampledPoints?.length ?? null}
          dftResult={dftResult}
          isPlaying={isPlaying}
          speed={speed}
          circleCount={circleCount}
          showCircles={showCircles}
          onRunDFT={handleRunDFT}
          onAnimate={handleAnimate}
          onClear={handleClear}
          onPlay={play}
          onPause={pause}
          onSetSpeed={setSpeed}
          onSetCircleCount={setCircleCount}
          onToggleCircles={toggleCircles}
        />

        {/* Canvas area */}

        <div className="flex-1 relative overflow-hidden">
          {phase !== "animate" && (
            <Canvas
              canvasRef={canvasRef}
              rawPoints={rawPoints}
              sampledPoints={sampledPoints}
              isDrawing={isDrawing}
              onMouseDown={startDraw}
              onMouseMove={continueDraw}
              onMouseUp={endDraw}
              onMouseLeave={endDraw}
              onTouchStart={startDraw}
              onTouchMove={continueDraw}
              onTouchEnd={endDraw}
            />
          )}
          

          {phase === "animate" && dftResult && (
            <EpicycleCanvas
              components={dftResult}
              isPlaying={isPlaying}
              speed={speed}
              circleCount={circleCount}
              showCircles={showCircles}
            />
          )}

        </div>

        <Spectrum
          dftResult={dftResult}
          sampledPoints={sampledPoints}
        />
      </div>

      {/* Footer */}

      <footer className="px-6 py-2 border-t border-amber-400/10 flex items-center gap-4 text-[9px] tracking-widest uppercase text-amber-400/25">
        <span>X[k] = Σ z[n] · e^(-2πi·k·n/N)</span>
        <span className="flex-1"/>
        {dftResult && (
          <span className="text-amber-400/40">
            dominant freq: k={dftResult[0].freq} r={dftResult[0].amp.toFixed(1)}
          </span>
        )}
        <span>N = 256</span>   
      </footer>
    </div>
  );

}