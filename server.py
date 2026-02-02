#!/usr/bin/env python3
"""
Lumi Admin Dashboard Server
Serves the OpenClaw admin dashboard
"""

import json
import os
import subprocess
from datetime import datetime
from http.server import HTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
from urllib.parse import urlparse, parse_qs

# Paths
DASHBOARD_DIR = Path.home() / ".openclaw" / "workspace" / "lumi-dashboard"
STATUS_FILE = DASHBOARD_DIR / "status.json"
WORKSPACE_DIR = Path.home() / ".openclaw" / "workspace"

# Mock agent data (in real deployment, this would query OpenClaw)
AGENTS = [
    {"id": "main", "name": "main", "online": True, "skills": 12},
    {"id": "sub-agent-1", "name": "research", "online": True, "skills": 8},
    {"id": "sub-agent-2", "name": "coding", "online": False, "skills": 5},
]

def get_status():
    """Get current Lumi status from status.json"""
    if not STATUS_FILE.exists():
        return {
            "status": "idle",
            "message": "Ready for new tasks",
            "last_updated": datetime.now().isoformat()
        }

    try:
        with open(STATUS_FILE, 'r') as f:
            status_data = json.load(f)
            return status_data
    except:
        return {
            "status": "idle",
            "message": "Ready for new tasks",
            "last_updated": datetime.now().isoformat()
        }

def get_agent_file(agent_id, filename):
    """Get file content from workspace"""
    # Map agent IDs to workspace files
    agent_files = {
        "main": {
            "Soul.md": "SOUL.md",
            "MEMORY.md": "MEMORY.md"
        }
    }

    if agent_id not in agent_files:
        return None

    if filename not in agent_files[agent_id]:
        return None

    file_path = WORKSPACE_DIR / agent_files[agent_id][filename]

    if not file_path.exists():
        return None

    try:
        with open(file_path, 'r') as f:
            return f.read()
    except:
        return None

def save_agent_file(agent_id, filename, content):
    """Save file content to workspace"""
    agent_files = {
        "main": {
            "Soul.md": "SOUL.md",
            "MEMORY.md": "MEMORY.md"
        }
    }

    if agent_id not in agent_files:
        return False

    if filename not in agent_files[agent_id]:
        return False

    file_path = WORKSPACE_DIR / agent_files[agent_id][filename]

    try:
        with open(file_path, 'w') as f:
            f.write(content)
        return True
    except:
        return False

def restart_agent(agent_id):
    """Restart an agent (mock implementation)"""
    # In real deployment, this would send SIGUSR1 or call OpenClaw API
    return True

class LumiDashboardHandler(SimpleHTTPRequestHandler):
    """Custom HTTP handler with API endpoints"""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(DASHBOARD_DIR), **kwargs)

    def do_GET(self):
        """Handle GET requests"""
        if self.path == "/api/status":
            self.send_json_response({
                "timestamp": datetime.now().isoformat(),
                **get_status()
            })
        elif self.path == "/api/dashboard":
            self.send_json_response({
                "agents": AGENTS,
                "port": 3001
            })
        elif self.path.startswith("/api/file"):
            # Parse query parameters
            parsed = urlparse(self.path)
            query = parse_qs(parsed.query)

            agent_id = query.get("agent", ["main"])[0]
            filename = query.get("file", ["Soul.md"])[0]

            content = get_agent_file(agent_id, filename)

            if content is None:
                self.send_json_response({"error": "File not found"}, status=404)
            else:
                self.send_json_response({"content": content})
        else:
            super().do_GET()

    def do_POST(self):
        """Handle POST requests"""
        if self.path == "/api/file":
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data.decode())

            agent_id = data.get("agent", "main")
            filename = data.get("file", "Soul.md")
            content = data.get("content", "")

            success = save_agent_file(agent_id, filename, content)

            if success:
                self.send_json_response({"status": "ok"})
            else:
                self.send_json_response({"error": "Failed to save file"}, status=500)

        elif self.path == "/api/restart":
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data.decode())

            agent_id = data.get("agent", "main")
            success = restart_agent(agent_id)

            if success:
                self.send_json_response({"status": "ok"})
            else:
                self.send_json_response({"error": "Failed to restart agent"}, status=500)

        else:
            self.send_json_response({"error": "Not found"}, status=404)

    def send_json_response(self, data, status=200):
        """Send JSON response"""
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()
        self.wfile.write(json.dumps(data, indent=2).encode())

    def do_OPTIONS(self):
        """Handle OPTIONS for CORS"""
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def log_message(self, format, *args):
        """Suppress default logging"""
        pass

def main():
    """Start the dashboard server"""
    port = 3001
    server = HTTPServer(("0.0.0.0", port), LumiDashboardHandler)

    print(f"🦞 Lumi Admin Dashboard running on http://0.0.0.0:{port}")
    print(f"📊 Admin Panel: http://0.0.0.0:{port}/admin.html")
    print(f"📈 Status Page: http://0.0.0.0:{port}/status.html")
    print(f"🔌 API endpoints:")
    print(f"   - GET  /api/status")
    print(f"   - GET  /api/dashboard")
    print(f"   - GET  /api/file?agent=X&file=Y")
    print(f"   - POST /api/file")
    print(f"   - POST /api/restart")
    print(f"📁 Serving from: {DASHBOARD_DIR}")

    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n🦞 Dashboard stopped")

if __name__ == "__main__":
    main()
