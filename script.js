// ===== CLAWDBOT DASHBOARD SCRIPT =====

class ClawdbotDashboard {
    constructor() {
        this.startTime = new Date();
        this.currentExpression = 'idle';
        this.stats = {
            sessions: 42,
            activity: 156,
            commands: 89
        };
        this.init();
    }

    init() {
        this.setupExpressionControls();
        this.startUptimeCounter();
        this.startActivitySimulation();
        this.updateStats();
        this.startRandomExpressionChanges();
        this.logActivity('Dashboard loaded successfully', 'info');
    }

    // ===== EXPRESSION CONTROLS =====
    setupExpressionControls() {
        const buttons = document.querySelectorAll('.btn[data-expression]');
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                const expression = button.getAttribute('data-expression');
                this.setExpression(expression);
            });
        });
    }

    setExpression(expression) {
        const faceContainer = document.getElementById('faceContainer');
        const statusLabel = document.getElementById('statusLabel');
        const statusText = document.getElementById('statusText');
        const statusIndicator = document.getElementById('statusIndicator');

        // Remove all expression classes
        faceContainer.classList.remove('happy', 'thinking', 'working', 'error', 'idle');

        // Add new expression class
        faceContainer.classList.add(expression);
        this.currentExpression = expression;

        // Update status label
        const labels = {
            idle: 'IDLE',
            happy: 'HAPPY',
            thinking: 'THINKING',
            working: 'WORKING',
            error: 'ERROR'
        };
        statusLabel.textContent = labels[expression];

        // Update status text and indicator
        const statusMessages = {
            idle: { text: 'System Online - Waiting for commands', color: '#00ff88' },
            happy: { text: 'Everything is awesome! 🎉', color: '#00ff88' },
            thinking: { text: 'Processing request...', color: '#3498db' },
            working: { text: 'Executing tasks...', color: '#f39c12' },
            error: { text: 'Something went wrong!', color: '#ff4757' }
        };

        const status = statusMessages[expression];
        statusText.textContent = status.text;
        statusIndicator.style.background = status.color;
        statusIndicator.style.boxShadow = `0 0 10px ${status.color}`;

        // Log the expression change
        this.logActivity(`Expression changed to: ${expression.toUpperCase()}`, 'info');
    }

    // ===== UPTIME COUNTER =====
    startUptimeCounter() {
        const uptimeElement = document.getElementById('uptime');

        setInterval(() => {
            const now = new Date();
            const diff = now - this.startTime;

            const hours = Math.floor(diff / 3600000);
            const minutes = Math.floor((diff % 3600000) / 60000);
            const seconds = Math.floor((diff % 60000) / 1000);

            uptimeElement.textContent = this.formatTime(hours, minutes, seconds);
        }, 1000);
    }

    formatTime(hours, minutes, seconds) {
        return [
            hours.toString().padStart(2, '0'),
            minutes.toString().padStart(2, '0'),
            seconds.toString().padStart(2, '0')
        ].join(':');
    }

    // ===== STATS UPDATES =====
    updateStats() {
        document.getElementById('sessions').textContent = this.stats.sessions;
        document.getElementById('activity').textContent = this.stats.activity;
        document.getElementById('commands').textContent = this.stats.commands;

        // Simulate stats updates
        setInterval(() => {
            this.stats.activity += Math.floor(Math.random() * 3);
            document.getElementById('activity').textContent = this.stats.activity;
        }, 5000);
    }

    // ===== ACTIVITY LOG =====
    logActivity(message, type = 'info') {
        const activityLog = document.getElementById('activityLog');
        const now = new Date();
        const time = this.formatTime(
            now.getHours(),
            now.getMinutes(),
            now.getSeconds()
        );

        const activityItem = document.createElement('div');
        activityItem.className = 'activity-item';
        activityItem.innerHTML = `
            <span class="activity-time">${time}</span>
            <span class="activity-message">${message}</span>
        `;

        // Add to top of log
        activityLog.insertBefore(activityItem, activityLog.firstChild);

        // Keep only last 10 items
        while (activityLog.children.length > 10) {
            activityLog.removeChild(activityLog.lastChild);
        }
    }

    // ===== ACTIVITY SIMULATION =====
    startActivitySimulation() {
        const activities = [
            'Received new command',
            'Processing webhook',
            'Updating database',
            'Sending notification',
            'Running scheduled task',
            'Checking system health',
            'Syncing with remote',
            'Executing script',
            'Parsing user input',
            'Generating response'
        ];

        setInterval(() => {
            const randomActivity = activities[Math.floor(Math.random() * activities.length)];
            this.logActivity(randomActivity, 'activity');
        }, 8000);
    }

    // ===== RANDOM EXPRESSION CHANGES =====
    startRandomExpressionChanges() {
        setInterval(() => {
            // Only change randomly if current expression is idle
            if (this.currentExpression === 'idle') {
                const expressions = ['happy', 'thinking'];
                const randomExpression = expressions[Math.floor(Math.random() * expressions.length)];

                this.setExpression(randomExpression);

                // Return to idle after a short delay
                setTimeout(() => {
                    this.setExpression('idle');
                }, 3000);
            }
        }, 15000);
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.dashboard = new ClawdbotDashboard();
});
