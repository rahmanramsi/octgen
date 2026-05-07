<script lang="ts">
	import '../app.css';
	import { Toaster } from '$lib/components/ui/sonner';
	import SiteHeader from '$lib/components/site-header.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<title>octgen — kumpulan prompt generate gambar</title>
	<meta
		name="description"
		content="Koleksi prompt untuk generate gambar AI: Midjourney, Stable Diffusion, Flux, dan lainnya."
	/>
	<meta name="theme-color" content="#09090b" media="(prefers-color-scheme: dark)" />
	<meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
</svelte:head>

<div class="flex min-h-dvh flex-col bg-background text-foreground">
	<SiteHeader />
	<main class="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 sm:py-10">
		{@render children()}
	</main>
	<footer class="border-t border-border/60 py-6 text-center text-xs text-muted-foreground">
		<p>Built with SvelteKit + PocketBase + shadcn-svelte</p>
	</footer>
</div>

<Toaster position="bottom-center" richColors closeButton />
