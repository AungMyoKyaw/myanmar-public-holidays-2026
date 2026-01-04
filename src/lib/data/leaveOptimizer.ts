// src/lib/data/leaveOptimizer.ts

import type { Holiday, SubstituteWorkDay } from './holidays';
import { holidays, substituteWorkDays } from './holidays';

export interface LeaveSuggestion {
	id: string;
	title: string;
	titleMyanmar: string;

	// Core metrics
	leaveRequired: number; // Days you need to take off
	totalDaysOff: number; // Total consecutive days including weekends/holidays
	efficiency: number; // totalDaysOff / leaveRequired ratio

	// Date ranges
	startDate: string; // First day of the extended holiday
	endDate: string; // Last day
	leaveDates: string[]; // Specific dates to take leave

	// Related holidays
	relatedHolidays: Holiday[]; // Which holidays this suggestion leverages

	// Strategic info
	strategy: 'natural' | 'bridge' | 'extension' | 'long-break' | 'ambitious';
	difficulty: 'easy' | 'moderate' | 'ambitious';
	savingsText: string; // "Take 5 days, get 16 days off"
	savingsTextMyanmar: string;

	// Month info for filtering
	primaryMonth: string; // Main month (e.g., "April")
	monthsSpanned: string[]; // All months touched

	// UI helpers
	isBestValue?: boolean; // Flag for the top suggestion
}

export interface OptimizationOptions {
	maxLeaveDays?: number; // Max leave days user can take (for filtering)
	minEfficiency?: number; // Minimum efficiency ratio (e.g., 2.0 = 2x)
	excludeAmbitious?: boolean; // Exclude suggestions requiring >10 days leave
	selectedMonths?: string[]; // Filter by months
}

// Utility functions

function formatDate(date: Date): string {
	return date.toISOString().split('T')[0];
}

function isWeekend(date: Date): boolean {
	const day = date.getDay();
	return day === 0 || day === 6; // Sunday = 0, Saturday = 6
}

function isSubstituteWorkDay(date: Date, subDays: SubstituteWorkDay[]): boolean {
	const dateStr = formatDate(date);
	return subDays.some((sub) => sub.date === dateStr);
}

// Core optimization functions

function findNaturalBridges(holidays: Holiday[]): LeaveSuggestion[] {
	const suggestions: LeaveSuggestion[] = [];

	// Union Day + Chinese New Year (Feb 12-17) - 6 days, 0 leave required
	const unionDay = holidays.find((h) => h.id === 'union-day');
	const chineseNewYear = holidays.find((h) => h.id === 'chinese-new-year');

	if (unionDay && chineseNewYear) {
		suggestions.push({
			id: 'union-chinese-natural',
			title: 'Union Day + Chinese New Year',
			titleMyanmar: 'ပြည်ထောင်စုနေ့ + တရုတ်နှစ်သစ်ကူး',
			leaveRequired: 0,
			totalDaysOff: 6,
			efficiency: Infinity,
			startDate: '2026-02-12',
			endDate: '2026-02-17',
			leaveDates: [],
			relatedHolidays: [unionDay, chineseNewYear],
			strategy: 'natural',
			difficulty: 'easy',
			savingsText: 'Take 0 days, get 6 days off (FREE!)',
			savingsTextMyanmar: 'ရက် ၀ ယူပြီး ရက် ၆ အနားရ (အခမဲ့!)',
			primaryMonth: 'February',
			monthsSpanned: ['February'],
			isBestValue: false
		});
	}

	// Labour Day Weekend (Apr 30 - May 3) - 4 days, 0 leave required
	const kasonDay = holidays.find((h) => h.id === 'full-moon-kason');
	const labourDay = holidays.find((h) => h.id === 'labour-day');

	if (kasonDay && labourDay) {
		suggestions.push({
			id: 'labour-weekend-natural',
			title: 'Labour Day Long Weekend',
			titleMyanmar: 'အလုပ်သမားနေ့ ရက်သားရှည်',
			leaveRequired: 0,
			totalDaysOff: 4,
			efficiency: Infinity,
			startDate: '2026-04-30',
			endDate: '2026-05-03',
			leaveDates: [],
			relatedHolidays: [kasonDay, labourDay],
			strategy: 'natural',
			difficulty: 'easy',
			savingsText: 'Take 0 days, get 4 days off (FREE!)',
			savingsTextMyanmar: 'ရက် ၀ ယူပြီး ရက် ၄ အနားရ (အခမဲ့!)',
			primaryMonth: 'May',
			monthsSpanned: ['April', 'May'],
			isBestValue: false
		});
	}

	return suggestions;
}

