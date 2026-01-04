<script lang="ts">
	import {
		type Holiday,
		type SubstituteWorkDay,
		categoryColors,
		formatDate,
		getHolidayDays,
		substituteWorkDays
	} from '$lib/data/holidays';
	import HolidayIcon from './HolidayIcon.svelte';
	import { Building2, AlertCircle, Moon, Clock, Search, X } from 'lucide-svelte';

	const {
		holidays,
		year = 2026,
		highlightedDateRange
	}: {
		holidays: Holiday[];
		year?: number;
		highlightedDateRange?: { start: string; end: string } | null;
	} = $props();

	// Search functionality for calendar view
	let calendarSearchQuery = $state('');

	// Filter holidays for calendar search
	const calendarFilteredHolidays = $derived(
		holidays.filter((holiday) => {
			if (calendarSearchQuery === '') {
				return true;
			}
			const matchesSearch =
				holiday.name.toLowerCase().includes(calendarSearchQuery.toLowerCase()) ??
				holiday.nameMyanmar?.toLowerCase().includes(calendarSearchQuery.toLowerCase()) ??
				holiday.description?.toLowerCase().includes(calendarSearchQuery.toLowerCase());
			return matchesSearch;
		})
	);

	const months = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December'
	];

	const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
	const weekDayFullNames = [
		'Sunday',
		'Monday',
		'Tuesday',
		'Wednesday',
		'Thursday',
		'Friday',
		'Saturday'
	];

	function getDaysInMonth(month: number, year: number): number {
		return new Date(year, month + 1, 0).getDate();
	}

	function getFirstDayOfMonth(month: number, year: number): number {
		return new Date(year, month, 1).getDay();
	}

	function getHolidaysForDate(month: number, day: number): Holiday[] {
		const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
		return holidays.filter((h) => {
			const start = new Date(h.startDate);
			const end = h.endDate ? new Date(h.endDate) : start;
			const check = new Date(dateStr);
			return check >= start && check <= end;
		});
	}

	function getSubstituteWorkDay(month: number, day: number): SubstituteWorkDay | undefined {
		const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
		return substituteWorkDays.find((s) => s.date === dateStr);
	}

	function isToday(month: number, day: number): boolean {
		const today = new Date();
		return today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;
	}

	function isWeekend(dayOfWeek: number): boolean {
		return dayOfWeek === 0 || dayOfWeek === 6;
	}

	function isInHighlightedRange(month: number, day: number): boolean {
		if (!highlightedDateRange) {
			return false;
		}
		const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
		const checkDate = new Date(dateStr);
		const startDate = new Date(highlightedDateRange.start);
		const endDate = new Date(highlightedDateRange.end);
		return checkDate >= startDate && checkDate <= endDate;
	}

	let selectedHoliday = $state<Holiday | null>(null);
	let selectedSubstituteDay = $state<SubstituteWorkDay | null>(null);
	let tooltipPosition = $state({ x: 0, y: 0 });
	let isMobile = $state(false);

	// Focus management for mobile modals
	let lastFocusedElement = $state<HTMLElement | null>(null);

	// Detect mobile on mount
	$effect(() => {
		isMobile = window.innerWidth < 640;
		const handleResize = () => {
			isMobile = window.innerWidth < 640;
		};
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	});

	function showTooltip(holiday: Holiday, event: MouseEvent) {
		selectedHoliday = holiday;
		selectedSubstituteDay = null;
		tooltipPosition = { x: event.clientX, y: event.clientY };
	}

	function showSubstituteTooltip(subDay: SubstituteWorkDay, event: MouseEvent) {
		selectedSubstituteDay = subDay;
		selectedHoliday = null;
		tooltipPosition = { x: event.clientX, y: event.clientY };
	}

	function hideTooltip() {
		selectedHoliday = null;
		selectedSubstituteDay = null;
	}

	// Mobile modal focus management
	function openHolidayModal(holiday: Holiday, event: MouseEvent) {
		selectedHoliday = holiday;
		selectedSubstituteDay = null;
		tooltipPosition = { x: event.clientX, y: event.clientY };
		lastFocusedElement = event.target as HTMLElement;
	}

	function openSubstituteModal(subDay: SubstituteWorkDay, event: MouseEvent) {
		selectedSubstituteDay = subDay;
		selectedHoliday = null;
		tooltipPosition = { x: event.clientX, y: event.clientY };
		lastFocusedElement = event.target as HTMLElement;
	}

	function closeHolidayModal() {
		selectedHoliday = null;
		if (lastFocusedElement) {
			lastFocusedElement.focus();
			lastFocusedElement = null;
		}
	}

	function closeSubstituteModal() {
		selectedSubstituteDay = null;
		if (lastFocusedElement) {
			lastFocusedElement.focus();
			lastFocusedElement = null;
		}
	}

	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			if (selectedHoliday) {
				closeHolidayModal();
			} else if (selectedSubstituteDay) {
				closeSubstituteModal();
			}
		}
	}

	function getMonthSubstituteDays(monthIndex: number): SubstituteWorkDay[] {
		return substituteWorkDays.filter((s) => new Date(s.date).getMonth() === monthIndex);
	}

	function clearCalendarSearch() {
		calendarSearchQuery = '';
	}

	function getHighlightedMonth(): number | null {
		if (!highlightedDateRange) {
			return null;
		}

		// Find the first month that contains any highlighted dates
		for (let monthIndex = 0; monthIndex < 12; monthIndex++) {
			const daysInMonth = getDaysInMonth(monthIndex, year);
			for (let day = 1; day <= daysInMonth; day++) {
				if (isInHighlightedRange(monthIndex, day)) {
					return monthIndex;
				}
			}
		}
		return null;
	}

	// Auto-scroll to highlighted month when range changes
	$effect(() => {
		if (highlightedDateRange) {
			const highlightedMonth = getHighlightedMonth();
			if (highlightedMonth !== null) {
				// Small delay to ensure DOM is updated
				setTimeout(() => {
					const monthElement = document.getElementById(`month-${highlightedMonth}`);
					if (monthElement) {
						monthElement.scrollIntoView({
							behavior: 'smooth',
							block: 'start',
							inline: 'nearest'
						});
					}
				}, 100);
			}
		}
	});
