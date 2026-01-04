<script lang="ts">
	import HolidayCard from '$lib/components/HolidayCard.svelte';
	import CalendarView from '$lib/components/CalendarView.svelte';
	import LeaveOptimizerView from '$lib/components/LeaveOptimizerView.svelte';
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
		Github
	} from 'lucide-svelte';

	let searchQuery = $state('');
	let viewMode = $state<'grid' | 'timeline' | 'calendar' | 'optimizer'>('calendar');
	let highlightedDateRange = $state<{ start: string; end: string } | null>(null);

	// Filter holidays based on search query
	const filteredHolidays = $derived(
		holidays.filter((holiday) => {
			// Search filter
			const matchesSearch =
				searchQuery === '' ||
				holiday.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				holiday.nameMyanmar?.toLowerCase().includes(searchQuery.toLowerCase()) ||
				holiday.description?.toLowerCase().includes(searchQuery.toLowerCase());

			return matchesSearch;
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
							<svg viewBox="0 0 36 36" class="h-5 w-5" fill="currentColor">
								<path
									d="M32.5 5H28V1a1 1 0 00-2 0v4H10V1a1 1 0 00-2 0v4H3.5C1.57 5 0 6.57 0 8.5v24C0 34.43 1.57 36 3.5 36h29c1.93 0 3.5-1.57 3.5-3.5v-24C36 6.57 34.43 5 32.5 5zM34 32.5c0 .83-.67 1.5-1.5 1.5h-29C2.67 34 2 33.33 2 32.5V14h32v18.5zM34 12H2V8.5C2 7.67 2.67 7 3.5 7H8v2a1 1 0 002 0V7h16v2a1 1 0 002 0V7h4.5c.83 0 1.5.67 1.5 1.5V12z"
								/>
							</svg>
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
					<p class="font-myanmar mt-3 text-base text-white/40 sm:text-lg">
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

	<main class="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
		<!-- Filters Section -->
		<div
			class="stagger-3 mb-8 flex animate-fade-in-up flex-col gap-4 opacity-0 sm:mb-12 lg:flex-row lg:items-center lg:justify-between"
		>
			<!-- Search -->
			<div class="relative w-full lg:max-w-md">
				<Search
					size={18}
					strokeWidth={1.5}
					class="absolute top-1/2 left-4 -translate-y-1/2 text-white/25"
				/>
				<input
					type="text"
					bind:value={searchQuery}
					placeholder="Search holidays..."
					class="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] py-3 pr-10 pl-12 text-sm text-white placeholder-white/30 backdrop-blur-sm transition-all focus:border-amber-500/40 focus:bg-white/[0.06] focus:ring-2 focus:ring-amber-500/10 focus:outline-none"
				/>
				{#if searchQuery}
					<button
						onclick={clearSearch}
						class="absolute top-1/2 right-3 -translate-y-1/2 rounded-md p-1 text-white/30 transition-colors hover:bg-white/10 hover:text-white/60"
					>
						<X size={16} strokeWidth={2} />
					</button>
				{/if}
			</div>

			<!-- View toggle -->
			<div
				class="flex items-center gap-1 rounded-xl border border-white/[0.08] bg-white/[0.03] p-1"
			>
				<button
					onclick={() => (viewMode = 'calendar')}
					class="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-all {viewMode ===
					'calendar'
						? 'bg-white/10 text-white'
						: 'text-white/40 hover:text-white/70'}"
					title="Calendar View"
				>
					<CalendarDays size={16} strokeWidth={1.5} />
					<span class="hidden sm:inline">Calendar</span>
				</button>
				<button
					onclick={() => (viewMode = 'grid')}
					class="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-all {viewMode ===
					'grid'
						? 'bg-white/10 text-white'
						: 'text-white/40 hover:text-white/70'}"
					title="Grid View"
				>
					<LayoutGrid size={16} strokeWidth={1.5} />
					<span class="hidden sm:inline">Grid</span>
				</button>
				<button
					onclick={() => (viewMode = 'timeline')}
					class="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-all {viewMode ===
					'timeline'
						? 'bg-white/10 text-white'
						: 'text-white/40 hover:text-white/70'}"
					title="Timeline View"
				>
					<List size={16} strokeWidth={1.5} />
					<span class="hidden sm:inline">Timeline</span>
				</button>
				<button
					onclick={() => (viewMode = 'optimizer')}
					class="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-all {viewMode ===
					'optimizer'
						? 'bg-amber-500/20 text-amber-400'
						: 'text-white/40 hover:text-white/70'}"
					title="Leave Planner"
				>
					<CalendarCheck size={16} strokeWidth={1.5} />
					<span class="hidden sm:inline">Leave Planner</span>
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

		<!-- Calendar View -->
		{#if viewMode === 'calendar'}
			<CalendarView holidays={filteredHolidays} year={2026} {highlightedDateRange} />
		{:else if viewMode === 'grid'}
			<!-- Grid View -->
			<div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
				{#each filteredHolidays as holiday, i (holiday.id)}
					<div class="animate-fade-in-up opacity-0" style="animation-delay: {i * 50}ms">
						<HolidayCard {holiday} />
					</div>
				{/each}
			</div>
		{:else if viewMode === 'timeline'}
			<!-- Timeline View -->
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
							{#each monthHolidays as holiday, i (holiday.id)}
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
		{:else}
			<!-- Leave Optimizer View -->
			<LeaveOptimizerView onViewCalendar={handleViewCalendarFromOptimizer} />
		{/if}

		<!-- Empty state -->
		{#if filteredHolidays.length === 0}
			<div
				class="flex animate-scale-in flex-col items-center justify-center py-24 text-center opacity-0"
			>
				<div
					class="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-white/[0.04] text-white/20"
				>
					<Search size={40} strokeWidth={1} />
				</div>
				<h3 class="font-display text-xl text-white/70">No holidays found</h3>
				<p class="mt-2 text-sm text-white/40">Try adjusting your search criteria</p>
				<button
					onclick={() => {
						searchQuery = '';
					}}
					class="mt-6 flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-5 py-2.5 text-sm font-medium text-amber-400 transition-all hover:bg-amber-500/15"
				>
					<X size={16} strokeWidth={2} />
					Clear search
				</button>
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
					{#each substituteWorkDays as subDay, i (subDay.id)}
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
					<Sparkles size={24} strokeWidth={1.5} />
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
						<Droplets size={20} strokeWidth={1.5} />
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
						<Moon size={20} strokeWidth={1.5} />
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
						<CalendarCheck size={20} strokeWidth={1.5} />
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
						<TreePine size={20} strokeWidth={1.5} />
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
			<p class="mt-3 flex items-center justify-center gap-2 text-xs text-white/20">
				<span>Made with</span>
				<Heart size={12} strokeWidth={2} class="text-rose-500/60" />
				<span>for Myanmar</span>
				<span class="mx-2">|</span>
				<span>{new Date().getFullYear()}</span>
			</p>
			<p class="mt-2 text-xs text-white/15">
				<a
					href="https://github.com/AungMyoKyaw/myanmar-public-holidays-2026"
					target="_blank"
					rel="noopener noreferrer"
					class="inline-flex items-center gap-1.5 transition-colors hover:text-white/40"
				>
					<Github size={12} strokeWidth={1.5} />
					View source on GitHub
				</a>
			</p>
		</footer>
	</main>
</div>
