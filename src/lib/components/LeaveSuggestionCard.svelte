<!-- src/lib/components/LeaveSuggestionCard.svelte -->

<script lang="ts">
	import type { LeaveSuggestion } from '$lib/data/leaveOptimizer';
	import { categoryColors, formatDate } from '$lib/data/holidays';
	import HolidayIcon from './HolidayIcon.svelte';
	import {
		Calendar,
		Clock,
		TrendingUp,
		Eye,
		Smile,
		Lightbulb,
		Rocket,
		HelpCircle
	} from 'lucide-svelte';

	let {
		suggestion,
		onViewCalendar
	}: {
		suggestion: LeaveSuggestion;
		onViewCalendar?: (suggestion: LeaveSuggestion) => void;
	} = $props();

	// Efficiency badge styling
	const getEfficiencyBadge = (efficiency: number) => {
		if (efficiency === Infinity) return { color: 'emerald', label: 'FREE' };
		if (efficiency >= 3) return { color: 'emerald', label: 'Excellent' };
		if (efficiency >= 2) return { color: 'amber', label: 'Good' };
		return { color: 'slate', label: 'Basic' };
	};

	const efficiencyBadge = $derived(getEfficiencyBadge(suggestion.efficiency));

	// Difficulty badge styling
	const getDifficultyBadge = (difficulty: string) => {
		switch (difficulty) {
			case 'easy':
				return { color: 'emerald', Icon: Smile };
			case 'moderate':
				return { color: 'amber', Icon: Lightbulb };
			case 'ambitious':
				return { color: 'rose', Icon: Rocket };
			default:
				return { color: 'slate', Icon: HelpCircle };
		}
	};

	const difficultyBadge = $derived(getDifficultyBadge(suggestion.difficulty));

	function handleViewCalendar() {
		onViewCalendar?.(suggestion);
	}
</script>

