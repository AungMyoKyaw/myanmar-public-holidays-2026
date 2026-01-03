export interface Holiday {
	id: string;
	name: string;
	nameMyanmar?: string;
	startDate: string;
	endDate?: string;
	day: string;
	category: 'national' | 'religious' | 'cultural' | 'international';
	description?: string;
	isLunarDependent?: boolean;
	iconName: string;
}

export interface SubstituteWorkDay {
	id: string;
	date: string;
	day: string;
	reason: string;
	reasonMyanmar: string;
	forHoliday: string;
}

// Substitute working days - days you must work even though they're weekends
// Based on government announcements for 2026
export const substituteWorkDays: SubstituteWorkDay[] = [
	{
		id: 'sub-jan-10',
		date: '2026-01-10',
		day: 'Sat',
		reason: 'Substitute for Independence Day (Jan 4, Sunday)',
		reasonMyanmar: 'လွတ်လပ်ရေးနေ့ (တနင်္ဂနွေနေ့) အစားထိုးအလုပ်လုပ်ရက်',
		forHoliday: 'independence-day'
	}
];

export const holidays: Holiday[] = [
	{
		id: 'new-year-2026',
		name: "New Year's Holidays",
		nameMyanmar: 'နှစ်သစ်ကူးရုံးပိတ်ရက်များ',
		startDate: '2026-01-01',
		endDate: '2026-01-02',
		day: 'Thu - Fri',
		category: 'international',
		description: 'Celebration of the Gregorian New Year',
		iconName: 'party-popper'
	},
	{
		id: 'independence-day',
		name: 'Independence Day',
		nameMyanmar: 'လွတ်လပ်ရေးနေ့',
		startDate: '2026-01-04',
		day: 'Sun',
		category: 'national',
		description: 'Commemorates independence from British rule in 1948',
		iconName: 'flag'
	},
	{
		id: 'union-day',
		name: "Union Day's Holidays",
		nameMyanmar: 'ပြည်ထောင်စုနေ့ရုံးပိတ်ရက်များ',
		startDate: '2026-02-12',
		endDate: '2026-02-13',
		day: 'Thu - Fri',
		category: 'national',
		description: 'Celebrates the Panglong Agreement signed in 1947',
		iconName: 'users'
	},
	{
		id: 'chinese-new-year',
		name: 'Chinese New Year Holidays',
		nameMyanmar: 'တရုတ်နှစ်သစ်ကူးရုံးပိတ်ရက်များ',
		startDate: '2026-02-16',
		endDate: '2026-02-17',
		day: 'Mon - Tue',
		category: 'cultural',
		description: 'Lunar New Year celebration',
		iconName: 'sparkles'
	},
	{
		id: 'peasants-day',
		name: 'Peasant Day',
		nameMyanmar: 'တောင်သူလယ်သမားနေ့',
		startDate: '2026-03-02',
		day: 'Mon',
		category: 'national',
		description: 'Honours agricultural workers',
		iconName: 'wheat'
	},
	{
		id: 'full-moon-tabaung',
		name: 'Full Moon Day of Tabaung',
		nameMyanmar: 'တပေါင်းလပြည့်နေ့',
		startDate: '2026-03-02',
		day: 'Mon',
		category: 'religious',
		description: 'Buddhist full moon festival',
		iconName: 'moon'
	},
	{
		id: 'armed-forces-day',
		name: 'Armed Forces Day',
		nameMyanmar: 'တပ်မတော်နေ့',
		startDate: '2026-03-27',
		day: 'Fri',
		category: 'national',
		description: 'Commemorates the resistance against Japanese occupation in 1945',
		iconName: 'shield'
	},
	{
		id: 'thingyan',
		name: 'Thingyan Holidays',
		nameMyanmar: 'သင်္ကြန်ပွဲတော်ရုံးပိတ်ရက်များ',
		startDate: '2026-04-11',
		endDate: '2026-04-19',
		day: 'Sat - Sun',
		category: 'cultural',
		description: 'Traditional New Year water festival - 9 consecutive days of celebration',
		iconName: 'droplets'
	},
	{
		id: 'full-moon-kason',
		name: 'Full Moon Day of Kason',
		nameMyanmar: 'ကဆုန်လပြည့်နေ့',
		startDate: '2026-04-30',
		day: 'Thu',
		category: 'religious',
		description: "Buddha Day - commemorates Buddha's birth, enlightenment, and passing",
		iconName: 'flower-2'
	},
	{
		id: 'labour-day',
		name: 'Labour Day',
		nameMyanmar: 'အလုပ်သမားနေ့',
		startDate: '2026-05-01',
		day: 'Fri',
		category: 'international',
		description: "International Workers' Day",
		iconName: 'hard-hat'
	},
	{
		id: 'martyrs-day',
		name: "Martyrs' Day",
		nameMyanmar: 'အာဇာနည်နေ့',
		startDate: '2026-07-19',
		day: 'Sun',
		category: 'national',
		description: 'Honours Aung San and other leaders assassinated in 1947',
		iconName: 'flame'
	},
	{
		id: 'full-moon-warso',
		name: 'Full Moon Day of Warso',
		nameMyanmar: 'ဝါဆိုလပြည့်နေ့',
		startDate: '2026-07-29',
		day: 'Wed',
		category: 'religious',
		description: 'Start of Buddhist Lent (Vassa) - monks begin rain retreat',
		iconName: 'circle'
	},
	{
		id: 'thadingyut',
		name: 'Thadingyut Holidays',
		nameMyanmar: 'သီတင်းကျွတ်ပွဲတော်ရုံးပိတ်ရက်များ',
		startDate: '2026-10-25',
		endDate: '2026-10-27',
		day: 'Sun - Tue',
		category: 'religious',
		description: 'Festival of Lights - end of Buddhist Lent',
		iconName: 'lamp'
	},
	{
		id: 'tazaungdaing',
		name: 'Tazaungdaing Holidays',
		nameMyanmar: 'တန်ဆောင်တိုင်ပွဲတော်ရုံးပိတ်ရက်များ',
		startDate: '2026-11-23',
		endDate: '2026-11-24',
		day: 'Mon - Tue',
		category: 'religious',
		description: 'Festival of Lights with robe-weaving ceremony',
		iconName: 'sparkle'
	},
	{
		id: 'national-day',
		name: 'National Day',
		nameMyanmar: 'အမျိုးသားနေ့',
		startDate: '2026-12-04',
		day: 'Fri',
		category: 'national',
		description: 'Commemorates the 1920 student boycott against British rule',
		iconName: 'award'
	},
	{
		id: 'christmas',
		name: 'Christmas Holiday',
		nameMyanmar: 'ခရစ္စမတ်ရုံးပိတ်ရက်',
		startDate: '2026-12-25',
		day: 'Fri',
		category: 'international',
		description: 'Christian celebration of the birth of Jesus Christ',
		iconName: 'gift'
	},
	{
		id: 'eid-al-fitr',
		name: 'Eid al-Fitr',
		nameMyanmar: 'အိဒ်အလ်ဖစ်တာ',
		startDate: '2026-TBD',
		day: '*',
		category: 'religious',
		description: 'Festival of Breaking the Fast - date to be announced (subject to moon sighting)',
		isLunarDependent: true,
		iconName: 'moon'
	},
	{
		id: 'deepavali',
		name: 'Deepavali',
		nameMyanmar: 'ဒီပါဝလီ',
		startDate: '2026-TBD',
		day: '*',
		category: 'religious',
		description: 'Hindu Festival of Lights - date to be announced (subject to moon sighting)',
		isLunarDependent: true,
		iconName: 'star'
	}
];

