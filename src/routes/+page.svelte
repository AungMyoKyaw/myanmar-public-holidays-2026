<script lang="ts">
	import HolidayCard from '$lib/components/HolidayCard.svelte';
	import CalendarView from '$lib/components/CalendarView.svelte';
	import {
		holidays,
		groupHolidaysByMonth,
		getTotalHolidayDays,
		categoryLabels,
		categoryColors,
		type Holiday
	} from '$lib/data/holidays';

	let searchQuery = $state('');
	let selectedCategory = $state<Holiday['category'] | 'all'>('all');
	let viewMode = $state<'grid' | 'timeline' | 'calendar'>('calendar');

	const categories: (Holiday['category'] | 'all')[] = ['all', 'national', 'religious', 'cultural', 'international'];

	const filteredHolidays = $derived(
		holidays.filter((h) => {
			const matchesSearch =
				searchQuery === '' ||
				h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				h.nameMyanmar?.includes(searchQuery) ||
				h.description?.toLowerCase().includes(searchQuery.toLowerCase());
			const matchesCategory = selectedCategory === 'all' || h.category === selectedCategory;
			return matchesSearch && matchesCategory;
		})
	);

	const groupedHolidays = $derived(
		(() => {
			const grouped = new Map<string, Holiday[]>();
			filteredHolidays.forEach((holiday) => {
				const date = new Date(holiday.startDate);
				const month = date.toLocaleDateString('en-US', { month: 'long' });
				if (!grouped.has(month)) {
					grouped.set(month, []);
				}
				grouped.get(month)!.push(holiday);
			});
			return grouped;
		})()
	);

	const stats = $derived({
		total: holidays.length,
		totalDays: getTotalHolidayDays(),
		national: holidays.filter((h) => h.category === 'national').length,
		religious: holidays.filter((h) => h.category === 'religious').length,
		cultural: holidays.filter((h) => h.category === 'cultural').length,
		international: holidays.filter((h) => h.category === 'international').length
	});
</script>

<svelte:head>
	<!-- Primary Meta Tags -->
	<title>Myanmar Public Holidays 2026 | မြန်မာနိုင်ငံ အများပြည်သူရုံးပိတ်ရက်များ</title>
	<meta name="title" content="Myanmar Public Holidays 2026 | မြန်မာနိုင်ငံ အများပြည်သူရုံးပိတ်ရက်များ" />
	<meta
		name="description"
		content="Complete list of 32 official public holidays in Myanmar for 2026. Plan your year with Thingyan (9 days), Independence Day, Union Day, Thadingyut, and more. Includes calendar view, filtering, and bilingual support."
	/>
	<meta name="keywords" content="Myanmar holidays 2026, Myanmar public holidays, Thingyan 2026, Burma holidays, မြန်မာရုံးပိတ်ရက်, သင်္ကြန်, Independence Day Myanmar, Union Day, Thadingyut, Buddhist holidays" />
	<meta name="author" content="Myanmar Holidays" />
	<meta name="robots" content="index, follow" />
	<link rel="canonical" href="https://myanmar-holidays-2026.vercel.app" />

	<!-- Open Graph / Facebook -->
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://myanmar-holidays-2026.vercel.app" />
	<meta property="og:title" content="Myanmar Public Holidays 2026 🇲🇲" />
	<meta property="og:description" content="Plan your year with the complete list of 32 official public holidays in Myanmar for 2026. Features calendar view, Thingyan dates (Apr 11-19), and bilingual support." />
	<meta property="og:image" content="https://myanmar-holidays-2026.vercel.app/og-image.png" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:locale" content="en_US" />
	<meta property="og:locale:alternate" content="my_MM" />
	<meta property="og:site_name" content="Myanmar Holidays 2026" />

	<!-- Twitter -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:url" content="https://myanmar-holidays-2026.vercel.app" />
	<meta name="twitter:title" content="Myanmar Public Holidays 2026 🇲🇲" />
	<meta name="twitter:description" content="Plan your year with the complete list of 32 official public holidays in Myanmar for 2026. Features calendar view, Thingyan dates (Apr 11-19), and bilingual support." />
	<meta name="twitter:image" content="https://myanmar-holidays-2026.vercel.app/og-image.png" />

	<!-- Mobile & PWA -->
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
	<meta name="theme-color" content="#0a0a0f" />
	<meta name="apple-mobile-web-app-capable" content="yes" />
	<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
	<meta name="apple-mobile-web-app-title" content="MM Holidays 2026" />

	<!-- Fonts -->
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Noto+Sans+Myanmar:wght@400;500;600;700&display=swap"
		rel="stylesheet"
	/>

	<!-- Structured Data for SEO -->
	{@html `<script type="application/ld+json">
	{
		"@context": "https://schema.org",
		"@type": "WebApplication",
		"name": "Myanmar Public Holidays 2026",
		"description": "Complete list of 32 official public holidays in Myanmar for 2026",
		"url": "https://myanmar-holidays-2026.vercel.app",
		"applicationCategory": "UtilitiesApplication",
		"operatingSystem": "Any",
		"offers": {
			"@type": "Offer",
			"price": "0",
			"priceCurrency": "USD"
		},
		"author": {
			"@type": "Organization",
			"name": "Myanmar Holidays"
		}
	}
	</script>`}
