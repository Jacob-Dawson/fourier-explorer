import type { Point, FreqComponent } from "../types";

interface SpectrumProps{
    dftResult: FreqComponent[] | null;
    sampledPoints: Point[] | null;
}

// Amplitude Spectrum

function AmplitudeSpectrum({components}: { components: FreqComponent[]}){

    // Display first 64 bins in frequency order (not sorted by amplitude)
    const bins = [...components]
        .sort((a, b) => a.freq - b.freq)
        .slice(0, 64);

    const maxAmp = Math.max(...bins.map(c => c.amp), 1);

    return (
        <div className="flex-1 flex flex-col justify-end">
            <div className="flex items-end gap-px h-28">
                {bins.map(c => {

                    // Log scale so tiny harmonics are still visible

                    const raw = Math.log1p(c.amp) / Math.log1p(maxAmp);
                    const h = isFinite(raw) ? raw : 0;                    
                    return (
                        <div
                            key={c.freq}
                            className="flex-1 bg-cyan-400 transition-all duration-300"
                            style={{ height: `${h * 100}%`, opacity: 0.2 + h * 0.75}}
                        />
                    );

                })}
            </div>
            <div className="mt-1 flex justify-between text-[8px] text-cyan-400/25">
                <span>k=0</span>
                <span>63</span>
            </div>
            <p className="text-[8px] text-cyan-400/25 mt-1 tracking-wider">
                log amplitude
            </p>
        </div>
    );

}

// Point distribution

function PointDistribution({ points }: { points: Point[]}){

    const BUCKETS = 20;
    const minY = Math.min(...points.map(p => p.y));
    const maxY = Math.max(...points.map(p => p.y));
    const range = maxY - minY || 1;

    const bars = Array(BUCKETS).fill(0) as number[];
    points.forEach(p => {
        const b = Math.min(BUCKETS - 1, Math.floor(((p.y - minY) / range) * BUCKETS));
        bars[b]++;
    });
    const maxBar = Math.max(...bars, 1);

    return (
        <div className="flex-1 flex flex-col justify-end">
            <div className="flex items-end gap-px h-28">
                {bars.map((v, i) => {
                    const ratio = v / maxBar;
                    const safeRatio = isFinite(ratio) ? ratio : 0;
                    return (
                    <div
                        key={i}
                        className="flex-1 bg-cyan-400 transition-all duration-500"
                        style={{ height: `${safeRatio * 100}%`, opacity: 0.2 + safeRatio * 0.7 }}                    
                    />
                    );
                })}
            </div>
            <p className="text-[8px] text-cyan-400/25 mt-1 tracking-wider">
                point distribution
            </p>
        </div>
    );

}

// Main Component

export default function Spectrum({ dftResult, sampledPoints}: SpectrumProps){

    return (

        <aside className="w-40 border-1 border-cyan-400/10 p-4 flex flex-col gap-3 shrink-0">
            <span className="text-[9px] tracking-[0.25em] uppercase text-cyan-400/30">
                {dftResult ? "Amplitude Spectrum" : "Freq Spectrum"}
            </span>

            {dftResult ? (
                <AmplitudeSpectrum components={dftResult} />
            ) : sampledPoints ? (
                <PointDistribution points={sampledPoints} />
            ) : (
                <div className="flex-1 flex items-center justify-center">
                    <span className="text-[9px] text-cyan-400/15 text-center leading-relaxed tracking-widest uppercase">
                        awaiting<br />path data
                    </span>
                </div>
            )}
        </aside>
    );

}