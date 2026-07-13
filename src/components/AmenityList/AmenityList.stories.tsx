import type { Meta, StoryObj } from '@storybook/react';
import {
	Accessibility,
	BabyIcon,
	Bike,
	Car,
	Coffee,
	Dog,
	ParkingCircle,
	Trees,
	Utensils,
	Wifi,
} from 'lucide-react';
import { AmenityList } from './AmenityList';

const sample = [
	{ icon: <ParkingCircle className="h-5 w-5" />, label: 'Free parking' },
	{ icon: <Accessibility className="h-5 w-5" />, label: 'Wheelchair accessible' },
	{ icon: <Wifi className="h-5 w-5" />, label: 'Free Wi-Fi' },
	{ icon: <Dog className="h-5 w-5" />, label: 'Dogs on leash' },
	{ icon: <BabyIcon className="h-5 w-5" />, label: 'Family-friendly' },
	{ icon: <Bike className="h-5 w-5" />, label: 'Bike rack' },
	{ icon: <Coffee className="h-5 w-5" />, label: 'Café on site' },
	{ icon: <Trees className="h-5 w-5" />, label: 'Outdoor seating' },
	{ icon: <Utensils className="h-5 w-5" />, label: 'Picnic tables' },
];

const meta: Meta<typeof AmenityList> = {
	title: 'Design System/Components/AmenityList',
	component: AmenityList,
	parameters: { layout: 'padded' },
	tags: ['autodocs'],
	argTypes: {
		variant: { control: 'radio', options: ['tiles', 'chips', 'list'] },
		columns: { control: 'radio', options: [2, 3, 4] },
	},
};

export default meta;

type Story = StoryObj<typeof AmenityList>;

export const Tiles: Story = {
	args: { items: sample, variant: 'tiles', columns: 3 },
};

export const TwoColumn: Story = {
	args: { items: sample.slice(0, 6), variant: 'tiles', columns: 2 },
};

export const FourColumn: Story = {
	args: { items: sample, variant: 'tiles', columns: 4 },
};

export const Chips: Story = {
	args: { items: sample, variant: 'chips' },
};

export const List: Story = {
	args: {
		items: [
			{ icon: <Car className="h-4 w-4" />, label: 'Lot parking', description: '20 spaces' },
			{ icon: <Accessibility className="h-4 w-4" />, label: 'Step-free entry' },
			{ icon: <Wifi className="h-4 w-4" />, label: 'Free Wi-Fi' },
		],
		variant: 'list',
	},
};
