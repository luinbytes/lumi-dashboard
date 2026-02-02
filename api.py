#!/usr/bin/env python3
"""
Lumi Dashboard API
Dynamic behavior flow chart generator - scans workspace files and extracts behavioral rules.
"""

from flask import Flask, jsonify, send_from_directory
import re
import os
from pathlib import Path
from typing import List, Dict, Any
import json

app = Flask(__name__, static_folder='.', static_url_path='')

WORKSPACE = Path('/home/ubuntu/.openclaw/workspace')


class RuleExtractor:
    """Extract behavioral rules from markdown files."""

    def __init__(self, workspace: Path):
        self.workspace = workspace
        self.rules = []
        self.mode_rules = []
        self.time_rules = []
        self.critical_rules = []
        self.permission_rules = []
        self.workflows = []

    def scan_files(self) -> List[Path]:
        """Scan all .md files in workspace root."""
        return list(self.workspace.glob('*.md'))

    def extract_time_based_rules(self, content: str, filename: str) -> List[Dict]:
        """Extract time-based rules (e.g., '10:00-23:00 GMT')."""
        rules = []
        patterns = [
            r'(\d{1,2}:\d{2})\s*-\s*(\d{1,2}:\d{2})\s*(?:GMT|UTC)?',
            r'(?:daytime|overnight|nighttime).*?(\d{1,2}:\d{2})',
            r'(\d{1,2}:\d{2})\s*(?:GMT|UTC)',
        ]

        for pattern in patterns:
            matches = re.finditer(pattern, content, re.IGNORECASE)
            for match in matches:
                rules.append({
                    'type': 'time_rule',
                    'pattern': match.group(0),
                    'start': match.group(1) if match.lastindex >= 1 else None,
                    'end': match.group(2) if match.lastindex >= 2 else None,
                    'file': filename,
                    'context': self._get_context(content, match.start(), 50)
                })

        return rules

    def extract_mode_switches(self, content: str, filename: str) -> List[Dict]:
        """Extract mode switches (e.g., 'daytime mode', 'overnight mode')."""
        rules = []
        patterns = [
            r'(?:mode|switch|check):?\s*(daytime|overnight|nighttime)',
            r'(?:if|when|while)\s+.*?(\d{1,2}:\d{2})',
            r'(?:check|determine|decide)\s+mode',
        ]

        for pattern in patterns:
            matches = re.finditer(pattern, content, re.IGNORECASE)
            for match in matches:
                rules.append({
                    'type': 'mode_switch',
                    'pattern': match.group(0),
                    'mode': match.group(1) if (match.lastindex is not None and match.lastindex >= 1) else None,
                    'file': filename,
                    'context': self._get_context(content, match.start(), 50)
                })

        return rules

    def extract_conditional_workflows(self, content: str, filename: str) -> List[Dict]:
        """Extract conditional workflows (if/then structures)."""
        rules = []
        patterns = [
            r'if\s+(.*?):?\s*then\s+(.*?)(?:\.|$|\n)',
            r'when\s+(.*?):?\s*(?:do|then|use)\s+(.*?)(?:\.|$|\n)',
            r'(?:respond|reply|send)\s+.*?(?:when|if|unless)\s+(.*?)(?:\.|$|\n)',
            r'(?:only|never|always)\s+(?:when|if|unless)\s+(.*?)(?:\.|$|\n)',
        ]

        for pattern in patterns:
            matches = re.finditer(pattern, content, re.IGNORECASE | re.DOTALL)
            for match in matches:
                condition = match.group(1).strip() if match.lastindex >= 1 else None
                action = match.group(2).strip() if match.lastindex >= 2 else None

                rules.append({
                    'type': 'conditional_workflow',
                    'condition': condition,
                    'action': action,
                    'file': filename,
                    'context': self._get_context(content, match.start(), 80)
                })

        return rules

    def extract_critical_rules(self, content: str, filename: str) -> List[Dict]:
        """Extract critical rules (NEVER, CRITICAL, MUST)."""
        rules = []
        patterns = [
            r'(?:CRITICAL|IMPORTANT|MUST|NEVER|ALWAYS).*?:?\s*(.*?)(?:\.|$|\n)',
            r'⚠️.*?:?\s*(.*?)(?:\.|$|\n)',
            r'NEVER\s+(.*?)(?:\.|$|\n)',
            r'ALWAYS\s+(.*?)(?:\.|$|\n)',
        ]

        for pattern in patterns:
            matches = re.finditer(pattern, content, re.IGNORECASE | re.DOTALL)
            for match in matches:
                rule_text = match.group(1).strip() if match.lastindex >= 1 else match.group(0)

                rules.append({
                    'type': 'critical_rule',
                    'rule': rule_text,
                    'file': filename,
                    'context': self._get_context(content, match.start(), 80)
                })

        return rules

    def extract_permission_gates(self, content: str, filename: str) -> List[Dict]:
        """Extract permission gates (Ask First, requires approval)."""
        rules = []
        patterns = [
            r'(?:ask|request|check)\s+first.*?:?\s*(.*?)(?:\.|$|\n)',
            r'(?:requires|needs)\s+approval.*?:?\s*(.*?)(?:\.|$|\n)',
            r'(?:before|when)\s+(?:doing|sending|posting)\s+.*?:?\s*(.*?)(?:\.|$|\n)',
        ]

        for pattern in patterns:
            matches = re.finditer(pattern, content, re.IGNORECASE | re.DOTALL)
            for match in matches:
                rule_text = match.group(1).strip() if match.lastindex >= 1 else match.group(0)

                rules.append({
                    'type': 'permission_gate',
                    'rule': rule_text,
                    'file': filename,
                    'context': self._get_context(content, match.start(), 80)
                })

        return rules

    def _get_context(self, content: str, position: int, chars: int) -> str:
        """Get context around a match."""
        start = max(0, position - chars)
        end = min(len(content), position + chars)
        return content[start:end].strip()

    def process_file(self, filepath: Path) -> Dict[str, Any]:
        """Process a single markdown file and extract all rules."""
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
        except Exception as e:
            return {'file': str(filepath), 'error': str(e)}

        filename = filepath.name

        results = {
            'file': filename,
            'time_rules': self.extract_time_based_rules(content, filename),
            'mode_switches': self.extract_mode_switches(content, filename),
            'conditional_workflows': self.extract_conditional_workflows(content, filename),
            'critical_rules': self.extract_critical_rules(content, filename),
            'permission_gates': self.extract_permission_gates(content, filename),
        }

        # Aggregate all rules
        self.time_rules.extend(results['time_rules'])
        self.mode_rules.extend(results['mode_switches'])
        self.workflows.extend(results['conditional_workflows'])
        self.critical_rules.extend(results['critical_rules'])
        self.permission_rules.extend(results['permission_gates'])

        return results

    def extract_all(self) -> List[Dict]:
        """Extract rules from all workspace .md files."""
        files = self.scan_files()
        results = []

        for filepath in files:
            result = self.process_file(filepath)
            results.append(result)

        return results

    def generate_mermaid_flowchart(self) -> str:
        """Generate Mermaid flow chart from extracted rules."""
        lines = ['graph TD', '']

        # Start node
        lines.append('    Start([Start Heartbeat]) --> CheckTime["Check Current Time"]')

        # Time-based decision nodes
        if self.time_rules:
            lines.append('')
            lines.append('    %% Time-based rules')
            for i, rule in enumerate(self.time_rules[:3]):  # Limit to first 3 for readability
                lines.append(f'    CheckTime -->|{rule["pattern"]}| TimeRule{i}[{rule["file"]}]')

        # Mode switch nodes
        if self.mode_rules:
            lines.append('')
            lines.append('    %% Mode switches')
            lines.append('    CheckTime --> DaytimeCheck{Time in 10:00-23:00?}')
            lines.append('    DaytimeCheck -->|Yes| DaytimeMode["Daytime Mode"]')
            lines.append('    DaytimeCheck -->|No| OvernightMode["Overnight Mode"]')

        # Critical rules
        if self.critical_rules:
            lines.append('')
            lines.append('    %% Critical rules')
            for i, rule in enumerate(self.critical_rules[:5]):
                lines.append(f'    Critical{i}["{rule["rule"][:50]}..."]')
                lines.append(f'    Critical{i}:::critical')

        # Permission gates
        if self.permission_rules:
            lines.append('')
            lines.append('    %% Permission gates')
            for i, rule in enumerate(self.permission_rules[:3]):
                lines.append(f'    Gate{i}["Ask first: {rule["rule"][:40]}..."]')
                lines.append(f'    Gate{i}:::permission')

        # Styling
        lines.append('')
        lines.append('    classDef critical fill:#f66,stroke:#333,stroke-width:2px,color:#fff')
        lines.append('    classDef permission fill:#fc6,stroke:#333,stroke-width:2px,color:#000')

        return '\n'.join(lines)


