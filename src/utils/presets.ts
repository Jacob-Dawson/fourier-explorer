import type { Point } from "../types";

export type PresetName = "circle" | "star" | "heart" | "figure8" | "trefoil" | "lissajous" | "square" | "astroid" | "deltoid";

export const PRESETS: { name: PresetName; label: string }[] = [
    {name: "circle", label: "Circle"},
    {name: "star", label: "Star"},
    {name: "heart", label: "Heart"},
    {name: "figure8", label: "Figure-8"},
    {name: "trefoil", label: "Trefoil"},
    {name: "lissajous", label: "Lissajous"},
    {name: "square", label: "Square"},
    {name: "astroid", label: "Asteroid"},
    {name: "deltoid", label: "Deltoid"}
];

export function generatePreset(
    name: PresetName,
    cx: number,
    cy: number,
    n = 256
): Point[] {
    const r = Math.min(cx, cy) * 0.6;
    const points: Point[] = [];

    for(let i = 0; i < n; i++){

        // Trefoil (3-petal rose)
        const t = name === "trefoil"
            ? (i / n) * Math.PI
            : (i / n) * (Math.PI * 2);

        let x = 0;
        let y = 0;

        switch (name) {
            case "circle":
                x = cx + r * Math.cos(t);
                y = cy + r * Math.sin(t);
                break;

            case "star": {
                const spikes = 5;
                const outerR = r;
                const innerR = r*0.4;
                const cycleT = (t % (Math.PI * 2 / spikes)) / (Math.PI * 2 / spikes);
                const radius = cycleT < 0.5
                    ? outerR + (innerR - outerR) * (cycleT * 2)
                    : innerR + (outerR - innerR) * ((cycleT - 0.5) * 2);
                x = cx + radius * Math.cos(t - Math.PI / 2);
                y = cy + radius * Math.sin(t - Math.PI / 2);
                break;
            }

            case "heart": {
                const s = r / 17;
                x = cx + s * 16 * Math.pow(Math.sin(t), 3);
                y = cy - s * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
                break;
            }

            case "figure8":
                x = cx + r * Math.sin(t);
                y = cy + (r * 0.5) * Math.sin(t) * Math.cos(t);
                break;

            case "trefoil":
                x = cx + r * Math.cos(3 * t) * Math.cos(t);
                y = cy + r * Math.cos(3 * t) * Math.sin(t);
                break;

            case "lissajous":
                x = cx + r * Math.sin(3 * t + Math.PI / 2);
                y = cy + r * Math.sin(2 * t);
                break;

            case "square":
                x = cx + r * Math.cos(t) / Math.max(Math.abs(Math.cos(t)), Math.abs(Math.sin(t)));
                y = cy + r * Math.sin(t) / Math.max(Math.abs(Math.cos(t)), Math.abs(Math.sin(t)));
                break;

            case "astroid":
                x = cx + r * Math.pow(Math.cos(t), 3);
                y = cy + r * Math.pow(Math.sin(t), 3);
                break;

            case "deltoid":
                x = cx + r * (2 * Math.cos(t) + Math.cos(2 * t)) / 3;
                y = cy + r * (2 * Math.sin(t) - Math.sin(2 * t)) / 3;
                break;
        }

        points.push({x,y})

    }

    return points;
}