<article class="card-elevated group relative overflow-hidden rounded-2xl p-5 sm:p-6">
	<!-- Best value badge -->
	{#if suggestion.isBestValue}
		<div
			class="absolute -top-2 -right-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-amber-500 text-black shadow-lg"
		>
			<svg viewBox="0 0 20 20" class="h-4 w-4" fill="currentColor">
				<path
					d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
				/>
			</svg>
		</div>
	{/if}

	<!-- Gradient overlay on hover -->
	<div
		class="pointer-events-none absolute inset-0 bg-gradient-to-br from-transparent to-amber-500/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
	></div>

	<!-- Decorative corner accent -->
	<div
		class="absolute -top-8 -right-8 h-24 w-24 rounded-full bg-gradient-to-br from-amber-500/20 to-transparent opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-60"
	></div>

	<div class="relative z-10">
		<!-- Badges row -->
		<div class="mb-4 flex flex-wrap items-center gap-2">
			<!-- Difficulty badge -->
			<span
				class="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium tracking-wide uppercase
				{difficultyBadge.color === 'emerald'
					? 'border-emerald-500/25 bg-emerald-500/10 text-emerald-400'
					: difficultyBadge.color === 'amber'
						? 'border-amber-500/25 bg-amber-500/10 text-amber-400'
						: 'border-rose-500/25 bg-rose-500/10 text-rose-400'}"
			>
				<difficultyBadge.Icon size={12} strokeWidth={2} />
				{suggestion.difficulty}
			</span>

			<!-- Efficiency badge -->
			<span
				class="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium tracking-wide uppercase
				{efficiencyBadge.color === 'emerald'
					? 'border-emerald-500/25 bg-emerald-500/10 text-emerald-400'
					: efficiencyBadge.color === 'amber'
						? 'border-amber-500/25 bg-amber-500/10 text-amber-400'
						: 'border-slate-500/25 bg-slate-500/10 text-slate-400'}"
			>
				<TrendingUp size={12} strokeWidth={2} />
				{efficiencyBadge.label}
			</span>

			<!-- Strategy badge -->
			<span
				class="inline-flex items-center gap-1.5 rounded-full border border-violet-500/25 bg-violet-500/10 px-3 py-1.5 text-xs font-medium tracking-wide text-violet-400 uppercase"
			>
				{suggestion.strategy.replace('-', ' ')}
			</span>
		</div>

		<!-- Title and icon -->
		<div class="mb-4 flex items-start gap-3">
			<div
				class="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 text-amber-400 transition-transform duration-300 group-hover:scale-105"
			>
				<HolidayIcon name="calendar-check" size={22} strokeWidth={1.75} />
			</div>
			<div class="min-w-0 flex-1">
				<h3 class="font-display text-lg leading-tight text-white/95 sm:text-xl">
					{suggestion.title}
				</h3>
				{#if suggestion.titleMyanmar}
					<p class="font-myanmar mt-1 truncate text-sm text-white/50">
						{suggestion.titleMyanmar}
					</p>
				{/if}
			</div>
		</div>

		<!-- Key metrics -->
		<div class="mb-5 flex flex-wrap items-baseline gap-4">
			<!-- Efficiency highlight -->
			<div class="flex items-baseline gap-2">
				<span class="text-2xl font-bold text-amber-400">
					{suggestion.efficiency === Infinity ? '∞' : suggestion.efficiency.toFixed(1)}
				</span>
				<span class="text-sm text-amber-400/60">x efficiency</span>
			</div>

			<!-- Leave vs Total -->
			<div class="text-sm text-white/60">
				<span class="font-medium text-white/90">{suggestion.leaveRequired}</span> leave days →
				<span class="font-medium text-white/90">{suggestion.totalDaysOff}</span> total days
			</div>
		</div>

		<!-- Savings text -->
		<div class="mb-4 rounded-lg bg-white/[0.04] p-3">
			<p class="text-sm font-medium text-white/90">{suggestion.savingsText}</p>
			<p class="font-myanmar mt-1 text-xs text-white/60">{suggestion.savingsTextMyanmar}</p>
		</div>

		<!-- Date range -->
		<div class="mb-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
			<div class="flex items-center gap-2 text-white/60">
				<Calendar size={14} strokeWidth={1.5} class="text-white/40" />
				<span>{formatDate(suggestion.startDate)} - {formatDate(suggestion.endDate)}</span>
			</div>
			{#if suggestion.leaveDates.length > 0}
				<div class="flex items-center gap-2 text-white/50">
					<Clock size={13} strokeWidth={1.5} class="text-white/35" />
					<span
						>{suggestion.leaveDates.length} leave day{suggestion.leaveDates.length > 1
							? 's'
							: ''}</span
					>
				</div>
			{/if}
		</div>

		<!-- Related holidays -->
		{#if suggestion.relatedHolidays.length > 0}
			<div class="mb-5">
				<p class="mb-2 text-xs font-medium tracking-wider text-white/60 uppercase">Includes</p>
				<div class="flex flex-wrap gap-2">
					{#each suggestion.relatedHolidays as holiday (holiday.id)}
						{@const colors = categoryColors[holiday.category]}
						<span
							class="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium {colors.border} {colors.bg} {colors.text}"
						>
							<HolidayIcon name={holiday.iconName} size={12} strokeWidth={2} />
							{holiday.name}
						</span>
					{/each}
				</div>
			</div>
		{/if}

		<!-- Action buttons -->
		<div class="flex gap-3">
			<button
				onclick={handleViewCalendar}
				class="flex flex-1 items-center justify-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-sm font-medium text-amber-400 transition-all hover:bg-amber-500/15"
			>
				<Eye size={16} strokeWidth={1.5} />
				View Calendar
			</button>
		</div>
	</div>

	<!-- Bottom gradient line -->
	<div
		class="absolute right-0 bottom-0 left-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
	></div>
</article>
