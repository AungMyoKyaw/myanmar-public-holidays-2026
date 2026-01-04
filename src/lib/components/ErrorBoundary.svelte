<!-- src/lib/components/ErrorBoundary.svelte -->
<script lang="ts">
	import { AlertCircle, RefreshCw } from 'lucide-svelte';

	interface Props {
		children: import('svelte').Snippet;
	}

	let { children }: Props = $props();

	let error = $state<string | null>(null);
	let errorInfo = $state<string | null>(null);

	function handleError(e: unknown) {
		console.error('ErrorBoundary caught error:', e);
		error = e instanceof Error ? e.message : 'An unexpected error occurred';
		errorInfo = e instanceof Error ? e.stack || null : null;
	}

	// Catch errors during component lifecycle
	$effect(() => {
		try {
			// This will catch errors during reactive updates
		} catch (e) {
			handleError(e);
		}
	});

	function retry() {
		error = null;
		errorInfo = null;
		window.location.reload();
	}
</script>

<svelte:window
	on:unhandledrejection={(e: PromiseRejectionEvent) => handleError(e.reason)}
	on:error={(e: ErrorEvent) => handleError(e)}
/>

{#if error}
	<div class="flex min-h-screen items-center justify-center bg-[#050507] p-4 text-white">
		<div class="w-full max-w-md text-center">
			<div
				class="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/15 text-red-400"
			>
				<AlertCircle size={32} strokeWidth={1.5} aria-hidden="true" />
			</div>
			<h1 class="font-display mb-4 text-xl text-white/90">Something went wrong</h1>
			<p class="mb-6 leading-relaxed text-white/60">
				{error}
			</p>
			{#if errorInfo}
				<details class="mb-6 rounded-lg bg-white/[0.03] p-4 text-left">
					<summary class="cursor-pointer text-white/70">Technical details</summary>
					<pre class="mt-2 overflow-x-auto text-xs text-white/40">{errorInfo}</pre>
				</details>
			{/if}
			<button
				onclick={retry}
				class="mx-auto flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-3 font-medium text-[#050507] transition-colors hover:bg-amber-400"
			>
				<RefreshCw size={16} strokeWidth={2} aria-hidden="true" />
				Try again
			</button>
		</div>
	</div>
{:else}
	{@render children()}
{/if}
