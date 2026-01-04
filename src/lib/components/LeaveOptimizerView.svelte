<!-- src/lib/components/LeaveOptimizerView.svelte -->

<script lang="ts">
	import { allLeaveSuggestions, type LeaveSuggestion } from '$lib/data/leaveOptimizer';
	import LeaveSuggestionCard from './LeaveSuggestionCard.svelte';
	import { CalendarDays, TrendingUp, Clock, Filter, X, SlidersHorizontal } from 'lucide-svelte';
	import { SvelteSet } from 'svelte/reactivity';

	let {
		onViewCalendar
	}: {
		onViewCalendar?: (suggestion: LeaveSuggestion) => void;
	} = $props();

	let suggestions: LeaveSuggestion[] = allLeaveSuggestions;

	console.log('LeaveOptimizerView mounted, suggestions:', suggestions);

	// Filter and sort state
	let sortBy = $state<'efficiency' | 'days' | 'chronological'>('efficiency');
	let maxLeaveDays = $state<number | null>(null);
	let minEfficiency = $state<number | null>(null);
	let excludeAmbitious = $state(false);
	let selectedMonths = $state<string[]>([]);

	// UI state
	let showFilters = $state(false);

	// Available months from suggestions
	const availableMonths = $derived(() => {
		const months = new SvelteSet<string>();
		suggestions.forEach((suggestion: LeaveSuggestion) => {
			suggestion.monthsSpanned.forEach((month: string) => months.add(month));
		});
		return Array.from(months).sort();
	});

	// Filtered and sorted suggestions
	const filteredSuggestions = $derived(() => {
		let filtered = suggestions.filter((suggestion: LeaveSuggestion) => {
			// Max leave days filter
			if (maxLeaveDays !== null && suggestion.leaveRequired > maxLeaveDays) {
				return false;
			}

			// Min efficiency filter
			if (
				minEfficiency !== null &&
				suggestion.efficiency < minEfficiency &&
				suggestion.efficiency !== Infinity
			) {
				return false;
			}

			// Exclude ambitious filter
			if (excludeAmbitious && suggestion.difficulty === 'ambitious') {
				return false;
			}

			// Month filter
			if (
				selectedMonths.length > 0 &&
				!selectedMonths.some((month: string) => suggestion.monthsSpanned.includes(month))
			) {
				return false;
			}

			return true;
		});

		// Sort
		filtered.sort((a: LeaveSuggestion, b: LeaveSuggestion) => {
			switch (sortBy) {
				case 'efficiency':
					if (a.efficiency === Infinity && b.efficiency === Infinity) {
						return b.totalDaysOff - a.totalDaysOff;
					}
					if (a.efficiency === Infinity) return -1;
					if (b.efficiency === Infinity) return 1;
					return b.efficiency - a.efficiency;

				case 'days':
					return b.totalDaysOff - a.totalDaysOff;

				case 'chronological':
					return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();

				default:
					return 0;
			}
		});

		return filtered;
	});

	// Stats
	const stats = $derived(() => ({
		total: filteredSuggestions().length,
		free: filteredSuggestions().filter((s: LeaveSuggestion) => s.efficiency === Infinity).length,
		highEfficiency: filteredSuggestions().filter(
			(s: LeaveSuggestion) => s.efficiency >= 3 && s.efficiency !== Infinity
		).length,
		totalLeaveDays: filteredSuggestions().reduce(
			(sum: number, s: LeaveSuggestion) => sum + s.leaveRequired,
			0
		),
		totalDaysOff: filteredSuggestions().reduce(
			(sum: number, s: LeaveSuggestion) => sum + s.totalDaysOff,
			0
		)
	}));

	function toggleMonth(month: string) {
		selectedMonths = selectedMonths.includes(month)
			? selectedMonths.filter((m) => m !== month)
			: [...selectedMonths, month];
	}

	function clearFilters() {
		maxLeaveDays = null;
		minEfficiency = null;
		excludeAmbitious = false;
		selectedMonths = [];
		sortBy = 'efficiency';
	}

	function handleViewCalendar(suggestion: LeaveSuggestion) {
		onViewCalendar?.(suggestion);
	}

	function getSortLabel(sortBy: string) {
		switch (sortBy) {
			case 'efficiency':
				return 'Best Efficiency';
			case 'days':
				return 'Most Days Off';
			case 'chronological':
				return 'By Date';
			default:
				return 'Best Efficiency';
		}
	}
