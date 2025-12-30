<script lang="ts">
	import type { Holiday, SubstituteWorkDay } from '$lib/data/holidays';
	import { categoryColors, formatDate, getHolidayDays, substituteWorkDays } from '$lib/data/holidays';

	let { holidays, year = 2026 }: { holidays: Holiday[]; year?: number } = $props();

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

	const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

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
		return (
			today.getFullYear() === year && today.getMonth() === month && today.getDate() === day
		);
	}

	function isWeekend(dayOfWeek: number): boolean {
		return dayOfWeek === 0 || dayOfWeek === 6;
	}

	let selectedHoliday = $state<Holiday | null>(null);
	let selectedSubstituteDay = $state<SubstituteWorkDay | null>(null);
	let tooltipPosition = $state({ x: 0, y: 0 });

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

	// Get substitute work days for a specific month
	function getMonthSubstituteDays(monthIndex: number): SubstituteWorkDay[] {
		return substituteWorkDays.filter((s) => new Date(s.date).getMonth() === monthIndex);
	}
</script>

<div class="calendar-container">
	<!-- Responsive grid: 1 col mobile, 2 cols tablet, 3 cols desktop, 4 cols wide -->
	<div class="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:gap-6">
		{#each months as monthName, monthIndex}
			{@const daysInMonth = getDaysInMonth(monthIndex, year)}
			{@const firstDay = getFirstDayOfMonth(monthIndex, year)}
			{@const monthHolidays = holidays.filter((h) => new Date(h.startDate).getMonth() === monthIndex)}
			{@const monthSubstituteDays = getMonthSubstituteDays(monthIndex)}

			<div
				class="rounded-2xl border border-white/10 bg-white/5 p-3 sm:p-4 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/[0.07]"
			>
				<!-- Month header -->
				<div class="mb-2 sm:mb-3 flex items-center justify-between">
					<h3 class="text-base sm:text-lg font-semibold text-white">{monthName}</h3>
					{#if monthHolidays.length > 0}
						<span
							class="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] sm:text-xs font-medium text-amber-300"
						>
							{monthHolidays.length} {monthHolidays.length === 1 ? 'holiday' : 'holidays'}
						</span>
					{/if}
				</div>

				<!-- Week day headers -->
				<div class="mb-1 sm:mb-2 grid grid-cols-7 gap-0.5 sm:gap-1">
					{#each weekDays as day, i}
						<div
							class="text-center text-xs font-medium {isWeekend(i)
								? 'text-rose-400/60'
								: 'text-white/40'}"
						>
							{day}
						</div>
					{/each}
				</div>

				<!-- Calendar grid -->
				<div class="grid grid-cols-7 gap-0.5 sm:gap-1">
					<!-- Empty cells for days before first of month -->
					{#each Array(firstDay) as _, i}
						<div class="aspect-square"></div>
					{/each}

					<!-- Day cells -->
					{#each Array(daysInMonth) as _, dayIndex}
						{@const day = dayIndex + 1}
						{@const dayOfWeek = (firstDay + dayIndex) % 7}
						{@const dayHolidays = getHolidaysForDate(monthIndex, day)}
						{@const substituteDay = getSubstituteWorkDay(monthIndex, day)}
						{@const hasHoliday = dayHolidays.length > 0}
						{@const hasSubstitute = !!substituteDay}
						{@const primaryHoliday = dayHolidays[0]}
						{@const colors = primaryHoliday ? categoryColors[primaryHoliday.category] : null}

						<button
							class="group relative aspect-square rounded-md sm:rounded-lg text-xs sm:text-sm transition-all
								{isToday(monthIndex, day)
								? 'ring-2 ring-amber-500 ring-offset-1 ring-offset-[#0a0a0f]'
								: ''}
								{hasSubstitute
								? 'bg-orange-500/30 border border-orange-500/50 hover:scale-110 hover:z-10'
								: hasHoliday
									? `${colors?.bg} ${colors?.border} border hover:scale-110 hover:z-10`
									: isWeekend(dayOfWeek)
										? 'text-rose-400/60 hover:bg-white/5'
										: 'text-white/60 hover:bg-white/5'}"
							onmouseenter={(e) => {
								if (hasSubstitute) showSubstituteTooltip(substituteDay, e);
								else if (hasHoliday) showTooltip(primaryHoliday, e);
							}}
							onmouseleave={hideTooltip}
							onclick={() => {
								if (hasSubstitute) selectedSubstituteDay = substituteDay;
								else if (hasHoliday) selectedHoliday = primaryHoliday;
							}}
						>
							<span
								class="flex h-full w-full items-center justify-center {hasSubstitute
									? 'text-orange-300 font-semibold'
									: hasHoliday
										? colors?.text + ' font-semibold'
										: ''}"
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
									class="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-white/20 text-[10px] font-bold text-white"
								>
									{dayHolidays.length}
								</span>
							{/if}
						</button>
					{/each}
				</div>

				<!-- Month's holiday list (compact) -->
				{#if monthHolidays.length > 0 || monthSubstituteDays.length > 0}
					<div class="mt-3 space-y-1 border-t border-white/10 pt-3">
						{#each monthHolidays as holiday}
							{@const colors = categoryColors[holiday.category]}
							<div
								class="flex items-center gap-2 rounded-lg px-2 py-1 text-xs transition-all hover:bg-white/5"
							>
								<span class="text-base">{holiday.icon}</span>
								<span class="flex-1 truncate text-white/70">{holiday.name}</span>
								<span class="text-white/40">{formatDate(holiday.startDate).split(' ')[1]}</span>
								{#if getHolidayDays(holiday) > 1}
									<span class="rounded bg-white/10 px-1.5 py-0.5 text-[10px] text-white/50">
										{getHolidayDays(holiday)}d
									</span>
								{/if}
							</div>
						{/each}
						{#each monthSubstituteDays as subDay}
							<div
								class="flex items-center gap-2 rounded-lg px-2 py-1 text-xs transition-all hover:bg-orange-500/10 bg-orange-500/5"
							>
								<span class="text-base">🏢</span>
								<span class="flex-1 truncate text-orange-300/80">Work Day</span>
								<span class="text-orange-400/60">{formatDate(subDay.date).split(' ')[1]}</span>
								<span class="rounded bg-orange-500/20 px-1.5 py-0.5 text-[10px] text-orange-300/70">
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

<!-- Floating tooltip for holidays -->
{#if selectedHoliday}
	{@const colors = categoryColors[selectedHoliday.category]}
	<div
		class="pointer-events-none fixed z-50 max-w-xs rounded-xl border {colors.border} {colors.bg} p-4 shadow-2xl backdrop-blur-xl"
		style="left: {Math.min(tooltipPosition.x + 10, window.innerWidth - 300)}px; top: {Math.min(
			tooltipPosition.y + 10,
			window.innerHeight - 200
		)}px;"
	>
		<div class="flex items-start gap-3">
			<span class="text-3xl">{selectedHoliday.icon}</span>
			<div>
				<h4 class="font-semibold text-white">{selectedHoliday.name}</h4>
				{#if selectedHoliday.nameMyanmar}
					<p class="font-myanmar text-sm text-white/60">{selectedHoliday.nameMyanmar}</p>
				{/if}
				<p class="mt-1 text-xs text-white/50">
					{formatDate(selectedHoliday.startDate)}
					{#if selectedHoliday.endDate}
						- {formatDate(selectedHoliday.endDate)}
					{/if}
					<span class="ml-2 text-white/30">({selectedHoliday.day})</span>
				</p>
				{#if getHolidayDays(selectedHoliday) > 1}
					<span
						class="mt-2 inline-block rounded-full bg-white/10 px-2 py-0.5 text-xs font-medium text-white/70"
					>
						{getHolidayDays(selectedHoliday)} days
					</span>
				{/if}
				{#if selectedHoliday.description}
					<p class="mt-2 text-xs leading-relaxed text-white/50">{selectedHoliday.description}</p>
				{/if}
				{#if selectedHoliday.isLunarDependent}
					<p class="mt-2 flex items-center gap-1 text-xs text-amber-400/80">
						<span>🌙</span> Date subject to moon sighting
					</p>
				{/if}
			</div>
		</div>
	</div>
{/if}

<!-- Floating tooltip for substitute working days -->
{#if selectedSubstituteDay}
	<div
		class="pointer-events-none fixed z-50 max-w-xs rounded-xl border border-orange-500/40 bg-orange-500/20 p-4 shadow-2xl backdrop-blur-xl"
		style="left: {Math.min(tooltipPosition.x + 10, window.innerWidth - 300)}px; top: {Math.min(
			tooltipPosition.y + 10,
			window.innerHeight - 200
		)}px;"
	>
		<div class="flex items-start gap-3">
			<span class="text-3xl">🏢</span>
			<div>
				<h4 class="font-semibold text-orange-200">Substitute Working Day</h4>
				<p class="font-myanmar text-sm text-orange-300/70">{selectedSubstituteDay.reasonMyanmar}</p>
				<p class="mt-1 text-xs text-orange-300/50">
					{formatDate(selectedSubstituteDay.date)}
					<span class="ml-2 text-orange-300/30">({selectedSubstituteDay.day})</span>
				</p>
				<p class="mt-2 text-xs leading-relaxed text-orange-200/60">{selectedSubstituteDay.reason}</p>
				<div class="mt-2 flex items-center gap-1 text-xs text-orange-400/80">
					<span>⚠️</span>
					<span>Office attendance required</span>
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
	.font-myanmar {
		font-family: 'Noto Sans Myanmar', sans-serif;
	}
</style>
