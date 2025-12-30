<script lang="ts">
	import type { Holiday } from '$lib/data/holidays';
	import {
		categoryColors,
		categoryLabels,
		formatDateRange,
		getHolidayDays
	} from '$lib/data/holidays';
	import HolidayIcon from './HolidayIcon.svelte';
	import { Calendar, Clock, Moon } from 'lucide-svelte';

	let { holiday }: { holiday: Holiday } = $props();

	const colors = $derived(categoryColors[holiday.category]);
	const days = $derived(getHolidayDays(holiday));
</script>

<article class="card-elevated group relative overflow-hidden rounded-2xl p-5 sm:p-6">
	<!-- Gradient overlay on hover -->
	<div
		class="pointer-events-none absolute inset-0 bg-gradient-to-br {colors.gradient} opacity-0 transition-opacity duration-500 group-hover:opacity-100"
	></div>

	<!-- Decorative corner accent -->
	<div
		class="absolute -top-8 -right-8 h-24 w-24 rounded-full bg-gradient-to-br {colors.gradient} opacity-40 blur-2xl transition-all duration-500 group-hover:scale-125 group-hover:opacity-60"
	></div>

	<!-- Icon floating background -->
	<div
		class="absolute top-4 right-4 opacity-[0.06] transition-all duration-500 group-hover:scale-110 group-hover:opacity-[0.1]"
	>
		<HolidayIcon name={holiday.iconName} size={80} strokeWidth={1} />
	</div>

	<div class="relative z-10">
		<!-- Category badge -->
		<div class="mb-4 flex items-center gap-3">
			<span
				class="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium tracking-wide uppercase {colors.border} {colors.bg} {colors.text}"
			>
				<span class="h-1.5 w-1.5 rounded-full bg-current opacity-70"></span>
				{categoryLabels[holiday.category]}
			</span>
		</div>

		<!-- Holiday icon and name -->
		<div class="flex items-start gap-3">
			<div
				class="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl {colors.bg} {colors.text} transition-transform duration-300 group-hover:scale-105"
			>
				<HolidayIcon name={holiday.iconName} size={22} strokeWidth={1.75} />
			</div>
			<div class="min-w-0 flex-1">
				<h3 class="font-display text-lg leading-tight text-white/95 sm:text-xl">
					{holiday.name}
				</h3>
				{#if holiday.nameMyanmar}
					<p class="font-myanmar mt-1 truncate text-sm text-white/50">
						{holiday.nameMyanmar}
					</p>
				{/if}
			</div>
		</div>

		<!-- Date info -->
		<div class="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
			<div class="flex items-center gap-2 text-white/60">
				<Calendar size={15} strokeWidth={1.5} class="text-white/40" />
				<span>{formatDateRange(holiday)}</span>
			</div>
			<span class="hidden text-white/20 sm:inline">|</span>
			<div class="flex items-center gap-2 text-white/50">
				<Clock size={14} strokeWidth={1.5} class="text-white/35" />
				<span>{holiday.day}</span>
			</div>
		</div>

		<!-- Days badge and lunar indicator -->
		<div class="mt-4 flex flex-wrap items-center gap-3">
			{#if days > 1}
				<div
					class="inline-flex items-center gap-2 rounded-lg bg-white/[0.06] px-3 py-1.5 backdrop-blur-sm"
				>
					<span class="text-lg font-semibold text-white">{days}</span>
					<span class="text-xs tracking-wide text-white/50 uppercase">days</span>
				</div>
			{/if}

			{#if holiday.isLunarDependent}
				<div
					class="inline-flex items-center gap-1.5 rounded-lg bg-amber-500/10 px-2.5 py-1.5 text-xs text-amber-400/90"
				>
					<Moon size={13} strokeWidth={2} />
					<span>Lunar dependent</span>
				</div>
			{/if}
		</div>

		<!-- Description -->
		{#if holiday.description}
			<p class="mt-4 text-sm leading-relaxed text-white/45">
				{holiday.description}
			</p>
		{/if}
	</div>

	<!-- Bottom gradient line -->
	<div
		class="absolute right-0 bottom-0 left-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
	></div>
</article>
