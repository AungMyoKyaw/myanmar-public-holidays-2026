<script lang="ts">
	import type { Holiday, SubstituteWorkDay } from '$lib/data/holidays';
	import {
		categoryColors,
		formatDate,
		getHolidayDays,
		substituteWorkDays
	} from '$lib/data/holidays';
	import HolidayIcon from './HolidayIcon.svelte';
	import { Building2, AlertCircle, Moon, Clock } from 'lucide-svelte';

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

	const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

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

	function getMonthSubstituteDays(monthIndex: number): SubstituteWorkDay[] {
		return substituteWorkDays.filter((s) => new Date(s.date).getMonth() === monthIndex);
	}
</script>

<div class="calendar-container">
	<!-- Responsive grid -->
	<div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:gap-6">
		{#each months as monthName, monthIndex (monthIndex)}
			{@const daysInMonth = getDaysInMonth(monthIndex, year)}
			{@const firstDay = getFirstDayOfMonth(monthIndex, year)}
			{@const monthHolidays = holidays.filter(
				(h) => new Date(h.startDate).getMonth() === monthIndex
			)}
			{@const monthSubstituteDays = getMonthSubstituteDays(monthIndex)}

			<div
				class="card-elevated group/month animate-fade-in-up rounded-2xl p-4 opacity-0 sm:p-5"
				style="animation-delay: {monthIndex * 50}ms"
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

				<!-- Week day headers -->
				<div class="mb-2 grid grid-cols-7 gap-1">
					{#each weekDays as day, i (i)}
						<div
							class="text-center text-[11px] font-medium {isWeekend(i)
								? 'text-rose-400/50'
								: 'text-white/30'}"
						>
							{day}
						</div>
					{/each}
				</div>

				<!-- Calendar grid -->
				<div class="grid grid-cols-7 gap-1">
					<!-- Empty cells for days before first of month -->
					<!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
					{#each Array(firstDay) as _, emptyIndex (`empty-${monthIndex}-${emptyIndex}`)}
						<div class="aspect-square"></div>
					{/each}

					<!-- Day cells -->
					<!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
					{#each Array(daysInMonth) as _, dayIndex (dayIndex)}
						{@const day = dayIndex + 1}
						{@const dayOfWeek = (firstDay + dayIndex) % 7}
						{@const dayHolidays = getHolidaysForDate(monthIndex, day)}
						{@const substituteDay = getSubstituteWorkDay(monthIndex, day)}
						{@const hasHoliday = dayHolidays.length > 0}
						{@const hasSubstitute = !!substituteDay}
						{@const primaryHoliday = dayHolidays[0]}
						{@const colors = primaryHoliday ? categoryColors[primaryHoliday.category] : null}

						<button
							class="group relative aspect-square rounded-lg text-xs transition-all duration-200 sm:text-sm
								{isToday(monthIndex, day) ? 'ring-2 ring-amber-500/70 ring-offset-1 ring-offset-[#0a0a0f]' : ''}
								{hasSubstitute
								? 'border border-orange-500/40 bg-orange-500/20 hover:z-10 hover:scale-110 hover:bg-orange-500/30'
								: hasHoliday
									? `${colors?.bg} ${colors?.border} border hover:z-10 hover:scale-110`
									: isWeekend(dayOfWeek)
										? 'text-rose-400/50 hover:bg-white/5'
										: 'text-white/50 hover:bg-white/5'}"
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
									? 'font-semibold text-orange-300'
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
									class="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-white/20 text-[9px] font-bold text-white backdrop-blur-sm"
								>
									{dayHolidays.length}
								</span>
							{/if}
						</button>
					{/each}
				</div>

				<!-- Month's holiday list -->
				{#if monthHolidays.length > 0 || monthSubstituteDays.length > 0}
					<div class="mt-4 space-y-1.5 border-t border-white/[0.06] pt-4">
						{#each monthHolidays as holiday (holiday.id)}
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
						{#each monthSubstituteDays as subDay (subDay.id)}
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

<!-- Floating tooltip for holidays -->
{#if selectedHoliday}
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
					<Clock size={12} strokeWidth={1.5} />
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
						<Moon size={12} strokeWidth={2} />
						<span>Date subject to moon sighting</span>
					</div>
				{/if}
			</div>
		</div>
	</div>
{/if}

<!-- Floating tooltip for substitute working days -->
{#if selectedSubstituteDay}
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
					<Clock size={12} strokeWidth={1.5} />
					<span>{formatDate(selectedSubstituteDay.date)}</span>
					<span class="text-orange-300/25">({selectedSubstituteDay.day})</span>
				</div>
				<p class="mt-3 text-xs leading-relaxed text-orange-200/50">
					{selectedSubstituteDay.reason}
				</p>
				<div class="mt-3 flex items-center gap-1.5 text-xs text-orange-400/80">
					<AlertCircle size={12} strokeWidth={2} />
					<span>Office attendance required</span>
				</div>
			</div>
		</div>
	</div>
{/if}
