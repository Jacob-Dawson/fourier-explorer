# Fourier Transform Explorer

An interactive browser-based visualisation of the Discrete Fourier Transform. Draw any shape, pick a preset, and watch it decomposed into a chain of rotating circles — each one a single frequency component from the DFT.

🔗 **[Live Demo](#)** · [GitHub](https://github.com/Jacob-Dawson)

---

![Fourier Transform Explorer](./preview.gif)

---

## What it does

The app takes a 2D path — either drawn freehand or selected from a preset library — samples it into 256 evenly-spaced points, runs a Discrete Fourier Transform, and animates the resulting frequency components as a chain of rotating circles (epicycles). The tip of the final circle traces out the original shape.

Reducing the circle count via the slider produces a lossy reconstruction — a great way to visually understand what "frequency content" means. Sharp-cornered shapes like the square and triangle show the [Gibbs phenomenon](https://en.wikipedia.org/wiki/Gibbs_phenomenon) clearly at low circle counts.

---

## Features

### Drawing
- Freehand canvas drawing with mouse and touch support
- Arc-length resampling — points are spaced evenly by distance travelled, not by time, so fast and slow strokes produce the same quality input
- Closed / open path toggle — open paths use mirroring to avoid the periodic snap-back inherent to the DFT
- Auto-advances to animation on mouse-up — no extra clicks needed

### Presets
17 built-in shapes across four categories:

| Geometric | Curves | Parametric | Famous |
|-----------|--------|------------|--------|
| Circle | Heart | Lissajous | Cardioid |
| Oval | Star | Astroid | Spirograph |
| Triangle | Figure-8 | Deltoid | Butterfly |
| Square | Trefoil | | Rose (4-petal) |
| Pentagon | | | |
| Hexagon | | | |

### Animation controls
- Play / pause
- Speed slider
- Circle count slider — reduce to see lossy reconstruction
- Scale slider
- Show / hide circles and arms
- Casual rotation toggle — slowly rotates the entire epicycle system
- Fading trail — older path segments fade out with decreasing opacity and line width

### Amplitude spectrum
- Real-time log-scale frequency spectrum displayed in the sidebar
- Updates live as the DFT result changes

### Responsive layout
- **Desktop** — full three-panel layout with sidebar, canvas, and spectrum panel
- **Tablet / Mobile** — canvas fills the screen, controls accessible via a bottom drawer

---

## Tech stack

- [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- HTML5 Canvas API for all rendering and animation

No animation libraries. No DFT libraries. Everything is implemented from scratch.

---

## Project structure

```
src/
├── components/
│   ├── Canvas.tsx          # Freehand drawing surface
│   ├── EpicycleCanvas.tsx  # rAF animation loop and epicycle rendering
│   ├── Sidebar.tsx         # Controls panel
│   ├── Spectrum.tsx        # Amplitude spectrum display
│   ├── PresetBar.tsx       # Preset shape selector
│   └── Drawer.tsx          # Mobile bottom sheet
├── hooks/
│   ├── useDrawing.ts       # Pointer events, path sampling
│   └── useEpicycles.ts     # Playback controls state
├── utils/
│   ├── dft.ts              # Discrete Fourier Transform (O(N²) naive implementation)
│   ├── resample.ts         # Arc-length path resampling
│   ├── presets.ts          # Parametric curve generators
│   └── canvas.ts           # Shared canvas drawing helpers
├── types/
│   └── index.ts            # Shared TypeScript types
└── App.tsx

```
---

## How to run locally

```bash
git clone https://github.com/Jacob-Dawson/fourier-explorer
cd fourier-explorer
npm install
npm run dev
```

---

## The maths in one line

Each point on the path is treated as a complex number `z[n] = x[n] + i·y[n]`. The DFT computes:
X[k] = Σ(n=0..N-1)  z[n] · e^(-2πi·k·n/N)

Each `X[k]` describes one rotating circle: `|X[k]|` is its radius and `arg(X[k])` is its starting angle. Summing all circles tip-to-tail reconstructs the original path.

---

## License

MIT