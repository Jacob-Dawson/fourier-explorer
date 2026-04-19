interface DrawerProps{
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

export default function Drawer({ isOpen, onClose, children}: DrawerProps){

    return(
        <>
            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 z-20 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sheet */}
            <div
                className={`fixed bottom-0 left-0 right-0 z-30 lg:hidden bg-[#0a0a0f] border-t border-cyan-400/20 transition-transform duration-300 ease-in-out ${isOpen ? "translate-y-0" : "translate-y-full"}`}
                style={{ maxHeight: "75vh", overflowY: "auto"}}
            >
                {/* Handle */}
                <div className="flex justify-center pt-3 pb-1">
                    <div className="w-10 h-1 rounded-full bg-cyan-400/20"/>
                </div>

                {/* Close button */}
                <div className="flex justify-between items-center px-5 py-2 border-b border-cyan-400/10">
                    <span className="text-[9px] tracking-[0.3em] uppercase text-cyan-400/40">
                        Controls
                    </span>
                    <button
                        onClick={onClose}
                        className="text-[10px] tracking-widest uppercase text-cyan-400/40 hover:text-cyan-400 transition-colors px-2 py-1"
                    >
                        Close X
                    </button>
                </div>

                {children}
            </div>
        </>
    );

}