<script lang="ts">
	import HolidayCard from '$lib/components/HolidayCard.svelte';
	import {
		holidays,
		getTotalHolidayDays,
		substituteWorkDays,
		formatDate,
		type Holiday
	} from '$lib/data/holidays';
	import type { LeaveSuggestion } from '$lib/data/leaveOptimizer';
	import { SvelteMap } from 'svelte/reactivity';
	import {
		Search,
		CalendarDays,
		Calendar,
		LayoutGrid,
		List,
		Building2,
		Droplets,
		Moon,
		CalendarCheck,
		Sparkles,
		Heart,
		TreePine,
		X,
		Github,
		AlertTriangle,
		RefreshCw
	} from 'lucide-svelte';

	let searchQuery = $state('');
	let viewMode = $state<'grid' | 'timeline' | 'calendar' | 'optimizer'>('calendar');
	let highlightedDateRange = $state<{ start: string; end: string } | null>(null);

	// Lazy load components
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let CalendarView: any = $state(null);
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let LeaveOptimizerView: any = $state(null);

	// Loading states and timeouts
	let calendarLoading = $state(false);
	let optimizerLoading = $state(false);
	let calendarTimeout = $state(false);
	let optimizerTimeout = $state(false);

	async function loadCalendarView() {
		if (!CalendarView && !calendarLoading) {
			calendarLoading = true;
			calendarTimeout = false;

			// Set timeout for loading
			const timeoutId = setTimeout(() => {
				calendarTimeout = true;
			}, 10000); // 10 second timeout

			try {
				CalendarView = (await import('$lib/components/CalendarView.svelte')).default;
			} catch (error) {
				console.error('Failed to load CalendarView:', error);
				calendarTimeout = true;
			} finally {
				clearTimeout(timeoutId);
				calendarLoading = false;
			}
		}
	}

	async function loadLeaveOptimizerView() {
		if (!LeaveOptimizerView && !optimizerLoading) {
			optimizerLoading = true;
			optimizerTimeout = false;

			// Set timeout for loading
			const timeoutId = setTimeout(() => {
				optimizerTimeout = true;
			}, 10000); // 10 second timeout

			try {
				LeaveOptimizerView = (await import('$lib/components/LeaveOptimizerView.svelte')).default;
			} catch (error) {
				console.error('Failed to load LeaveOptimizerView:', error);
				optimizerTimeout = true;
			} finally {
				clearTimeout(timeoutId);
				optimizerLoading = false;
			}
		}
	}

	// Load components when their views are selected
	$effect(() => {
		if (viewMode === 'calendar') {
			void loadCalendarView();
		}
		if (viewMode === 'optimizer') {
			void loadLeaveOptimizerView();
		}
	});

	// Filter holidays based on search query
	const filteredHolidays = $derived(
		holidays.filter((holiday) => {
			// Search filter
			if (searchQuery === '') {
				return true;
			}

			const query = searchQuery.toLowerCase();
			const matchesName = holiday.name.toLowerCase().includes(query);
			const matchesNameMyanmar = holiday.nameMyanmar?.toLowerCase().includes(query) ?? false;
			const matchesDescription = holiday.description?.toLowerCase().includes(query) ?? false;

			return matchesName || matchesNameMyanmar || matchesDescription;
		})
	);

	// Group filtered holidays by month
	const holidaysByMonth = $derived.by(() => {
		const grouped = new SvelteMap<string, Holiday[]>();
		filteredHolidays.forEach((holiday) => {
			const date = new Date(holiday.startDate);
			const month = date.toLocaleDateString('en-US', { month: 'long' });
			if (!grouped.has(month)) {
				grouped.set(month, []);
			}
			grouped.get(month)!.push(holiday);
		});
		return grouped;
	});

	const stats = $derived({
		total: holidays.length,
		confirmed: holidays.filter((h) => !h.startDate.includes('TBD')).length,
		totalDays: getTotalHolidayDays()
	});

	function clearSearch() {
		searchQuery = '';
	}

	function handleViewToggleKeydown(event: KeyboardEvent) {
		const viewToggles = ['calendar', 'grid', 'timeline', 'optimizer'] as const;
		const currentIndex = viewToggles.indexOf(viewMode);

		if (event.key === 'ArrowLeft') {
			event.preventDefault();
			const prevIndex = currentIndex > 0 ? currentIndex - 1 : viewToggles.length - 1;
			viewMode = viewToggles[prevIndex];
			// Focus the new tab button
			setTimeout(() => {
				const newTab = document.querySelector(
					`[aria-label*="Switch to ${viewToggles[prevIndex]} view"]`
				) as HTMLElement;
				if (newTab) {
					newTab.focus();
				}
			}, 0);
		} else if (event.key === 'ArrowRight') {
			event.preventDefault();
			const nextIndex = currentIndex < viewToggles.length - 1 ? currentIndex + 1 : 0;
			viewMode = viewToggles[nextIndex];
			// Focus the new tab button
			setTimeout(() => {
				const newTab = document.querySelector(
					`[aria-label*="Switch to ${viewToggles[nextIndex]} view"]`
				) as HTMLElement;
				if (newTab) {
					newTab.focus();
				}
			}, 0);
		}
	}

	function handleViewCalendarFromOptimizer(suggestion: LeaveSuggestion) {
		highlightedDateRange = { start: suggestion.startDate, end: suggestion.endDate };
		viewMode = 'calendar';
		// Scroll to top smoothly
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}

	// Clear highlighting when switching away from calendar view
	$effect(() => {
		if (viewMode !== 'calendar') {
			highlightedDateRange = null;
		}
	});
