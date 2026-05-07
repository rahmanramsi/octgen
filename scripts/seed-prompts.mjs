// One-shot seed script. Run from project root after backend is up:
//
//   PB_EMAIL=you@example.com PB_PASSWORD=secret node scripts/seed-prompts.mjs
//
// Creates 10 original prompts across categories that mirror meigen.ai's
// taxonomy (UI/graphic, poster, product, photography, illustration, 3D, food).
// Prompts are written from scratch — not duplicated from any source.
//
// Required env: PB_EMAIL, PB_PASSWORD (a PocketBase superuser).
// Optional env: PB_URL (defaults to http://127.0.0.1:8090).

const PB_URL = process.env.PB_URL || 'http://127.0.0.1:8090';
const EMAIL = process.env.PB_EMAIL;
const PASSWORD = process.env.PB_PASSWORD;

if (!EMAIL || !PASSWORD) {
	console.error('Missing PB_EMAIL or PB_PASSWORD env. Example:');
	console.error('  PB_EMAIL=admin@example.com PB_PASSWORD=secret node scripts/seed-prompts.mjs');
	process.exit(1);
}

const auth = await fetch(`${PB_URL}/api/collections/_superusers/auth-with-password`, {
	method: 'POST',
	headers: { 'Content-Type': 'application/json' },
	body: JSON.stringify({ identity: EMAIL, password: PASSWORD }),
}).then((r) => r.json());

if (!auth.token) {
	console.error('Auth failed:', auth);
	process.exit(1);
}
const headers = { 'Content-Type': 'application/json', Authorization: auth.token };

async function tagId(slug) {
	const r = await fetch(
		`${PB_URL}/api/collections/tags/records?filter=(slug='${slug}')&perPage=1`,
		{ headers },
	).then((r) => r.json());
	return r.items?.[0]?.id;
}

const tagMap = {};
for (const slug of [
	'graphic-design',
	'poster',
	'product-brand',
	'photography',
	'illustration',
	'3d-render',
	'food-drink',
	'gpt-image',
	'nano-banana',
	'midjourney',
]) {
	tagMap[slug] = await tagId(slug);
}
console.log('Resolved tags:', tagMap);

