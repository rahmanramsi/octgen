<script lang="ts">
	import { Check, Copy } from '@lucide/svelte';
	import { toast } from 'svelte-sonner';
	import { Button } from '$lib/components/ui/button';
	import { cn } from '$lib/utils';

	let {
		text,
		label = 'Copy prompt',
		size = 'default',
		variant = 'default',
		class: className,
	}: {
		text: string;
		label?: string;
		size?: 'sm' | 'default' | 'lg' | 'icon';
		variant?: 'default' | 'secondary' | 'outline' | 'ghost';
		class?: string;
	} = $props();

	let copied = $state(false);
	let timer: ReturnType<typeof setTimeout> | undefined;

	async function copy() {
		try {
			await navigator.clipboard.writeText(text);
			copied = true;
			toast.success('Prompt disalin ke clipboard');
			clearTimeout(timer);
			timer = setTimeout(() => (copied = false), 1500);
		} catch {
			toast.error('Gagal menyalin. Salin manual ya.');
		}
	}
</script>

<Button onclick={copy} {size} {variant} class={cn('gap-2', className)} aria-live="polite">
	{#if copied}
		<Check class="size-4" />
		<span>Tersalin</span>
	{:else}
		<Copy class="size-4" />
		<span>{label}</span>
	{/if}
</Button>
