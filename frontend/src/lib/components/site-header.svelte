<script lang="ts">
	import { page } from '$app/state';
	import { Sparkles } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';
	import { cn } from '$lib/utils';

	const links = [
		{ href: '/', label: 'Home' },
		{ href: '/prompts/', label: 'Prompts' },
	];

	const current = $derived(page.url.pathname);
</script>

<header
	class="sticky top-0 z-30 w-full border-b border-border/60 bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/60"
>
	<div class="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:h-16 sm:px-6">
		<a href="/" class="flex items-center gap-2 text-base font-semibold tracking-tight sm:text-lg">
			<Sparkles class="size-5 text-primary" />
			<span>octgen</span>
		</a>

		<nav class="flex items-center gap-0.5 sm:gap-1">
			{#each links as link (link.href)}
				{@const active = current === link.href || (link.href !== '/' && current.startsWith(link.href))}
				<Button
					href={link.href}
					variant="ghost"
					size="sm"
					class={cn(
						'h-9 px-3 text-sm font-medium',
						active ? 'text-foreground' : 'text-muted-foreground',
					)}
				>
					{link.label}
				</Button>
			{/each}
		</nav>
	</div>
</header>
