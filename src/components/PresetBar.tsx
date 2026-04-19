import type { PresetName } from "../utils/presets";

interface Preset {
    name: PresetName;
    label: string;
    symbol: string;
}

interface Category{
    label: string;
    presets: Preset[];
}

const CATEGORIES: Category[] = [
    {
        label: "Geometric",
        presets: [
            {name: "circle", label: "Circle", symbol: "○"},
            {name: "oval", label: "Oval", symbol: "⬭"},
            {name: "triangle", label: "Triangle", symbol: "△"},
            {name: "square", label: "Square", symbol: "□"},
            { name: "pentagon", label: "Pentagon", symbol: "⬠" },
            { name: "hexagon",  label: "Hexagon",  symbol: "⬡" },
        ],
    },
    {
        label: "Curves",
        presets: [
            { name: "heart",   label: "Heart",    symbol: "♡" },
            { name: "star",    label: "Star",     symbol: "✦" },
            { name: "figure8", label: "Figure-8", symbol: "∞" },
            { name: "trefoil", label: "Trefoil",  symbol: "☘" },
        ],
    },
    {
        label: "Parametric",
        presets: [
            { name: "lissajous", label: "Lissajous", symbol: "⌇" },
            { name: "astroid",   label: "Astroid",   symbol: "✴" },
            { name: "deltoid",   label: "Deltoid",   symbol: "◬" },
        ],
    }
];

interface PresetBarProps{
    onSelect: (name: PresetName) => void;
}

export default function PresetBar({onSelect}: PresetBarProps){

    return (
        <div className="border-b border-cyan-400/10 bg-[#0a0a0f]">

            {/* Desktop layout */}

            <div className="hidden lg:grid lg:grid-cols-3 divide-x divide-cyan-400/10">
                {CATEGORIES.map(cat => (
                    <div key={cat.label} className="px-4 py-2.5 flex flex-col gap-2">
                        <span className="text-[8px] tracking-[0.3em] uppercase text-cyan-400/30">
                            {cat.label}
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                            {cat.presets.map(p => (
                                <PresetPill key={p.name} preset={p} onSelect={onSelect}/>
                            ))}
                        </div>
                    </div>
                ))}

            </div>
            
            {/* Mobile / tablet layout */}
            <div className="lg:hidden relative">
                {/* Fade gradient on right edge to indicate more content */}
                <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#0a0a0f] to-transparent z-10" />
                
                <div className="flex flex-wrap items-center gap-2 px-4 py-2">
                    {CATEGORIES.map((cat, ci) => (
                    <div
                        key={cat.label}
                        className="flex items-center gap-1.5 shrink-0"
                    >
                        {ci > 0 && (
                        <span className="text-cyan-400/15 text-xs mx-1">|</span>
                        )}
                        {cat.presets.map(p => (
                        <PresetPill key={p.name} preset={p} onSelect={onSelect} />
                        ))}
                    </div>
                    ))}
                    {/* Right padding so last pill clears the fade */}
                    <div className="w-6 shrink-0" />
                </div>
            </div>
        </div>
    );

}

// Pill button

function PresetPill({
    preset,
    onSelect
}: {
    preset: Preset;
    onSelect: (name: PresetName) => void;
}) {
    return(
        <button
            onClick={() => onSelect(preset.name)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-cyan-400/15 text-cyan-400/50 hover:border-cyan-400/60 hover:text-cyan-400 hover:bg-cyan-400/5 transition-all cursor-pointer group shrink-0"
        >
            <span className="text-[11px] group-hover:scale-110 transition-transform">
                {preset.symbol}
            </span>
            <span className="text-[9px] tracking-widest uppercase">
                {preset.label}
            </span>
        </button>
    );

}