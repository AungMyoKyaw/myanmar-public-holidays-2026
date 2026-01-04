// src/lib/i18n/translations.ts

export const translations = {
	leaveOptimizer: {
		title: 'Smart Leave Planner',
		titleMyanmar: 'အားလပ်ရက်စီစဉ်ရေးအတွက် အတိုင်းအတာ အကြံပြုချက်များ',
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
		free: 'free',
		highEfficiency: 'high efficiency',
		noSuggestions: 'No suggestions found',
		adjustFilters: 'Try adjusting your filters to see more options',
		clearFilters: 'Clear filters',
		viewCalendar: 'View Calendar',
		share: 'Share',
		takeDaysGetDays: (leave: number, total: number) => `Take ${leave} days, get ${total} days off`,
		takeDaysGetDaysMyanmar: (leave: number, total: number) =>
			`ရက် ${leave} ယူပြီး ရက် ${total} အနားရ`,
		freeBreak: 'Take 0 days, get {days} days off (FREE!)',
		freeBreakMyanmar: 'ရက် ၀ ယူပြီး ရက် {days} အနားရ (အခမဲ့!)'
	},
	suggestions: {
		'union-chinese-natural': {
			title: 'Union Day + Chinese New Year',
			titleMyanmar: 'ပြည်ထောင်စုနေ့ + တရုတ်နှစ်သစ်ကူး',
			savingsText: 'Take 0 days, get 6 days off (FREE!)',
			savingsTextMyanmar: 'ရက် ၀ ယူပြီး ရက် ၆ အနားရ (အခမဲ့!)'
		},
		'labour-weekend-natural': {
			title: 'Labour Day Long Weekend',
			titleMyanmar: 'အလုပ်သမားနေ့ ရက်သားရှည်',
			savingsText: 'Take 0 days, get 4 days off (FREE!)',
			savingsTextMyanmar: 'ရက် ၀ ယူပြီး ရက် ၄ အနားရ (အခမဲ့!)'
		},
		'new-year-bridge': {
			title: 'New Year Bridge',
			titleMyanmar: 'နှစ်သစ်ကူး ကြားထဲအလုပ်ရက်',
			savingsText: 'Take 2 days, get 7 days off',
			savingsTextMyanmar: 'ရက် ၂ ယူပြီး ရက် ၇ အနားရ'
		},
		'thingyan-extension': {
			title: 'Thingyan Super Break',
			titleMyanmar: 'သင်္ကြန် စူပါအနားရက်',
			savingsText: 'Take 5 days, get 16 days off',
			savingsTextMyanmar: 'ရက် ၅ ယူပြီး ရက် ၁၆ အနားရ'
		},
		'thadingyut-extension': {
			title: 'Thadingyut Long Weekend',
			titleMyanmar: 'သီတင်းကျွတ် ရက်သားရှည်',
			savingsText: 'Take 3 days, get 9 days off',
			savingsTextMyanmar: 'ရက် ၃ ယူပြီး ရက် ၉ အနားရ'
		},
		'december-mega-break': {
			title: 'December Mega Break',
			titleMyanmar: 'ဒီဇင်ဘာ စူပါအနားရက်',
			savingsText: 'Take 15 days, get 25 days off',
			savingsTextMyanmar: 'ရက် ၁၅ ယူပြီး ရက် ၂၅ အနားရ'
		}
	}
} as const;

export type TranslationKey = keyof typeof translations;
