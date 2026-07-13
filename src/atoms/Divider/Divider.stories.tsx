import type { Meta, StoryObj } from '@storybook/react';
import { Divider } from './Divider';

const meta: Meta<typeof Divider> = {
	title: 'Design System/Atoms/Divider',
	component: Divider,
	parameters: { layout: 'padded' },
	tags: ['autodocs'],
	argTypes: {
		orientation: { control: 'radio', options: ['horizontal', 'vertical'] },
	},
};

export default meta;

type Story = StoryObj<typeof Divider>;

export const Horizontal: Story = {
	render: () => (
		<div className="flex max-w-md flex-col gap-4">
			<p className="text-sm text-[var(--ds-text)]">Above the divider</p>
			<Divider />
			<p className="text-sm text-[var(--ds-text)]">Below the divider</p>
		</div>
	),
};

export const Vertical: Story = {
	render: () => (
		<div className="flex h-12 items-center gap-4 text-sm text-[var(--ds-text-muted)]">
			<span>Free</span>
			<Divider orientation="vertical" />
			<span>Family-friendly</span>
			<Divider orientation="vertical" />
			<span>0.4 mi</span>
		</div>
	),
};
