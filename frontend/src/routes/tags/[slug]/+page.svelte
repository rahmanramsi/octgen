<script lang="ts">
	import { ArrowLeft, Hash } from '@lucide/svelte';
	import PromptCard from '$lib/components/prompt-card.svelte';
	import { Button } from '$lib/components/ui/button';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>#{data.tag.name} — octgen</title>
</svelte:head>

<div class="space-y-6">
	<Button href="/prompts/" variant="ghost" size="sm" class="-ml-2 gap-1 text-muted-foreground">
		<ArrowLeft class="size-4" /> Semua prompt
	</Button>
	<header class="space-y-2">
		<h1 class="flex items-center gap-2 text-2xl font-bold tracking-tight sm:text-3xl">
			<Hash class="size-6 text-muted-foreground" />{data.tag.name}
		</h1>
		<p class="text-sm text-muted-foreground">{data.totalItems} prompt dengan tag ini</p>
	</header>

	{#if data.prompts.length === 0}
		<div class="rounded-lg border border-dashed border-border/60 p-10 text-center">
			<p class="text-sm text-muted-foreground">Belum ada prompt dengan tag ini.</p>
		</div>
	{:else}
		<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
			{#each data.prompts as prompt (prompt.id)}
				<PromptCard {prompt} />
			{/each}
		</div>
	{/if}
</div>
