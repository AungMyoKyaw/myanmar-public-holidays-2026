# Myanmar Public Holidays 2026

A beautifully designed web application displaying the complete list of official public holidays in Myanmar for the year 2026. Built with SvelteKit, featuring bilingual support (English/Myanmar), interactive calendar views, and a modern dark theme.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## Features

- **17 Official Holidays** - Complete list with 32 total days off
- **Three View Modes**
  - Calendar view with holiday indicators and tooltips
  - Grid view with detailed holiday cards
  - Timeline view for chronological navigation
- **Search & Filter** - Real-time search and category filtering (National, Religious, Cultural, International)
- **Bilingual Support** - Full English and Myanmar language translations
- **Responsive Design** - Optimized for mobile, tablet, and desktop
- **Dark Theme** - Beautiful gradient backgrounds with smooth animations
- **SEO Optimized** - Structured data (JSON-LD), Open Graph, and Twitter cards
- **Static Site Generation** - Fast loading with pre-rendered content

## Tech Stack

- **Framework** - SvelteKit with Svelte 5 (runes)
- **Language** - TypeScript
- **Styling** - TailwindCSS 4
- **Build Tool** - Vite 7
- **Package Manager** - Bun
- **Testing** - Vitest + Playwright
- **Deployment** - GitHub Pages

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) or [Node.js](https://nodejs.org/) (v20+)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/myanmar-public-holidays-2026.git
cd myanmar-public-holidays-2026

# Install dependencies
bun install
```

### Development

```bash
# Start development server
bun run dev

# Open in browser (default: http://localhost:5173)
bun run dev -- --open
```

### Building

```bash
# Build for production
bun run build

# Preview production build
bun run preview
```

### Testing

```bash
# Run tests
bun run test

# Run tests in watch mode
bun run test:unit
```

### Linting & Formatting

```bash
# Check code
bun run lint

# Format code
bun run format
```

## Project Structure

```
src/
├── app.html              # HTML template
├── routes/
│   ├── +page.svelte      # Main application page
│   ├── +layout.svelte    # Root layout
│   └── layout.css        # Global styles
├── lib/
│   ├── components/
│   │   ├── HolidayCard.svelte    # Holiday card component
│   │   └── CalendarView.svelte   # Interactive calendar
│   ├── data/
│   │   └── holidays.ts           # Holiday data & utilities
│   └── index.ts                  # Library exports
└── app.d.ts              # TypeScript declarations
```

## Deployment

This project is configured for GitHub Pages deployment via GitHub Actions. The deployment workflow is triggered on push to the `master` branch.

### Manual Deployment

```bash
# Build
bun run build

# The build output is in the `build/` directory
# Deploy the contents to your hosting service
```

### Custom Base Path

If deploying to a subdirectory, update `svelte.config.js`:

```js
export default {
	kit: {
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: '404.html',
			precompress: false,
			strict: true
		}),
		paths: {
			base: '/your-repo-name'
		}
	}
};
```

## Holiday Data

Holidays are categorized as follows:

| Category      | Count | Examples                                  |
| ------------- | ----- | ----------------------------------------- |
| National      | 7     | Independence Day, Union Day, Martyrs' Day |
| Religious     | 4     | 4-digit Thingyan, Full Moon Days          |
| Cultural      | 1     | Kayin New Year                            |
| International | 5     | Labor Day, Christmas, etc.                |

## License

MIT License - see LICENSE file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
