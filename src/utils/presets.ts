import type { Point } from "../types";

export type PresetName = "circle" | "star" | "heart" | "figure8" | "trefoil" | "lissajous" | "square" | "astroid" | "deltoid" | "triangle" | "pentagon" | "hexagon" | "oval" | "cardioid" | "hypotrochoid" | "butterfly" | "rose4";

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
            : name === "butterfly"
            ? (i / n) * (Math.PI * 4)
            : name === "hypotrochoid"
            ? (i / n) * (Math.PI * 6)
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

            case "oval":
                x = cx + r * Math.cos(t);
                y = cy + r * 0.55 * Math.sin(t);
                break;

            case "triangle": {
                // Smooth parametric triangle
                const sides = 3;
                const corner = Math.floor((t / (Math.PI * 2)) * sides);
                const localT = (t / (Math.PI * 2)) * sides - corner;
                const a1 = (corner / sides) * Math.PI * 2 - Math.PI / 2;
                const a2 = ((corner + 1) / sides) * Math.PI * 2 - Math.PI / 2;
                x = cx + r * (Math.cos(a1) + localT * (Math.cos(a2) - Math.cos(a1)));
                y = cy + r * (Math.sin(a1) + localT * (Math.sin(a2) - Math.sin(a1)));
                break;
            }

            case "pentagon":{
                const sides = 5;
                const corner = Math.floor((t / (Math.PI * 2)) * sides);
                const localT = (t / (Math.PI * 2)) * sides - corner;
                const a1 = (corner / sides) * Math.PI * 2 - Math.PI / 2;
                const a2 = ((corner + 1) / sides) * Math.PI * 2 - Math.PI / 2;
                x = cx + r * (Math.cos(a1) + localT * (Math.cos(a2) - Math.cos(a1)));
                y = cy + r * (Math.sin(a1) + localT * (Math.sin(a2) - Math.sin(a1)));
                break;
            }

            case "hexagon":{
                const sides = 6;
                const corner = Math.floor((t / (Math.PI * 2)) * sides);
                const localT = (t / (Math.PI * 2)) * sides - corner;
                const a1 = (corner / sides) * Math.PI * 2 - Math.PI / 2;
                const a2 = ((corner + 1) / sides) * Math.PI * 2 - Math.PI / 2;
                x = cx + r * (Math.cos(a1) + localT * (Math.cos(a2) - Math.cos(a1)));
                y = cy + r * (Math.sin(a1) + localT * (Math.sin(a2) - Math.sin(a1)));
                break;
            }

            case "cardioid":
                x = cx + r * 0.5 * (2 * Math.cos(t) - Math.cos(2 * t));
                y = cy + r * 0.5 * (2 * Math.sin(t) - Math.sin(2 * t));
                break;

            case "hypotrochoid":{
                // Spirograph
                const R = 5, rr = 3, d = 5;
                x = cx + (r / (R + d)) * ((R - rr) * Math.cos(t) + d * Math.cos((R - rr) / rr * t));
                y = cy + (r / (R + d)) * ((R - rr) * Math.sin(t) - d * Math.sin((R - rr) / rr * t));
                break;
            }

            case "butterfly":
                // Butterfly curve
                x = cx + (r / 4) * Math.sin(t) * (Math.exp(Math.cos(t)) - 2 * Math.cos(4 * t) - Math.pow(Math.sin(t / 12), 5));
                y = cy - (r / 4) * Math.cos(t) * (Math.exp(Math.cos(t)) - 2 * Math.cos(4 * t) - Math.pow(Math.sin(t / 12), 5));
                break;

            case "rose4":
                // 4-petal rose
                x = cx + r * Math.cos(2 * t) * Math.cos(t);
                y = cy + r * Math.cos(2 * t) * Math.sin(t);
                break;
        }

        points.push({x,y})

    }

    return points;
}