</script>

<svelte:head>
	<!-- Primary Meta Tags -->
	<title>Myanmar Public Holidays 2026 | 16-18 Holidays · 30+ Days Off</title>
	<meta name="title" content="Myanmar Public Holidays 2026 | 16-18 Holidays · 30+ Days Off" />
	<meta
		name="description"
		content="Complete calendar of Myanmar's official public holidays in 2026. Featuring 9-day Thingyan festival, Union Day, Independence Day & more. Interactive calendar view with search. မြန်မာ့ရုံးပိတ်ရက်များ ၂၀၂၆"
	/>
	<meta
		name="keywords"
		content="Myanmar holidays 2026, Burma holidays, Myanmar public holidays, Thingyan 2026, မြန်မာ့ရုံးပိတ်ရက်, Independence Day Myanmar, Union Day, Buddhist holidays Myanmar, Myanmar calendar 2026"
	/>
	<meta name="author" content="Myanmar Holidays" />
	<meta name="robots" content="index, follow" />
	<link rel="canonical" href="https://aungmyokyaw.github.io/myanmar-public-holidays-2026/" />

	<!-- Open Graph / Facebook -->
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://aungmyokyaw.github.io/myanmar-public-holidays-2026/" />
	<meta property="og:title" content="Myanmar Public Holidays 2026 | Plan Your Year" />
	<meta
		property="og:description"
		content="18 official holidays · 30+ days off · 9-day Thingyan festival (Apr 11-19). Interactive calendar with bilingual support. Perfect for planning your 2026!"
	/>
	<meta
		property="og:image"
		content="https://aungmyokyaw.github.io/myanmar-public-holidays-2026/og-image.png"
	/>
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:image:alt" content="Myanmar Public Holidays 2026 - 16-18 Holidays" />
	<meta property="og:locale" content="en_US" />
	<meta property="og:locale:alternate" content="my_MM" />
	<meta property="og:site_name" content="Myanmar Holidays 2026" />

	<!-- Twitter Card -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:url" content="https://aungmyokyaw.github.io/myanmar-public-holidays-2026/" />
	<meta
		name="twitter:title"
		content="Myanmar Public Holidays 2026 | 16-18 Holidays · 30+ Days Off"
	/>
	<meta
		name="twitter:description"
		content="Complete calendar of Myanmar's 2026 holidays. 9-day Thingyan festival, interactive calendar view, bilingual support. Plan your year now!"
	/>
	<meta name="twitter:image" content="https://myanmar-holidays-2026.vercel.app/og-image.png" />
	<meta name="twitter:image:alt" content="Myanmar Public Holidays 2026 Calendar" />
	<meta name="twitter:creator" content="@myanmar_holidays" />

	<!-- Additional SEO -->
	<meta name="application-name" content="Myanmar Holidays 2026" />
	<meta name="apple-mobile-web-app-title" content="MM Holidays 2026" />
	<meta name="format-detection" content="telephone=no" />

	<!-- Mobile & PWA -->
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
	<meta name="theme-color" content="#050507" />
	<meta name="mobile-web-app-capable" content="yes" />
	<meta name="apple-mobile-web-app-capable" content="yes" />
	<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />

	<!-- Premium Fonts -->
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=DM+Serif+Display&family=Noto+Sans+Myanmar:wght@400;500;600;700&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<div class="noise-overlay mesh-bg min-h-screen text-white">
	<!-- Skip links for keyboard navigation -->
	<nav class="sr-only focus-within:not-sr-only" aria-label="Skip navigation">
		<div class="fixed top-4 left-4 z-50 flex flex-col gap-2">
			<a href="#main-content" class="skip-link">Skip to main content</a>
			<a href="#search" class="skip-link">Skip to search</a>
			<a href="#view-toggles" class="skip-link">Skip to view options</a>
		</div>
	</nav>
	<!-- Animated background orbs -->
	<div class="pointer-events-none fixed inset-0 overflow-hidden">
		<div
			class="absolute -top-1/4 -left-1/4 h-[600px] w-[600px] animate-pulse-glow rounded-full bg-gradient-to-br from-amber-900/20 via-transparent to-transparent blur-[100px]"
		></div>
		<div
			class="absolute -right-1/4 -bottom-1/4 h-[700px] w-[700px] animate-pulse-glow rounded-full bg-gradient-to-tl from-rose-900/15 via-transparent to-transparent blur-[120px]"
			style="animation-delay: 2s;"
		></div>
		<div
			class="absolute top-1/3 right-1/4 h-[400px] w-[400px] animate-float rounded-full bg-gradient-to-br from-violet-900/10 to-transparent blur-[80px]"
			style="animation-delay: 1s;"
		></div>
	</div>

	<!-- Header -->
	<header class="relative z-10 border-b border-white/[0.06]">
		<div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
			<div class="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
				<!-- Title Section -->
				<div class="animate-fade-in-up opacity-0">
					<!-- Badge -->
					<div class="mb-4 flex items-center gap-3">
						<div
							class="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 text-amber-400 ring-1 ring-amber-500/20"
						>
							<Calendar size={20} strokeWidth={1.75} />
						</div>
						<div
							class="h-6 w-px bg-gradient-to-b from-transparent via-amber-500/30 to-transparent"
						></div>
						<span class="text-[11px] font-medium tracking-[0.25em] text-amber-500/70 uppercase"
							>Official Calendar 2026</span
						>
					</div>

					<!-- Main Title -->
					<h1 class="font-display text-4xl tracking-tight sm:text-5xl lg:text-6xl">
						<span class="text-gradient-gold animate-shimmer bg-[length:200%_auto]"> Myanmar </span>
						<span class="text-white/90"> Holidays</span>
					</h1>
					<p class="font-myanmar mt-3 text-base tracking-wide text-white/60 sm:text-lg">
						မြန်မာနိုင်ငံ အများပြည်သူရုံးပိတ်ရက်များ ၂၀၂၆
					</p>
				</div>

				<!-- Stats Cards -->
				<div class="stagger-2 flex animate-fade-in-up flex-wrap gap-3 opacity-0">
					<div class="card-elevated group flex flex-col rounded-2xl px-5 py-4">
						<div class="flex items-baseline gap-1">
							<span class="text-3xl font-semibold text-white">{stats.confirmed}</span>
							<span class="text-sm text-white/30">confirmed</span>
						</div>
						<span class="mt-1 text-xs font-medium tracking-wider text-white/40 uppercase"
							>Holidays</span
						>
					</div>
					<div class="card-elevated group flex flex-col rounded-2xl px-5 py-4">
						<div class="flex items-baseline gap-1">
							<span class="text-3xl font-semibold text-white">{stats.totalDays}</span>
							<span class="text-sm text-white/30">total</span>
						</div>
						<span class="mt-1 text-xs font-medium tracking-wider text-white/40 uppercase"
							>Days Off</span
						>
					</div>
				</div>
			</div>
		</div>
	</header>

	<main
		class="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8"
		id="main-content"
	>
		<!-- Filters Section -->
		<div class="mb-8 flex flex-col gap-4 sm:mb-12 lg:flex-row lg:items-center lg:justify-between">
			<!-- Search -->
			<div class="relative w-full lg:max-w-md" role="search">
				<Search
					size={18}
					strokeWidth={2}
					class="absolute top-1/2 left-4 z-10 -translate-y-1/2 text-white"
				/>
				<input
					type="text"
					bind:value={searchQuery}
					placeholder="Search holidays..."
					class="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] py-3 pr-10 pl-12 text-sm text-white placeholder-white/30 backdrop-blur-sm transition-all focus:border-amber-500/40 focus:bg-white/[0.06] focus:ring-2 focus:ring-amber-500/10 focus:outline-none"
					id="search"
				/>
				{#if searchQuery}
					<button
						onclick={clearSearch}
						class="absolute top-1/2 right-3 -translate-y-1/2 rounded-md p-1 text-white/30 transition-colors hover:bg-white/10 hover:text-white/60"
						aria-label="Clear search"
					>
						<X size={16} strokeWidth={2} aria-hidden="true" />
					</button>
				{/if}
			</div>

			<!-- View toggle -->
			<div
				class="flex items-center gap-1 rounded-xl border border-white/[0.08] bg-white/[0.03] p-1"
				id="view-toggles"
				role="tablist"
				aria-label="Content view options"
				onkeydown={handleViewToggleKeydown}
				tabindex="0"
			>
				<button
					onclick={() => (viewMode = 'calendar')}
					class="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-all {viewMode ===
					'calendar'
						? 'bg-white/10 text-white'
						: 'text-white/40 hover:text-white/70'}"
					title="Calendar View"
					aria-label="Switch to calendar view showing monthly holiday grids"
					role="tab"
					aria-selected={viewMode === 'calendar'}
					tabindex={viewMode === 'calendar' ? 0 : -1}
				>
					<CalendarDays size={16} strokeWidth={1.5} aria-hidden="true" />
					<span class="hidden sm:inline">Calendar</span>
					<span class="sr-only sm:hidden">Calendar view</span>
				</button>
				<button
					onclick={() => (viewMode = 'grid')}
					class="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-all {viewMode ===
					'grid'
						? 'bg-white/10 text-white'
						: 'text-white/40 hover:text-white/70'}"
					title="Grid View"
					aria-label="Switch to grid view showing holiday cards in columns"
					role="tab"
					aria-selected={viewMode === 'grid'}
					tabindex={viewMode === 'grid' ? 0 : -1}
				>
					<LayoutGrid size={16} strokeWidth={1.5} aria-hidden="true" />
					<span class="hidden sm:inline">Grid</span>
					<span class="sr-only sm:hidden">Grid view</span>
				</button>
				<button
					onclick={() => (viewMode = 'timeline')}
					class="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-all {viewMode ===
					'timeline'
						? 'bg-white/10 text-white'
						: 'text-white/40 hover:text-white/70'}"
					title="Timeline View"
					aria-label="Switch to timeline view showing holidays organized by month"
					role="tab"
					aria-selected={viewMode === 'timeline'}
					tabindex={viewMode === 'timeline' ? 0 : -1}
				>
					<List size={16} strokeWidth={1.5} aria-hidden="true" />
					<span class="hidden sm:inline">Timeline</span>
					<span class="sr-only sm:hidden">Timeline view</span>
				</button>
				<button
					onclick={() => (viewMode = 'optimizer')}
					class="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-all {viewMode ===
					'optimizer'
						? 'bg-amber-500/20 text-amber-400'
						: 'text-white/40 hover:text-white/70'}"
					title="Leave Planner"
					aria-pressed={viewMode === 'optimizer'}
					aria-label="Switch to leave planner view for optimizing holiday combinations"
				>
					<CalendarCheck size={16} strokeWidth={1.5} aria-hidden="true" />
					<span class="hidden sm:inline">Leave Planner</span>
					<span class="sr-only sm:hidden">Leave planner view</span>
				</button>
			</div>
		</div>

		<!-- Results count -->
		{#if filteredHolidays.length !== holidays.length && viewMode !== 'calendar' && viewMode !== 'optimizer'}
			<div class="mb-6 flex animate-fade-in items-center gap-2 text-sm text-white/40 opacity-0">
				<span>Showing</span>
				<span class="font-medium text-white/60">{filteredHolidays.length}</span>
				<span>of</span>
				<span class="font-medium text-white/60">{holidays.length}</span>
				<span>holidays</span>
			</div>
		{/if}

		<!-- Live region for screen readers - search results announcements -->
		<div aria-live="polite" aria-atomic="true" class="sr-only">
			{#if filteredHolidays.length !== holidays.length}
				{filteredHolidays.length === 0
					? 'No holidays found matching your search criteria'
					: `Showing ${filteredHolidays.length} of ${holidays.length} holidays`}
			{/if}
		</div>

		<!-- Live region for screen readers - view change announcements -->
		<div aria-live="polite" aria-atomic="true" class="sr-only">
			{#if viewMode === 'calendar'}
				Calendar view selected, showing monthly holiday calendar
			{:else if viewMode === 'grid'}
				Grid view selected, showing holiday cards in columns
			{:else if viewMode === 'timeline'}
				Timeline view selected, showing holidays organized by month
			{:else if viewMode === 'optimizer'}
				Leave planner view selected, showing holiday combination optimizer
			{/if}
		</div>

		<!-- Live region for screen readers - loading status announcements -->
		<div aria-live="polite" aria-atomic="true" class="sr-only">
			{#if calendarLoading}
				Loading calendar view...
			{:else if optimizerLoading}
				Loading leave planner...
			{:else if calendarTimeout}
				Calendar view failed to load, retry button available
			{:else if optimizerTimeout}
				Leave planner failed to load, retry button available
			{/if}
		</div>

		<!-- Calendar View -->
		{#if viewMode === 'calendar'}
			<section aria-labelledby="calendar-view-heading" class="sr-only">
				<h2 id="calendar-view-heading" class="sr-only">Calendar View</h2>
			</section>
			{#if CalendarView}
				<CalendarView holidays={filteredHolidays} year={2026} {highlightedDateRange} />
			{:else if calendarTimeout}
				<div
					class="flex animate-scale-in flex-col items-center justify-center py-24 text-center opacity-0"
				>
					<div
						class="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 text-red-400"
					>
						<AlertTriangle size={32} strokeWidth={1.5} />
					</div>
					<h3 class="font-display text-lg text-white/70">Loading Timeout</h3>
					<p class="mt-1 mb-6 text-sm text-white/40">Calendar view took too long to load</p>
					<button
						onclick={() => {
							CalendarView = null;
							calendarTimeout = false;
							void loadCalendarView();
						}}
						class="flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-5 py-2.5 text-sm font-medium text-amber-400 transition-all hover:bg-amber-500/15"
					>
						<RefreshCw size={16} strokeWidth={1.5} />
						Try Again
					</button>
				</div>
			{:else}
				<!-- Calendar Loading Skeleton -->
				<div class="space-y-4">
					<!-- Month headers skeleton -->
					<div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
						{#each Array.from({ length: 12 }) as _, i (i)}
							<div class="card-elevated animate-pulse rounded-2xl p-4 sm:p-5">
								<!-- Month title skeleton -->
								<div class="mb-4 flex items-center justify-between">
									<div class="h-6 w-20 rounded bg-white/10"></div>
									<div class="h-6 w-8 rounded-full bg-white/5"></div>
								</div>

								<!-- Calendar grid skeleton -->
								<div class="grid grid-cols-7 gap-1">
									<!-- Weekday headers -->
									{#each Array.from({ length: 7 }) as _, i (i)}
										<div class="h-4 rounded bg-white/5"></div>
									{/each}

									<!-- Calendar days -->
									{#each Array.from({ length: 35 }) as _, i (i)}
										<div class="aspect-square rounded-lg bg-white/5"></div>
									{/each}
								</div>
							</div>
						{/each}
					</div>
				</div>
			{/if}
		{:else if viewMode === 'grid'}
			<!-- Grid View -->
			<section aria-labelledby="grid-view-heading">
				<h2 id="grid-view-heading" class="sr-only">Holiday Grid View</h2>
				<div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
					{#each filteredHolidays as holiday, i (holiday.id ?? holiday.name)}
						<div class="animate-fade-in-up opacity-0" style="animation-delay: {i * 30}ms">
							<HolidayCard {holiday} />
						</div>
					{/each}
				</div>
			</section>
		{:else if viewMode === 'timeline'}
			<!-- Timeline View -->
			<section aria-labelledby="timeline-view-heading">
				<h2 id="timeline-view-heading" class="sr-only">Holiday Timeline View</h2>
				<div class="space-y-16">
					{#each Array.from(holidaysByMonth.entries()) as [month, monthHolidays], monthIndex (month)}
						<section
							class="animate-fade-in-up opacity-0"
							style="animation-delay: {monthIndex * 100}ms"
						>
							<div class="sticky top-0 z-20 -mx-4 mb-8 bg-[#050507]/90 px-4 py-4 backdrop-blur-xl">
								<h2 class="font-display flex items-center gap-4 text-2xl">
									<span class="h-px w-12 bg-gradient-to-r from-amber-500/50 to-transparent"></span>
									<span class="text-white/90">{month}</span>
									<span
										class="rounded-lg bg-white/[0.06] px-3 py-1 text-sm font-normal text-white/40"
									>
										{monthHolidays.length}
										{monthHolidays.length === 1 ? 'holiday' : 'holidays'}
									</span>
								</h2>
							</div>
							<div class="relative ml-6 border-l border-white/[0.08] pl-10">
								{#each monthHolidays as holiday, i (holiday.id ?? holiday.name)}
									<div
										class="relative mb-8 animate-slide-in-left opacity-0 last:mb-0"
										style="animation-delay: {i * 80}ms"
									>
										<!-- Timeline dot -->
										<div
											class="absolute top-8 -left-[43px] h-3 w-3 rounded-full border-2 border-amber-500/60 bg-[#050507]"
										></div>
										<HolidayCard {holiday} />
									</div>
								{/each}
							</div>
						</section>
					{/each}
				</div>
			</section>
		{:else}
			<!-- Leave Optimizer View -->
			<section aria-labelledby="optimizer-view-heading">
				<h2 id="optimizer-view-heading" class="sr-only">Leave Planner View</h2>
				{#if LeaveOptimizerView}
					<LeaveOptimizerView onViewCalendar={handleViewCalendarFromOptimizer} />
				{:else if optimizerTimeout}
					<div
						class="flex animate-scale-in flex-col items-center justify-center py-24 text-center opacity-0"
					>
						<div
							class="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 text-red-400"
						>
							<AlertTriangle size={32} strokeWidth={1.5} />
						</div>
						<h3 class="font-display text-lg text-white/70">Loading Timeout</h3>
						<p class="mt-1 mb-6 text-sm text-white/40">Leave planner took too long to load</p>
						<button
							onclick={() => {
								LeaveOptimizerView = null;
								optimizerTimeout = false;
								void loadLeaveOptimizerView();
							}}
							class="flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-5 py-2.5 text-sm font-medium text-amber-400 transition-all hover:bg-amber-500/15"
						>
							<RefreshCw size={16} strokeWidth={1.5} />
							Try Again
						</button>
					</div>
				{:else}
					<!-- Leave Optimizer Loading Skeleton -->
					<div class="space-y-8">
						<!-- Header skeleton -->
						<div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
							<div>
								<div class="mb-2 h-8 w-64 rounded bg-white/10"></div>
								<div class="h-4 w-96 rounded bg-white/5"></div>
								<div class="mt-1 h-4 w-80 rounded bg-white/5"></div>
							</div>
							<!-- Stats skeleton -->
							<div class="flex flex-wrap gap-3">
								{#each Array.from({ length: 3 }) as _, i (i)}
									<div class="flex flex-col rounded-xl bg-white/5 px-4 py-3">
										<div class="mb-1 h-6 w-12 rounded bg-white/10"></div>
										<div class="h-3 w-16 rounded bg-white/5"></div>
									</div>
								{/each}
							</div>
						</div>

						<!-- Controls skeleton -->
						<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
							<div class="flex items-center gap-3">
								<div class="h-4 w-16 rounded bg-white/5"></div>
								<div class="flex items-center gap-1">
									{#each Array.from({ length: 3 }) as _, i (i)}
										<div class="flex items-center gap-1.5 rounded-lg bg-white/5 px-3 py-1.5">
											<div class="h-4 w-4 rounded bg-white/10"></div>
											<div class="h-3 w-16 rounded bg-white/10"></div>
										</div>
									{/each}
								</div>
							</div>
							<div class="h-10 w-24 rounded-lg bg-white/5"></div>
						</div>

						<!-- Cards skeleton -->
						<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
							{#each Array.from({ length: 6 }) as _, i (i)}
								<div
									class="animate-pulse rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6"
									style="animation-delay: {i * 100}ms"
								>
									<div class="mb-4 flex items-start justify-between">
										<div class="flex-1">
											<div class="mb-2 h-5 w-3/4 rounded bg-white/10"></div>
											<div class="mb-1 h-4 w-1/2 rounded bg-white/5"></div>
											<div class="h-3 w-2/3 rounded bg-white/5"></div>
										</div>
										<div class="h-6 w-16 rounded-full bg-white/5"></div>
									</div>
									<div class="space-y-2">
										<div class="flex items-center gap-2">
											<div class="h-4 w-4 rounded bg-white/5"></div>
											<div class="h-3 w-24 rounded bg-white/10"></div>
										</div>
										<div class="flex items-center gap-2">
											<div class="h-4 w-4 rounded bg-white/5"></div>
											<div class="h-3 w-20 rounded bg-white/10"></div>
										</div>
										<div class="flex items-center gap-2">
											<div class="h-4 w-4 rounded bg-white/5"></div>
											<div class="h-3 w-28 rounded bg-white/10"></div>
										</div>
									</div>
									<div class="mt-4 flex gap-2">
										<div class="h-8 flex-1 rounded-lg bg-white/5"></div>
										<div class="h-8 w-20 rounded-lg bg-white/5"></div>
									</div>
								</div>
							{/each}
						</div>
					</div>
				{/if}
			</section>
		{/if}

		<!-- Empty state -->
		{#if filteredHolidays.length === 0}
			<div
				class="flex animate-scale-in flex-col items-center justify-center py-24 text-center opacity-0"
			>
				<div
					class="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-white/[0.04] text-white/40"
				>
					<Search size={40} strokeWidth={1} aria-hidden="true" />
				</div>
				<h3 class="font-display text-xl text-white/70">No holidays found</h3>
				<p class="mt-2 text-sm text-white/40">Try adjusting your search criteria</p>
				<button
					onclick={() => {
						searchQuery = '';
					}}
					class="mt-6 flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-5 py-2.5 text-sm font-medium text-amber-400 transition-all hover:bg-amber-500/15"
				>
					<X size={16} strokeWidth={2} aria-hidden="true" />
					Clear search
				</button>
			</div>

			<!-- Live region for screen readers - empty state announcements -->
			<div aria-live="assertive" aria-atomic="true" class="sr-only">
				No holidays found matching your search criteria. Try adjusting your search terms.
			</div>
		{/if}

		<!-- Substitute Working Days Section -->
		{#if substituteWorkDays.length > 0}
			<section class="mt-20 animate-fade-in-up opacity-0" style="animation-delay: 200ms">
				<div class="mb-8 flex items-center gap-4">
					<div
						class="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/15 text-orange-400"
					>
						<Building2 size={24} strokeWidth={1.5} />
					</div>
					<div>
						<h2 class="font-display text-xl text-white/90 sm:text-2xl">Substitute Working Days</h2>
						<p class="mt-1 text-sm text-white/40">
							{substituteWorkDays.length} day{substituteWorkDays.length > 1 ? 's' : ''} requiring office
							attendance
						</p>
					</div>
				</div>

				<p class="mb-6 text-sm leading-relaxed text-white/50">
					These are days when you <strong class="text-orange-300">must attend office</strong> even though
					they fall on weekends. They substitute for public holidays.
				</p>

				<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{#each substituteWorkDays as subDay, i (subDay.id ?? subDay.date)}
						<div
							class="card-elevated group animate-fade-in-up rounded-2xl border-orange-500/20 p-5 opacity-0 transition-all hover:border-orange-500/30"
							style="animation-delay: {i * 100 + 300}ms"
						>
							<div class="flex items-center gap-4">
								<div
									class="flex h-14 w-14 flex-col items-center justify-center rounded-xl bg-orange-500/15"
								>
									<span class="text-xl font-semibold text-orange-300"
										>{formatDate(subDay.date).split(' ')[1]}</span
									>
									<span class="text-[10px] font-medium text-orange-400/60 uppercase"
										>{formatDate(subDay.date).split(' ')[0]}</span
									>
								</div>
								<div class="flex-1">
									<h3 class="font-medium text-orange-200">{subDay.day} - Work Day</h3>
									<p class="mt-0.5 text-xs text-orange-300/50">{subDay.reason}</p>
								</div>
							</div>
							<p class="font-myanmar mt-3 text-xs text-orange-300/40">{subDay.reasonMyanmar}</p>
						</div>
					{/each}
				</div>
			</section>
		{/if}

		<!-- Important Notes Section -->
		<section class="mt-20 animate-fade-in-up opacity-0" style="animation-delay: 300ms">
			<div class="mb-8 flex items-center gap-4">
				<div
					class="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/15 text-amber-400"
				>
					<Sparkles size={24} strokeWidth={1.5} aria-hidden="true" />
				</div>
				<h2 class="font-display text-xl text-white/90 sm:text-2xl">Important Notes</h2>
			</div>

			<div class="grid gap-4 sm:grid-cols-2">
				<!-- Substitute Working Days Note -->
				<div class="card-elevated rounded-2xl border-orange-500/15 p-6">
					<div class="flex items-center gap-3 text-orange-400">
						<Building2 size={20} strokeWidth={1.5} />
						<h3 class="font-medium">Substitute Working Days</h3>
					</div>
					<p class="mt-3 text-sm leading-relaxed text-white/50">
						When public holidays fall on weekends, the government may designate <strong
							class="text-orange-300/80">substitute working days</strong
						> (usually Saturdays) when offices must remain open.
					</p>
				</div>

				<!-- Thingyan Note -->
				<div class="card-elevated rounded-2xl border-rose-500/15 p-6">
					<div class="flex items-center gap-3 text-rose-400">
						<Droplets size={20} strokeWidth={1.5} aria-hidden="true" />
						<h3 class="font-medium">Thingyan Festival</h3>
					</div>
					<p class="mt-3 text-sm leading-relaxed text-white/50">
						The 2026 Thingyan holiday spans <strong class="text-white/70">9 consecutive days</strong
						> (April 11-19). All government offices and banks will be closed during this period.
					</p>
				</div>

				<!-- Lunar Dependent Note -->
				<div class="card-elevated rounded-2xl border-violet-500/15 p-6">
					<div class="flex items-center gap-3 text-violet-400">
						<Moon size={20} strokeWidth={1.5} aria-hidden="true" />
						<h3 class="font-medium">Lunar-Dependent Dates</h3>
					</div>
					<p class="mt-3 text-sm leading-relaxed text-white/50">
						Dates for <strong class="text-white/70">Eid al-Fitr</strong> and
						<strong class="text-white/70">Deepavali</strong> are marked with * (to be announced). Exact
						dates are subject to moon sighting and government notification.
					</p>
				</div>

				<!-- Weekend Holidays Note -->
				<div class="card-elevated rounded-2xl border-amber-500/15 p-6">
					<div class="flex items-center gap-3 text-amber-400">
						<CalendarCheck size={20} strokeWidth={1.5} aria-hidden="true" />
						<h3 class="font-medium">Weekend Holidays</h3>
					</div>
					<p class="mt-3 text-sm leading-relaxed text-white/50">
						Public holidays that fall on <strong class="text-white/70">Saturday or Sunday</strong> are
						not substituted with replacement holidays on other working days.
					</p>
				</div>

				<!-- Kayin New Year Note -->
				<div class="card-elevated rounded-2xl border-emerald-500/15 p-6 sm:col-span-2">
					<div class="flex items-center gap-3 text-emerald-400">
						<TreePine size={20} strokeWidth={1.5} aria-hidden="true" />
						<h3 class="font-medium">Kayin New Year</h3>
					</div>
					<p class="mt-3 text-sm leading-relaxed text-white/50">
						There is <strong class="text-white/70">no Kayin New Year</strong> in 2026. The previous one
						fell on December 19, 2025, and the next occurs in early 2027.
					</p>
				</div>
			</div>
		</section>

		<!-- Footer -->
		<footer class="mt-20 border-t border-white/[0.06] pt-10 text-center">
			<p class="text-sm text-white/30">
				Data verified against official government announcements and DICA gazettes.
			</p>
			<p class="mt-3 flex items-center justify-center gap-2 text-xs text-white/30">
				<span>Made with</span>
				<Heart size={12} strokeWidth={2} class="text-rose-500/60" aria-hidden="true" />
				<span>for Myanmar</span>
				<span class="mx-2">|</span>
				<span>{new Date().getFullYear()}</span>
			</p>
			<p class="mt-2 text-xs text-white/25">
				<a
					href="https://github.com/AungMyoKyaw/myanmar-public-holidays-2026"
					target="_blank"
					rel="noopener noreferrer"
					class="inline-flex items-center gap-1.5 transition-colors hover:text-white/40"
				>
					<Github size={12} strokeWidth={1.5} aria-hidden="true" />
					View source on GitHub
				</a>
			</p>
		</footer>
	</main>
</div>
