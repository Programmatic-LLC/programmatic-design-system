import type { Meta, StoryObj } from '@storybook/react';
import { RadioGroup, Radio } from './Radio';

const options = [
	{ value: 'draft', label: 'Draft' },
	{ value: 'published', label: 'Published' },
	{ value: 'archived', label: 'Archived' },
];

const meta: Meta<typeof RadioGroup> = {
	title: 'Design System/Atoms/RadioGroup',
	component: RadioGroup,
	parameters: { layout: 'padded' },
	tags: ['autodocs'],
	argTypes: {
		size: { control: 'radio', options: ['sm', 'md'] },
		orientation: { control: 'radio', options: ['vertical', 'horizontal'] },
		disabled: { control: 'boolean' },
	},
};

export default meta;

type Story = StoryObj<typeof RadioGroup>;

export const Default: Story = {
	args: {
		label: 'Visibility',
		defaultValue: 'published',
		options,
	},
};

export const Horizontal: Story = {
	args: {
		label: 'Visibility',
		defaultValue: 'draft',
		orientation: 'horizontal',
		options,
	},
};

export const WithHint: Story = {
	args: {
		label: 'Visibility',
		defaultValue: 'draft',
		hint: 'Controls whether this entity appears to end users.',
		options,
	},
};

export const WithError: Story = {
	args: {
		label: 'Visibility',
		error: 'Choose a visibility setting.',
		options,
	},
};

export const Disabled: Story = {
	args: {
		label: 'Visibility',
		defaultValue: 'published',
		disabled: true,
		options,
	},
};

export const ComposedChildren: Story = {
	render: () => (
		<RadioGroup label="Distance unit" defaultValue="mi">
			<Radio value="mi" label="Miles" />
			<Radio value="km" label="Kilometers" />
		</RadioGroup>
	),
};
