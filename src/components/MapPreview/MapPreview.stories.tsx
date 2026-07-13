import type { Meta, StoryObj } from '@storybook/react';
import { MapPreview } from './MapPreview';

const meta: Meta<typeof MapPreview> = {
	title: 'Design System/Components/MapPreview',
	component: MapPreview,
	parameters: { layout: 'padded' },
	tags: ['autodocs'],
	argTypes: {
		aspectRatio: { control: 'text' },
		rounded: { control: 'boolean' },
	},
	decorators: [
		(Story) => (
			<div className="max-w-2xl">
				<Story />
			</div>
		),
	],
};

export default meta;

type Story = StoryObj<typeof MapPreview>;

export const Placeholder: Story = {
	args: {
		address: '218 Main St, Riverbend',
		coordinates: { latitude: 44.0521, longitude: -123.0868 },
		onGetDirections: () => {},
	},
};

export const NoAddress: Story = {
	args: {
		onGetDirections: () => {},
	},
};

export const WithMapImage: Story = {
	args: {
		address: 'Riverwalk Trailhead',
		coordinates: { latitude: 44.0521, longitude: -123.0868 },
		onGetDirections: () => {},
		children: (
			<img
				src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1200&q=80&auto=format&fit=crop"
				alt="Map of the area"
				className="h-full w-full object-cover"
			/>
		),
	},
};

export const NoActionButton: Story = {
	args: {
		address: '218 Main St, Riverbend',
		coordinates: { latitude: 44.0521, longitude: -123.0868 },
	},
};
