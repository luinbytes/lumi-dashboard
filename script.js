// ===== LUMI BEHAVIOR FLOW DASHBOARD =====

class BehaviorFlowDashboard {
    constructor() {
        this.behaviorRules = null;
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupBehaviorFlow();
        this.loadStats();
        this.loadBehaviorFlow();
    }

    // ===== NAVIGATION =====
    setupNavigation() {
        const navBtns = document.querySelectorAll('.nav-btn');
        const views = {
            dashboard: document.getElementById('dashboardView'),
            flow: document.getElementById('flowView'),
        };

        navBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const viewName = btn.getAttribute('data-view');

                navBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                Object.entries(views).forEach(([name, view]) => {
                    if (view) {
                        if (name === viewName) {
                            view.classList.remove('hidden');
                        } else {
                            view.classList.add('hidden');
                        }
                    }
                });

                if (viewName === 'flow') {
                    this.loadBehaviorFlow();
                }
            });
        });

        // Action buttons
        document.getElementById('refreshFlowBtn')?.addEventListener('click', () => {
            this.loadBehaviorFlow();
        });

        document.getElementById('loadAdminBtn')?.addEventListener('click', () => {
            window.location.href = '/admin.html';
        });

        document.getElementById('refreshFlow2')?.addEventListener('click', () => {
            this.loadBehaviorFlow();
        });
    }

    // ===== BEHAVIOR FLOW =====
    setupBehaviorFlow() {
        const tabBtns = document.querySelectorAll('.tab-btn');
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const tab = btn.getAttribute('data-tab');

                tabBtns.forEach(b => {
                    b.classList.remove('active');
                    b.setAttribute('aria-selected', 'false');
                });
                btn.classList.add('active');
                btn.setAttribute('aria-selected', 'true');

                this.filterRules(tab);
            });
        });

        if (typeof mermaid !== 'undefined') {
            mermaid.initialize({
                startOnLoad: false,
                theme: 'dark',
                securityLevel: 'loose',
            });
        }
    }

    async loadStats() {
        try {
            const response = await fetch('/api/stats');
            const data = await response.json();

            document.getElementById('filesCount').textContent = data.files_in_workspace || '-';
        } catch (error) {
            console.error('Failed to load stats:', error);
        }
    }

    async loadBehaviorFlow() {
        try {
            const response = await fetch('/api/flowchart');
            const data = await response.json();

            this.updateFlowStats(data.summary);
            this.renderMermaidChart(data.mermaid);

            this.behaviorRules = data;
            this.filterRules('time');

            console.log('✅ Behavior flow loaded successfully');
        } catch (error) {
            console.error('Failed to load behavior flow:', error);
            document.getElementById('mermaidChart').innerHTML =
                '<p class="error">Failed to load flow chart</p>';
        }
    }

    updateFlowStats(summary) {
        document.getElementById('timeRulesCount').textContent = summary.time_rules || 0;
        document.getElementById('modeSwitchesCount').textContent = summary.mode_switches || 0;
        document.getElementById('criticalRulesCount').textContent = summary.critical_rules || 0;
        document.getElementById('workflowsCount').textContent = summary.conditional_workflows || 0;
        document.getElementById('permissionGatesCount').textContent = summary.permission_gates || 0;
    }

    async renderMermaidChart(mermaidCode) {
        const chartDiv = document.getElementById('mermaidChart');

        if (!chartDiv) return;

        chartDiv.textContent = mermaidCode;

        try {
            await mermaid.run({
                nodes: [chartDiv]
            });
        } catch (error) {
            console.error('Mermaid render error:', error);
            chartDiv.innerHTML = '<p class="error">Failed to render flow chart</p>';
        }
    }

    filterRules(tabType) {
        if (!this.behaviorRules) return;

        const rulesContent = document.getElementById('rulesContent');
        if (!rulesContent) return;

        let rules = [];
        let title = '';

        switch (tabType) {
            case 'time':
                rules = this.behaviorRules.time_rules || [];
                title = 'Time Rules';
                break;
            case 'mode':
                rules = this.behaviorRules.mode_switches || [];
                title = 'Mode Switches';
                break;
            case 'workflow':
                rules = this.behaviorRules.conditional_workflows || [];
                title = 'Conditional Workflows';
                break;
            case 'critical':
                rules = this.behaviorRules.critical_rules || [];
                title = 'Critical Rules';
                break;
            case 'permission':
                rules = this.behaviorRules.permission_gates || [];
                title = 'Permission Gates';
                break;
        }

        if (rules.length === 0) {
            rulesContent.innerHTML = `<p class="no-rules">No ${title.toLowerCase()} found.</p>`;
            return;
        }

        rulesContent.innerHTML = `
            <h4 class="rules-section-title">${title}</h4>
            <div class="rules-grid">
                ${rules.map(rule => this.renderRuleCard(rule)).join('')}
            </div>
        `;
    }

    renderRuleCard(rule) {
        const context = rule.context || rule.rule || rule.pattern || '';
        const file = rule.file || 'Unknown';

        return `
            <div class="rule-card">
                <div class="rule-file">📄 ${file}</div>
                <div class="rule-context">${this.escapeHtml(context)}</div>
            </div>
        `;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    new BehaviorFlowDashboard();
});
