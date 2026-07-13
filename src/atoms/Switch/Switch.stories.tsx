import type { Meta, StoryObj } from '@storybook/react';
import { Switch } from './Switch';

const meta: Meta<typeof Switch> = {
	title: 'Design System/Atoms/Switch',
	component: Switch,
	parameters: { layout: 'padded' },
	tags: ['autodocs'],
	argTypes: {
		size: { control: 'radio', options: ['sm', 'md'] },
		disabled: { control: 'boolean' },
		checked: { control: 'boolean' },
	},
};

export default meta;

type Story = StoryObj<typeof Switch>;

export const Default: Story = {
	args: { label: 'Publish immediately', defaultChecked: true },
};

export const Off: Story = {
	args: { label: 'Show distance in miles' },
};

export const WithHint: Story = {
	args: {
		label: 'Email notifications',
		hint: 'Get notified when a listing is approved.',
	},
};

export const Disabled: Story = {
	args: { label: 'Unavailable', disabled: true, defaultChecked: true },
};

export const Small: Story = {
	args: { label: 'Compact toggle', size: 'sm', defaultChecked: true },
};
