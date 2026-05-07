import { pb } from './pocketbase';
import type { Prompt, Tag } from './types';

export function imageUrl(
	record: Prompt,
	filename: string,
	thumb?: '400x400' | '800x0',
): string {
	if (!filename) return '';
	const opts = thumb ? { thumb } : undefined;
	return pb.files.getUrl(record, filename, opts);
}

export function firstImageUrl(record: Prompt, thumb?: '400x400' | '800x0'): string {
	const filename = record.images?.[0];
	return filename ? imageUrl(record, filename, thumb) : '';
}

export function escapeFilter(value: string): string {
	return value.replace(/['"\\]/g, '\\$&');
}

export function tagBySlug(tags: Tag[] | undefined, slug: string): Tag | undefined {
	return tags?.find((t) => t.slug === slug);
}

export function formatDate(iso: string): string {
	if (!iso) return '';
	const d = new Date(iso);
	return d.toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' });
}
