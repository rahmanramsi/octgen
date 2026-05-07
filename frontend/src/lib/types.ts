export interface Tag {
	id: string;
	collectionId: string;
	collectionName: string;
	name: string;
	slug: string;
	created: string;
	updated: string;
}

export interface Prompt {
	id: string;
	collectionId: string;
	collectionName: string;
	title: string;
	slug: string;
	body: string;
	description?: string;
	tags: string[];
	images: string[];
	featured: boolean;
	created: string;
	updated: string;
	expand?: {
		tags?: Tag[];
	};
}
