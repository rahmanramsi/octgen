import { error } from '@sveltejs/kit';
import { pb } from '$lib/pocketbase';
import { escapeFilter } from '$lib/pb-utils';
import type { Prompt, Tag } from '$lib/types';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
	let tag: Tag;
	try {
		tag = await pb
			.collection('tags')
			.getFirstListItem<Tag>(`slug = "${escapeFilter(params.slug)}"`);
	} catch (e) {
		const status = (e as { status?: number })?.status;
		if (status === 404) error(404, 'Tag tidak ditemukan');
		throw e;
	}

	const results = await pb.collection('prompts').getList<Prompt>(1, 48, {
		filter: `tags.id ?= "${tag.id}"`,
		sort: '-created',
		expand: 'tags',
	});

	return { tag, prompts: results.items, totalItems: results.totalItems };
};
