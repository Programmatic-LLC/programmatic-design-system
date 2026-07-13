import type { Meta, StoryObj } from '@storybook/react';
import { Select } from './Select';

const options = [
	{ value: 'public-art', label: 'Public Art' },
	{ value: 'dining', label: 'Dining' },
	{ value: 'lodging', label: 'Lodging' },
	{ value: 'trails', label: 'Trails' },
	{ value: 'events', label: 'Events' },
];

const meta: Meta<typeof Select> = {
	title: 'Design System/Atoms/Select',
	component: Select,
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

type Story = StoryObj<typeof Select>;

export const Default: Story = {
	args: {
		label: 'Entity type',
		placeholder: 'Select a type',
		defaultValue: '',
		options,
	},
};

export const WithHint: Story = {
	args: {
		label: 'Entity type',
		placeholder: 'Select a type',
		defaultValue: '',
		hint: 'Determines which fields appear next.',
		options,
	},
};

export const WithError: Story = {
	args: {
		label: 'Entity type',
		placeholder: 'Select a type',
		defaultValue: '',
		error: 'Please choose an entity type.',
		required: true,
		options,
	},
};

export const Disabled: Story = {
	args: { label: 'Entity type', disabled: true, options },
};

export const Playground: Story = {
	args: {
		label: 'Entity type',
		placeholder: 'Select a type',
		defaultValue: '',
		size: 'md',
		required: false,
		disabled: false,
		options,
	},
};
