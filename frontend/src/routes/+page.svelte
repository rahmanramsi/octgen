<script lang="ts">
	import { ArrowRight } from '@lucide/svelte';
	import PromptCard from '$lib/components/prompt-card.svelte';
	import TagChip from '$lib/components/tag-chip.svelte';
	import { Button } from '$lib/components/ui/button';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<div class="space-y-10 sm:space-y-14">
	<section class="space-y-4 sm:space-y-6">
		<div class="space-y-3">
			<h1 class="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
				Kumpulan prompt <span class="text-primary">generate gambar</span>
			</h1>
			<p class="max-w-2xl text-sm text-muted-foreground sm:text-base">
				Koleksi prompt yang sudah ku-tes dan ku-tweak untuk berbagai model AI image generator. Tinggal copy
				dan paste.
			</p>
		</div>
		{#if data.tags.length > 0}
			<div class="flex flex-wrap gap-1.5">
				{#each data.tags.slice(0, 12) as tag (tag.id)}
					<TagChip {tag} />
				{/each}
				{#if data.tags.length > 12}
					<Button href="/prompts/" variant="ghost" size="sm" class="h-7 text-xs">
						+{data.tags.length - 12} lagi
					</Button>
				{/if}
			</div>
		{/if}
	</section>

	{#if data.featured.length > 0}
		<section class="space-y-4">
			<div class="flex items-end justify-between">
				<h2 class="text-xl font-semibold sm:text-2xl">Featured</h2>
			</div>
			<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
				{#each data.featured as prompt (prompt.id)}
					<PromptCard {prompt} />
				{/each}
			</div>
		</section>
	{/if}

	<section class="space-y-4">
		<div class="flex items-end justify-between">
			<h2 class="text-xl font-semibold sm:text-2xl">Terbaru</h2>
			<Button href="/prompts/" variant="ghost" size="sm" class="gap-1">
				Semua <ArrowRight class="size-4" />
			</Button>
		</div>
		{#if data.recent.length === 0}
			<div class="rounded-lg border border-dashed border-border/60 p-8 text-center">
				<p class="text-sm text-muted-foreground">
					Belum ada prompt. Tambah lewat admin UI di port 8090.
				</p>
			</div>
		{:else}
			<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
				{#each data.recent as prompt (prompt.id)}
					<PromptCard {prompt} />
				{/each}
			</div>
		{/if}
	</section>
</div>
