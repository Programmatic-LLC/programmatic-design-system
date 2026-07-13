import type { Meta, StoryObj } from '@storybook/react';
import { Textarea } from './Textarea';

const meta: Meta<typeof Textarea> = {
	title: 'Design System/Atoms/Textarea',
	component: Textarea,
	parameters: { layout: 'padded' },
	tags: ['autodocs'],
	argTypes: {
		size: { control: 'radio', options: ['sm', 'md'] },
		resize: { control: 'radio', options: ['none', 'vertical', 'both'] },
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

type Story = StoryObj<typeof Textarea>;

export const Default: Story = {
	args: {
		label: 'Description',
		placeholder: 'Tell visitors what makes this place special…',
	},
};

export const WithHint: Story = {
	args: {
		label: 'Description',
		placeholder: 'Add some detail…',
		hint: 'Markdown is supported.',
	},
};

export const WithError: Story = {
	args: {
		label: 'Description',
		error: 'Description is required.',
		required: true,
	},
};

export const Disabled: Story = {
	args: { label: 'Description', placeholder: 'Unavailable', disabled: true },
};

export const Playground: Story = {
	args: {
		label: 'Description',
		placeholder: 'Type here…',
		rows: 4,
		size: 'md',
		resize: 'vertical',
		required: false,
		disabled: false,
	},
};
