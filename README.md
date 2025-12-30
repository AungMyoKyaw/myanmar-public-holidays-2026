# Myanmar Public Holidays 2026

A beautifully designed web application displaying the complete list of official public holidays in Myanmar for the year 2026. Built with SvelteKit, featuring bilingual support (English/Myanmar), interactive calendar views, and a modern dark theme.

**🔗 Live Demo:** [myanmar-public-holidays-2026](https://aungmyokyaw.github.io/myanmar-public-holidays-2026/)

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## Features

- **18 Official Holidays** - Complete list with 33 total days off
- **9-Day Thingyan Festival** - Extended holiday period from April 11-19, 2026
- **Three View Modes**
  - Calendar view with holiday indicators and tooltips
  - Grid view with detailed holiday cards
  - Timeline view for chronological navigation
- **Search & Filter** - Real-time search functionality
- **Bilingual Support** - Full English and Myanmar language translations
- **Responsive Design** - Optimized for mobile, tablet, and desktop
- **Dark Theme** - Beautiful gradient backgrounds with smooth animations
- **SEO Optimized** - Open Graph tags and Twitter cards for social media
- **Static Site Generation** - Fast loading with pre-rendered content
- **Substitute Working Days** - Display of mandatory work days on weekends

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

## Deployment

This project is automatically deployed to GitHub Pages via GitHub Actions. The deployment workflow is triggered on push to the `master` branch.

### Live URL

- **Production:** https://aungmyokyaw.github.io/myanmar-public-holidays-2026/

### Manual Deployment

```bash
# Build
bun run build

# The build output is in the `build/` directory
# Deploy the contents to your hosting service
```

### GitHub Pages Setup

The project is configured with `BASE_PATH` environment variable for GitHub Pages deployment. The base path is automatically set to `/myanmar-public-holidays-2026` during build.

## Holiday Data

Holidays are categorized as follows:

| Category      | Count | Examples                                      |
| ------------- | ----- | --------------------------------------------- |
| National      | 7     | Independence Day, Union Day, Armed Forces Day |
| Religious     | 7     | Thingyan, Full Moon Days, Eid celebrations    |
| Cultural      | 2     | Thingyan Water Festival, Chinese New Year     |
| International | 2     | New Year's Day, Labour Day, Christmas         |

### Key Highlights

- **Thingyan 2026:** 9-day festival (April 11-19)
- **Substitute Working Day:** January 10, 2026 (Saturday) for Independence Day
- **Lunar-Dependent Dates:** Eid al-Adha, Eid al-Fitr, and Deepavali dates are subject to moon sighting
- **No Kayin New Year:** The holiday does not occur in 2026 (next one in early 2027)

## License

MIT License - see LICENSE file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
