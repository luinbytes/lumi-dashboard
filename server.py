#!/usr/bin/env python3
"""
Lumi Dashboard Server
Serves the Lumi Status page
"""

import json
import os
from datetime import datetime
from http.server import HTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
from urllib.parse import parse_qs

# Paths
DASHBOARD_DIR = Path.home() / ".openclaw" / "workspace" / "lumi-dashboard"
STATUS_FILE = DASHBOARD_DIR / "status.json"

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

class LumiDashboardHandler(SimpleHTTPRequestHandler):
    """Custom HTTP handler with API endpoints"""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(WORKSPACE / "lumi-dashboard"), **kwargs)

    def do_GET(self):
        if self.path == "/api/status":
            self.send_json_response({
                "timestamp": datetime.now().isoformat(),
                **get_status()
            })
        else:
            super().do_GET()

    def send_json_response(self, data):
        """Send JSON response"""
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        self.wfile.write(json.dumps(data, indent=2).encode())

    def log_message(self, format, *args):
        """Suppress default logging"""
        pass

def main():
    """Start the dashboard server"""
    port = 3001
    server = HTTPServer(("0.0.0.0", port), LumiDashboardHandler)

    print(f"🦞 Lumi Dashboard running on http://0.0.0.0:{port}")
    print(f"📊 API endpoint: http://0.0.0.0:{port}/api/status")
    print(f"📁 Serving from: {WORKSPACE / 'lumi-dashboard'}")

    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n🦞 Dashboard stopped")

if __name__ == "__main__":
    main()
