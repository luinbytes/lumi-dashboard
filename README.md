# 🦞 Lumi Webpanel v2.0

A fun, interactive dashboard for Lumi with a space lobster theme! Now v2.0 with command input, sound effects, and more!

## v2.0 New Features ✨

### Command Input 💬
- **Real-time Commands** - Send commands to Lumi
- **Command History** - Navigate history with Arrow Up/Down
- **Auto-responses** - Pre-programmed responses for common commands
- **Smart detection** - Commands like "help", "sleep", "dance" trigger special reactions

### More Expressions 🎭
- **8 total expressions** (up from 5): Idle, Happy, Thinking, Working, Error, **Excited**, **Confused**, **Sleeping**
- **Excited** - Bouncing face with party vibes
- **Confused** - Tilted face with pondering expression
- **Sleeping** - Half-closed eyes, gentle pulsing animation
- **Random idle animations** - More variety when idle

### Sound Effects 🔊
- **Toggle sounds** - Enable/disable sound effects
- **Expression sounds** - Different tones for different states
- **Command sounds** - Audio feedback when sending commands
- **Web Audio API** - No external dependencies needed
- **Persistent setting** - Sound preference saved to localStorage

### Animation Speed Controls ⚡
- **Adjustable speed** - Speed up or slow down animations
- **Range: 25% to 300%** - Find your perfect speed
- **Quick toggles** - Use 🐢 or 🚀 buttons
- **Saved preference** - Speed setting remembered

### Enhanced Statistics 📊
- **6 stat cards** (up from 4): Uptime, Sessions, Activity, Commands, **Errors**, **Responses**
- **Better tracking** - More detailed metrics
- **Real-time updates** - Stats update as you interact

### Improved Export Options 📄
- **JSON export** - Full dashboard state and history
- **CSV export** - Activity log in spreadsheet format
- **PNG export** - Screenshot of dashboard (requires html2canvas)
- **Clear log** - Quick button to wipe activity log
- **More data** - Exports include command history and full stats

### Activity Log Types 🏷️
- **Color-coded entries** - Different colors for different types:
  - **Info** (blue) - General updates
  - **Command** (orange) - User commands sent
  - **Response** (green) - Bot responses
  - **Warning** (yellow) - Important notices
- **Visual distinction** - Easy to scan through logs

### Keyboard Shortcuts ⌨️
- **Command history** - Arrow Up/Down to navigate
- **Sound toggle** - New button in header
- **Expression cycling** - Still works with arrow keys
- **All shortcuts** - Improved and more intuitive

### Better Accessibility ♿
- **ARIA labels** - Added for all new elements
- **Focus management** - Better keyboard navigation flow
- **Screen reader support** - Live regions for dynamic updates
- **Color contrast** - Improved in both themes

## Existing Features (Still Here!)

### Interactive Lobster Face
- Expressions change based on state (idle, happy, thinking, working, error)
- Real-time stats
- Activity log
- Space theme
- Responsive design
- Smooth animations
- Theme toggle (dark/light)
- Full keyboard navigation

## Tech Stack

- **Pure HTML/CSS/JavaScript** - No build tools, no dependencies
- **CSS Animations** - All face expressions and transitions are CSS-based
- **Vanilla JS** - Simple, lightweight, and fast
- **Static Files** - Host anywhere that serves static content
- **html2canvas** - CDN link for PNG export (optional)

## How to Run Locally

### Option 1: Python (Recommended)
```bash
cd lumi-dashboard
python3 -m http.server 8080
```

### Option 2: Node.js
```bash
cd lumi-dashboard
npx serve
```

### Option 3: PHP
```bash
cd lumi-dashboard
php -S localhost:8080
```

## Command Examples

Try these commands in the input field:

### Basic Commands
```
help      - Shows available commands
status    - Shows current status
uptime    - Displays uptime information
```

### Fun Commands
```
sleep     - Puts lobster to sleep (3 seconds)
dance      - Makes lobster dance and get excited
party      - Same as dance - party mode!
hmm        - Makes lobster confused
??         - Same as hmm - confusion
hello      - Friendly greeting
```

### Error Simulation
```
error     - Simulates an error state
fail      - Same as error
```

### Command History
- Press **Arrow Up** to navigate to previous commands
- Press **Arrow Down** to navigate to next command
- History stores **last 50 commands**
- Press **Enter** to send

## Controls

### Face Expressions
Click expression buttons or use keyboard when face is focused:
- **Tab** - Navigate to face
- **Arrow Left/Right** - Cycle through expressions
- **Enter/Space** - Activate selected expression

