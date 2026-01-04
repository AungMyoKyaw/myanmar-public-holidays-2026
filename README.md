# Myanmar Public Holidays 2026

A beautifully designed web application displaying the complete list of official public holidays in Myanmar for the year 2026. Built with SvelteKit, featuring bilingual support (English/Myanmar), interactive calendar views, and a modern dark theme.

**Live Demo:** [myanmar-public-holidays-2026](https://aungmyokyaw.github.io/myanmar-public-holidays-2026/)

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## Features

- **16 Confirmed Holidays** - 30 confirmed days off plus 2 additional holidays with TBD dates (18 total)
- **9-Day Thingyan Festival** - Extended holiday period from April 11-19, 2026
- **Three View Modes**
  - Calendar view with holiday indicators and tooltips
  - Grid view with detailed holiday cards
  - Timeline view for chronological navigation
- **Leave Planner** - Smart suggestions to maximize your vacation time by strategically taking leave around public holidays
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
│   │   ├── CalendarView.svelte   # Interactive calendar
│   │   ├── LeaveOptimizerView.svelte    # NEW: Smart leave planner
│   │   └── LeaveSuggestionCard.svelte   # NEW: Leave suggestion cards
│   ├── data/
│   │   ├── holidays.ts           # Holiday data & utilities
│   │   └── leaveOptimizer.ts     # NEW: Leave optimization logic
│   ├── i18n/
│   │   └── translations.ts       # NEW: Bilingual text constants
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
| National      | 6     | Independence Day, Union Day, Armed Forces Day |
| Religious     | 7     | Thingyan, Full Moon Days, Eid celebrations    |
| Cultural      | 2     | Thingyan Water Festival, Chinese New Year     |
| International | 3     | New Year's Day, Labour Day, Christmas         |

### Key Highlights

- **Confirmed Holidays:** 16 holidays with 30 confirmed days off
- **TBD Holidays:** 2 additional holidays (Eid al-Fitr and Deepavali) with dates to be announced
- **Thingyan 2026:** 9-day festival (April 11-19)
- **Substitute Working Day:** January 10, 2026 (Saturday) is a replacement workday
- **Lunar-Dependent Dates:** Eid al-Fitr and Deepavali are marked with \* (to be announced, subject to moon sighting)
- **Weekend Policy:** Public holidays falling on Saturday or Sunday are NOT substituted with replacement holidays
- **No Kayin New Year:** The holiday does not occur in 2026 (next one in early 2027)

## Smart Leave Planner

Maximize your 2026 vacation time with intelligent suggestions that analyze Myanmar's public holidays and recommend optimal leave periods.

### Key Features

- **Efficiency Analysis**: See exactly how many leave days you need to take to get maximum days off
- **Strategic Suggestions**: Get personalized recommendations based on holiday patterns
- **Multiple Strategies**: From "free" natural bridges to ambitious long-break extensions
- **Advanced Filtering**: Filter by leave days required, efficiency ratio, difficulty, and months
- **Interactive Planning**: Visual calendar integration and sharing capabilities

### Top Suggestions for 2026

1. **Thingyan Super Break** (Best Value)
   - Take 5 days → Get 16 days off (3.2x efficiency)
   - April 11-26, 2026
   - Includes 9-day Thingyan festival

2. **Union Day + Chinese New Year** (FREE!)
   - Take 0 days → Get 6 days off
   - February 12-17, 2026
   - Natural holiday bridge

3. **Labour Day Weekend** (FREE!)
   - Take 0 days → Get 4 days off
   - April 30 - May 3, 2026

### How It Works

The Leave Planner analyzes:

- Official public holidays and their dates
- Weekend patterns and substitute workdays
- Natural bridges between holidays
- Strategic leave placement for maximum efficiency

Switch to the "Leave Planner" view to explore personalized vacation optimization strategies!

## License

MIT License - see LICENSE file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
