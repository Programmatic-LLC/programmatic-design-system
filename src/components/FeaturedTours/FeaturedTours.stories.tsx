import type { Meta, StoryObj } from '@storybook/react';
import { FeaturedTours } from './FeaturedTours';
import { Section } from '../Section';

const meta: Meta<typeof FeaturedTours> = {
	title: 'Design System/Components/FeaturedTours',
	component: FeaturedTours,
	parameters: { layout: 'centered' },
	tags: ['autodocs'],
	decorators: [
		(Story) => (
			<div className="w-[960px] max-w-full">
				<Story />
			</div>
		),
	],
};

export default meta;

type Story = StoryObj<typeof FeaturedTours>;

const sampleItems = [
	{
		id: '1',
		title: 'Mill Heritage Walk',
		preview:
			'A self-guided walk past five sites of the original mill town, with audio at each stop.',
		image:
			'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80&auto=format&fit=crop',
	},
	{
		id: '2',
		title: 'Riverbend Public Art Loop',
		preview: 'Eight sculptures and murals threaded together by a 45-minute downtown walk.',
		image:
			'https://images.unsplash.com/photo-1577083552431-6e5fd75a9160?w=800&q=80&auto=format&fit=crop',
	},
	{
		id: '3',
		title: 'Evening Foodie Stroll',
		preview: 'Three stops, three bites, one neighborhood — a curated taste of Cherry St.',
		image:
			'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80&auto=format&fit=crop',
	},
];

export const Default: Story = {
	args: {
		items: sampleItems,
		onSelect: () => {},
	},
};

export const WithSectionHeader: Story = {
	render: (args) => (
		<Section title="Featured in tours" headingLevel="h2">
			<FeaturedTours {...args} />
		</Section>
	),
	args: {
		items: sampleItems,
	},
};

export const TwoColumns: Story = {
	args: {
		items: sampleItems.slice(0, 2),
		columns: 2,
	},
};

export const NoImages: Story = {
	args: {
		items: sampleItems.map((i) => ({ ...i, image: null })),
	},
};

export const Static: Story = {
	args: {
		items: sampleItems,
	},
};
