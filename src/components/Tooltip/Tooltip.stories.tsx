import type { Meta, StoryObj } from '@storybook/react';
import { HelpCircle } from 'lucide-react';
import { Tooltip } from './Tooltip';

const meta: Meta<typeof Tooltip> = {
	title: 'Design System/Components/Tooltip',
	component: Tooltip,
	parameters: { layout: 'centered' },
	tags: ['autodocs'],
	decorators: [
		(Story) => (
			<div className="flex h-40 w-80 items-start justify-center pt-4">
				<Story />
			</div>
		),
	],
};

export default meta;

type Story = StoryObj<typeof Tooltip>;

export const IconTrigger: Story = {
	args: {
		content:
			'Total number of times visitors scanned one of your QR codes during the selected period.',
		children: (
			<button
				type="button"
				aria-label="More information"
				className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ds-ring)] focus-visible:ring-offset-2"
			>
				<HelpCircle className="h-4 w-4 text-[var(--ds-text-muted)]" aria-hidden="true" />
			</button>
		),
	},
};

export const TextTrigger: Story = {
	args: {
		content: 'Shown on hover and on keyboard focus. Press Escape to dismiss.',
		children: (
			<button
				type="button"
				className="rounded-lg border border-[var(--ds-border-strong)] px-3 py-1.5 text-sm text-[var(--ds-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ds-ring)] focus-visible:ring-offset-2"
			>
				Hover or focus me
			</button>
		),
	},
};
