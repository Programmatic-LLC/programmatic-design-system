import { describe, expect, it } from 'vitest';
import {
	brandMeetsTextContrast,
	brandThemeVars,
	deriveBrandScale,
	pickTextOnBrand,
} from './brandScale';

const STEP_KEYS = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'];

function luminance(hex: string): number {
	const value = hex.replace('#', '');
	const channel = (offset: number) => parseInt(value.slice(offset, offset + 2), 16);
	const toLinear = (n: number) => {
		const s = n / 255;
		return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
	};
	return (
		0.2126 * toLinear(channel(0)) + 0.7152 * toLinear(channel(2)) + 0.0722 * toLinear(channel(4))
	);
}

describe('deriveBrandScale', () => {
	it('returns a full scale keyed by step with the seed at 600', () => {
		const scale = deriveBrandScale('#158474');
		expect(scale).not.toBeNull();
		expect(Object.keys(scale!)).toEqual(STEP_KEYS);
		expect(scale!['600']).toBe('#158474');
	});

	it('mixes light steps towards white', () => {
		const scale = deriveBrandScale('#158474');
		expect(scale!['50']).toBe('#f3f9f8');
		expect(luminance(scale!['50'])).toBeGreaterThan(luminance(scale!['300']));
		expect(luminance(scale!['300'])).toBeGreaterThan(luminance(scale!['600']));
	});

	it('produces progressively darker steps above 600', () => {
		const scale = deriveBrandScale('#158474');
		expect(luminance(scale!['700'])).toBeGreaterThan(luminance(scale!['800']));
		expect(luminance(scale!['800'])).toBeGreaterThan(luminance(scale!['950']));
	});

	it('expands 3-digit hex seeds', () => {
		const scale = deriveBrandScale('#fff');
		expect(scale).not.toBeNull();
		expect(scale!['50']).toBe('#ffffff');
	});

	it('accepts seeds without a leading hash and with whitespace', () => {
		expect(deriveBrandScale(' 158474 ')).not.toBeNull();
	});

	it('darkens low-contrast seeds so 600 stays readable on white', () => {
		const scale = deriveBrandScale('#ffffff');
		expect(scale!['600']).not.toBe('#ffffff');
		const contrast = 1.05 / (luminance(scale!['600']) + 0.05);
		expect(contrast).toBeGreaterThanOrEqual(4.5);
	});

	it('keeps clamped steps monotonically darker for light seeds', () => {
		const scale = deriveBrandScale('#f7e017');
		expect(luminance(scale!['500'])).toBeGreaterThanOrEqual(luminance(scale!['600']));
		expect(luminance(scale!['600'])).toBeGreaterThanOrEqual(luminance(scale!['700']));
	});

	it('returns null for invalid input', () => {
		expect(deriveBrandScale('')).toBeNull();
		expect(deriveBrandScale('nothex')).toBeNull();
		expect(deriveBrandScale('#12345g')).toBeNull();
		expect(deriveBrandScale('#1234')).toBeNull();
	});
});

describe('pickTextOnBrand', () => {
	it('picks white text for dark seeds', () => {
		expect(pickTextOnBrand('#158474')).toBe('#ffffff');
		expect(pickTextOnBrand('#000000')).toBe('#ffffff');
	});

	it('picks dark text for light seeds', () => {
		expect(pickTextOnBrand('#ffffff')).toBe('#0f172a');
		expect(pickTextOnBrand('#f7e017')).toBe('#0f172a');
	});

	it('falls back to white for invalid seeds', () => {
		expect(pickTextOnBrand('bogus')).toBe('#ffffff');
	});
});

describe('brandMeetsTextContrast', () => {
	it('returns true when the seed has 4.5 contrast on white', () => {
		expect(brandMeetsTextContrast('#158474')).toBe(true);
		expect(brandMeetsTextContrast('#000000')).toBe(true);
	});

	it('returns false for light seeds', () => {
		expect(brandMeetsTextContrast('#ffffff')).toBe(false);
	});

	it('returns true for invalid seeds', () => {
		expect(brandMeetsTextContrast('bogus')).toBe(true);
	});
});

describe('brandThemeVars', () => {
	it('returns undefined without a seed', () => {
		expect(brandThemeVars(undefined)).toBeUndefined();
		expect(brandThemeVars('')).toBeUndefined();
	});

	it('returns undefined for invalid seeds', () => {
		expect(brandThemeVars('bogus')).toBeUndefined();
	});

	it('maps the scale onto css custom properties', () => {
		const vars = brandThemeVars('#158474');
		expect(vars).toBeDefined();
		STEP_KEYS.forEach((step) => {
			expect(vars![`--ds-brand-${step}`]).toMatch(/^#[0-9a-f]{6}$/);
		});
		expect(vars!['--ds-brand-600']).toBe('#158474');
		expect(vars!['--ds-ring']).toBe(vars!['--ds-brand-500']);
		expect(vars!['--ds-text-on-brand']).toBe('#ffffff');
	});
});
