#!/usr/bin/env python3
"""
Lumi Dashboard Server
Serves the Lumi Dashboard with real-time OpenClaw integration
"""

import json
import os
import re
import subprocess
from datetime import datetime, timedelta
from http.server import HTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
from urllib.parse import parse_qs

# Paths
WORKSPACE = Path.home() / ".openclaw" / "workspace"
STATUS_FILE = WORKSPACE / "OVERNIGHT_STATUS.md"
HEARTBEAT_FILE = WORKSPACE / "OVERNIGHT_HEARTBEAT.md"
MEMORY_DIR = WORKSPACE / "memory"

def parse_status_file():
    """Parse OVERNIGHT_STATUS.md to extract current status"""
    if not STATUS_FILE.exists():
        return {"active": False, "current_task": None, "queue_position": "N/A"}

    content = STATUS_FILE.read_text()

    # Extract current state
    active = "**active:** true" in content
    current_task = "N/A"
    queue_position = "N/A"

    # Parse current task
    task_match = re.search(r'\*\*current_task:\*\*\s+(\d+/\d+)\s+-\s+(.+)', content)
    if task_match:
        queue_position = task_match.group(1)
        current_task = task_match.group(2)

    # Parse session stats
    tasks_completed = re.search(r'tasks_completed:\s*(\d+)', content)
    commits_made = re.search(r'commits_made:\s*(\d+)', content)
    prs_created = re.search(r'prs_created:\s*(\d+)', content)

    return {
        "active": active,
        "current_task": current_task,
        "queue_position": queue_position,
        "tasks_completed": int(tasks_completed.group(1)) if tasks_completed else 0,
        "commits_made": int(commits_made.group(1)) if commits_made else 0,
        "prs_created": int(prs_created.group(1)) if prs_created else 0,
    }

def calculate_uptime():
    """Calculate session uptime based on heartbeat"""
    if not HEARTBEAT_FILE.exists():
        return 0

    try:
        heartbeat_ms = int(HEARTBEAT_FILE.read_text().strip())
        heartbeat_time = datetime.fromtimestamp(heartbeat_ms / 1000)
        uptime = datetime.now() - heartbeat_time
        return int(uptime.total_seconds())
    except:
        return 0

def count_activity():
    """Count activity entries from memory files"""
    if not MEMORY_DIR.exists():
        return 0

    count = 0
    for memory_file in MEMORY_DIR.glob("*.md"):
        content = memory_file.read_text()
        # Count subsections as activity markers
        count += len(re.findall(r'^##+', content, re.MULTILINE))

    return count

def get_github_stats():
    """Get GitHub stats via gh CLI"""
    try:
        # Get open PRs
        prs_result = subprocess.run(
            ["gh", "repo", "list", "--limit", "50", "--json", "pullRequests"],
            capture_output=True,
            text=True,
            timeout=10
        )

        if prs_result.returncode == 0:
            repos = json.loads(prs_result.stdout)
            open_prs = sum(repo.get("pullRequests", {}).get("totalCount", 0) for repo in repos)

            return {
                "open_prs": open_prs,
                "repos_tracked": len(repos)
            }
    except:
        pass

    return {"open_prs": 0, "repos_tracked": 0}

class LumiDashboardHandler(SimpleHTTPRequestHandler):
    """Custom HTTP handler with API endpoints"""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(WORKSPACE / "lumi-dashboard"), **kwargs)

    def do_GET(self):
        if self.path == "/api/status":
            self.send_json_response({
                "timestamp": datetime.now().isoformat(),
                "status": parse_status_file(),
                "uptime_seconds": calculate_uptime(),
                "activity_count": count_activity(),
                "github": get_github_stats()
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
    port = 3000
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
