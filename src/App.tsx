import Drawer from "./components/Drawer";
import { useState, useEffect } from "react";
import type { FreqComponent, Phase } from "./types";
import { computeDFT } from "./utils/dft";
import { useDrawing } from "./hooks/useDrawing";
import { useEpicycles } from "./hooks/useEpicycles";
import Canvas from "./components/Canvas";
import Sidebar from "./components/Sidebar";
import Spectrum from "./components/Spectrum";
import EpicycleCanvas from "./components/EpicycleCanvas";
import PresetBar from "./components/PresetBar";
import { generatePreset } from "./utils/presets";
import type { PresetName } from "./utils/presets";

export default function App() {

  const [phase, setPhase] = useState<Phase>("draw");
  const [dftResult, setDftResult] = useState<FreqComponent[] | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const {
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

    if(!sampledPoints) return;

    const result = computeDFT(sampledPoints);
    setDftResult(result);
    setPhase("animate");
    
  }, [sampledPoints]);

  const handlePreset = (name: PresetName) => {
    const canvas = canvasRef.current;
    // Fallback to canvas window dimensions if canvas isnt mounted
    const width = canvas?.width ?? window.innerWidth;
    const height = canvas?.height ?? window.innerHeight;
    const points = generatePreset(name, width / 2, height / 2);
    const result = computeDFT(points);
    setDftResult(result);
    setPhase("animate");
  };

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
  
  return (
    <div
      style={{ fontFamily: "'DM Mono', 'Courier New', monospace"}}
      className="flex flex-col h-screen w-full bg-[#0a0a0f] text-cyan-400 select-none overflow-hidden"
    >
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-3 border-b border-cyan-400/10">
        <div className="flex items-center gap-3">
            <div className="flex gap-1">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-cyan-400"
                    style={{ opacity: 0.3 + i * 0.2}}
                  />
                ))}
            </div>
            <span className="text-xs tracking-[0.25em] uppercase text-cyan-400/60">
                Fourier Transform Explorer
            </span>
        </div>
      </header>

      <PresetBar onSelect={handlePreset} />

      {/* Main layout */}
      <div className="flex flex-1 min-h-0">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
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
            closePath={closePath}
            onRunDFT={handleRunDFT}
            onAnimate={handleAnimate}
            onClear={handleClear}
            onPlay={play}
            onPause={pause}
            onSetSpeed={setSpeed}
            onSetCircleCount={setCircleCount}
            onToggleCircles={toggleCircles}
            onToggleClosePath={() => setClosePath(p => !p)}
          />
        </div>

        {/* Mobile / Tablet drawer */}
        <Drawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)}>
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
            closePath={closePath}
            onRunDFT={handleRunDFT}
            onAnimate={handleAnimate}
            onClear={handleClear}
            onPlay={play}
            onPause={pause}
            onSetSpeed={setSpeed}
            onSetCircleCount={setCircleCount}
            onToggleCircles={toggleCircles}
            onToggleClosePath={() => setClosePath(p => !p)}
          />
        </Drawer>

        {/* Floating controls button - mobile / tablet only */}
        <button
          onClick={() => setDrawerOpen(true)}
          className="lg:hidden fixed bottom-6 right-6 z-10 w-12 h-12 border border-cyan-400/50 bg-[#0a0a0f] text-cyan-400 text-xs tracking-widest flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.2)] hover:bg-cyan-400 hover:text-black transition-all cursor-pointer"
        >
          ⚙
        </button>

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
        
        <div className="hidden lg:block">
          <Spectrum
            dftResult={dftResult}
            sampledPoints={sampledPoints}
          />
        </div>
      </div>

      {/* Footer */}

      <footer className="px-6 py-2 border-t border-cyan-400/10 flex items-center gap-4 text-[9px] tracking-widest uppercase text-cyan-400/25">
        <span>X[k] = Σ z[n] · e^(-2πi·k·n/N)</span>
        <span className="flex-1"/>
        {dftResult && (
          <span className="text-cyan-400/40">
            dominant freq: k={dftResult[0].freq} r={dftResult[0].amp.toFixed(1)}
          </span>
        )}
        <span>N = {dftResult ? dftResult.length : 256}</span>   
      </footer>
    </div>
  );

}