</script>

<div class="space-y-6">
	<!-- Header -->
	<div class="animate-fade-in-up opacity-0">
		<div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
			<div>
				<h2 class="font-display text-2xl text-white/90 sm:text-3xl">Smart Leave Planner</h2>
				<p class="font-myanmar mt-2 text-base text-white/40">
					အားလပ်ရက်စီစဉ်ရေးအတွက် အတိုင်းအတာ အကြံပြုချက်များ
				</p>
				<p class="mt-1 text-sm text-white/50">
					Maximize your 2026 holidays by strategically taking leave around public holidays
				</p>
			</div>

			<!-- Stats -->
			<div class="flex flex-wrap gap-3">
				<div class="card-elevated flex flex-col rounded-xl px-4 py-3">
					<div class="flex items-baseline gap-1">
						<span class="text-xl font-semibold text-white">{stats().total}</span>
						<span class="text-sm text-white/30">suggestions</span>
					</div>
				</div>
				<div class="card-elevated flex flex-col rounded-xl px-4 py-3">
					<div class="flex items-baseline gap-1">
						<span class="text-xl font-semibold text-emerald-400">{stats().free}</span>
						<span class="text-sm text-white/30">free</span>
					</div>
				</div>
				<div class="card-elevated flex flex-col rounded-xl px-4 py-3">
					<div class="flex items-baseline gap-1">
						<span class="text-xl font-semibold text-amber-400">{stats().highEfficiency}</span>
						<span class="text-sm text-white/30">high efficiency</span>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Controls -->
	<div class="animate-fade-in-up opacity-0" style="animation-delay: 100ms">
		<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
			<!-- Sort -->
			<div class="flex items-center gap-3">
				<span class="text-sm font-medium text-white/60">Sort by:</span>
				<div class="flex items-center gap-1">
					{#each ['efficiency', 'days', 'chronological'] as sortOption (sortOption)}
						<button
							onclick={() => (sortBy = sortOption as 'efficiency' | 'days' | 'chronological')}
							class="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all
								{sortBy === sortOption
								? 'bg-amber-500/20 text-amber-400'
								: 'text-white/40 hover:bg-white/5 hover:text-white/70'}"
						>
							{#if sortOption === 'efficiency'}
								<TrendingUp size={14} strokeWidth={1.5} />
							{:else if sortOption === 'days'}
								<CalendarDays size={14} strokeWidth={1.5} />
							{:else}
								<Clock size={14} strokeWidth={1.5} />
							{/if}
							<span class="hidden sm:inline">{getSortLabel(sortOption)}</span>
						</button>
					{/each}
				</div>
			</div>

			<!-- Filter toggle -->
			<button
				onclick={() => (showFilters = !showFilters)}
				class="flex items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm font-medium text-white/70 transition-all hover:border-white/20 hover:bg-white/10 hover:text-white"
			>
				<SlidersHorizontal size={16} strokeWidth={1.5} />
				Filters
				{#if maxLeaveDays !== null || minEfficiency !== null || excludeAmbitious || selectedMonths.length > 0}
					<span class="ml-1 h-2 w-2 rounded-full bg-amber-400"></span>
				{/if}
			</button>
		</div>
	</div>

	<!-- Filters Panel -->
	{#if showFilters}
		<div
			class="animate-fade-in-up rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 opacity-0"
			style="animation-delay: 200ms"
		>
			<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
				<!-- Max Leave Days -->
				<div>
					<label for="maxLeaveDays" class="mb-2 block text-sm font-medium text-white/70"
						>Max Leave Days</label
					>
					<div class="flex gap-2">
						<input
							id="maxLeaveDays"
							type="number"
							min="0"
							max="30"
							bind:value={maxLeaveDays}
							placeholder="Any"
							class="flex-1 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-sm text-white placeholder-white/30 focus:border-amber-500/40 focus:outline-none"
						/>
						{#if maxLeaveDays !== null}
							<button
								onclick={() => (maxLeaveDays = null)}
								class="flex items-center justify-center rounded-lg bg-white/10 px-2 text-white/40 hover:text-white"
							>
								<X size={16} strokeWidth={2} />
							</button>
						{/if}
					</div>
				</div>

				<!-- Min Efficiency -->
				<div>
					<label for="minEfficiency" class="mb-2 block text-sm font-medium text-white/70"
						>Min Efficiency</label
					>
					<div class="flex gap-2">
						<input
							id="minEfficiency"
							type="number"
							min="1"
							max="10"
							step="0.1"
							bind:value={minEfficiency}
							placeholder="Any"
							class="flex-1 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-sm text-white placeholder-white/30 focus:border-amber-500/40 focus:outline-none"
						/>
						{#if minEfficiency !== null}
							<button
								onclick={() => (minEfficiency = null)}
								class="flex items-center justify-center rounded-lg bg-white/10 px-2 text-white/40 hover:text-white"
							>
								<X size={16} strokeWidth={2} />
							</button>
						{/if}
					</div>
				</div>

				<!-- Difficulty Filter -->
				<div>
					<div class="mb-2 block text-sm font-medium text-white/70">Difficulty</div>
					<label class="flex items-center gap-2">
						<input
							type="checkbox"
							bind:checked={excludeAmbitious}
							class="rounded border-white/20 bg-white/5 text-amber-500 focus:ring-amber-500"
						/>
						<span class="text-sm text-white/60">Exclude ambitious</span>
					</label>
				</div>

				<!-- Clear Filters -->
				<div class="flex items-end">
					<button
						onclick={clearFilters}
						class="w-full rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400 transition-all hover:bg-red-500/15"
					>
						Clear All Filters
					</button>
				</div>
			</div>

			<!-- Month Filter -->
			{#if availableMonths().length > 0}
				<div class="mt-6 border-t border-white/[0.06] pt-4">
					<div class="mb-3 block text-sm font-medium text-white/70">Months</div>
					<div class="flex flex-wrap gap-2">
						{#each availableMonths() as month (month)}
							<button
								onclick={() => toggleMonth(month)}
								class="rounded-lg border px-3 py-1.5 text-sm font-medium transition-all
									{selectedMonths.includes(month)
									? 'border-amber-500/40 bg-amber-500/20 text-amber-400'
									: 'border-white/[0.08] bg-white/[0.03] text-white/60 hover:border-white/20 hover:bg-white/10 hover:text-white'}"
							>
								{month}
							</button>
						{/each}
					</div>
				</div>
			{/if}
		</div>
	{/if}

	<!-- Results count -->
	{#if filteredSuggestions().length !== suggestions.length}
		<div
			class="flex animate-fade-in animate-fade-in-up items-center gap-2 text-sm text-white/40 opacity-0"
			style="animation-delay: 300ms"
		>
			<span>Showing</span>
			<span class="font-medium text-white/60">{filteredSuggestions().length}</span>
			<span>of</span>
			<span class="font-medium text-white/60">{suggestions.length}</span>
			<span>suggestions</span>
		</div>
	{/if}

	<!-- Suggestions Grid -->
	{#if filteredSuggestions().length > 0}
		<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" style="animation-delay: 400ms">
			{#each filteredSuggestions() as suggestion, i (suggestion.id)}
				<div class="animate-fade-in-up opacity-0" style="animation-delay: {i * 100}ms">
					<LeaveSuggestionCard {suggestion} onViewCalendar={handleViewCalendar} />
				</div>
			{/each}
		</div>
	{:else}
		<!-- Empty state -->
		<div
			class="flex animate-scale-in flex-col items-center justify-center py-24 text-center opacity-0"
			style="animation-delay: 400ms"
		>
			<div
				class="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-white/[0.04] text-white/20"
			>
				<Filter size={40} strokeWidth={1} />
			</div>
			<h3 class="font-display text-xl text-white/70">No suggestions found</h3>
			<p class="mt-2 text-sm text-white/40">Try adjusting your filters to see more options</p>
			<button
				onclick={clearFilters}
				class="mt-6 flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-5 py-2.5 text-sm font-medium text-amber-400 transition-all hover:bg-amber-500/15"
			>
				<X size={16} strokeWidth={2} />
				Clear filters
			</button>
		</div>
	{/if}
</div>
