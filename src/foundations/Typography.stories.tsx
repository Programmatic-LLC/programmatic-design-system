import type { Meta, StoryObj } from '@storybook/react';
import { Text } from '../atoms/Text';
import { fontWeights, typeScale } from '../tokens/typography';

const meta = {
	title: 'Design System/Foundations/Typography',
	parameters: { layout: 'padded' },
} satisfies Meta;

export default meta;

type Story = StoryObj;

export const Scale: Story = {
	render: () => (
		<div className="flex flex-col gap-6">
			{typeScale.map((t) => (
				<div
					key={t.variant}
					className="grid grid-cols-1 gap-2 border-b border-[var(--ds-border)] pb-6 last:border-b-0 last:pb-0 md:grid-cols-[200px_1fr] md:items-baseline md:gap-8"
				>
					<div className="flex flex-col">
						<span className="font-mono text-xs uppercase tracking-wider text-[var(--ds-text-subtle)]">
							{t.variant}
						</span>
						<span className="text-sm text-[var(--ds-text-muted)]">{t.size}</span>
						<span className="text-sm text-[var(--ds-text-muted)]">{t.usage}</span>
					</div>
					<Text variant={t.variant}>The explorer&apos;s guide to {t.variant}</Text>
				</div>
			))}
		</div>
	),
};

export const Weights: Story = {
	render: () => (
		<div className="flex flex-col gap-4">
			{fontWeights.map((w) => (
				<div key={w.name} className="grid grid-cols-[120px_1fr] items-baseline gap-6">
					<span className="font-mono text-xs uppercase tracking-wider text-[var(--ds-text-subtle)]">
						{w.name} · {w.value}
					</span>
					<Text variant="h3" weight={w.name}>
						Discover places worth the detour
					</Text>
				</div>
			))}
		</div>
	),
};

export const Colors: Story = {
	render: () => (
		<div className="flex flex-col gap-2">
			<Text color="default">Default — primary text on light surfaces.</Text>
			<Text color="muted">Muted — supporting copy and metadata.</Text>
			<Text color="subtle">Subtle — hints, placeholders, deemphasized.</Text>
			<Text color="brand">Brand — used sparingly for emphasis.</Text>
			<Text color="success">Success</Text>
			<Text color="warning">Warning</Text>
			<Text color="danger">Danger</Text>
			<Text color="info">Info</Text>
		</div>
	),
};
