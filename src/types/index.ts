export interface Point{
    x: number;
    y: number;
}

export interface FreqComponent{
    freq: number; // harmonic (k)
    amp: number; // circle radius |X[k]|
    phase: number; // starting angle arg(X[k])
    re: number;
    im: number;
}

export type Phase = "draw" | "ready" | "dft" | "animate";