import { pb } from '$lib/pocketbase';
import { escapeFilter } from '$lib/pb-utils';
import type { Prompt, Tag } from '$lib/types';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ url, depends }) => {
	depends('app:prompts');
	const q = url.searchParams.get('q')?.trim() ?? '';
	const tagSlug = url.searchParams.get('tag')?.trim() ?? '';

	const filterParts: string[] = [];
	if (q) {
		const safe = escapeFilter(q);
		filterParts.push(`(title ~ "${safe}" || body ~ "${safe}" || description ~ "${safe}")`);
	}
	if (tagSlug) {
		filterParts.push(`tags.slug ?= "${escapeFilter(tagSlug)}"`);
	}
	const filter = filterParts.join(' && ');

	const [results, tags] = await Promise.all([
		pb.collection('prompts').getList<Prompt>(1, 48, {
			filter,
			sort: '-created',
			expand: 'tags',
		}),
		pb.collection('tags').getFullList<Tag>({ sort: 'name' }),
	]);

	return {
		prompts: results.items,
		totalItems: results.totalItems,
		tags,
		q,
		tagSlug,
	};
};
