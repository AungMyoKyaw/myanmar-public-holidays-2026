<script lang="ts">
	import type { Holiday } from '$lib/data/holidays';
	import {
		categoryColors,
		categoryLabels,
		formatDateRange,
		getHolidayDays
	} from '$lib/data/holidays';

	let { holiday }: { holiday: Holiday } = $props();

	const colors = $derived(categoryColors[holiday.category]);
	const days = $derived(getHolidayDays(holiday));
</script>

<article
	class="group relative overflow-hidden rounded-2xl border {colors.border} {colors.bg} p-5 backdrop-blur-sm transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-white/5"
>
	<!-- Glow effect on hover -->
	<div
		class="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
	></div>

	<!-- Icon floating -->
	<div
		class="absolute -top-2 -right-2 text-5xl opacity-20 transition-all duration-500 group-hover:scale-110 group-hover:opacity-40"
	>
		{holiday.icon}
	</div>

	<div class="relative z-10">
		<!-- Category badge -->
		<span
			class="inline-block rounded-full border px-3 py-1 text-xs font-medium tracking-wider uppercase {colors.border} {colors.text}"
		>
			{categoryLabels[holiday.category]}
		</span>

		<!-- Holiday name -->
		<h3 class="mt-3 text-lg leading-tight font-semibold text-white">
			{holiday.name}
		</h3>

		{#if holiday.nameMyanmar}
			<p class="font-myanmar mt-1 text-sm text-white/60">
				{holiday.nameMyanmar}
			</p>
		{/if}

		<!-- Date info -->
		<div class="mt-4 flex items-center gap-3">
			<div class="flex items-center gap-2">
				<svg class="h-4 w-4 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
					/>
				</svg>
				<span class="text-sm text-white/70">{formatDateRange(holiday)}</span>
			</div>
			<span class="text-white/30">•</span>
			<span class="text-sm text-white/50">{holiday.day}</span>
		</div>

		<!-- Days badge -->
		{#if days > 1}
			<div class="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-2.5 py-1">
				<span class="text-lg font-bold text-white">{days}</span>
				<span class="text-xs text-white/60">days</span>
			</div>
		{/if}

		<!-- Lunar dependent indicator -->
		{#if holiday.isLunarDependent}
			<div class="mt-3 flex items-center gap-1.5 text-xs text-amber-400/80">
				<svg class="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
					<path
						d="M12 3a9 9 0 109 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 01-4.4 2.26 5.403 5.403 0 01-3.14-9.8c-.44-.06-.9-.1-1.36-.1z"
					/>
				</svg>
				<span>Date subject to moon sighting</span>
			</div>
		{/if}

		<!-- Description -->
		{#if holiday.description}
			<p class="mt-3 text-sm leading-relaxed text-white/50">
				{holiday.description}
			</p>
		{/if}
	</div>
</article>