export const categoryColors: Record<
	Holiday['category'],
	{ bg: string; text: string; border: string; gradient: string }
> = {
	national: {
		bg: 'bg-amber-500/10',
		text: 'text-amber-400',
		border: 'border-amber-500/25',
		gradient: 'from-amber-500/20 to-amber-600/5'
	},
	religious: {
		bg: 'bg-violet-500/10',
		text: 'text-violet-400',
		border: 'border-violet-500/25',
		gradient: 'from-violet-500/20 to-violet-600/5'
	},
	cultural: {
		bg: 'bg-rose-500/10',
		text: 'text-rose-400',
		border: 'border-rose-500/25',
		gradient: 'from-rose-500/20 to-rose-600/5'
	},
	international: {
		bg: 'bg-emerald-500/10',
		text: 'text-emerald-400',
		border: 'border-emerald-500/25',
		gradient: 'from-emerald-500/20 to-emerald-600/5'
	}
};

export const categoryLabels: Record<Holiday['category'], string> = {
	national: 'National',
	religious: 'Religious',
	cultural: 'Cultural',
	international: 'International'
};

export function getHolidayDays(holiday: Holiday): number {
	if (!holiday.endDate) return 1;
	const start = new Date(holiday.startDate);
	const end = new Date(holiday.endDate);
	return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
}

export function getTotalHolidayDays(): number {
	return holidays.reduce((total, holiday) => {
		// Skip TBD holidays
		if (holiday.startDate.includes('TBD')) return total;
		return total + getHolidayDays(holiday);
	}, 0);
}

export function formatDate(dateString: string): string {
	const date = new Date(dateString);
	return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function formatDateRange(holiday: Holiday): string {
	if (!holiday.endDate) {
		return formatDate(holiday.startDate);
	}
	return `${formatDate(holiday.startDate)} - ${formatDate(holiday.endDate)}`;
}

export function getMonth(dateString: string): string {
	const date = new Date(dateString);
	return date.toLocaleDateString('en-US', { month: 'long' });
}

export function groupHolidaysByMonth(): Map<string, Holiday[]> {
	const grouped = new Map<string, Holiday[]>();

	holidays.forEach((holiday) => {
		const month = getMonth(holiday.startDate);
		if (!grouped.has(month)) {
			grouped.set(month, []);
		}
		grouped.get(month)!.push(holiday);
	});

	return grouped;
}

export function getUpcomingHolidays(count: number = 3): Holiday[] {
	const today = new Date();
	today.setHours(0, 0, 0, 0);

	return holidays.filter((h) => new Date(h.endDate || h.startDate) >= today).slice(0, count);
}

export function getHolidaysByCategory(category: Holiday['category']): Holiday[] {
	return holidays.filter((h) => h.category === category);
}
