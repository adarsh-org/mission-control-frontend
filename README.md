# Mission Control Frontend

## Status
- **Build**: Vite + React + Tailwind
- **Server**: Running on http://localhost:5173 (Port may vary if 5173 is busy)
- **Source**: `/data/workspace/mission-control-frontend`

## Features
- **Live Kanban**: Listens to `kanban` event on SSE stream.
- **Live Logs**: Listens to `log` event on SSE stream.
- **Visuals**: High-tech sci-fi "Command Center" theme (scanlines, monospaced fonts, neon green).

## How to Access
1. Ensure the backend (Mission Control) is running on port 3000.
2. Open http://localhost:5173 in your browser.
3. If using via OpenClaw browser tool: `browser action=navigate url=http://localhost:5173`

## Configuration
- API Endpoint: `/api/stream` (Proxied to `http://localhost:3000`)
