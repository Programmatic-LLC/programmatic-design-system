import type { Meta, StoryObj } from '@storybook/react';
import { Calendar, Footprints, Hotel, Landmark, Route, Sparkles, UtensilsCrossed } from 'lucide-react';
import { CategoryNav } from './CategoryNav';

const meta: Meta<typeof CategoryNav> = {
	title: 'Design System/Components/CategoryNav',
	component: CategoryNav,
	parameters: { layout: 'fullscreen' },
	tags: ['autodocs'],
	argTypes: {
		sticky: { control: 'boolean' },
		bordered: { control: 'boolean' },
	},
};

export default meta;

type Story = StoryObj<typeof CategoryNav>;

const items = [
	{ key: 'tours', label: 'Tours', icon: Route, count: 5 },
	{ key: 'events', label: 'Events', icon: Calendar, count: 3 },
	{ key: 'attractions', label: 'Attractions', icon: Sparkles, count: 12 },
	{ key: 'trails', label: 'Trails', icon: Footprints, count: 4 },
	{ key: 'dining', label: 'Dining', icon: UtensilsCrossed, count: 8 },
	{ key: 'lodging', label: 'Lodging', icon: Hotel, count: 6 },
	{ key: 'historical', label: 'Historical', icon: Landmark, count: 9 },
];

export const Basic: Story = {
	args: {
		items,
		activeKey: 'tours',
	},
};

export const Sticky: Story = {
	args: {
		items,
		sticky: true,
		activeKey: 'attractions',
	},
};
