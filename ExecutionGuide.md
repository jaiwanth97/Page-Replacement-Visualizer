# Execution Guide (One Page)

## 1) Setup Instructions
- Download the project folder.
- Open `sdj.html` directly in a modern browser (Chrome 90+, Edge 90+, Firefox 88+). No server or build needed.

## 2) User Interface Guide
- Algorithm: Choose `FIFO`, `LRU`, `OPTIMAL`, or `CLOCK`.
- Number of Frames: Select 1–10 physical frames.
- Animation Speed (ms): Time per step in milliseconds.
- Page Reference String: Comma-separated sequence (e.g., `7,0,1,2,0,3,...`).
- Controls:
  - Initialize Simulation: Prepares the run and builds the timeline.
  - Play / Pause: Starts and pauses step-by-step playback.
  - Step Back / Step Forward: Move one step at a time while paused.
  - Reset: Jump back to the initial step.
  - Export Screenshot: Save the current canvas as a PNG.

## 3) Animation Features
- Frame-by-frame transitions render the current page, action, and memory frames.
- Timeline: Click any step to jump; auto-scroll is enabled only during playback.
- Real-time Statistics:
  - Algorithm, Total References, Current Step
  - Page Faults, Page Hits, Hit Ratio, Fault Ratio
  - Completion (done/total steps), Avg Step Time, ETA, Efficiency (current hit ratio)
- Color Coding:
  - Brand (Indigo): Active frame when not a hit
  - Green: Page Hit
  - Red: Page Fault
  - Amber: Page being replaced
  - Slate: Occupied frame; Neutral/Muted text for empty

## 4) Browser Requirements
- Tested on latest Chrome/Edge/Firefox.
- Recommended minimum versions: Chrome 90+, Edge 90+, Firefox 88+.
- Mobile screens are supported with responsive layout; best experienced on desktop.
