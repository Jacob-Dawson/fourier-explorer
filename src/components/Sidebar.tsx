import type { FreqComponent, Phase } from "../types";

interface SidebarProps{
    phase: Phase;
    isDrawing: boolean;
    rawPointCount: number;
    sampledPointCount: number | null;
    dftResult: FreqComponent[] | null;
    // Playback
    isPlaying: boolean;
    speed: number;
    circleCount: number;
    showCircles: boolean;
    // Callbacks
    onRunDFT: () => void;
    onAnimate: () => void;
    onClear: () => void;
    onPlay: () => void;
    onPause: () => void;
    onSetSpeed: (s: number) => void;
    onSetCircleCount: (n: number) => void;
    onToggleCircles: () => void;
}

// Small reuseable primitives

function Section({ label, children}: { label: string; children: React.ReactNode}){

    return (
        <div className="space-y-2">
            <div className="text-[9px] tracking-[0.3em] uppercase text-amber-400/30 border-b border-amber-400/10 pb-1">
                {label}
            </div>
            {children}
        </div>
    );

}

function Readout({ label, value, highlight}: {
    label: string;
    value: string | number;
    highlight?: boolean;
}) {

    return (
        <div className="flex justify-between items-baseline">
            <span className="text-[10px] text-amber-400/40 tracking-wider">
                {label}
            </span>
            <span className={`text-[11px] font-bold tabular-nums ${highlight ? "text-amber-400" : "text-amber-400/70"}`}>
                {value}
            </span>
        </div>
    );

}

function Slider({label, value, min, max, step = 1, onChange}: {
    label: string;
    value: number;
    min: number;
    max: number;
    step?: number;
    onChange: (n: number) => void;
}) {
    return (
        <div className="space-y-1">
            <div className="flex justify-between">
                <span className="text-[10px] text-amber-400/40 tracking-wider">{label}</span>
                <span className="text-[10px] text-amber-400/70 tabular-nums">{value}</span>
            </div>
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={e => onChange(Number(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer"
            />
        </div>
    );
}

// Main component

export default function Sidebar({
    phase,
    isDrawing,
    rawPointCount,
    sampledPointCount,
    dftResult,
    isPlaying,
    speed,
    circleCount,
    showCircles,
    onRunDFT,
    onAnimate,
    onClear,
    onPlay,
    onPause,
    onSetSpeed,
    onSetCircleCount,
    onToggleCircles
}: SidebarProps) {

    const statusLabel = 
        phase === "animate" ? "PLAYING" :
        phase === "dft" ? "DONE" :
        phase === "ready" ? "READY" :
        isDrawing ? "DRAWING" : "IDLE";

    const stepsDone = 
        phase === "animate" ? 3 :
        phase === "dft" ? 2 : 
        phase === "ready" ? 1 : 0;

    return (
    <aside className="w-52 border-r border-amber-400/10 p-5 flex flex-col gap-6 shrink-0 overflow-y-auto">

      <Section label="Instructions">
        <p className="text-[11px] text-amber-400/50 leading-relaxed">
          {phase === "animate"
            ? "Epicycles are reconstructing your path. Adjust circles and speed below."
            : phase === "dft"
            ? "DFT complete. Hit Animate to watch the epicycles draw your shape."
            : "Draw any shape. The path is sampled into 256 points then fed to the DFT."}
        </p>
      </Section>

      <Section label="Path Data">
        <Readout label="Raw pts"  value={rawPointCount} />
        <Readout label="Sampled"  value={sampledPointCount ?? "—"} />
        <Readout label="DFT bins" value={dftResult ? dftResult.length : "—"} highlight={!!dftResult} />
        <Readout label="Status"   value={statusLabel} highlight={phase === "animate"} />
      </Section>

      {dftResult && (
        <Section label="Top Components">
          {dftResult.slice(0, 5).map((c, i) => (
            <div key={i} className="flex justify-between text-[9px] py-0.5 border-b border-amber-400/5">
              <span className="text-amber-400/40">k={c.freq}</span>
              <span className="text-amber-400/70 tabular-nums">r={c.amp.toFixed(1)}</span>
              <span className="text-amber-400/40 tabular-nums">
                {(c.phase * 180 / Math.PI).toFixed(0)}°
              </span>
            </div>
          ))}
        </Section>
      )}

      {/* Playback controls — only visible in animate phase */}
      {phase === "animate" && (
        <Section label="Controls">
          <div className="flex gap-2 mb-2">
            <button
              onClick={isPlaying ? onPause : onPlay}
              className="flex-1 text-[10px] tracking-widest uppercase py-1.5 border
                border-amber-400 text-amber-400 hover:bg-amber-400 hover:text-black transition-all"
            >
              {isPlaying ? "Pause" : "Play"}
            </button>
            <button
              onClick={onToggleCircles}
              className={`flex-1 text-[10px] tracking-widest uppercase py-1.5 border transition-all
                ${showCircles
                  ? "border-amber-400/50 text-amber-400/50 hover:border-amber-400 hover:text-amber-400"
                  : "border-amber-400 text-amber-400"}`}
            >
              {showCircles ? "Hide" : "Show"}
            </button>
          </div>

          <Slider
            label="Speed"
            value={speed}
            min={0.1}
            max={5}
            step={0.1}
            onChange={onSetSpeed}
          />

          <Slider
            label="Circles"
            value={circleCount}
            min={1}
            max={dftResult?.length ?? 256}
            onChange={onSetCircleCount}
          />
        </Section>
      )}

      <Section label="Steps">
        <ol className="text-[10px] leading-relaxed list-none space-y-1.5">
          {["Draw path", "Run DFT", "Animate epicycles", "Controls"].map((s, i) => {
            const done = i < stepsDone;
            const active = i === stepsDone;
            return (
              <li key={i} className={`flex items-center gap-2 ${active || done ? "text-amber-400" : "text-amber-400/30"}`}>
                <span className={`w-4 h-4 rounded-full border flex items-center justify-center
                  text-[9px] shrink-0
                  ${active || done ? "border-amber-400 text-amber-400" : "border-amber-400/20"}`}>
                  {done ? "✓" : i + 1}
                </span>
                {s}
              </li>
            );
          })}
        </ol>
      </Section>

      <div className="flex-1" />

      <div className="flex flex-col gap-2">
        <button
          onClick={onClear}
          className="text-[10px] tracking-widest uppercase px-3 py-2 border border-amber-400/20
            text-amber-400/50 hover:text-amber-400 hover:border-amber-400/50 transition-colors"
        >
          Clear
        </button>

        {phase === "dft" && (
          <button
            onClick={onAnimate}
            className="text-[10px] tracking-widest uppercase px-3 py-2.5 border transition-all
              border-amber-400 text-amber-400 hover:bg-amber-400 hover:text-black cursor-pointer
              shadow-[0_0_12px_rgba(251,191,36,0.3)]"
          >
            Animate →
          </button>
        )}

        {(phase === "draw" || phase === "ready") && (
          <button
            onClick={onRunDFT}
            disabled={phase !== "ready"}
            className={`text-[10px] tracking-widest uppercase px-3 py-2.5 border transition-all
              ${phase === "ready"
                ? "border-amber-400 text-amber-400 hover:bg-amber-400 hover:text-black cursor-pointer shadow-[0_0_12px_rgba(251,191,36,0.3)]"
                : "border-amber-400/10 text-amber-400/20 cursor-not-allowed"}`}
          >
            Run DFT →
          </button>
        )}
      </div>
    </aside>
  );

}