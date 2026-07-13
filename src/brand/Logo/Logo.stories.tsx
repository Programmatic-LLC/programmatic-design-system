import type { Meta, StoryObj } from '@storybook/react';
import { Lockup } from './Lockup';
import { Logomark } from './Logomark';
import { Wordmark } from './Wordmark';

const meta: Meta<typeof Lockup> = {
	title: 'Design System/Brand/Logo',
	component: Lockup,
	parameters: { layout: 'padded' },
	tags: ['autodocs'],
	argTypes: {
		size: { control: { type: 'range', min: 16, max: 120, step: 4 } },
		color: { control: 'color' },
	},
};

export default meta;

type Story = StoryObj<typeof Lockup>;

const brandColors = [
	{ label: 'Brand', value: 'var(--ds-brand-600)' },
	{ label: 'Brand dark', value: 'var(--ds-brand-800)' },
	{ label: 'Ink', value: 'var(--ds-neutral-900)' },
];

export const FullLockup: Story = {
	args: { size: 48, title: 'DestinationHub' },
};

export const Mark: Story = {
	render: (args) => <Logomark size={args.size ?? 64} color={args.color} title="DestinationHub mark" />,
	args: { size: 64 },
};

export const WordmarkOnly: Story = {
	render: (args) => <Wordmark size={args.size ?? 28} color={args.color} title="DestinationHub" />,
	args: { size: 28 },
};

export const BrandColors: Story = {
	render: () => (
		<div className="flex flex-col gap-6">
			{brandColors.map((c) => (
				<div key={c.label} className="flex items-center gap-6">
					<span className="w-24 text-sm text-[var(--ds-text-muted)]">{c.label}</span>
					<Lockup size={40} color={c.value} title={`DestinationHub — ${c.label}`} />
				</div>
			))}
		</div>
	),
};

export const OnDark: Story = {
	render: () => (
		<div className="flex flex-col gap-6 rounded-xl bg-[var(--ds-neutral-900)] p-8">
			<Lockup size={40} color="#ffffff" title="DestinationHub on dark" />
			<div className="flex items-center gap-8">
				<Logomark size={56} color="var(--ds-brand-400)" />
				<Wordmark size={24} color="#ffffff" />
			</div>
		</div>
	),
};

export const TwoTone: Story = {
	render: () => (
		<Lockup
			size={48}
			iconColor="var(--ds-brand-600)"
			textColor="var(--ds-neutral-900)"
			title="DestinationHub two-tone"
		/>
	),
};

export const Sizes: Story = {
	render: () => (
		<div className="flex flex-col gap-6">
			{[24, 32, 48, 72].map((s) => (
				<div key={s} className="flex items-center gap-6">
					<span className="w-12 text-sm text-[var(--ds-text-muted)]">{s}px</span>
					<Lockup size={s} color="var(--ds-brand-600)" />
				</div>
			))}
		</div>
	),
};
