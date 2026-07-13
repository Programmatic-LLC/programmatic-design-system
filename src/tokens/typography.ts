export type TextVariant =
	| 'display'
	| 'h1'
	| 'h2'
	| 'h3'
	| 'h4'
	| 'body-lg'
	| 'body'
	| 'body-sm'
	| 'caption'
	| 'overline';

export interface TypeToken {
	variant: TextVariant;
	className: string;
	defaultTag: string;
	size: string;
	usage: string;
}

export const typeScale: TypeToken[] = [
	{
		variant: 'display',
		className: 'text-4xl sm:text-5xl font-bold tracking-tight leading-tight',
		defaultTag: 'h1',
		size: '36 → 48px',
		usage: 'Hero / landing headlines',
	},
	{
		variant: 'h1',
		className: 'text-3xl sm:text-4xl font-bold tracking-tight leading-tight',
		defaultTag: 'h1',
		size: '30 → 36px',
		usage: 'Page titles',
	},
	{
		variant: 'h2',
		className: 'text-2xl sm:text-3xl font-semibold tracking-tight leading-snug',
		defaultTag: 'h2',
		size: '24 → 30px',
		usage: 'Section headings',
	},
	{
		variant: 'h3',
		className: 'text-xl sm:text-2xl font-semibold leading-snug',
		defaultTag: 'h3',
		size: '20 → 24px',
		usage: 'Sub-section headings',
	},
	{
		variant: 'h4',
		className: 'text-lg sm:text-xl font-semibold leading-snug',
		defaultTag: 'h4',
		size: '18 → 20px',
		usage: 'Card / list headings',
	},
	{
		variant: 'body-lg',
		className: 'text-lg leading-relaxed',
		defaultTag: 'p',
		size: '18px',
		usage: 'Lead paragraphs, intros',
	},
	{
		variant: 'body',
		className: 'text-base leading-relaxed',
		defaultTag: 'p',
		size: '16px',
		usage: 'Default body copy',
	},
	{
		variant: 'body-sm',
		className: 'text-sm leading-normal',
		defaultTag: 'p',
		size: '14px',
		usage: 'Secondary / dense text',
	},
	{
		variant: 'caption',
		className: 'text-xs leading-normal',
		defaultTag: 'span',
		size: '12px',
		usage: 'Captions, metadata',
	},
	{
		variant: 'overline',
		className: 'text-xs font-semibold uppercase tracking-wider leading-normal',
		defaultTag: 'span',
		size: '12px',
		usage: 'Labels, eyebrows',
	},
];

export const fontWeights = [
	{ name: 'normal', value: 400, className: 'font-normal' },
	{ name: 'medium', value: 500, className: 'font-medium' },
	{ name: 'semibold', value: 600, className: 'font-semibold' },
	{ name: 'bold', value: 700, className: 'font-bold' },
] as const;
