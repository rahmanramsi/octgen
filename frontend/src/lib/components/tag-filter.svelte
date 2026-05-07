<script lang="ts">
	import { Filter } from '@lucide/svelte';
	import * as Sheet from '$lib/components/ui/sheet';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import { cn } from '$lib/utils';
	import type { Tag } from '$lib/types';

	let {
		tags,
		selectedSlug = null,
		onSelect,
		class: className,
	}: {
		tags: Tag[];
		selectedSlug?: string | null;
		onSelect: (slug: string | null) => void;
		class?: string;
	} = $props();

	let open = $state(false);

	function pick(slug: string | null) {
		onSelect(slug);
		open = false;
	}

	const selected = $derived(tags.find((t) => t.slug === selectedSlug));
</script>

<Sheet.Root bind:open>
	<Sheet.Trigger>
		{#snippet child({ props })}
			<Button {...props} variant="outline" size="default" class={cn('h-11 gap-2 sm:h-10', className)}>
				<Filter class="size-4" />
				<span>{selected ? `#${selected.name}` : 'Tag'}</span>
				{#if selected}
					<span class="ml-1 rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold text-primary-foreground"
						>1</span
					>
				{/if}
			</Button>
		{/snippet}
	</Sheet.Trigger>
	<Sheet.Content side="right" class="w-full max-w-sm sm:max-w-md">
		<Sheet.Header>
			<Sheet.Title>Filter berdasarkan tag</Sheet.Title>
			<Sheet.Description>Pilih satu tag untuk mempersempit hasil.</Sheet.Description>
		</Sheet.Header>
		<div class="flex flex-wrap gap-2 px-4 pb-6">
			<button type="button" onclick={() => pick(null)} class="contents" aria-label="Hapus filter tag">
				<Badge
					variant={selectedSlug === null ? 'default' : 'secondary'}
					class="cursor-pointer rounded-full px-3 py-1.5 text-sm hover:bg-accent"
				>
					Semua
				</Badge>
			</button>
			{#each tags as tag (tag.id)}
				<button
					type="button"
					onclick={() => pick(tag.slug)}
					class="contents"
					aria-label={`Filter ${tag.name}`}
				>
					<Badge
						variant={selectedSlug === tag.slug ? 'default' : 'secondary'}
						class="cursor-pointer rounded-full px-3 py-1.5 text-sm hover:bg-accent"
					>
						#{tag.name}
					</Badge>
				</button>
			{/each}
			{#if tags.length === 0}
				<p class="text-sm text-muted-foreground">Belum ada tag.</p>
			{/if}
		</div>
	</Sheet.Content>
</Sheet.Root>
