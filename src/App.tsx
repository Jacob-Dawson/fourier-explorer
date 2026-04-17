import { useState, useEffect } from "react";
import type { FreqComponent } from "./types";
import { computeDFT } from "./utils/dft";
import { useDrawing } from "./hooks/useDrawing";
import Canvas from "./components/Canvas";
import Sidebar from "./components/Sidebar";
import Spectrum from "./components/Spectrum";

type Phase = "draw" | "ready" | "dft";

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

  const handleClear = () => {
    clear();
    setDftResult(null);
    setPhase("draw");
  }
  
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
                  {phase === "dft" ? "02" : "01"}
              </span>
              {" / "}04
            </span>
            <span>
              {phase === "dft" ? "DFT Computed" : phase === "ready" ? "Path Ready" : "Draw Mode"}
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
          onRunDFT={handleRunDFT}
          onClear={handleClear}
        />

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