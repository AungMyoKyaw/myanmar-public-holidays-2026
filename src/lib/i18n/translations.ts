// src/lib/i18n/translations.ts

export const translations = {
	leaveOptimizer: {
		title: 'Smart Leave Planner',
		titleMyanmar: 'အားလပ်ရက်စီစဉ်ရေး',
		subtitle: 'Maximize your 2026 holidays by strategically taking leave around public holidays',
		sortBy: 'Sort by:',
		bestEfficiency: 'Best Efficiency',
		mostDaysOff: 'Most Days Off',
		byDate: 'By Date',
		filters: 'Filters',
		maxLeaveDays: 'Max Leave Days',
		minEfficiency: 'Min Efficiency',
		excludeAmbitious: 'Exclude ambitious',
		clearAllFilters: 'Clear All Filters',
		showing: 'Showing',
		of: 'of',
		suggestions: 'suggestions',
		noSuggestions: 'No suggestions found',
		adjustFilters: 'Try adjusting your filters to see more options',
		clearFilters: 'Clear filters',
		viewCalendar: 'View Calendar',
		share: 'Share',
		takeDaysGetDays: (leave: number, total: number) => `Take ${leave} days, get ${total} days off`,
		takeDaysGetDaysMyanmar: (leave: number, total: number) =>
			`${leave} ရက် ယူပြီး ${total} ရက် အနားရ`
	}
} as const;

export type TranslationKey = keyof typeof translations;
