// ===== CLAWDBOT DASHBOARD SCRIPT v2.0 =====

class ClawdbotDashboard {
    constructor() {
        this.startTime = new Date();
        this.currentExpression = 'idle';
        this.animationSpeed = 1.0;
        this.soundEnabled = false;
        this.stats = {
            sessions: 42,
            activity: 156,
            commands: 89,
            uptime: 0,
            errors: 3,
            responses: 245
        };
        this.expressions = ['idle', 'happy', 'thinking', 'working', 'error', 'excited', 'confused', 'sleeping'];
        this.currentExpressionIndex = 0;
        this.activityLogData = []; // Store all activity for export
        this.commandHistory = [];
        this.historyIndex = -1;
        this.init();
    }

    init() {
        this.setupExpressionControls();
        this.setupKeyboardNavigation();
        this.setupThemeToggle();
        this.setupExportButtons();
        this.setupCommandInput();
        this.setupSoundToggle();
        this.setupSpeedControls();
        this.loadSavedTheme();
        this.loadSavedSettings();
        this.startUptimeCounter();
        this.startActivitySimulation();
        this.updateStats();
        this.startRandomExpressionChanges();
        this.logActivity('Dashboard v2.0 loaded successfully', 'info');
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

    // ===== KEYBOARD NAVIGATION =====
    setupKeyboardNavigation() {
        const faceContainer = document.getElementById('faceContainer');
        const commandInput = document.getElementById('commandInput');

        // Face navigation
        faceContainer.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'ArrowRight':
                    e.preventDefault();
                    this.nextExpression();
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    this.previousExpression();
                    break;
                case 'Enter':
                case ' ':
                    e.preventDefault();
                    this.setExpression(this.expressions[this.currentExpressionIndex]);
                    break;
            }
        });

        // Command input navigation
        commandInput.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowUp') {
                e.preventDefault();
                this.navigateHistory(-1);
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                this.navigateHistory(1);
            }
        });
    }

    navigateHistory(direction) {
        const commandInput = document.getElementById('commandInput');
        
        if (direction === -1) {
            this.historyIndex = Math.min(this.historyIndex + 1, this.commandHistory.length - 1);
        } else if (direction === 1) {
            this.historyIndex = Math.max(this.historyIndex - 1, -1);
        }

        if (this.historyIndex >= 0 && this.historyIndex < this.commandHistory.length) {
            commandInput.value = this.commandHistory[this.commandHistory.length - 1 - this.historyIndex];
        } else {
            commandInput.value = '';
        }
    }

    // ===== EXPORT BUTTONS =====
    setupExportButtons() {
        document.getElementById('exportJSON').addEventListener('click', () => {
            this.exportToJSON();
        });

        document.getElementById('exportCSV').addEventListener('click', () => {
            this.exportToCSV();
        });

        document.getElementById('exportPNG')?.addEventListener('click', () => {
            this.exportToPNG();
        });

        document.getElementById('clearLog')?.addEventListener('click', () => {
            this.clearActivityLog();
        });
    }

    // ===== COMMAND INPUT =====
    setupCommandInput() {
        const commandInput = document.getElementById('commandInput');
        const sendButton = document.getElementById('sendCommand');

        const sendCommand = () => {
            const command = commandInput.value.trim();
            if (command) {
                this.sendCommand(command);
                commandInput.value = '';
                this.commandHistory.push(command);
                this.historyIndex = -1;
                
                // Limit history to 50 commands
                if (this.commandHistory.length > 50) {
                    this.commandHistory.shift();
                }
            }
        };

        sendButton.addEventListener('click', sendCommand);
        commandInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                sendCommand();
            }
        });
    }

    sendCommand(command) {
        // Simulate command processing
        this.logActivity(`Command sent: ${command}`, 'command');
        this.stats.commands++;
        this.updateStats();

        // Set expression based on command
        if (command.toLowerCase().includes('error') || command.toLowerCase().includes('fail')) {
            this.setExpression('error');
        } else if (command.toLowerCase().includes('help')) {
            this.setExpression('thinking');
            setTimeout(() => {
                this.logActivity('Help: Available commands - status, uptime, stats, clear, sleep', 'info');
            }, 1000);
        } else if (command.toLowerCase().includes('status')) {
            this.setExpression('happy');
        } else if (command.toLowerCase().includes('sleep')) {
            this.setExpression('sleeping');
            setTimeout(() => this.setExpression('idle'), 3000);
        } else if (command.toLowerCase().includes('dance') || command.toLowerCase().includes('party')) {
            this.setExpression('excited');
        } else if (command.toLowerCase().includes('hmm') || command.toLowerCase().includes('??')) {
            this.setExpression('confused');
        } else {
            this.setExpression('working');
            setTimeout(() => {
                this.setExpression('happy');
                this.logActivity(`Response to: ${command}`, 'response');
            }, 1000 + Math.random() * 1000);
        }

        // Play sound if enabled
        if (this.soundEnabled) {
            this.playSound('command');
        }
    }

    // ===== SOUND TOGGLE =====
    setupSoundToggle() {
        const soundToggle = document.getElementById('soundToggle');
        if (!soundToggle) return;

        soundToggle.addEventListener('click', () => {
            this.toggleSound();
        });

        soundToggle.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.toggleSound();
            }
        });

        // Update toggle button appearance
        this.updateSoundToggleUI();
    }

    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        localStorage.setItem('clawdbot-sound', this.soundEnabled ? 'enabled' : 'disabled');
        this.logActivity(`Sound ${this.soundEnabled ? 'enabled' : 'disabled'}`, 'info');
        this.updateSoundToggleUI();
    }

    updateSoundToggleUI() {
        const soundToggle = document.getElementById('soundToggle');
        if (!soundToggle) return;

        soundToggle.textContent = this.soundEnabled ? '🔊' : '🔇';
        soundToggle.setAttribute('aria-label', `Sound ${this.soundEnabled ? 'enabled' : 'disabled'}`);
    }

    playSound(type) {
        // Create simple beep using Web Audio API
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.value = type === 'command' ? 440 : (type === 'error' ? 220 : 523);
            oscillator.type = 'sine';
            gainNode.gain.value = 0.1;

            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.1);
        } catch (e) {
            console.error('Audio API not available:', e);
        }
    }

    // ===== SPEED CONTROLS =====
    setupSpeedControls() {
        const speedUp = document.getElementById('speedUp');
        const speedDown = document.getElementById('speedDown');
        const speedDisplay = document.getElementById('speedDisplay');

        if (!speedUp || !speedDown) return;

        speedUp.addEventListener('click', () => {
            this.animationSpeed = Math.min(this.animationSpeed + 0.25, 3.0);
            this.updateSpeedDisplay();
        });

        speedDown.addEventListener('click', () => {
            this.animationSpeed = Math.max(this.animationSpeed - 0.25, 0.25);
            this.updateSpeedDisplay();
        });
    }

    updateSpeedDisplay() {
        const speedDisplay = document.getElementById('speedDisplay');
        if (speedDisplay) {
            speedDisplay.textContent = `${(this.animationSpeed * 100).toFixed(0)}%`;
            // Update CSS variable for animation speed
            document.documentElement.style.setProperty('--anim-speed', (1 / this.animationSpeed).toString());
        }
        localStorage.setItem('clawdbot-speed', this.animationSpeed.toString());
    }

    // ===== THEME TOGGLE =====
    setupThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        themeToggle.addEventListener('click', () => {
            this.toggleTheme();
        });

        themeToggle.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.toggleTheme();
            }
        });
    }

    toggleTheme() {
        const body = document.body;
        const themeIcon = document.querySelector('.theme-icon');

        body.classList.toggle('light-mode');

        const isLightMode = body.classList.contains('light-mode');
        themeIcon.textContent = isLightMode ? '☀️' : '🌙';

        localStorage.setItem('clawdbot-theme', isLightMode ? 'light' : 'dark');
        this.logActivity(`Theme changed to ${isLightMode ? 'light' : 'dark'} mode`, 'info');
    }

    loadSavedTheme() {
        const savedTheme = localStorage.getItem('clawdbot-theme');
        const themeIcon = document.querySelector('.theme-icon');

        if (savedTheme === 'light') {
            document.body.classList.add('light-mode');
            themeIcon.textContent = '☀️';
        }
    }

    loadSavedSettings() {
        // Load sound setting
        const savedSound = localStorage.getItem('clawdbot-sound');
        if (savedSound === 'enabled') {
            this.soundEnabled = true;
        }

        // Load animation speed
        const savedSpeed = localStorage.getItem('clawdbot-speed');
        if (savedSpeed) {
            this.animationSpeed = parseFloat(savedSpeed);
            this.updateSpeedDisplay();
        }

        this.updateSoundToggleUI();
    }

    setExpression(expression) {
        const faceContainer = document.getElementById('faceContainer');
        const statusLabel = document.getElementById('statusLabel');
        const statusText = document.getElementById('statusText');
        const statusIndicator = document.getElementById('statusIndicator');

        // Remove all expression classes
        faceContainer.classList.remove('happy', 'thinking', 'working', 'error', 'idle', 'excited', 'confused', 'sleeping');

        // Add new expression class
        faceContainer.classList.add(expression);
        this.currentExpression = expression;

        // Update expression index for keyboard navigation
        this.currentExpressionIndex = this.expressions.indexOf(expression);

        // Update status label
        const labels = {
            idle: 'IDLE',
            happy: 'HAPPY',
            thinking: 'THINKING',
            working: 'WORKING',
            error: 'ERROR',
            excited: 'EXCITED',
            confused: 'CONFUSED',
            sleeping: 'SLEEPING'
        };
        statusLabel.textContent = labels[expression] || 'IDLE';

        // Update status text and indicator
        const statusMessages = {
            idle: { text: 'System Online - Waiting for commands', color: '#00ff88' },
            happy: { text: 'Everything is awesome! 🎉', color: '#00ff88' },
            thinking: { text: 'Processing request...', color: '#3498db' },
            working: { text: 'Executing tasks...', color: '#f39c12' },
            error: { text: 'Something went wrong!', color: '#ff4757' },
            excited: { text: 'Party time! 🎉', color: '#ff69b4' },
            confused: { text: 'Hm, let me think...', color: '#9b59b6' },
            sleeping: { text: 'Zzz... taking a nap', color: '#95a5a6' }
        };

        const status = statusMessages[expression] || statusMessages.idle;
        statusText.textContent = status.text;
        statusIndicator.style.background = status.color;
        statusIndicator.style.boxShadow = `0 0 10px ${status.color}`;

        // Log expression change
        this.logActivity(`Expression changed to: ${expression.toUpperCase()}`, 'info');

        // Play sound if enabled
        if (this.soundEnabled) {
            this.playSound('expression');
        }
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

            this.stats.uptime = diff;
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
        
        // Update additional stats if elements exist
        const errorsElement = document.getElementById('errors');
        const responsesElement = document.getElementById('responses');
        if (errorsElement) errorsElement.textContent = this.stats.errors;
        if (responsesElement) responsesElement.textContent = this.stats.responses;

        // Simulate stats updates
        setInterval(() => {
            this.stats.activity += Math.floor(Math.random() * 3);
            if (document.getElementById('activity')) {
                document.getElementById('activity').textContent = this.stats.activity;
            }
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
        activityItem.className = `activity-item type-${type}`;
        activityItem.innerHTML = `
            <span class="activity-time">${time}</span>
            <span class="activity-message">${message}</span>
            <span class="activity-type">${type}</span>
        `;

        // Add to top of log
        activityLog.insertBefore(activityItem, activityLog.firstChild);

        // Store in data array for export
        this.activityLogData.unshift({
            time: now.toISOString(),
            message: message,
            type: type
        });

        // Limit log to 20 items in display
        while (activityLog.children.length > 20) {
            activityLog.removeChild(activityLog.lastChild);
        }
    }

    clearActivityLog() {
        const activityLog = document.getElementById('activityLog');
        activityLog.innerHTML = '';
        this.activityLogData = [];
        this.logActivity('Activity log cleared', 'info');
    }

    // ===== EXPORT FUNCTIONS =====
    exportToJSON() {
        const data = {
            stats: this.stats,
            uptime: new Date().toISOString(),
            expressions: this.expressions,
            activityLog: this.activityLogData,
            commandHistory: this.commandHistory
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        this.downloadFile(blob, 'clawdbot-dashboard.json');
        this.logActivity('Exported to JSON', 'info');
    }

    exportToCSV() {
        const csvHeaders = 'Time,Message,Type\n';
        const csvData = this.activityLogData.map(item => 
            `${item.time},"${item.message}",${item.type}`
        ).join('\n');

        const blob = new Blob([csvHeaders + csvData], { type: 'text/csv' });
        this.downloadFile(blob, 'clawdbot-activity.csv');
        this.logActivity('Exported to CSV', 'info');
    }

    exportToPNG() {
        // Use html2canvas if available, otherwise create simple download
        const dashboard = document.querySelector('.container');
        
        // Try to use html2canvas library
        if (typeof html2canvas !== 'undefined') {
            html2canvas(dashboard).then(canvas => {
                canvas.toBlob(blob => {
                    this.downloadFile(blob, 'clawdbot-screenshot.png');
                });
            });
        } else {
            this.logActivity('html2canvas library required for PNG export', 'warning');
            alert('PNG export requires html2canvas library');
        }
    }

    downloadFile(blob, filename) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // ===== EXPRESSION CYCLING =====
    nextExpression() {
        this.currentExpressionIndex = (this.currentExpressionIndex + 1) % this.expressions.length;
        this.logActivity(`Previewing: ${this.expressions[this.currentExpressionIndex].toUpperCase()}`, 'info');
    }

    previousExpression() {
        this.currentExpressionIndex = (this.currentExpressionIndex - 1 + this.expressions.length) % this.expressions.length;
        this.logActivity(`Previewing: ${this.expressions[this.currentExpressionIndex].toUpperCase()}`, 'info');
    }

    // ===== RANDOM EXPRESSION CHANGES =====
    startRandomExpressionChanges() {
        setInterval(() => {
            if (this.currentExpression === 'idle') {
                const randomExpressions = ['happy', 'thinking', 'confused'];
                const randomExpr = randomExpressions[Math.floor(Math.random() * randomExpressions.length)];
                this.setExpression(randomExpr);
                
                // Reset to idle after 3 seconds
                setTimeout(() => {
                    if (this.currentExpression === randomExpr) {
                        this.setExpression('idle');
                    }
                }, 3000);
            }
        }, 15000);
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.dashboard = new ClawdbotDashboard();
});
