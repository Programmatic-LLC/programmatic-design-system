import type { Meta, StoryObj } from '@storybook/react';
import { Plus, ArrowRight, Trash2, MapPin } from 'lucide-react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
	title: 'Design System/Atoms/Button',
	component: Button,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
	argTypes: {
		variant: {
			control: 'select',
			options: ['primary', 'secondary', 'outline', 'ghost', 'danger', 'link'],
		},
		size: {
			control: 'select',
			options: ['sm', 'md', 'lg', 'icon'],
		},
		isLoading: { control: 'boolean' },
		fullWidth: { control: 'boolean' },
		disabled: { control: 'boolean' },
	},
};

export default meta;

type Story = StoryObj<typeof Button>;

export const Primary: Story = {
	args: { children: 'Start exploring', variant: 'primary' },
};

export const Secondary: Story = {
	args: { children: 'Secondary', variant: 'secondary' },
};

export const Outline: Story = {
	args: { children: 'Outline', variant: 'outline' },
};

export const Ghost: Story = {
	args: { children: 'Ghost', variant: 'ghost' },
};

export const Danger: Story = {
	args: { children: 'Delete', variant: 'danger', leftIcon: <Trash2 className="h-4 w-4" /> },
};

export const Link: Story = {
	args: { children: 'Learn more', variant: 'link' },
};

export const WithIcons: Story = {
	parameters: { layout: 'padded' },
	render: () => (
		<div className="flex flex-wrap items-center gap-3">
			<Button leftIcon={<Plus className="h-4 w-4" />}>Add place</Button>
			<Button variant="outline" rightIcon={<ArrowRight className="h-4 w-4" />}>
				Continue
			</Button>
			<Button size="icon" variant="ghost" aria-label="Open map">
				<MapPin className="h-5 w-5" />
			</Button>
		</div>
	),
};

export const Loading: Story = {
	args: { children: 'Saving…', isLoading: true },
};

export const FullWidth: Story = {
	parameters: { layout: 'padded' },
	args: { children: 'Full width', fullWidth: true },
};

export const AllVariants: Story = {
	parameters: { layout: 'padded' },
	render: () => (
		<div className="flex flex-wrap gap-3">
			<Button variant="primary">Primary</Button>
			<Button variant="secondary">Secondary</Button>
			<Button variant="outline">Outline</Button>
			<Button variant="ghost">Ghost</Button>
			<Button variant="danger">Danger</Button>
			<Button variant="link">Link</Button>
		</div>
	),
};

export const AllSizes: Story = {
	parameters: { layout: 'padded' },
	render: () => (
		<div className="flex items-center gap-3">
			<Button size="sm">Small</Button>
			<Button size="md">Medium</Button>
			<Button size="lg">Large</Button>
			<Button size="icon" aria-label="Add">
				<Plus className="h-5 w-5" />
			</Button>
		</div>
	),
};

export const Playground: Story = {
	args: {
		children: 'Customize me',
		variant: 'primary',
		size: 'md',
		isLoading: false,
		fullWidth: false,
		disabled: false,
	},
};