@app.route('/')
def index():
    """Serve the main dashboard."""
    return send_from_directory('.', 'index.html')


@app.route('/api/flowchart')
def get_flowchart():
    """API endpoint to get flow chart and rules."""
    extractor = RuleExtractor(WORKSPACE)
    results = extractor.extract_all()
    mermaid = extractor.generate_mermaid_flowchart()

    return jsonify({
        'mermaid': mermaid,
        'files_scanned': len(results),
        'summary': {
            'time_rules': len(extractor.time_rules),
            'mode_switches': len(extractor.mode_rules),
            'conditional_workflows': len(extractor.workflows),
            'critical_rules': len(extractor.critical_rules),
            'permission_gates': len(extractor.permission_rules),
        },
        'time_rules': extractor.time_rules[:10],  # Limit for performance
        'mode_switches': extractor.mode_rules[:10],
        'conditional_workflows': extractor.workflows[:10],
        'critical_rules': extractor.critical_rules[:10],
        'permission_gates': extractor.permission_rules[:10],
    })


@app.route('/api/stats')
def get_stats():
    """Get quick stats about the dashboard."""
    extractor = RuleExtractor(WORKSPACE)
    files = extractor.scan_files()

    return jsonify({
        'files_in_workspace': len(files),
        'workspace_path': str(WORKSPACE),
        'status': 'online',
    })


if __name__ == '__main__':
    print(f"🦞 Lumi Dashboard API starting...")
    print(f"📂 Workspace: {WORKSPACE}")
    app.run(host='0.0.0.0', port=5000, debug=False)
