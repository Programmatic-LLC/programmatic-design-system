import type { Meta, StoryObj } from '@storybook/react';
import { Carousel } from './Carousel';

const meta: Meta<typeof Carousel> = {
	title: 'Design System/Components/Carousel',
	component: Carousel,
	parameters: { layout: 'padded' },
	tags: ['autodocs'],
	argTypes: {
		gap: { control: 'radio', options: ['sm', 'md', 'lg'] },
		controls: { control: 'boolean' },
		edgeFade: { control: 'boolean' },
		snap: { control: 'boolean' },
	},
};

export default meta;

type Story = StoryObj<typeof Carousel>;

const SwatchCard = ({ i }: { i: number }) => (
	<div className="flex h-64 w-72 flex-shrink-0 flex-col justify-end rounded-[var(--ds-radius-xl)] bg-gradient-to-br from-[var(--ds-brand-300)] to-[var(--ds-brand-600)] p-6 text-[var(--ds-text-on-brand)] shadow-md">
		<div className="text-sm uppercase tracking-wider opacity-80">Card</div>
		<div className="text-2xl font-semibold">Item {i + 1}</div>
	</div>
);

export const Basic: Story = {
	args: {
		'aria-label': 'Featured items',
		children: Array.from({ length: 8 }).map((_, i) => <SwatchCard key={i} i={i} />),
	},
};

export const TwoItems: Story = {
	args: {
		children: Array.from({ length: 2 }).map((_, i) => <SwatchCard key={i} i={i} />),
	},
};
