import type { Meta, StoryObj } from '@storybook/react';
import { Text } from './Text';
import { typeScale } from '../../tokens/typography';

const meta: Meta<typeof Text> = {
	title: 'Design System/Atoms/Text',
	component: Text,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
	argTypes: {
		variant: {
			control: 'select',
			options: typeScale.map((t) => t.variant),
		},
		color: {
			control: 'select',
			options: [
				'default',
				'muted',
				'subtle',
				'brand',
				'inverse',
				'success',
				'warning',
				'danger',
				'info',
			],
		},
		weight: {
			control: 'select',
			options: ['normal', 'medium', 'semibold', 'bold'],
		},
		align: {
			control: 'radio',
			options: ['left', 'center', 'right'],
		},
		truncate: { control: 'boolean' },
	},
};

export default meta;

type Story = StoryObj<typeof Text>;

export const Default: Story = {
	args: {
		children: 'The quick brown fox jumps over the lazy dog.',
		variant: 'body',
	},
};

export const Scale: Story = {
	parameters: { layout: 'padded' },
	render: () => (
		<div className="flex flex-col gap-4">
			{typeScale.map((t) => (
				<div key={t.variant} className="flex flex-col gap-1">
					<Text variant="overline" color="subtle">
						{t.variant} · {t.size} · {t.usage}
					</Text>
					<Text variant={t.variant}>The explorer&apos;s guide to {t.variant}</Text>
				</div>
			))}
		</div>
	),
};

export const Colors: Story = {
	parameters: { layout: 'padded' },
	render: () => (
		<div className="flex flex-col gap-2">
			<Text color="default">Default — primary text</Text>
			<Text color="muted">Muted — secondary text</Text>
			<Text color="subtle">Subtle — hints and placeholders</Text>
			<Text color="brand">Brand — DestinationHub teal</Text>
			<Text color="success">Success</Text>
			<Text color="warning">Warning</Text>
			<Text color="danger">Danger</Text>
			<Text color="info">Info</Text>
			<div className="rounded-lg bg-[var(--ds-brand-600)] p-3">
				<Text color="inverse">Inverse — text on brand fills</Text>
			</div>
		</div>
	),
};

export const Truncated: Story = {
	parameters: { layout: 'padded' },
	render: () => (
		<div className="max-w-xs">
			<Text truncate>
				This is a very long single line of text that will be truncated with an ellipsis when it
				overflows its container.
			</Text>
		</div>
	),
};

export const Playground: Story = {
	args: {
		children: 'Customize me in the controls panel',
		variant: 'h2',
		color: 'default',
	},
};
