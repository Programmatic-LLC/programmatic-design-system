import type { Meta, StoryObj } from '@storybook/react';
import { Mail, Search } from 'lucide-react';
import { Input } from './Input';

const meta: Meta<typeof Input> = {
	title: 'Design System/Atoms/Input',
	component: Input,
	parameters: { layout: 'padded' },
	tags: ['autodocs'],
	argTypes: {
		size: { control: 'radio', options: ['sm', 'md'] },
		disabled: { control: 'boolean' },
		required: { control: 'boolean' },
	},
	decorators: [
		(Story) => (
			<div className="max-w-sm">
				<Story />
			</div>
		),
	],
};

export default meta;

type Story = StoryObj<typeof Input>;

export const Default: Story = {
	args: { label: 'Place name', placeholder: 'e.g. Riverside Trailhead' },
};

export const WithHint: Story = {
	args: {
		label: 'Website',
		placeholder: 'https://',
		hint: 'Optional — shown on the public listing.',
	},
};

export const WithError: Story = {
	args: {
		label: 'Email',
		placeholder: 'you@example.com',
		defaultValue: 'not-an-email',
		error: 'Enter a valid email address.',
	},
};

export const Required: Story = {
	args: { label: 'Title', placeholder: 'Required field', required: true },
};

export const WithLeftIcon: Story = {
	args: {
		label: 'Search',
		placeholder: 'Search places…',
		leftIcon: <Search className="h-4 w-4" />,
	},
};

export const WithRightIcon: Story = {
	args: {
		label: 'Email',
		placeholder: 'you@example.com',
		rightIcon: <Mail className="h-4 w-4" />,
	},
};

export const Disabled: Story = {
	args: { label: 'Disabled', placeholder: 'Unavailable', disabled: true },
};

export const Small: Story = {
	args: { label: 'Compact', placeholder: 'Small size', size: 'sm' },
};

export const Playground: Story = {
	args: {
		label: 'Label',
		placeholder: 'Type here…',
		hint: '',
		error: '',
		size: 'md',
		required: false,
		disabled: false,
	},
};