function findShortBridges(holidays: Holiday[]): LeaveSuggestion[] {
	const suggestions: LeaveSuggestion[] = [];

	// New Year Bridge (Jan 1-2 + Jan 5-6) - Take 2 days, get 7 days
	const newYear = holidays.find((h) => h.id === 'new-year-2026');
	const independenceDay = holidays.find((h) => h.id === 'independence-day');

	if (newYear && independenceDay) {
		suggestions.push({
			id: 'new-year-bridge',
			title: 'New Year Bridge',
			titleMyanmar: 'နှစ်သစ်ကူး ကြားထဲအလုပ်ရက်',
			leaveRequired: 2,
			totalDaysOff: 7,
			efficiency: 3.5,
			startDate: '2026-01-01',
			endDate: '2026-01-07',
			leaveDates: ['2026-01-05', '2026-01-06'],
			relatedHolidays: [newYear, independenceDay],
			strategy: 'bridge',
			difficulty: 'easy',
			savingsText: 'Take 2 days, get 7 days off',
			savingsTextMyanmar: 'ရက် ၂ ယူပြီး ရက် ၇ အနားရ',
			primaryMonth: 'January',
			monthsSpanned: ['January'],
			isBestValue: false
		});
	}

	return suggestions;
}

function findExtensions(holidays: Holiday[]): LeaveSuggestion[] {
	const suggestions: LeaveSuggestion[] = [];

	// Thingyan Super Extension (Apr 11-19 + Apr 20-26) - Take 5 days, get 16 days
	const thingyan = holidays.find((h) => h.id === 'thingyan');

	if (thingyan) {
		suggestions.push({
			id: 'thingyan-extension',
			title: 'Thingyan Super Break',
			titleMyanmar: 'သင်္ကြန် စူပါအနားရက်',
			leaveRequired: 5,
			totalDaysOff: 16,
			efficiency: 3.2,
			startDate: '2026-04-11',
			endDate: '2026-04-26',
			leaveDates: ['2026-04-20', '2026-04-21', '2026-04-22', '2026-04-23', '2026-04-24'],
			relatedHolidays: [thingyan],
			strategy: 'extension',
			difficulty: 'moderate',
			savingsText: 'Take 5 days, get 16 days off',
			savingsTextMyanmar: 'ရက် ၅ ယူပြီး ရက် ၁၆ အနားရ',
			primaryMonth: 'April',
			monthsSpanned: ['April'],
			isBestValue: true
		});
	}

	// Thadingyut Extension (Oct 24-27 + Oct 28-30) - Take 3 days, get 9 days
	const thadingyut = holidays.find((h) => h.id === 'thadingyut');

	if (thadingyut) {
		suggestions.push({
			id: 'thadingyut-extension',
			title: 'Thadingyut Long Weekend',
			titleMyanmar: 'သီတင်းကျွတ် ရက်သားရှည်',
			leaveRequired: 3,
			totalDaysOff: 9,
			efficiency: 3.0,
			startDate: '2026-10-24',
			endDate: '2026-11-01',
			leaveDates: ['2026-10-28', '2026-10-29', '2026-10-30'],
			relatedHolidays: [thadingyut],
			strategy: 'extension',
			difficulty: 'easy',
			savingsText: 'Take 3 days, get 9 days off',
			savingsTextMyanmar: 'ရက် ၃ ယူပြီး ရက် ၉ အနားရ',
			primaryMonth: 'October',
			monthsSpanned: ['October', 'November'],
			isBestValue: false
		});
	}

	return suggestions;
}

