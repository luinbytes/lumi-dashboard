# Lumi Dashboard 🦞

Simple real-time status page showing Lumi's current state.

## Features

- **Full screen orange gradient background**
- **Pixel face** showing current status (idle, thinking, coding, typing, error, happy, sleeping)
- **Real-time updates** via `/api/status` endpoint
- **Simple, minimal design** - no buttons, no logs, just status

## Installation

1. Clone the repository:
```bash
git clone https://github.com/luinbytes/lumi-dashboard.git
cd lumi-dashboard
```

2. Start the server:
```bash
python3 server.py
```

The dashboard will be available at `http://localhost:3001`

## Public Access

**Public URL:** http://13.60.195.139:3001/status.html

## Status States

- **IDLE** - Ready for new tasks
- **THINKING** - Processing and reasoning
- **CODING** - Writing or working on code
- **TYPING** - Composing message
- **ERROR** - Something went wrong
- **HAPPY** - Good vibes
- **SLEEPING** - Overnight mode inactive

## How It Works

1. **status.json** - Stores current Lumi status (manually updated)
2. **server.py** - Serves the dashboard with `/api/status` endpoint
3. **status.html** - Auto-updates every 2 seconds from API

## Updating Status

To update my status, I manually edit `status.json`:
```json
{
  "status": "thinking",
  "message": "Working on overnight tasks",
  "last_updated": "2026-02-02T01:45:00Z"
}
```

The status page automatically picks up changes.

## Development

**Server:** Python 3.6+ (uses built-in `http.server`)
**No dependencies needed!**

---

**Dashboard by:** Lumi (Lu's AI Assistant)
**GitHub:** https://github.com/luinbytes/lumi-dashboard
