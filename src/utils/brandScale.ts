type RGB = { r: number; g: number; b: number };

type ScaleStep = '50' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900' | '950';

const WHITE: RGB = { r: 255, g: 255, b: 255 };
const BLACK: RGB = { r: 0, g: 0, b: 0 };

const STEPS: Record<ScaleStep, { towards: 'white' | 'black' | 'self'; amount: number }> = {
	'50': { towards: 'white', amount: 0.95 },
	'100': { towards: 'white', amount: 0.88 },
	'200': { towards: 'white', amount: 0.72 },
	'300': { towards: 'white', amount: 0.52 },
	'400': { towards: 'white', amount: 0.28 },
	'500': { towards: 'white', amount: 0.12 },
	'600': { towards: 'self', amount: 0 },
	'700': { towards: 'black', amount: 0.18 },
	'800': { towards: 'black', amount: 0.34 },
	'900': { towards: 'black', amount: 0.55 },
	'950': { towards: 'black', amount: 0.72 },
};

function hexToRgb(hex: string): RGB | null {
	const cleaned = hex.trim().replace(/^#/, '');
	const expanded =
		cleaned.length === 3
			? cleaned
				.split('')
				.map((c) => c + c)
				.join('')
			: cleaned;
	if (!/^[0-9a-fA-F]{6}$/.test(expanded)) return null;
	return {
		r: parseInt(expanded.slice(0, 2), 16),
		g: parseInt(expanded.slice(2, 4), 16),
		b: parseInt(expanded.slice(4, 6), 16),
	};
}

function clamp(n: number) {
	return Math.max(0, Math.min(255, Math.round(n)));
}

function rgbToHex({ r, g, b }: RGB): string {
	const to = (n: number) => clamp(n).toString(16).padStart(2, '0');
	return `#${to(r)}${to(g)}${to(b)}`;
}

function mix(a: RGB, b: RGB, t: number): RGB {
	return {
		r: a.r * (1 - t) + b.r * t,
		g: a.g * (1 - t) + b.g * t,
		b: a.b * (1 - t) + b.b * t,
	};
}

function relativeLuminance({ r, g, b }: RGB): number {
	const toLinear = (channel: number) => {
		const s = channel / 255;
		return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
	};
	return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

export type BrandScale = Record<ScaleStep, string>;

function contrastOnWhite(rgb: RGB): number {
	return 1.05 / (relativeLuminance(rgb) + 0.05);
}

function roundRgb({ r, g, b }: RGB): RGB {
	return { r: clamp(r), g: clamp(g), b: clamp(b) };
}

function darkenToContrast(rgb: RGB, minRatio: number): RGB {
	let candidate = roundRgb(rgb);
	if (contrastOnWhite(candidate) >= minRatio) return candidate;
	let lo = 0;
	let hi = 1;
	for (let i = 0; i < 24; i++) {
		const mid = (lo + hi) / 2;
		if (contrastOnWhite(roundRgb(mix(rgb, BLACK, mid))) >= minRatio) {
			hi = mid;
		} else {
			lo = mid;
		}
	}
	candidate = roundRgb(mix(rgb, BLACK, hi));
	let t = hi;
	while (contrastOnWhite(candidate) < minRatio && t < 1) {
		t = Math.min(1, t + 0.005);
		candidate = roundRgb(mix(rgb, BLACK, t));
	}
	return candidate;
}

const CONTRAST_FLOORS: Partial<Record<ScaleStep, number>> = {
	'500': 3,
	'600': 4.5,
	'700': 4.5,
};

const CLAMPED_STEPS: ScaleStep[] = ['500', '600', '700', '800', '900', '950'];

export function deriveBrandScale(seedHex: string): BrandScale | null {
	const seed = hexToRgb(seedHex);
	if (!seed) return null;
	const out = {} as BrandScale;
	(Object.keys(STEPS) as ScaleStep[]).forEach((step) => {
		const { towards, amount } = STEPS[step];
		if (towards === 'self') {
			out[step] = rgbToHex(seed);
			return;
		}
		const target = towards === 'white' ? WHITE : BLACK;
		out[step] = rgbToHex(mix(seed, target, amount));
	});
	let minContrast = 0;
	CLAMPED_STEPS.forEach((step) => {
		const rgb = hexToRgb(out[step]);
		if (!rgb) return;
		const floor = Math.max(CONTRAST_FLOORS[step] ?? 0, minContrast);
		const clamped = darkenToContrast(rgb, floor);
		out[step] = rgbToHex(clamped);
		minContrast = contrastOnWhite(clamped);
	});
	return out;
}

export function pickTextOnBrand(seedHex: string): string {
	const seed = hexToRgb(seedHex);
	if (!seed) return '#ffffff';
	const dark = hexToRgb('#0f172a');
	if (!dark) return '#ffffff';
	const seedLum = relativeLuminance(seed);
	const whiteContrast = 1.05 / (seedLum + 0.05);
	const darkContrast = (seedLum + 0.05) / (relativeLuminance(dark) + 0.05);
	return darkContrast >= whiteContrast ? '#0f172a' : '#ffffff';
}

export function brandMeetsTextContrast(seedHex: string): boolean {
	const seed = hexToRgb(seedHex);
	if (!seed) return true;
	return contrastOnWhite(seed) >= 4.5;
}

export function brandThemeVars(
	seedHex: string | undefined,
): Record<string, string> | undefined {
	if (!seedHex) return undefined;
	const scale = deriveBrandScale(seedHex);
	if (!scale) return undefined;
	const vars: Record<string, string> = {};
	(Object.keys(scale) as ScaleStep[]).forEach((step) => {
		vars[`--ds-brand-${step}`] = scale[step];
	});
	vars['--ds-ring'] = scale['500'];
	vars['--ds-text-on-brand'] = pickTextOnBrand(scale['600']);
	return vars;
}
