import type { Meta, StoryObj } from '@storybook/react';
import { Skeleton } from './Skeleton';

const meta: Meta<typeof Skeleton> = {
	title: 'Design System/Atoms/Skeleton',
	component: Skeleton,
	parameters: { layout: 'padded' },
	tags: ['autodocs'],
	argTypes: {
		shimmer: { control: 'boolean' },
	},
	decorators: [
		(Story) => (
			<div className="w-[480px] max-w-full">
				<Story />
			</div>
		),
	],
};

export default meta;

type Story = StoryObj<typeof Skeleton>;

export const Block: Story = {
	args: { className: 'h-24 w-full', shimmer: true },
};

export const Line: Story = {
	args: { className: 'h-4 w-3/4', shimmer: true },
};

export const Pulse: Story = {
	args: { className: 'h-24 w-full', shimmer: false },
};

export const ContentCard: Story = {
	render: () => (
		<div className="flex flex-col gap-3 rounded-[var(--ds-radius-lg)] border border-[var(--ds-border)] p-6">
			<Skeleton className="h-6 w-32" />
			<Skeleton className="h-4 w-full" />
			<Skeleton className="h-4 w-full" />
			<Skeleton className="h-4 w-5/6" />
			<div className="flex gap-2 pt-2">
				<Skeleton className="h-6 w-16 rounded-full" />
				<Skeleton className="h-6 w-20 rounded-full" />
			</div>
		</div>
	),
};