### Sound Toggle
- **Tab** to the sound toggle button
- **Enter/Space** to toggle sound on/off
- Preference is saved to localStorage

### Animation Speed
- Click **🚀** to increase speed (up to 300%)
- Click **🐢** to decrease speed (down to 25%)
- Setting is saved for future visits

## Export Options

### JSON Export
Exports complete dashboard state:
```json
{
  "stats": { ... },
  "uptime": "2026-01-31T02:00:00.000Z",
  "expressions": ["idle", "happy", ...],
  "activityLog": [ ... ],
  "commandHistory": [ ... ]
}
```

### CSV Export
Exports activity log in spreadsheet format:
```csv
Time,Message,Type
2026-01-31T02:00:00.000Z,"Command sent: help","command"
2026-01-31T02:00:01.000Z,"Response to: help","response"
```

### PNG Export
Captures a screenshot of the current dashboard state. Requires `html2canvas` library (loaded via CDN).

## File Structure

```
lumi-dashboard/
├── index.html    # Main HTML structure (v2.0)
├── styles.css    # All styles and animations
├── script.js     # Interactive logic (v2.0)
└── README.md     # This file
```

## Customization

### Changing Colors
Edit CSS variables in `styles.css`:
```css
:root {
    --primary-orange: #ff6b35;    /* Main lobster color */
    --secondary-orange: #ff8c61;  /* Lighter orange */
    --dark-bg: #0a0a1a;           /* Background color */
    --success: #00ff88;           /* Happy/success color */
    --error: #ff4757;             /* Error color */
    --thinking: #3498db;          /* Thinking color */
    --working: #f39c12;           /* Working color */
    --excited: #ff69b4;           /* Excited color */
    --confused: #9b59b6;           /* Confused color */
    --sleeping: #95a5a6;          /* Sleeping color */
}
```

### Adjusting Speeds
Animation speed is controlled via CSS variable `--anim-speed`:
- Default: 1.0 (100%)
- Minimum: 0.25 (25%)
- Maximum: 3.0 (300%)
- Modified by speed controls buttons

### Adding Custom Commands
Edit `sendCommand()` function in `script.js`:
```javascript
if (command.toLowerCase().includes('yourcommand')) {
    this.setExpression('happy');
    this.logActivity('Your custom response here', 'response');
}
```

## Fun Facts

- The lobster has **8 different expressions** now (up from 5)
- Stars twinkle in the background continuously
- The face blinks every 4 seconds
- Pupils move around randomly when idle
- Antennae wave independently of each other
- Activity log auto-limits to **20 items** in display (up from 10)
- Command history stores **last 50 commands**
- Sound effects use **Web Audio API** (no dependencies)
- Total file size: ~40KB (still very small!)

## Browser Support

Works in all modern browsers:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Ideas for Future Enhancements

- [ ] Real WebSocket connection to actual Lumi
- [ ] Sound effects library (different beeps, chirps)
- [ ] Custom expression builder UI
- [ ] Notification system integration
- [ ] Command alias system
- [ ] Multi-server support
- [ ] Widget/embeddable mode
- [ ] REST API for external integration
- [ ] Dark/Light mode presets
- [ ] High contrast mode for better accessibility

## Accessibility Features

The dashboard v2.0 is designed to be fully accessible:

### Keyboard Navigation
- **Tab** - Navigate through all interactive elements
- **Arrow Left/Right** - Cycle through expressions
- **Arrow Up/Down** - Navigate command history
- **Enter/Space** - Activate selected element
- **Escape** - Reset to idle expression

### ARIA Labels
- All buttons have descriptive labels
- Status updates are announced via `aria-live` regions
- Activity types are announced with context
- Command input has proper hints

### Visual Focus Indicators
- High-contrast focus rings
- Clear visual feedback for all interactions
- Animated focus states
- Color-coded activity types

## v2.0 Changelog

### Added
- Command input with history navigation
- 3 new expressions (excited, confused, sleeping)
- Sound effects toggle
- Animation speed controls (25% - 300%)
- 2 new stat cards (errors, responses)
- PNG screenshot export
- Activity log types with color coding
- Clear log button
- Footer links
- Mobile responsiveness improvements

### Improved
- Better keyboard navigation
- Enhanced accessibility
- Improved command handling
- More responsive design
- Better localStorage persistence

### Fixed
- Expression cycling issues
- Theme toggle persistence
- Activity log formatting

## Have Fun! 🦞

This dashboard is designed to be playful and engaging. Send commands, watch animations, adjust speed, toggle sounds, and enjoy the space lobster vibes!

---

Built with 🦞 and cosmic energy v2.0 by Lumi (Lu's AI Assistant)
