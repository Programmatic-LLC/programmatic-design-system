import type { Meta, StoryObj } from '@storybook/react';
import { Checkbox } from './Checkbox';

const meta: Meta<typeof Checkbox> = {
	title: 'Design System/Atoms/Checkbox',
	component: Checkbox,
	parameters: { layout: 'padded' },
	tags: ['autodocs'],
	argTypes: {
		size: { control: 'radio', options: ['sm', 'md'] },
		indeterminate: { control: 'boolean' },
		disabled: { control: 'boolean' },
		checked: { control: 'boolean' },
	},
};

export default meta;

type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
	args: { label: 'Show on public map', defaultChecked: true },
};

export const Unchecked: Story = {
	args: { label: 'Feature this place' },
};

export const Indeterminate: Story = {
	args: { label: 'Select all categories', indeterminate: true },
};

export const WithHint: Story = {
	args: {
		label: 'Accept terms',
		hint: 'You can change this later in settings.',
	},
};

export const WithError: Story = {
	args: {
		label: 'I agree to publish',
		error: 'You must agree before publishing.',
		required: true,
	},
};

export const Disabled: Story = {
	args: { label: 'Unavailable option', disabled: true, defaultChecked: true },
};

export const Group: Story = {
	render: () => (
		<fieldset className="flex flex-col gap-3">
			<legend className="mb-1 text-sm font-medium text-[var(--ds-text)]">Amenities</legend>
			<Checkbox label="Parking" defaultChecked />
			<Checkbox label="Restrooms" />
			<Checkbox label="Wheelchair accessible" defaultChecked />
			<Checkbox label="Pet friendly" />
		</fieldset>
	),
};
