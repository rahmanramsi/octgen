<script lang="ts">
	import { goto, invalidate } from '$app/navigation';
	import { page } from '$app/state';
	import PromptCard from '$lib/components/prompt-card.svelte';
	import SearchBar from '$lib/components/search-bar.svelte';
	import TagFilter from '$lib/components/tag-filter.svelte';
	import { Button } from '$lib/components/ui/button';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	let query = $state(data.q);
	let debounceTimer: ReturnType<typeof setTimeout> | undefined;

	function syncUrl(next: { q?: string; tag?: string | null }) {
		const url = new URL(page.url);
		if (next.q !== undefined) {
			if (next.q) url.searchParams.set('q', next.q);
			else url.searchParams.delete('q');
		}
		if (next.tag !== undefined) {
			if (next.tag) url.searchParams.set('tag', next.tag);
			else url.searchParams.delete('tag');
		}
		goto(url, { replaceState: true, keepFocus: true, noScroll: true }).then(() =>
			invalidate('app:prompts'),
		);
	}

	function onSearchInput(value: string) {
		query = value;
		clearTimeout(debounceTimer);
		debounceTimer = setTimeout(() => syncUrl({ q: value }), 250);
	}

	function onTagSelect(slug: string | null) {
		syncUrl({ tag: slug });
	}

	function clearFilters() {
		query = '';
		const url = new URL(page.url);
		url.search = '';
		goto(url, { replaceState: true }).then(() => invalidate('app:prompts'));
	}

	const hasFilters = $derived(Boolean(data.q) || Boolean(data.tagSlug));
</script>

<div class="space-y-6">
	<header class="space-y-3">
		<h1 class="text-2xl font-bold tracking-tight sm:text-3xl">Prompts</h1>
		<p class="text-sm text-muted-foreground">
			{data.totalItems} prompt total{#if hasFilters} · sedang difilter{/if}
		</p>
	</header>

	<div class="sticky top-14 z-20 -mx-4 bg-background/85 px-4 py-3 backdrop-blur sm:top-16 sm:-mx-6 sm:px-6">
		<div class="flex flex-col gap-2 sm:flex-row">
			<SearchBar value={query} oninput={onSearchInput} class="flex-1" />
			<div class="flex gap-2">
				<TagFilter tags={data.tags} selectedSlug={data.tagSlug || null} onSelect={onTagSelect} />
				{#if hasFilters}
					<Button variant="ghost" size="default" class="h-11 sm:h-10" onclick={clearFilters}>
						Reset
					</Button>
				{/if}
			</div>
		</div>
	</div>

	{#if data.prompts.length === 0}
		<div class="rounded-lg border border-dashed border-border/60 p-10 text-center">
			<p class="text-sm text-muted-foreground">
				Tidak ada prompt yang cocok. Coba ubah keyword atau reset filter.
			</p>
		</div>
	{:else}
		<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
			{#each data.prompts as prompt (prompt.id)}
				<PromptCard {prompt} />
			{/each}
		</div>
	{/if}
</div>
