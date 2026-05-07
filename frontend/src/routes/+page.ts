import { pb } from '$lib/pocketbase';
import type { Prompt, Tag } from '$lib/types';
import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
	const [featured, recent, tags] = await Promise.all([
		pb.collection('prompts').getList<Prompt>(1, 6, {
			filter: 'featured = true',
			sort: '-created',
			expand: 'tags',
		}),
		pb.collection('prompts').getList<Prompt>(1, 12, {
			sort: '-created',
			expand: 'tags',
		}),
		pb.collection('tags').getFullList<Tag>({ sort: 'name' }),
	]);

	return {
		featured: featured.items,
		recent: recent.items,
		tags,
	};
};