const prompts = [
	{
		title: 'Brutalist Conference Poster',
		slug: 'brutalist-conference-poster',
		description: 'Heavy grid layout for tech/design conference posters.',
		featured: true,
		tags: ['poster', 'graphic-design', 'midjourney'],
		body: `Brutalist conference poster, A2 format. Massive sans-serif headline broken across 3 lines, flush-left, tracking -2%. Dense 12-column grid system visible as faint guide lines. Three speaker portraits in monochrome duotone (black + acid yellow), arranged in unequal column widths. Footer with date, location, and sponsor wordmarks in 8pt grotesk, justified.

Rough paper texture, halftone dots on portraits, slight registration offset on yellow plate for risograph feel. Color palette: warm off-white #F4F1E8, deep black #0A0A0A, single accent #F4D03F.

Reference: Wim Crouwel grid systems × Experimental Jetset typography × early-2000s independent magazine covers. Rendered at 4K --ar 2:3 --style raw`,
	},
	{
		title: 'Indie Cafe Menu Board',
		slug: 'indie-cafe-menu-board',
		description: 'Hand-lettered menu chalkboard for boutique coffee shops.',
		featured: true,
		tags: ['graphic-design', 'food-drink', 'illustration'],
		body: `Hand-lettered chalkboard menu for an indie specialty coffee shop. Slate-grey blackboard, white and pastel chalk strokes with visible chalk dust and smudges. Three columns: ESPRESSO, FILTER, NON-COFFEE. Each item has price right-aligned, brewing notes in smaller caps below.

Decorative botanical line drawings between sections (coffee branch, cardamom, fig leaf). Wax-stained burlap pinned at corners. Top header in a warm condensed serif "TODAY'S BREW", with a small acid-yellow tag pinned reading "single origin – limited".

Tropical hardwood frame, soft window light coming from the upper-left at 30°, subtle bokeh background of a busy cafe. Shot at 50mm, f/2.8.`,
	},
	{
		title: 'Minimal Skincare Bottle Render',
		slug: 'minimal-skincare-bottle-render',
		description: 'Hero product render for a minimalist skincare brand.',
		featured: true,
		tags: ['product-brand', '3d-render', 'photography'],
		body: `Hero product render of a minimal skincare serum bottle. Frosted opal glass, matte aluminum dropper cap with a knurled grip, single embossed wordmark "ATELIER" in a thin geometric sans. 30ml volume, slight asymmetric silhouette.

Backdrop: soft beige gradient (#E8DDD0 to #C9B59C), gentle vignette. Bottle floats 4cm above a polished travertine plinth, casting a soft contact shadow. Studio softbox lighting from camera-left, fill bounce card on right, subtle rim highlight from behind.

Shallow depth of field, 100mm macro lens equivalent, f/4. Photoreal materials: subsurface scattering on glass, anisotropic brushed metal, micro-imperfections on the travertine. Octane render, 4K, color-graded for a quiet luxury palette. --ar 4:5`,
	},
	{
		title: 'Editorial Portrait, Window Light',
		slug: 'editorial-portrait-window-light',
		description: 'Quiet editorial portrait with single-source soft window light.',
		tags: ['photography', 'gpt-image'],
		body: `Editorial portrait of a 30-year-old Indonesian woman, mid-shot, slight 3/4 angle to camera, eyes tracking just past the lens. Natural single-source window light from camera-left, large diffused softness, deep falloff into shadow on the right cheek.

Wardrobe: oversized cream linen shirt, unbuttoned at collar, no jewelry. Hair loose, slightly tousled, natural texture preserved. Background: warm putty-grey concrete wall, lightly textured, 2 stops below subject.

Captured on Hasselblad H6D-100c, 80mm f/2.8 wide open. Skin texture intentionally retained — pores, fine hairs, faint freckles. Color grade: Kodak Portra 400 emulation, slightly muted blue channel, warm midtones. Mood: introspective, unpretentious, contemporary editorial.`,
	},
	{
		title: 'Sticker Sheet, Vinyl Cut Style',
		slug: 'sticker-sheet-vinyl-cut',
		description: 'Die-cut sticker pack for laptop/water-bottle culture.',
		tags: ['illustration', 'graphic-design'],
		body: `Die-cut vinyl sticker sheet, 6 stickers arranged on a glossy backing paper with a thin white kiss-cut border around each. Theme: "tools of the trade" for a developer, illustrated in a flat thick-line style with limited 4-color palette (off-black, cream, terracotta, sage green).

Stickers: 1) coffee mug with steam forming a curly brace, 2) keyboard key labeled "esc" oversized, 3) cassette tape mid-rewind, 4) a stack of 3 books titled "rfc", "the c programming language", "ascii", 5) a sleeping cat curled around a mouse cursor, 6) a small banner reading "ship it" in hand-lettered script.

Slight halftone shading inside each illustration for print authenticity, and a faint shadow under each sticker to suggest peel-off depth. Top-down product shot, soft studio light, paper grain visible. --ar 1:1`,
	},
	{
		title: 'Isometric Cozy Workspace',
		slug: 'isometric-cozy-workspace',
		description: 'Lo-fi study room rendered in clean isometric 3D.',
		tags: ['illustration', '3d-render'],
		body: `Isometric 3D illustration of a cozy student workspace, viewed at the standard 30°/30° isometric projection. Wooden desk with a 24" monitor showing a dark code editor, mechanical keyboard with off-white caps, ergonomic mouse, journal open with a fountain pen on top.

Wall behind has a corkboard with three pinned polaroids and a single warm tungsten clip lamp. Floating shelf with five books (color-coded spines), a small monstera, and a vinyl record leaning against the wall. Cat curled on a knit blanket draped over the chair.

Soft afternoon sunlight angled from upper-right, warm bias (4500K), gentle volumetric haze. Limited palette: walnut wood, cream, dusty rose, deep teal accents. Slight ambient occlusion, subtle SSS on the cat. Blender Cycles render aesthetic, 4K, no harsh outlines. --ar 1:1`,
	},
	{
		title: 'Streetwear Lookbook, Tokyo',
		slug: 'streetwear-lookbook-tokyo',
		description: 'Editorial fashion shot for a streetwear drop.',
		featured: true,
		tags: ['photography', 'midjourney'],
		body: `Streetwear lookbook photograph, full-body, set in a quiet alley off Shimokitazawa at blue-hour. Subject is a 24-year-old in oversized boxy charcoal hoodie, wide-leg cargo pants in faded olive, technical mesh sneakers in cream. Cross-body bag in matte black ripstop nylon.

Stance: relaxed contrapposto, hands tucked into kangaroo pocket, gaze off-camera. Background: vending machine glow on the left (#F0E68C light spill), faint shop signage in Japanese reading 古書 (used books), wet asphalt reflecting purple-pink dusk sky.

Captured on Sony A7R IV, 35mm f/1.8, mild grain to mimic Cinestill 800T at 1600 push. Color grade: lifted shadows, slight teal-magenta split. Mood: lonely, contemplative, late-night dérive. --ar 4:5 --style raw`,
	},
	{
		title: 'Risograph-Style Travel Poster',
		slug: 'risograph-travel-poster',
		description: 'Two-color risograph travel poster, retro 80s.',
		tags: ['poster', 'illustration', 'graphic-design'],
		body: `Risograph-printed travel poster for "BROMO – DAWN PATROL". Limited two-spot palette: fluorescent pink (Riso F-Pink) and federal blue (Riso Federal Blue), with intentional misregistration of about 1.5mm on the pink plate.

Composition: stylized geometric Mt. Bromo silhouette across the lower third, cone-shaped, layered with simplified fog bands. Sun rendered as a hard pink half-disc rising behind the peak. Negative space sky filled with hand-drawn dotted halftone for the gradient.

Top headline "DAWN PATROL" in a chunky condensed display serif, flush-left, with the word "BROMO" rendered larger as the focal block. Small block of body copy lower-right reading "EAST JAVA · 4:30 AM CALL" in monospaced 9pt.

Heavy paper texture, slight ink saturation variation, edge bleed. 18×24 inch poster format. --ar 2:3`,
	},
	{
		title: 'Top-Down Indonesian Breakfast',
		slug: 'top-down-indonesian-breakfast',
		description: 'Overhead food photography of a traditional breakfast spread.',
		tags: ['food-drink', 'photography'],
		body: `Top-down food photograph of a traditional Indonesian breakfast spread, shot at 90° directly overhead. Centered: a banana-leaf-lined bamboo tray with nasi uduk, tempe goreng, sambal kacang in a small earthenware bowl, kerupuk udang, a halved telur balado, and a sprinkle of crispy fried shallots.

Surrounding the tray: a small glass of teh tawar (steaming, faint condensation on the rim), a porcelain saucer with sliced cucumber and tomato, a folded daun pisang napkin, an antique brass spoon. Background surface: weathered teak wood with deep grain, dark espresso stain.

Soft north-facing window light from the upper-left, no fill — natural shadow gradient. Subtle steam rising from the tea. Captured on Canon R5 with 50mm tilt-shift, f/8, ISO 200, color-graded with warm highlights and cool shadows. --ar 1:1 --style raw`,
	},
	{
		title: 'Geometric Logo Exploration',
		slug: 'geometric-logo-exploration',
		description: 'Mark exploration sheet for a B2B brand identity.',
		tags: ['graphic-design', 'product-brand', 'nano-banana'],
		body: `Logo exploration sheet for a fictional B2B fintech brand "AXIOM". 9-up grid of monochrome marks on a warm off-white background (#F2EEE6). Each mark sits in a thin 1pt outlined square cell with the variant number "01" through "09" in the bottom-right corner in a 7pt monospaced face.

Variants: 1) abstract overlapping circles forming an "A", 2) sharp geometric monogram of A+X, 3) wordmark with custom ligature on the X, 4) horizontal lockup with stacked tagline, 5) stamp-style mark inside a circle, 6) symbol composed of three diagonal strokes, 7) negative-space "A" inside a square, 8) condensed vertical wordmark, 9) icon-only mark for app use.

Bottom of sheet: small caption "AXIOM · IDENTITY EXPLORATION · v0.3" in 8pt monospaced, baseline-aligned. Style reference: Pentagram, Order Design, Mucho. Flat black ink, no gradients. --ar 4:5`,
	},
];

