<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';
	import { cn } from '$lib/utils';
	import type { Tag } from '$lib/types';

	let {
		tag,
		active = false,
		class: className,
	}: { tag: Pick<Tag, 'name' | 'slug'>; active?: boolean; class?: string } = $props();
</script>

<a
	href={`/tags/${tag.slug}/`}
	class={cn('inline-flex no-underline', className)}
	aria-label={`Filter prompt dengan tag ${tag.name}`}
>
	<Badge
		variant={active ? 'default' : 'secondary'}
		class="rounded-full px-3 py-1 text-xs font-medium hover:bg-accent"
	>
		#{tag.name}
	</Badge>
</a>
