<script lang="ts">
	import { slide } from 'svelte/transition';
	import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp, FileText, ImageOff } from '@lucide/svelte';
	import * as Card from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import AspectRatio from '$lib/components/ui/aspect-ratio/aspect-ratio.svelte';
	import CopyButton from './copy-button.svelte';
	import { imageUrl } from '$lib/pb-utils';
	import { cn } from '$lib/utils';
	import type { Prompt } from '$lib/types';

	let { prompt }: { prompt: Prompt } = $props();

	let expanded = $state(false);
	let scroller: HTMLDivElement | undefined = $state();
	let activeIndex = $state(0);

	const images = $derived(prompt.images ?? []);
	const tags = $derived(prompt.expand?.tags ?? []);
	const multi = $derived(images.length > 1);

	function onScroll() {
		if (!scroller) return;
		const w = scroller.clientWidth || 1;
		activeIndex = Math.round(scroller.scrollLeft / w);
	}

	function goTo(i: number) {
		if (!scroller) return;
		const w = scroller.clientWidth;
		scroller.scrollTo({ left: i * w, behavior: 'smooth' });
	}

	function nudge(delta: number) {
		const next = Math.min(Math.max(activeIndex + delta, 0), images.length - 1);
		goTo(next);
	}
</script>

<Card.Root
	class="overflow-hidden border-border/60 transition-shadow duration-200 hover:shadow-md"
>
	<div class="relative bg-muted">
		<AspectRatio ratio={1}>
			{#if images.length === 0}
				<div class="flex h-full w-full items-center justify-center text-muted-foreground/40">
					<ImageOff class="size-12" />
				</div>
			{:else}
				<div
					bind:this={scroller}
					onscroll={onScroll}
					class="no-scrollbar flex h-full w-full touch-pan-x select-none snap-x snap-mandatory overflow-x-auto overscroll-x-contain scroll-smooth"
					style="-webkit-overflow-scrolling: touch;"
					aria-roledescription="carousel"
					aria-label={`${prompt.title} — ${images.length} gambar`}
				>
					{#each images as filename, i (filename)}
						<div
							class="relative h-full w-full shrink-0 snap-start"
							aria-roledescription="slide"
							aria-label={`${i + 1} dari ${images.length}`}
						>
							<img
								src={imageUrl(prompt, filename, '800x0')}
								alt={`${prompt.title} — ${i + 1}`}
								loading={i === 0 ? 'eager' : 'lazy'}
								decoding="async"
								draggable="false"
								class="h-full w-full select-none object-cover"
							/>
						</div>
					{/each}
				</div>
			{/if}
		</AspectRatio>

		{#if prompt.featured}
			<Badge
				variant="default"
				class="absolute left-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
			>
				Featured
			</Badge>
		{/if}

		{#if multi}
			<span
				class="absolute right-2 top-2 rounded-full bg-black/55 px-2 py-0.5 text-[11px] font-medium tabular-nums text-white backdrop-blur"
				aria-live="polite"
			>
				{activeIndex + 1} / {images.length}
			</span>

			<button
				type="button"
				onclick={() => nudge(-1)}
				disabled={activeIndex === 0}
				aria-label="Gambar sebelumnya"
				class="absolute left-1.5 top-1/2 hidden size-9 -translate-y-1/2 items-center justify-center rounded-full bg-background/80 text-foreground shadow-sm backdrop-blur transition-opacity hover:bg-background disabled:pointer-events-none disabled:opacity-0 sm:flex"
			>
				<ChevronLeft class="size-5" />
			</button>
			<button
				type="button"
				onclick={() => nudge(1)}
				disabled={activeIndex === images.length - 1}
				aria-label="Gambar berikutnya"
				class="absolute right-1.5 top-1/2 hidden size-9 -translate-y-1/2 items-center justify-center rounded-full bg-background/80 text-foreground shadow-sm backdrop-blur transition-opacity hover:bg-background disabled:pointer-events-none disabled:opacity-0 sm:flex"
			>
				<ChevronRight class="size-5" />
			</button>

			<div
				class="absolute bottom-1 left-1/2 flex -translate-x-1/2 items-center rounded-full bg-black/35 px-1 backdrop-blur"
				role="tablist"
				aria-label="Pilih gambar"
			>
				{#each images as _, i (i)}
					<button
						type="button"
						role="tab"
						aria-selected={i === activeIndex}
						aria-label={`Gambar ${i + 1}`}
						onclick={() => goTo(i)}
						class="grid size-7 place-items-center rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
					>
						<span
							class={cn(
								'block h-1.5 rounded-full bg-white/60 transition-all',
								i === activeIndex ? 'w-5 bg-white' : 'w-1.5 hover:bg-white/80',
							)}
						></span>
					</button>
				{/each}
			</div>
		{/if}
	</div>

	<Card.Content class="space-y-3 p-4">
		<div>
			<h3 class="line-clamp-2 text-base font-semibold leading-snug sm:text-lg">{prompt.title}</h3>
			{#if prompt.description}
				<p class="mt-1 line-clamp-2 text-sm text-muted-foreground">{prompt.description}</p>
			{/if}
		</div>

		{#if tags.length > 0}
			<div class="flex flex-wrap gap-1">
				{#each tags.slice(0, 4) as tag (tag.id)}
					<a
						href={`/tags/${tag.slug}/`}
						class="no-underline focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-full"
					>
						<Badge variant="secondary" class="rounded-full px-2 py-0 text-[10px] hover:bg-accent"
							>#{tag.name}</Badge
						>
					</a>
				{/each}
				{#if tags.length > 4}
					<span class="self-center text-[10px] text-muted-foreground">+{tags.length - 4}</span>
				{/if}
			</div>
		{/if}

		<div class="flex gap-2 pt-1">
			<Button
				variant="outline"
				size="default"
				class="h-11 flex-1 justify-between gap-2 sm:h-10"
				onclick={() => (expanded = !expanded)}
				aria-expanded={expanded}
				aria-controls={`prompt-body-${prompt.id}`}
			>
				<span class="inline-flex items-center gap-2">
					<FileText class="size-4" />
					{expanded ? 'Sembunyikan' : 'Lihat prompt'}
				</span>
				{#if expanded}
					<ChevronUp class="size-4 shrink-0" />
				{:else}
					<ChevronDown class="size-4 shrink-0" />
				{/if}
			</Button>
			<CopyButton
				text={prompt.body}
				label="Copy"
				size="default"
				variant="default"
				class="h-11 sm:h-10"
			/>
		</div>

		{#if expanded}
			<div
				id={`prompt-body-${prompt.id}`}
				transition:slide={{ duration: 180 }}
				class="overflow-hidden rounded-md border border-border/60 bg-muted/40"
			>
				<pre
					class="max-h-72 overflow-auto whitespace-pre-wrap break-words p-3 font-mono text-xs leading-relaxed text-foreground/90 sm:text-sm">{prompt.body}</pre>
			</div>
		{/if}
	</Card.Content>
</Card.Root>