let created = 0;
for (const p of prompts) {
	const tagIds = (p.tags || []).map((slug) => tagMap[slug]).filter(Boolean);
	const payload = {
		title: p.title,
		slug: p.slug,
		body: p.body,
		description: p.description ?? '',
		tags: tagIds,
		featured: p.featured ?? false,
	};

	// Upsert: try create, if 400 (slug conflict) then update
	let r = await fetch(`${PB_URL}/api/collections/prompts/records`, {
		method: 'POST',
		headers,
		body: JSON.stringify(payload),
	});
	if (r.ok) {
		console.log(`✓ created ${p.slug}`);
		created++;
		continue;
	}
	// Try find existing by slug, then PATCH
	const existing = await fetch(
		`${PB_URL}/api/collections/prompts/records?filter=(slug='${p.slug}')&perPage=1`,
		{ headers },
	).then((r) => r.json());
	const id = existing.items?.[0]?.id;
	if (id) {
		const patch = await fetch(`${PB_URL}/api/collections/prompts/records/${id}`, {
			method: 'PATCH',
			headers,
			body: JSON.stringify(payload),
		});
		if (patch.ok) {
			console.log(`↻ updated ${p.slug}`);
			created++;
		} else {
			console.error(`✗ ${p.slug}: PATCH failed`, await patch.text());
		}
	} else {
		console.error(`✗ ${p.slug}: POST failed`, await r.text());
	}
}

console.log(`\nDone. ${created}/${prompts.length} prompts upserted.`);
