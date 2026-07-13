export interface ColorSwatch {
	name: string;
	cssVar: string;
	value: string;
}

export interface ColorScale {
	name: string;
	description: string;
	swatches: ColorSwatch[];
}

export interface SemanticToken {
	name: string;
	cssVar: string;
	usage: string;
}

const scale = (
	prefix: string,
	entries: [string, string][],
): ColorSwatch[] =>
	entries.map(([step, value]) => ({
		name: `${prefix}-${step}`,
		cssVar: `--ds-${prefix}-${step}`,
		value,
	}));

export const brandScale: ColorScale = {
	name: 'Brand',
	description: 'Teal, anchored on the DestinationHub primary #158474 (600).',
	swatches: scale('brand', [
		['50', '#ecfdf6'],
		['100', '#cdf6e8'],
		['200', '#9fead2'],
		['300', '#66d7b8'],
		['400', '#30bd9a'],
		['500', '#16a085'],
		['600', '#158474'],
		['700', '#115e52'],
		['800', '#0d4a40'],
		['900', '#0a3a33'],
		['950', '#052420'],
	]),
};

export const neutralScale: ColorScale = {
	name: 'Neutral',
	description: 'Slate ramp for text, surfaces, and borders.',
	swatches: scale('neutral', [
		['0', '#ffffff'],
		['50', '#f8fafc'],
		['100', '#f1f5f9'],
		['200', '#e2e8f0'],
		['300', '#cbd5e1'],
		['400', '#94a3b8'],
		['500', '#64748b'],
		['600', '#475569'],
		['700', '#334155'],
		['800', '#1e293b'],
		['900', '#0f172a'],
		['950', '#020617'],
	]),
};

export const semanticScales: ColorScale[] = [
	{
		name: 'Success',
		description: 'Confirmation, positive status.',
		swatches: [
			{ name: 'success', cssVar: '--ds-success', value: '#16a34a' },
			{ name: 'success-surface', cssVar: '--ds-success-surface', value: '#dcfce7' },
			{ name: 'success-strong', cssVar: '--ds-success-strong', value: '#15803d' },
		],
	},
	{
		name: 'Warning',
		description: 'Caution, needs attention.',
		swatches: [
			{ name: 'warning', cssVar: '--ds-warning', value: '#ca8a04' },
			{ name: 'warning-surface', cssVar: '--ds-warning-surface', value: '#fef9c3' },
			{ name: 'warning-strong', cssVar: '--ds-warning-strong', value: '#a16207' },
		],
	},
	{
		name: 'Danger',
		description: 'Errors, destructive actions.',
		swatches: [
			{ name: 'danger', cssVar: '--ds-danger', value: '#dc2626' },
			{ name: 'danger-surface', cssVar: '--ds-danger-surface', value: '#fee2e2' },
			{ name: 'danger-strong', cssVar: '--ds-danger-strong', value: '#b91c1c' },
		],
	},
	{
		name: 'Info',
		description: 'Neutral informational accents.',
		swatches: [
			{ name: 'info', cssVar: '--ds-info', value: '#2563eb' },
			{ name: 'info-surface', cssVar: '--ds-info-surface', value: '#dbeafe' },
			{ name: 'info-strong', cssVar: '--ds-info-strong', value: '#1d4ed8' },
		],
	},
];

export const aliasTokens: SemanticToken[] = [
	{ name: 'bg', cssVar: '--ds-bg', usage: 'App background' },
	{ name: 'surface', cssVar: '--ds-surface', usage: 'Cards, sheets, raised surfaces' },
	{ name: 'surface-subtle', cssVar: '--ds-surface-subtle', usage: 'Subtle filled areas' },
	{ name: 'surface-muted', cssVar: '--ds-surface-muted', usage: 'Hover / muted fills' },
	{ name: 'border', cssVar: '--ds-border', usage: 'Default borders, dividers' },
	{ name: 'border-strong', cssVar: '--ds-border-strong', usage: 'Emphasised borders' },
	{ name: 'text', cssVar: '--ds-text', usage: 'Primary text' },
	{ name: 'text-muted', cssVar: '--ds-text-muted', usage: 'Secondary text' },
	{ name: 'text-subtle', cssVar: '--ds-text-subtle', usage: 'Placeholders, hints' },
	{ name: 'text-on-brand', cssVar: '--ds-text-on-brand', usage: 'Text on brand fills' },
	{ name: 'ring', cssVar: '--ds-ring', usage: 'Focus rings' },
];
