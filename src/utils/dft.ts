import type { Point, FreqComponent } from "../types"

/*

Discrete Fourier Transform

Treats each sampled point as a complex number: z[n] = x[n] + i*y[n]

X[k] = (sum)(n = 0.. N - 1) z[n] * e^(-2pii*k*n/N)



*/

export function computeDFT(points: Point[]): FreqComponent[]{

    const N = points.length;

    // Center the path saround the origin so the epicycles
    // Orbit the canvas center rather than some arbitrary corner

    const cx = points.reduce((s, p) => s + p.x, 0) / N;
    const cy = points.reduce((s, p) => s + p.y, 0) / N;

    const result: FreqComponent[] = [];

    for(let k = 0; k < N; k++){
        let re = 0;
        let im = 0;

        for(let n = 0; n < N; n++){

            const angle = (2 * Math.PI*k*n) / N;
            re += (points[n].x - cx) * Math.cos(angle) + (points[n].y - cy) * Math.sin(angle);
            im += (points[n].y - cy) * Math.cos(angle) - (points[n].x - cx) * Math.sin(angle);

        }
    
        re /= N;
        im /= N;

        result.push({
            freq: k,
            amp: Math.sqrt(re * re + im * im),
            phase: Math.atan2(im, re),
            re,
            im
        });

    }

    // Sort biggest amplitude first - the large circles define the coarse shape, small ones add fine detail at the tip of the chain
    return result.sort((a,b) => b.amp - a.amp);

}