</svelte:head>

<div class="min-h-screen bg-[#0a0a0f] text-white">
	<!-- Animated background -->
	<div class="fixed inset-0 overflow-hidden pointer-events-none">
		<div class="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-amber-900/20 via-transparent to-transparent rounded-full blur-3xl animate-pulse-slow"></div>
		<div class="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-rose-900/20 via-transparent to-transparent rounded-full blur-3xl animate-pulse-slow" style="animation-delay: 2s;"></div>
		<div class="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-violet-900/10 to-transparent rounded-full blur-3xl animate-float"></div>
	</div>

	<!-- Header -->
	<header class="relative z-10 border-b border-white/5">
		<div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
			<div class="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
				<div>
					<div class="flex items-center gap-3 mb-3">
						<span class="text-4xl">🇲🇲</span>
						<div class="h-8 w-px bg-gradient-to-b from-transparent via-amber-500/50 to-transparent"></div>
						<span class="text-xs font-medium uppercase tracking-[0.3em] text-amber-500/80">Official Calendar</span>
					</div>
					<h1 class="font-outfit text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
						<span class="bg-gradient-to-r from-white via-amber-100 to-white bg-clip-text text-transparent">
							Myanmar Holidays
						</span>
						<span class="ml-3 inline-flex items-center rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 px-4 py-1 text-2xl font-bold text-white shadow-lg shadow-amber-500/25">
							2026
						</span>
					</h1>
					<p class="mt-3 font-myanmar text-lg text-white/50">
						မြန်မာနိုင်ငံ အများပြည်သူရုံးပိတ်ရက်များ ၂၀၂၆
					</p>
				</div>

				<!-- Stats cards -->
				<div class="flex flex-wrap gap-3">
					<div class="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur-sm transition-all hover:border-amber-500/30 hover:bg-white/10">
						<div class="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100"></div>
						<div class="relative">
							<div class="text-3xl font-bold text-white">{stats.total}</div>
							<div class="text-xs font-medium uppercase tracking-wider text-white/40">Holidays</div>
						</div>
					</div>
					<div class="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur-sm transition-all hover:border-rose-500/30 hover:bg-white/10">
						<div class="absolute inset-0 bg-gradient-to-br from-rose-500/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100"></div>
						<div class="relative">
							<div class="text-3xl font-bold text-white">{stats.totalDays}</div>
							<div class="text-xs font-medium uppercase tracking-wider text-white/40">Days Off</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</header>

	<main class="relative z-10 mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
		<!-- Filters -->
		<div class="mb-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
			<!-- Search -->
			<div class="relative max-w-md flex-1">
				<svg
					class="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/30"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
					/>
				</svg>
				<input
					type="text"
					bind:value={searchQuery}
					placeholder="Search holidays..."
					class="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-12 pr-4 text-white placeholder-white/30 backdrop-blur-sm transition-all focus:border-amber-500/50 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
				/>
			</div>

			<!-- Category filters -->
			<div class="flex flex-wrap items-center gap-2">
				{#each categories as category}
					{@const isActive = selectedCategory === category}
					{@const colors = category === 'all' ? null : categoryColors[category]}
					<button
						onclick={() => (selectedCategory = category)}
						class="rounded-full border px-4 py-2 text-sm font-medium transition-all {isActive
							? 'border-amber-500/50 bg-amber-500/20 text-amber-300'
							: 'border-white/10 bg-white/5 text-white/60 hover:border-white/20 hover:bg-white/10 hover:text-white'}"
					>
						{category === 'all' ? 'All' : categoryLabels[category]}
						{#if category !== 'all'}
							<span class="ml-1.5 text-xs opacity-60">
								({stats[category]})
							</span>
						{/if}
					</button>
				{/each}
			</div>

			<!-- View toggle -->
			<div class="flex items-center gap-1 rounded-xl border border-white/10 bg-white/5 p-1">
				<button
					onclick={() => (viewMode = 'calendar')}
					class="rounded-lg p-2 transition-all {viewMode === 'calendar'
						? 'bg-white/10 text-white'
						: 'text-white/40 hover:text-white'}"
					title="Calendar View"
				>
					<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
						/>
					</svg>
				</button>
				<button
					onclick={() => (viewMode = 'grid')}
					class="rounded-lg p-2 transition-all {viewMode === 'grid'
						? 'bg-white/10 text-white'
						: 'text-white/40 hover:text-white'}"
					title="Grid View"
				>
					<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
						/>
					</svg>
				</button>
				<button
					onclick={() => (viewMode = 'timeline')}
					class="rounded-lg p-2 transition-all {viewMode === 'timeline'
						? 'bg-white/10 text-white'
						: 'text-white/40 hover:text-white'}"
					title="Timeline View"
				>
					<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M4 6h16M4 10h16M4 14h16M4 18h16"
						/>
					</svg>
				</button>
			</div>
		</div>

		<!-- Results count -->
		{#if filteredHolidays.length !== holidays.length && viewMode !== 'calendar'}
			<div class="mb-6 text-sm text-white/40">
				Showing {filteredHolidays.length} of {holidays.length} holidays
			</div>
		{/if}

		<!-- Calendar View -->
		{#if viewMode === 'calendar'}
			<CalendarView holidays={filteredHolidays} year={2026} />
		{:else if viewMode === 'grid'}
			<!-- Grid View -->
			<div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
				{#each filteredHolidays as holiday, i}
					<div style="animation: fadeInUp 0.5s ease-out {i * 0.05}s both;">
						<HolidayCard {holiday} />
					</div>
				{/each}
			</div>
		{:else}
			<!-- Timeline View -->
			<div class="space-y-12">
				{#each groupedHolidays as [month, monthHolidays], monthIndex}
					<section style="animation: fadeInUp 0.5s ease-out {monthIndex * 0.1}s both;">
						<div class="sticky top-0 z-20 -mx-4 mb-6 bg-gradient-to-r from-[#0a0a0f] via-[#0a0a0f]/95 to-transparent px-4 py-3 backdrop-blur-xl">
							<h2 class="inline-flex items-center gap-3 text-2xl font-bold">
								<span class="h-px w-8 bg-gradient-to-r from-amber-500 to-transparent"></span>
								{month}
								<span class="text-sm font-normal text-white/30">({monthHolidays.length} {monthHolidays.length === 1 ? 'holiday' : 'holidays'})</span>
							</h2>
						</div>
						<div class="relative ml-4 border-l border-white/10 pl-8">
							{#each monthHolidays as holiday, i}
								<div class="relative mb-6 last:mb-0" style="animation: fadeInLeft 0.4s ease-out {i * 0.1}s both;">
									<!-- Timeline dot -->
									<div class="absolute -left-[41px] top-6 h-3 w-3 rounded-full border-2 border-amber-500 bg-[#0a0a0f]"></div>
									<HolidayCard {holiday} />
								</div>
							{/each}
						</div>
					</section>
				{/each}
			</div>
		{/if}

		<!-- Empty state -->
		{#if filteredHolidays.length === 0}
			<div class="flex flex-col items-center justify-center py-20 text-center">
				<div class="text-6xl mb-4">🔍</div>
				<h3 class="text-xl font-semibold text-white/80">No holidays found</h3>
				<p class="mt-2 text-white/40">Try adjusting your search or filter criteria</p>
				<button
					onclick={() => {
						searchQuery = '';
						selectedCategory = 'all';
					}}
					class="mt-4 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-sm font-medium text-amber-400 transition-all hover:bg-amber-500/20"
				>
					Clear filters
				</button>
			</div>
		{/if}

		<!-- Important Notes -->
		<section class="mt-16">
			<h2 class="mb-6 flex items-center gap-3 text-xl font-bold">
				<span class="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400">
					📋
				</span>
				Important Notes
			</h2>
			<div class="grid gap-4 sm:grid-cols-2">
				<div class="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-5">
					<h3 class="flex items-center gap-2 font-semibold text-rose-300">
						<span>💧</span> Thingyan Festival
					</h3>
					<p class="mt-2 text-sm leading-relaxed text-white/60">
						The 2026 Thingyan holiday spans <strong class="text-white">9 consecutive days</strong> (April 11–19). All government offices and banks will be closed during this period.
					</p>
				</div>
				<div class="rounded-2xl border border-violet-500/20 bg-violet-500/5 p-5">
					<h3 class="flex items-center gap-2 font-semibold text-violet-300">
						<span>🌙</span> Lunar-Dependent Dates
					</h3>
					<p class="mt-2 text-sm leading-relaxed text-white/60">
						Dates for <strong class="text-white">Eid al-Adha</strong> and <strong class="text-white">Deepavali</strong> are projections. The Ministry of Labour confirms exact dates 1–2 weeks in advance.
					</p>
				</div>
				<div class="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5">
					<h3 class="flex items-center gap-2 font-semibold text-amber-300">
						<span>📅</span> Double Holidays
					</h3>
					<p class="mt-2 text-sm leading-relaxed text-white/60">
						On <strong class="text-white">March 2</strong>, Peasants' Day coincides with the Full Moon of Tabaung. The total of 32 holiday days remains consistent.
					</p>
				</div>
				<div class="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">
					<h3 class="flex items-center gap-2 font-semibold text-emerald-300">
						<span>🎄</span> Kayin New Year
					</h3>
					<p class="mt-2 text-sm leading-relaxed text-white/60">
						There is <strong class="text-white">no Kayin New Year</strong> in 2026. The previous one fell on December 19, 2025, and the next occurs in early 2027.
					</p>
				</div>
			</div>
		</section>

		<!-- Footer -->
		<footer class="mt-16 border-t border-white/5 pt-8 text-center">
			<p class="text-sm text-white/30">
				Data verified against official government announcements and DICA gazettes.
			</p>
			<p class="mt-2 text-xs text-white/20">
				Made with ❤️ for Myanmar | {new Date().getFullYear()}
			</p>
		</footer>
	</main>
</div>

<style>
	:global(body) {
		font-family: 'Outfit', system-ui, sans-serif;
		background: #0a0a0f;
	}

	.font-outfit {
		font-family: 'Outfit', system-ui, sans-serif;
	}

	.font-myanmar {
		font-family: 'Noto Sans Myanmar', sans-serif;
	}

	@keyframes fadeInUp {
		from {
			opacity: 0;
			transform: translateY(20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@keyframes fadeInLeft {
		from {
			opacity: 0;
			transform: translateX(-20px);
		}
		to {
			opacity: 1;
			transform: translateX(0);
		}
	}

	@keyframes pulse-slow {
		0%, 100% {
			opacity: 0.3;
		}
		50% {
			opacity: 0.5;
		}
	}

	@keyframes float {
		0%, 100% {
			transform: translateY(0) rotate(0deg);
		}
		50% {
			transform: translateY(-20px) rotate(5deg);
		}
	}

	.animate-pulse-slow {
		animation: pulse-slow 8s ease-in-out infinite;
	}

	.animate-float {
		animation: float 15s ease-in-out infinite;
	}
</style>
