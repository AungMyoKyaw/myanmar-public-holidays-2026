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
		HelpCircle,
		Star,
		Check
	} from 'lucide-svelte';

	const {
		suggestion,
		onViewCalendar
	}: {
		suggestion: LeaveSuggestion;
		onViewCalendar?: (suggestion: LeaveSuggestion) => void;
	} = $props();

	// Efficiency badge styling
	const getEfficiencyBadge = (efficiency: number) => {
		if (efficiency === Infinity) {
			return { color: 'emerald', label: 'FREE' };
		}
		if (efficiency >= 3) {
			return { color: 'emerald', label: 'Excellent' };
		}
		if (efficiency >= 2) {
			return { color: 'amber', label: 'Good' };
		}
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

	// Helper functions for badge classes
	const getDifficultyBadgeClasses = (color: string) => {
		if (color === 'emerald') {
			return 'border-emerald-500/30 bg-emerald-500/15 text-emerald-300';
		}
		if (color === 'amber') {
			return 'border-amber-500/30 bg-amber-500/15 text-amber-300';
		}
		return 'border-rose-500/30 bg-rose-500/15 text-rose-300';
	};

	const getEfficiencyBadgeClasses = (color: string) => {
		if (color === 'emerald') {
			return 'border-emerald-500/30 bg-emerald-500/15 text-emerald-300';
		}
		if (color === 'amber') {
			return 'border-amber-500/30 bg-amber-500/15 text-amber-300';
		}
		return 'border-slate-500/30 bg-slate-500/15 text-slate-300';
	};

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
			<Star size={16} fill="currentColor" />
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
		<div class="mb-5 flex flex-wrap items-center gap-2">
			<!-- Difficulty badge -->
			<span
				class="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold tracking-wide uppercase
			{getDifficultyBadgeClasses(difficultyBadge.color)}"
			>
				<difficultyBadge.Icon size={13} strokeWidth={2.5} aria-hidden="true" />
				{suggestion.difficulty}
			</span>

			<!-- Efficiency badge -->
			<span
				class="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold tracking-wide uppercase
			{getEfficiencyBadgeClasses(efficiencyBadge.color)}"
			>
				<TrendingUp size={13} strokeWidth={2.5} aria-hidden="true" />
				{efficiencyBadge.label}
			</span>

			<!-- Strategy badge -->
			<span
				class="inline-flex items-center gap-1.5 rounded-lg border border-violet-500/30 bg-violet-500/15 px-3 py-1.5 text-xs font-semibold tracking-wide text-violet-300 uppercase"
			>
				{suggestion.strategy.replace('-', ' ')}
			</span>
		</div>

		<!-- Title and icon -->
		<div class="mb-5 flex items-start gap-4">
			<div
				class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/25 to-amber-600/15 text-amber-400 ring-1 ring-amber-500/20 transition-transform duration-300 group-hover:scale-110 group-hover:ring-amber-500/30"
				aria-hidden="true"
			>
				<HolidayIcon name="calendar-check" size={24} strokeWidth={2} />
			</div>
			<div class="min-w-0 flex-1">
				<h3 class="font-display mb-2 text-xl leading-tight text-white/95 sm:text-[22px]">
					{suggestion.title}
				</h3>
				{#if suggestion.titleMyanmar}
					<p class="font-myanmar text-sm leading-relaxed text-white/60">
						{suggestion.titleMyanmar}
					</p>
				{/if}
			</div>
		</div>

		<!-- Key metrics -->
		<h4 class="sr-only">Key Metrics</h4>
		<div class="mb-5 grid grid-cols-2 gap-3">
			<!-- Efficiency highlight -->
			<div
				class="flex flex-col gap-1 rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-3"
			>
				<span class="text-xs font-medium tracking-wider text-amber-400/70 uppercase"
					>Efficiency</span
				>
				<div class="flex items-baseline gap-1.5">
					<span
						class="text-2xl font-bold text-amber-400"
						aria-label="{suggestion.efficiency === Infinity
							? 'Infinite'
							: suggestion.efficiency.toFixed(1)} times efficiency rating"
					>
						{suggestion.efficiency === Infinity ? '∞' : suggestion.efficiency.toFixed(1)}
					</span>
					<span class="text-sm text-amber-400/60">×</span>
				</div>
			</div>

			<!-- Leave vs Total -->
			<div class="flex flex-col gap-1 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3">
				<span class="text-xs font-medium tracking-wider text-white/50 uppercase">Days Off</span>
				<div class="flex items-baseline gap-1.5 text-sm">
					<span class="text-lg font-semibold text-emerald-400">{suggestion.leaveRequired}</span>
					<span class="text-white/40">→</span>
					<span class="text-lg font-semibold text-white/90">{suggestion.totalDaysOff}</span>
				</div>
			</div>
		</div>

		<!-- Savings text -->
		<h4 class="sr-only">Savings Information</h4>
		<div
			class="mb-5 rounded-xl border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.03] p-4"
		>
			<div class="flex items-start gap-3">
				<div
					class="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-500/15"
				>
					<Check size={16} strokeWidth={2} class="text-emerald-400" />
				</div>
				<div class="min-w-0 flex-1">
					<p class="text-sm leading-relaxed font-medium text-white/95">{suggestion.savingsText}</p>
					<p class="font-myanmar mt-1.5 text-xs leading-relaxed text-white/60">
						{suggestion.savingsTextMyanmar}
					</p>
				</div>
			</div>
		</div>

		<!-- Date range -->
		<h4 class="sr-only">Date Range</h4>
		<div class="mb-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
			<div class="flex items-center gap-2 text-white/60">
				<Calendar size={14} strokeWidth={1.5} class="text-white/40" aria-hidden="true" />
				<span>{formatDate(suggestion.startDate)} - {formatDate(suggestion.endDate)}</span>
			</div>
			{#if suggestion.leaveDates.length > 0}
				<div class="flex items-center gap-2 text-white/50">
					<Clock size={13} strokeWidth={1.5} class="text-white/35" aria-hidden="true" />
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
			<h4 class="sr-only">Related Holidays</h4>
			<div class="mb-5">
				<p class="mb-2 text-xs font-medium tracking-wider text-white/60 uppercase">Includes</p>
				<div class="flex flex-wrap gap-2">
					{#each suggestion.relatedHolidays as holiday (holiday.id || holiday.name)}
						{@const colors = categoryColors[holiday.category]}
						<span
							class="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium {colors.border} {colors.bg} {colors.text}"
						>
							<span aria-hidden="true">
								<HolidayIcon name={holiday.iconName} size={12} strokeWidth={2} />
							</span>
							{holiday.name}
						</span>
					{/each}
				</div>
			</div>
		{/if}

		<!-- Action buttons -->
		<h4 class="sr-only">Actions</h4>
		<div class="flex gap-3">
			<button
				onclick={handleViewCalendar}
				class="flex flex-1 items-center justify-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-sm font-medium text-amber-400 transition-all hover:bg-amber-500/15"
			>
				<Eye size={16} strokeWidth={1.5} aria-hidden="true" />
				View Calendar
			</button>
		</div>
	</div>

	<!-- Bottom gradient line -->
	<div
		class="absolute right-0 bottom-0 left-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
	></div>
</article>
