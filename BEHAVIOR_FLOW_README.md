# Lumi Dashboard - Behavior Flow

Dynamic behavioral rule analysis dashboard for Lumi's OpenClaw agent.

## Features

### Behavior Flow Dashboard
- **Dynamic Rule Extraction**: Scans workspace `.md` files for behavioral rules
- **Mermaid Flow Chart**: Visual decision tree of agent behavior
- **Rule Categories**:
  - Time-based rules (`10:00-23:00 GMT`)
  - Mode switches (daytime/overnight)
  - Conditional workflows (`if/then`, `when/then`)
  - Critical rules (`NEVER`, `ALWAYS`, `CRITICAL`)
  - Permission gates (`ask first`, `requires approval`)

### Quick Stats
- Files scanned in workspace
- Time rules count
- Mode switches count
- Critical rules count
- Workflows count
- Permission gates count

### Rule Browser
- Tab-based filtering by rule type
- Context display with file source
- Quick search and exploration

## API Endpoints

### GET `/api/flowchart`
Returns Mermaid flow chart and extracted rules.

**Response:**
```json
{
  "mermaid": "graph TD...",
  "files_scanned": 28,
  "summary": {
    "time_rules": 150,
    "mode_switches": 6,
    "conditional_workflows": 79,
    "critical_rules": 204,
    "permission_gates": 16
  },
  "time_rules": [...],
  "mode_switches": [...],
  "conditional_workflows": [...],
  "critical_rules": [...],
  "permission_gates": [...]
}
```

### GET `/api/stats`
Quick stats about the workspace.

**Response:**
```json
{
  "files_in_workspace": 28,
  "workspace_path": "/home/ubuntu/.openclaw/workspace",
  "status": "online"
}
```

## Setup

### Install Dependencies
```bash
pip install Flask Werkzeug
```

### Run API Server
```bash
python3 api.py
```

API runs on `http://localhost:5000`

### Access Dashboard
- Behavior Flow: `http://localhost:5000/`
- Admin Panel: `http://localhost:3000/admin.html`

## Rule Extraction Patterns

### Time Rules
- `(\d{1,2}:\d{2})\s*-\s*(\d{1,2}:\d{2})\s*(?:GMT|UTC)?`
- `(?:daytime|overnight|nighttime).*?(\d{1,2}:\d{2})`
- `(\d{1,2}:\d{2})\s*(?:GMT|UTC)`

### Mode Switches
- `(?:mode|switch|check):?\s*(daytime|overnight|nighttime)`
- `(?:if|when|while)\s+.*?(\d{1,2}:\d{2})`
- `(?:check|determine|decide)\s+mode`

### Conditional Workflows
- `if\s+(.*?):?\s*then\s+(.*?)(?:\.|$|\n)`
- `when\s+(.*?):?\s*(?:do|then|use)\s+(.*?)(?:\.|$|\n)`
- `(?:respond|reply|send)\s+.*?(?:when|if|unless)\s+(.*?)(?:\.|$|\n)`

### Critical Rules
- `(?:CRITICAL|IMPORTANT|MUST|NEVER|ALWAYS).*?:?\s*(.*?)(?:\.|$|\n)`
- `⚠️.*?:?\s*(.*?)(?:\.|$|\n)`
- `NEVER\s+(.*?)(?:\.|$|\n)`
- `ALWAYS\s+(.*?)(?:\.|$|\n)`

### Permission Gates
- `(?:ask|request|check)\s+first.*?:?\s*(.*?)(?:\.|$|\n)`
- `(?:requires|needs)\s+approval.*?:?\s*(.*?)(?:\.|$|\n)`
- `(?:before|when)\s+(?:doing|sending|posting)\s+.*?:?\s*(.*?)(?:\.|$|\n)`

## Architecture

### Backend (Flask)
- `api.py`: Flask server with rule extraction
- `RuleExtractor`: Scans and parses markdown files
- `generate_mermaid_flowchart()`: Creates Mermaid diagram

### Frontend (Vanilla JS)
- `index.html`: Main dashboard layout
- `script.js`: Dashboard logic and API integration
- `styles.css`: Space lobster theme styling

### Libraries
- **Flask**: Web framework
- **Mermaid.js**: Flow chart rendering
- No external dependencies for frontend

## Development

### File Structure
```
lumi-dashboard/
├── api.py              # Flask API server
├── index.html          # Behavior flow dashboard
├── script.js           # Dashboard logic
├── styles.css          # Styling
├── requirements.txt    # Python dependencies
├── server.py          # Admin panel server (port 3001)
├── admin.html         # Admin panel UI
├── status.html        # Simple status page
└── status.json       # Status data
```

### Ports
- **5000**: Behavior Flow API & Dashboard
- **3001**: Admin Panel (server.py)

### Testing API
```bash
# Check stats
curl http://localhost:5000/api/stats | jq

# Get flow chart
curl http://localhost:5000/api/flowchart | jq '.summary'
```

## License

MIT
