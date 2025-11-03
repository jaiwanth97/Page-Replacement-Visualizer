# Page Replacement Algorithm Visualizer

Interactive visual simulator for Operating System page replacement algorithms (LRU, Optimal). Built with vanilla HTML/CSS/JS.

## Features
- Modern, accessible UI with a clean indigo theme
- Algorithms: FIFO, LRU, Optimal, Clock (Second Chance)
- Smooth, step-by-step animation with play/pause/step controls
- Interactive timeline to jump to any step
- Real-time statistics: hits, faults, ratios, completion, ETA, efficiency
- Export current canvas view as PNG

## Project Structure
- `sdj.html` — Main HTML page
- `assets/css/style.css` — Styles (theme via CSS variables)
- `assets/js/theme.js` — Shared theme colors for JS rendering
- `assets/js/algorithms.js` — Algorithm implementations
- `assets/js/animation.js` — Canvas drawing and sizing
- `assets/js/ui.js` — UI bindings, timeline, stats, controls
- `assets/js/metrics.js` — Extra computed metrics (ETA, efficiency)
- `assets/js/main.js` — Orchestrator; wires modules and initializes state

## Quick Start
1. Open `sdj.html` in a modern browser (Chrome 90+, Edge 90+, Firefox 88+).
2. Configure: algorithm, frames, animation speed, and reference string.
3. Click "Initialize Simulation" → Use Play/Pause/Step controls.
4. Click any item in the timeline to jump to that step.
5. Use "Export Screenshot" to download a PNG of the canvas.

## Notes
- No build tools required — static, client-side.
- Animations are time-based via the Animation Speed input (ms/step).
- Efficiency shown is the current hit ratio as a percentage.


