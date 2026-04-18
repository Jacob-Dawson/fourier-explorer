import type { PresetName } from "../utils/presets";
import { PRESETS } from "../utils/presets";

interface PresetBarProps{
    onSelect: (name: PresetName) => void;
}

export default function PresetBar({onSelect}: PresetBarProps){

    return (
        <div className="flex items-center gap-3 px-6 py-2 border-b border-amber-400/10">
            <span className="text-[9px] tracking-[0.3em] uppercase text-amber-400/30 shrink-0">
                Presets
            </span>
            <div className="flex gap-2">
                {PRESETS.map(p => (
                    <button
                        key={p.name}
                        onClick={() => onSelect(p.name)}
                        className="text-[9px] tracking-widest uppercase px-3 py-1 border border-amber-400/20 text-amber-400/50 hover:text-amber-400 hover:border-amber-400/50 transition-colors cursor-pointer"
                    >
                        {p.label}
                    </button>
                ))}
            </div>
            <span className="text-[9px] text-amber-400/20 tracking-widest">
                - or draw your own
            </span>
        </div>
    );

}