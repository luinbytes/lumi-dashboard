# 🦞 Clawdbot Webpanel

A fun, interactive dashboard for Clawdbot with a space lobster theme!

## Features

- **Interactive Lobster Face** - Expressions change based on state (idle, happy, thinking, working, error)
- **Real-time Stats** - Uptime counter, session count, activity tracking, command stats
- **Activity Log** - Live updates of system events
- **Space Theme** - Animated stars, cosmic vibes, lobster orange accents
- **Responsive Design** - Works on desktop and mobile
- **Smooth Animations** - CSS animations for all face expressions and UI elements
- **Accessibility** - Full keyboard navigation, ARIA labels, screen reader support
- **Theme Toggle** - Switch between dark mode (default) and light mode with persistence

## Tech Stack

- **Pure HTML/CSS/JavaScript** - No build tools, no dependencies
- **CSS Animations** - All face expressions and transitions are CSS-based
- **Vanilla JS** - Simple, lightweight, and fast
- **Static Files** - Host anywhere that serves static content

## Why This Stack?

I chose vanilla HTML/CSS/JS because:
1. **Zero dependencies** - No npm install, no node_modules, no build step
2. **Instant iteration** - Edit files and refresh browser
3. **Universal hosting** - Works on GitHub Pages, Netlify, Vercel, any web server
4. **Lightweight** - Entire app is ~25KB total
5. **Easy to understand** - Clean, readable code that's fun to play with

## How to Run Locally

### Option 1: Python (Recommended)
```bash
cd clawdbot-webpanel
python3 -m http.server 8080
```
Then open http://localhost:8080 in your browser.

### Option 2: Node.js
```bash
cd clawdbot-webpanel
npx serve
```
Or if you have serve installed:
```bash
serve -p 8080
```

### Option 3: PHP
```bash
cd clawdbot-webpanel
php -S localhost:8080
```

## Deployment Options

### GitHub Pages
1. Push this folder to a GitHub repository
2. Go to Settings > Pages
3. Select main branch and save
4. Your dashboard will be at `https://username.github.io/repo-name/`

### Netlify
1. Drag and drop the folder to https://app.netlify.com/drop
2. Instant deployment with HTTPS

### Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel` in the project directory
3. Follow the prompts

### Traditional Web Server
Upload to any web hosting (Apache, Nginx, cPanel) - it's just static files!

## Accessibility Features

The dashboard is designed to be fully accessible with keyboard navigation and screen reader support:

### Keyboard Navigation
- **Tab key** - Navigate through all interactive elements
- **Face container** - Press Tab to focus on the lobster face
- **Arrow keys (←/→)** - Cycle through expressions when face is focused
- **Enter/Space** - Activate the selected expression
- **Escape** - Reset to idle expression

### ARIA Labels
- All buttons have descriptive labels for screen readers
- Status updates are announced via `aria-live` regions
- The face container has `role="status"` for proper screen reader behavior
- Stats cards are labeled for easy identification

### Visual Focus Indicators
- High-contrast focus rings (green in dark mode, orange in light mode)
- Clear visual feedback when navigating with keyboard
- Animated focus states for interactive elements

## Theme Toggle

Switch between dark mode (default) and light mode:

- **Dark Mode** - Space-themed with dark background and vibrant orange accents
- **Light Mode** - Clean, light theme with improved readability for bright environments
- **Persistence** - Your theme preference is saved to localStorage and remembered across sessions
- **Keyboard Support** - Toggle theme with Tab + Enter/Space

## Face Expressions

The lobster face has 5 different expressions:

1. **IDLE** 😴 - Default state, subtle breathing animation
2. **HAPPY** 😊 - Bouncing face, squinting happy eyes, green status
3. **THINKING** 🤔 - Eyes looking back and forth, antennae twitching, blue status
4. **WORKING** ⚡ - Pulsing face, fast mandible movement, orange status
5. **ERROR** ❌ - Red X eyes, shaking face, red status

## Features Breakdown

### Dashboard Layout
- **Header** - Animated title with lobster emojis
- **Face Section** - Interactive lobster face with expression controls
- **Stats Cards** - 4 stat cards with hover effects
- **Activity Log** - Scrollable log of recent events
- **Status Bar** - Current system status indicator

### Animations
- **Twinkling stars** background
- **Floating title** effect
- **Blinking eyes** with pupil movement
- **Antennae waving** independently
- **Mandible movement** for all expressions
- **Claw waving** decoration
- **Pulsing status** indicators
- **Smooth transitions** between states

### Interactive Elements
- Click expression buttons to change the lobster's mood
- Stats update in real-time
- Activity log fills with simulated events
- Random expression changes every 15 seconds when idle
- Toggle theme with the button in the header

### Keyboard Shortcuts
- **Tab** - Navigate between interactive elements
- **Shift+Tab** - Navigate backwards
- **Arrow Left/Right** - Cycle through face expressions (when focused)
- **Enter/Space** - Activate selected expression or toggle theme
- **Escape** - Reset expression to idle

## File Structure

```
clawdbot-webpanel/
├── index.html    # Main HTML structure
├── styles.css    # All styles and animations
├── script.js     # Interactive logic
└── README.md     # This file
```

## Customization

### Changing Colors
Edit the CSS variables in `styles.css`:
```css
:root {
    --primary-orange: #ff6b35;    -- Main lobster color
    --secondary-orange: #ff8c61;  -- Lighter orange
    --dark-bg: #0a0a1a;           -- Background color
    --success: #00ff88;           -- Happy/success color
    --error: #ff4757;             -- Error color
    --thinking: #3498db;          -- Thinking color
    --working: #f39c12;           -- Working color
}
```

### Adjusting Speeds
Modify animation durations in `styles.css`:
- Change `animation: Xs` to make animations faster or slower
- Adjust intervals in `script.js` (e.g., `setInterval(..., 8000)`)

### Adding New Stats
1. Add HTML in `index.html` stats section
2. Add CSS styles for new stat card
3. Initialize and update in `script.js`

## Fun Facts

- The lobster has over 15 different animations
- Stars twinkle in the background continuously
- The face blinks every 4 seconds
- Pupils move around randomly when idle
- Antennae wave independently of each other
- Activity log automatically limits to 10 items
- Total file size: ~25KB (smaller than many images!)

## Browser Support

Works in all modern browsers:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Ideas for Future Enhancements

- Add sound effects for expression changes
- Integrate with real Clawdbot API for live stats
- Create custom expression builder
- Add notification system
- Export stats as CSV
- Add more user preferences
- Add high contrast mode for better accessibility
- Implement animation speed controls

## Have Fun! 🦞

This dashboard is designed to be playful and engaging. Click around, watch the animations, and enjoy the space lobster vibes!

---

Built with 🦞 and cosmic energy by Lumi
