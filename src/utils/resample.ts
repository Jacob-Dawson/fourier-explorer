import type { Point } from "../types";

/* Resamples an arbitrary length path or exactly n evenly-spaced points using arc length parameterisation
*/

export function resamplePath(points: Point[], n: number): Point[]{

    if(points.length < 2) return points;

    // Build a cumulative arc-length table
    const lengths: number[] = [0];
    for(let i = 1; i < points.length; i++){

        const dx = points[i].x - points[i - 1].x;
        const dy = points[i].y - points[i - 1].y;
        lengths.push(lengths[i - 1] + Math.sqrt(dx * dx + dy * dy));

    }

    const total = lengths[lengths.length - 1];
    if(total === 0) return points;

    const step = total / n;
    const out: Point[] = [];
    let j = 0;

    for(let i = 0; i < n; i++){

        const target = i * step;
        // Advance j until the next segment straddles our target distance
        while(j < lengths.length - 2 && lengths[j + 1] < target) j++;
        // Linearly interpolate between points[j] and points[j+1]
        const t = (target - lengths[j]) / (lengths[j + 1] - lengths[j]);

        out.push({
            x: points[j].x + t * (points[j + 1].x - points[j].x),
            y: points[j].y + t * (points[j + 1].y - points[j].y)
        })

    }

    return out;

}