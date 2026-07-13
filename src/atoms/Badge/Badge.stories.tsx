import type { Meta, StoryObj } from '@storybook/react';
import { Sparkles, Clock, MapPin } from 'lucide-react';
import { Badge } from './Badge';

const meta: Meta<typeof Badge> = {
	title: 'Design System/Atoms/Badge',
	component: Badge,
	parameters: { layout: 'centered' },
	tags: ['autodocs'],
	argTypes: {
		variant: {
			control: 'select',
			options: ['brand', 'neutral', 'solid', 'outline', 'success', 'warning', 'danger', 'info'],
		},
		size: { control: 'radio', options: ['sm', 'md'] },
		shape: { control: 'radio', options: ['rounded', 'pill'] },
	},
};

export default meta;

type Story = StoryObj<typeof Badge>;

export const Default: Story = {
	args: { children: 'Featured', variant: 'brand' },
};

export const AllVariants: Story = {
	parameters: { layout: 'padded' },
	render: () => (
		<div className="flex flex-wrap gap-2">
			<Badge variant="brand">Brand</Badge>
			<Badge variant="solid">Solid</Badge>
			<Badge variant="neutral">Neutral</Badge>
			<Badge variant="outline">Outline</Badge>
			<Badge variant="success">Open</Badge>
			<Badge variant="warning">Limited</Badge>
			<Badge variant="danger">Closed</Badge>
			<Badge variant="info">New</Badge>
		</div>
	),
};

export const AsPills: Story = {
	parameters: { layout: 'padded' },
	render: () => (
		<div className="flex flex-wrap gap-2">
			<Badge shape="pill" variant="neutral">Sculpture</Badge>
			<Badge shape="pill" variant="neutral">Outdoor</Badge>
			<Badge shape="pill" variant="neutral">Free</Badge>
			<Badge shape="pill" variant="neutral">Family-friendly</Badge>
		</div>
	),
};

export const WithIcons: Story = {
	parameters: { layout: 'padded' },
	render: () => (
		<div className="flex flex-wrap gap-2">
			<Badge variant="brand" leftIcon={<Sparkles className="h-3 w-3" />}>Featured</Badge>
			<Badge variant="success" leftIcon={<Clock className="h-3 w-3" />}>Open until 9 PM</Badge>
			<Badge variant="info" leftIcon={<MapPin className="h-3 w-3" />}>0.4 mi away</Badge>
		</div>
	),
};

export const Sizes: Story = {
	parameters: { layout: 'padded' },
	render: () => (
		<div className="flex items-center gap-3">
			<Badge size="sm">Small</Badge>
			<Badge size="md">Medium</Badge>
		</div>
	),
};
