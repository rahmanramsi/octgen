<script lang="ts">
	import { Search, X } from '@lucide/svelte';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import { cn } from '$lib/utils';

	let {
		value = $bindable(''),
		placeholder = 'Cari prompt...',
		class: className,
		oninput,
	}: {
		value?: string;
		placeholder?: string;
		class?: string;
		oninput?: (value: string) => void;
	} = $props();

	function handleInput(e: Event) {
		const target = e.currentTarget as HTMLInputElement;
		value = target.value;
		oninput?.(value);
	}

	function clear() {
		value = '';
		oninput?.('');
	}
</script>

<div class={cn('relative w-full', className)}>
	<Search
		class="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
	/>
	<Input
		type="search"
		inputmode="search"
		autocomplete="off"
		spellcheck={false}
		{placeholder}
		{value}
		oninput={handleInput}
		class="h-11 pl-9 pr-10 text-base sm:h-10 sm:text-sm"
	/>
	{#if value}
		<Button
			variant="ghost"
			size="icon"
			class="absolute right-1 top-1/2 size-9 -translate-y-1/2"
			onclick={clear}
			aria-label="Hapus pencarian"
		>
			<X class="size-4" />
		</Button>
	{/if}
</div>