function findAmbitiousBreaks(holidays: Holiday[]): LeaveSuggestion[] {
	const suggestions: LeaveSuggestion[] = [];

	// December Mega Break (Dec 4-28) - Take 15 days, get 25 days
	const nationalDay = holidays.find((h) => h.id === 'national-day');
	const christmas = holidays.find((h) => h.id === 'christmas');

	if (nationalDay && christmas) {
		const leaveDates: string[] = [];
		for (let d = new Date('2026-12-05'); d <= new Date('2026-12-23'); d.setDate(d.getDate() + 1)) {
			if (!isWeekend(d) && !isSubstituteWorkDay(d, substituteWorkDays)) {
				leaveDates.push(formatDate(d));
			}
		}

		suggestions.push({
			id: 'december-mega-break',
			title: 'December Mega Break',
			titleMyanmar: 'ဒီဇင်ဘာ စူပါအနားရက်',
			leaveRequired: 15,
			totalDaysOff: 25,
			efficiency: 1.67,
			startDate: '2026-12-04',
			endDate: '2026-12-28',
			leaveDates,
			relatedHolidays: [nationalDay, christmas],
			strategy: 'ambitious',
			difficulty: 'ambitious',
			savingsText: 'Take 15 days, get 25 days off',
			savingsTextMyanmar: 'ရက် ၁၅ ယူပြီး ရက် ၂၅ အနားရ',
			primaryMonth: 'December',
			monthsSpanned: ['December'],
			isBestValue: false
		});
	}

	return suggestions;
}

// Public API

export function generateLeaveSuggestions(
	holidays: Holiday[],
	options: OptimizationOptions = {}
): LeaveSuggestion[] {
	let suggestions: LeaveSuggestion[] = [];

	// 1. Find natural bridges (0 leave days)
	suggestions.push(...findNaturalBridges(holidays));

	// 2. Find short bridges (1-2 days)
	suggestions.push(...findShortBridges(holidays));

	// 3. Find extensions (3-5 days)
	suggestions.push(...findExtensions(holidays));

	// 4. Find ambitious breaks (10+ days)
	if (!options.excludeAmbitious) {
		suggestions.push(...findAmbitiousBreaks(holidays));
	}

	// Filter and sort
	suggestions = suggestions.filter((s) => {
		// Filter by max leave days
		if (options.maxLeaveDays && s.leaveRequired > options.maxLeaveDays) {
			return false;
		}

		// Filter by min efficiency
		if (
			options.minEfficiency &&
			s.efficiency < options.minEfficiency &&
			s.efficiency !== Infinity
		) {
			return false;
		}

		// Filter by months
		if (options.selectedMonths && options.selectedMonths.length > 0) {
			if (!options.selectedMonths.some((month) => s.monthsSpanned.includes(month))) {
				return false;
			}
		}

		return true;
	});

	// Sort by efficiency (Infinity first, then highest ratio)
	suggestions.sort((a, b) => {
		if (a.efficiency === Infinity && b.efficiency === Infinity) {
			return b.totalDaysOff - a.totalDaysOff; // More days first
		}
		if (a.efficiency === Infinity) return -1;
		if (b.efficiency === Infinity) return 1;
		return b.efficiency - a.efficiency;
	});

	return suggestions;
}

export function getAllLeaveSuggestions(options?: OptimizationOptions): LeaveSuggestion[] {
	return generateLeaveSuggestions(holidays, options);
}

export function getLeaveSuggestionsByMonth(
	month: string,
	options?: OptimizationOptions
): LeaveSuggestion[] {
	const monthOptions = { ...options, selectedMonths: [month] };
	return generateLeaveSuggestions(holidays, monthOptions);
}

export function getLeaveSuggestionsByDifficulty(
	difficulty: LeaveSuggestion['difficulty'],
	options?: OptimizationOptions
): LeaveSuggestion[] {
	const all = generateLeaveSuggestions(holidays, options);
	return all.filter((s) => s.difficulty === difficulty);
}

// Export for use in components
export const allLeaveSuggestions = getAllLeaveSuggestions();
