import type { PresetName } from "../utils/presets";
import { PRESETS } from "../utils/presets";

interface PresetBarProps{
    onSelect: (name: PresetName) => void;
}

export default function PresetBar({onSelect}: PresetBarProps){

    return (
        <div className="flex items-center gap-3 px-6 py-2 border-b border-cyan-400/10 overflow-x-auto">
            <span className="text-[9px] tracking-[0.3em] uppercase text-cyan-400/30 shrink-0">
                Presets
            </span>
            <div className="flex gap-2 shrink-0">
                {PRESETS.map(p => (
                    <button
                        key={p.name}
                        onClick={() => onSelect(p.name)}
                        className="text-[9px] tracking-widest uppercase px-3 py-1 border border-cyan-400/20 text-cyan-400/50 hover:text-cyan-400 hover:border-cyan-400/50 transition-colors cursor-pointer shrink-0"
                    >
                        {p.label}
                    </button>
                ))}
            </div>
            <span className="text-[9px] text-cyan-400/20 tracking-widest shrink-0 hidden md:block">
                - or draw your own
            </span>
        </div>
    );

}