</script>

<div class="calendar-container">
	<!-- Responsive grid -->
	<div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:gap-6">
		{#each months as monthName, monthIndex (monthIndex)}
			{@const daysInMonth = getDaysInMonth(monthIndex, year)}
			{@const firstDay = getFirstDayOfMonth(monthIndex, year)}
			{@const monthHolidays = calendarFilteredHolidays.filter(
				(h) => new Date(h.startDate).getMonth() === monthIndex
			)}
			{@const monthSubstituteDays = getMonthSubstituteDays(monthIndex)}

			<div
				id={`month-${monthIndex}`}
				class="card-elevated group/month animate-fade-in-up rounded-2xl p-4 opacity-0 sm:p-5"
				style="animation-delay: {monthIndex * 30}ms"
			>
				<!-- Month header -->
				<div class="mb-4 flex items-center justify-between">
					<h3 class="font-display text-lg text-white/90 sm:text-xl">{monthName}</h3>
					{#if monthHolidays.length > 0}
						<span
							class="rounded-full bg-amber-500/15 px-2.5 py-1 text-[11px] font-medium text-amber-400/90"
						>
							{monthHolidays.length}
						</span>
					{/if}
				</div>

				<!-- Calendar search -->
				{#if monthIndex === 0}
					<div class="mb-4">
						<div class="relative">
							<Search
								size={16}
								strokeWidth={2}
								class="absolute top-1/2 left-3 -translate-y-1/2 text-white/30"
							/>
							<input
								type="text"
								bind:value={calendarSearchQuery}
								placeholder="Search holidays in calendar..."
								class="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] py-2 pr-4 pl-10 text-sm text-white placeholder-white/30 backdrop-blur-sm transition-all focus:border-amber-500/40 focus:bg-white/[0.06] focus:outline-none"
							/>
							{#if calendarSearchQuery}
								<button
									onclick={clearCalendarSearch}
									class="absolute top-1/2 right-3 -translate-y-1/2 rounded-md p-1 text-white/30 transition-colors hover:bg-white/10 hover:text-white/60"
									aria-label="Clear calendar search"
								>
									<X size={12} strokeWidth={2} />
								</button>
							{/if}
						</div>
					</div>
				{/if}

				<!-- Live region for calendar search results -->
				{#if monthIndex === 0}
					<div aria-live="polite" aria-atomic="true" class="sr-only">
						{#if calendarSearchQuery}
							{calendarFilteredHolidays.length === 0
								? 'No holidays found in calendar matching your search'
								: `Calendar search found ${calendarFilteredHolidays.length} matching holidays`}
						{/if}
					</div>
				{/if}

				<!-- Calendar table or empty state -->
				{#if calendarFilteredHolidays.length === 0 && calendarSearchQuery !== ''}
					<div class="flex flex-col items-center justify-center py-16 text-center">
						<div
							class="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white/[0.04] text-white/30"
						>
							<Search size={24} strokeWidth={1.5} />
						</div>
						<h4 class="font-display mb-2 text-base text-white/70">No holidays found</h4>
						<p class="mb-4 text-sm text-white/40">Try adjusting your search terms</p>
						<button
							onclick={clearCalendarSearch}
							class="flex items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-sm font-medium text-amber-400 transition-all hover:bg-amber-500/15"
						>
							<X size={16} strokeWidth={2} />
							Clear search
						</button>

						<!-- Live region for calendar empty state -->
						<div aria-live="assertive" aria-atomic="true" class="sr-only">
							No holidays found in calendar matching your search criteria. Try adjusting your search
							terms.
						</div>
					</div>
				{:else}
					<table role="grid" class="w-full table-fixed border-collapse">
						<thead>
							<tr>
								{#each weekDays as day, i (i)}
									<th
										role="columnheader"
										scope="col"
										abbr={weekDayFullNames[i]}
										class="w-[14.285%] pb-2 text-center text-[11px] font-medium {isWeekend(i)
											? 'text-rose-400/50'
											: 'text-white/30'}"
									>
										{day}
									</th>
								{/each}
							</tr>
						</thead>
						<tbody>
							{#each Array(Math.ceil((firstDay + daysInMonth) / 7)) as __, weekIndex (weekIndex)}
								<tr>
									{#each Array(7) as __, dayOfWeek (dayOfWeek)}
										{@const dayIndex = weekIndex * 7 + dayOfWeek - firstDay}
										{@const isEmpty = dayIndex < 0 || dayIndex >= daysInMonth}
										<td role="gridcell" class="w-[14.285%] p-0">
											{#if isEmpty}
												<div class="aspect-square"></div>
											{:else}
												{@const day = dayIndex + 1}
												{@const dayOfWeekForDay = (firstDay + dayIndex) % 7}
												{@const dayHolidays = getHolidaysForDate(monthIndex, day)}
												{@const [primaryHoliday] = dayHolidays}
												{@const substituteDay = getSubstituteWorkDay(monthIndex, day)}
												{@const hasHoliday = dayHolidays.length > 0}
												{@const hasSubstitute = !!substituteDay}
												{@const isHighlighted = isInHighlightedRange(monthIndex, day)}
												{@const colors = primaryHoliday
													? categoryColors[primaryHoliday.category]
													: null}

												{@const getDateSuffix = () => {
													if (hasHoliday) {
														return ` - ${primaryHoliday.name}`;
													}
													if (hasSubstitute) {
														return ' - Substitute Work Day';
													}
													return '';
												}}
												{@const dateLabel = `${months[monthIndex]} ${day}, ${year}${getDateSuffix()}`}

												{@const getButtonClasses = () => {
													if (isHighlighted) {
														return 'scale-105 animate-pulse-subtle bg-amber-500/20 font-bold ring-2 ring-amber-400/60 ring-offset-2 ring-offset-[#0a0a0f] hover:z-10 hover:scale-110 hover:bg-amber-500/30';
													}
													if (hasSubstitute) {
														return 'border border-orange-500/40 bg-orange-500/20 hover:z-10 hover:scale-110 hover:bg-orange-500/30';
													}
													if (hasHoliday) {
														return `${colors?.bg} ${colors?.border} border hover:z-10 hover:scale-110`;
													}
													if (isWeekend(dayOfWeekForDay)) {
														return 'text-rose-400/50 hover:bg-white/5';
													}
													return 'text-white/50 hover:bg-white/5';
												}}

												{@const getSpanClasses = () => {
													if (isHighlighted) {
														return 'font-bold text-amber-300';
													}
													if (hasSubstitute) {
														return 'font-semibold text-orange-300';
													}
													if (hasHoliday) {
														return `${colors?.text} font-semibold`;
													}
													return '';
												}}

												<button
													aria-label={dateLabel}
													class="group relative aspect-square h-full min-h-[48px] w-full max-w-full min-w-[48px] overflow-hidden rounded-lg text-xs tabular-nums transition-all duration-200 sm:min-h-0 sm:min-w-0 sm:text-sm
													{isToday(monthIndex, day) ? 'ring-2 ring-amber-500/70 ring-offset-1 ring-offset-[#0a0a0f]' : ''}
													{getButtonClasses()}"
													onmouseenter={(e) => {
														if (hasSubstitute) {
															showSubstituteTooltip(substituteDay, e);
														} else if (hasHoliday) {
															showTooltip(primaryHoliday, e);
														}
													}}
													onmouseleave={hideTooltip}
													onfocus={() => {
														// Focus accessibility handled by aria-label and click event
														// No tooltip shown on focus to avoid positioning issues
													}}
													onblur={hideTooltip}
													onclick={(event) => {
														if (hasSubstitute && event) {
															openSubstituteModal(substituteDay, event);
														} else if (hasHoliday && event) {
															openHolidayModal(primaryHoliday, event);
														}
													}}
												>
													<span
														class="flex h-full w-full items-center justify-center {getSpanClasses()}"
													>
														{day}
													</span>

													<!-- Substitute work day indicator -->
													{#if hasSubstitute}
														<span
															class="absolute -bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-orange-400"
														></span>
													{/if}

													<!-- Holiday indicator dot -->
													{#if hasHoliday && !hasSubstitute}
														<span
															class="absolute -bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full {colors?.text.replace(
																'text-',
																'bg-'
															)}"
														></span>
													{/if}

													<!-- Multiple holidays indicator -->
													{#if dayHolidays.length > 1}
														<span
															class="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-white/20 text-[9px] font-bold text-white backdrop-blur-sm"
														>
															{dayHolidays.length}
														</span>
													{/if}
												</button>
											{/if}
										</td>
									{/each}
								</tr>
							{/each}
						</tbody>
					</table>
				{/if}

				<!-- Month's holiday list -->
				{#if monthHolidays.length > 0 || monthSubstituteDays.length > 0}
					<div class="mt-4 space-y-1.5 border-t border-white/[0.06] pt-4">
						{#each monthHolidays as holiday (holiday.id || holiday.name)}
							{@const colors = categoryColors[holiday.category]}
							<div
								class="flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-xs transition-all hover:bg-white/5"
							>
								<div class="{colors.text} opacity-80">
									<HolidayIcon name={holiday.iconName} size={15} strokeWidth={1.75} />
								</div>
								<span class="flex-1 truncate text-white/65">{holiday.name}</span>
								<span class="text-white/35 tabular-nums"
									>{formatDate(holiday.startDate).split(' ')[1]}</span
								>
								{#if getHolidayDays(holiday) > 1}
									<span
										class="rounded bg-white/[0.08] px-1.5 py-0.5 text-[10px] font-medium text-white/45"
									>
										{getHolidayDays(holiday)}d
									</span>
								{/if}
							</div>
						{/each}
						{#each monthSubstituteDays as subDay (subDay.id || subDay.date)}
							<div
								class="flex items-center gap-2.5 rounded-lg bg-orange-500/[0.06] px-2 py-1.5 text-xs transition-all hover:bg-orange-500/10"
							>
								<Building2 size={15} strokeWidth={1.75} class="text-orange-400/70" />
								<span class="flex-1 truncate text-orange-300/70">Work Day</span>
								<span class="text-orange-400/50 tabular-nums"
									>{formatDate(subDay.date).split(' ')[1]}</span
								>
								<span
									class="rounded bg-orange-500/15 px-1.5 py-0.5 text-[10px] font-medium text-orange-400/70"
								>
									sub
								</span>
							</div>
						{/each}
					</div>
				{/if}
			</div>
		{/each}
	</div>
</div>

<!-- Floating tooltip for holidays (desktop only) -->
{#if selectedHoliday && !isMobile}
	{@const colors = categoryColors[selectedHoliday.category]}
	<div
		class="pointer-events-none fixed z-50 max-w-xs rounded-2xl border {colors.border} bg-[#0f0f14]/95 p-5 shadow-2xl shadow-black/50 backdrop-blur-xl"
		style="left: {Math.min(tooltipPosition.x + 12, window.innerWidth - 320)}px; top: {Math.min(
			tooltipPosition.y + 12,
			window.innerHeight - 220
		)}px;"
	>
		<div class="flex items-start gap-4">
			<div
				class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl {colors.bg} {colors.text}"
			>
				<HolidayIcon name={selectedHoliday.iconName} size={24} strokeWidth={1.5} />
			</div>
			<div class="min-w-0 flex-1">
				<h4 class="font-display text-base text-white">{selectedHoliday.name}</h4>
				{#if selectedHoliday.nameMyanmar}
					<p class="font-myanmar mt-0.5 truncate text-sm text-white/50">
						{selectedHoliday.nameMyanmar}
					</p>
				{/if}
				<div class="mt-2 flex items-center gap-2 text-xs text-white/45">
					<Clock size={12} strokeWidth={1.5} aria-hidden="true" />
					<span>
						{formatDate(selectedHoliday.startDate)}
						{#if selectedHoliday.endDate}
							- {formatDate(selectedHoliday.endDate)}
						{/if}
					</span>
					<span class="text-white/25">({selectedHoliday.day})</span>
				</div>
				{#if getHolidayDays(selectedHoliday) > 1}
					<span
						class="mt-2 inline-block rounded-lg bg-white/[0.08] px-2.5 py-1 text-xs font-medium text-white/60"
					>
						{getHolidayDays(selectedHoliday)} days
					</span>
				{/if}
				{#if selectedHoliday.description}
					<p class="mt-3 text-xs leading-relaxed text-white/40">{selectedHoliday.description}</p>
				{/if}
				{#if selectedHoliday.isLunarDependent}
					<div class="mt-3 flex items-center gap-1.5 text-xs text-amber-400/80">
						<Moon size={12} strokeWidth={2} aria-hidden="true" />
						<span>Date subject to moon sighting</span>
					</div>
				{/if}
			</div>
		</div>
	</div>
{/if}

<!-- Modal tooltip for holidays (mobile only) -->
{#if selectedHoliday && isMobile}
	{@const colors = categoryColors[selectedHoliday.category]}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
		onclick={closeHolidayModal}
		onkeydown={handleKeyDown}
		role="dialog"
		aria-labelledby="holiday-title"
		aria-modal="true"
		tabindex="0"
	>
		<div
			class="w-full max-w-sm rounded-2xl border {colors.border} bg-[#0f0f14]/95 p-6 shadow-2xl shadow-black/50"
			onclick={(e) => e.stopPropagation()}
			role="presentation"
		>
			<div class="flex items-start gap-4">
				<div
					class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl {colors.bg} {colors.text}"
				>
					<HolidayIcon name={selectedHoliday.iconName} size={24} strokeWidth={1.5} />
				</div>
				<div class="min-w-0 flex-1">
					<h4 id="holiday-title" class="font-display text-lg text-white">{selectedHoliday.name}</h4>
					{#if selectedHoliday.nameMyanmar}
						<p class="font-myanmar mt-0.5 truncate text-sm text-white/50">
							{selectedHoliday.nameMyanmar}
						</p>
					{/if}
					<div class="mt-3 flex items-center gap-2 text-sm text-white/60">
						<Clock size={14} strokeWidth={1.5} aria-hidden="true" />
						<span>
							{formatDate(selectedHoliday.startDate)}
							{#if selectedHoliday.endDate}
								- {formatDate(selectedHoliday.endDate)}
							{/if}
						</span>
						<span class="text-white/40">({selectedHoliday.day})</span>
					</div>
					{#if getHolidayDays(selectedHoliday) > 1}
						<span
							class="mt-3 inline-block rounded-lg bg-white/[0.08] px-3 py-1.5 text-sm font-medium text-white/70"
						>
							{getHolidayDays(selectedHoliday)} days
						</span>
					{/if}
					{#if selectedHoliday.description}
						<p class="mt-4 text-sm leading-relaxed text-white/50">{selectedHoliday.description}</p>
					{/if}
					{#if selectedHoliday.isLunarDependent}
						<div class="mt-4 flex items-center gap-2 text-sm text-amber-400/90">
							<Moon size={14} strokeWidth={2} aria-hidden="true" />
							<span>Date subject to moon sighting</span>
						</div>
					{/if}
				</div>
			</div>
			<button
				onclick={closeHolidayModal}
				class="mt-6 w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-sm font-medium text-white/70 transition-colors hover:bg-white/10"
			>
				Close
			</button>
		</div>
	</div>
{/if}

<!-- Floating tooltip for substitute working days (desktop only) -->
{#if selectedSubstituteDay && !isMobile}
	<div
		class="pointer-events-none fixed z-50 max-w-xs rounded-2xl border border-orange-500/30 bg-[#0f0f14]/95 p-5 shadow-2xl shadow-black/50 backdrop-blur-xl"
		style="left: {Math.min(tooltipPosition.x + 12, window.innerWidth - 320)}px; top: {Math.min(
			tooltipPosition.y + 12,
			window.innerHeight - 220
		)}px;"
	>
		<div class="flex items-start gap-4">
			<div
				class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-orange-500/15 text-orange-400"
			>
				<Building2 size={24} strokeWidth={1.5} />
			</div>
			<div class="flex-1">
				<h4 class="font-display text-base text-orange-200">Substitute Working Day</h4>
				<p class="font-myanmar mt-0.5 text-sm text-orange-300/60">
					{selectedSubstituteDay.reasonMyanmar}
				</p>
				<div class="mt-2 flex items-center gap-2 text-xs text-orange-300/45">
					<Clock size={12} strokeWidth={1.5} aria-hidden="true" />
					<span>{formatDate(selectedSubstituteDay.date)}</span>
					<span class="text-orange-300/25">({selectedSubstituteDay.day})</span>
				</div>
				<p class="mt-3 text-xs leading-relaxed text-orange-200/50">
					{selectedSubstituteDay.reason}
				</p>
				<div class="mt-3 flex items-center gap-1.5 text-xs text-orange-400/80">
					<AlertCircle size={12} strokeWidth={2} aria-hidden="true" />
					<span>Office attendance required</span>
				</div>
			</div>
		</div>
	</div>
{/if}

<!-- Modal tooltip for substitute working days (mobile only) -->
{#if selectedSubstituteDay && isMobile}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
		onclick={closeSubstituteModal}
		onkeydown={handleKeyDown}
		role="dialog"
		aria-labelledby="substitute-title"
		aria-modal="true"
		tabindex="0"
	>
		<div
			class="w-full max-w-sm rounded-2xl border border-orange-500/30 bg-[#0f0f14]/95 p-6 shadow-2xl shadow-black/50"
			onclick={(e) => e.stopPropagation()}
			role="presentation"
		>
			<div class="flex items-start gap-4">
				<div
					class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-orange-500/15 text-orange-400"
				>
					<Building2 size={24} strokeWidth={1.5} />
				</div>
				<div class="flex-1">
					<h4 id="substitute-title" class="font-display text-lg text-orange-200">
						Substitute Working Day
					</h4>
					<p class="font-myanmar mt-0.5 text-sm text-orange-300/60">
						{selectedSubstituteDay.reasonMyanmar}
					</p>
					<div class="mt-3 flex items-center gap-2 text-sm text-orange-300/60">
						<Clock size={14} strokeWidth={1.5} aria-hidden="true" />
						<span>{formatDate(selectedSubstituteDay.date)}</span>
						<span class="text-orange-300/40">({selectedSubstituteDay.day})</span>
					</div>
					<p class="mt-4 text-sm leading-relaxed text-orange-200/70">
						{selectedSubstituteDay.reason}
					</p>
					<div class="mt-4 flex items-center gap-2 text-sm text-orange-400/90">
						<AlertCircle size={14} strokeWidth={2} aria-hidden="true" />
						<span>Office attendance required</span>
					</div>
				</div>
			</div>
			<button
				onclick={closeSubstituteModal}
				class="mt-6 w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-sm font-medium text-white/70 transition-colors hover:bg-white/10"
			>
				Close
			</button>
		</div>
	</div>
{/if}
