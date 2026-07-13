import type { Meta, StoryObj } from '@storybook/react';
import { Field } from './Field';
import { controlBase, controlSizes, controlValid } from './styles';
import { cn } from '../../utils/cn';

const meta: Meta<typeof Field> = {
	title: 'Design System/Atoms/Field',
	component: Field,
	parameters: { layout: 'padded' },
	tags: ['autodocs'],
	decorators: [
		(Story) => (
			<div className="max-w-sm">
				<Story />
			</div>
		),
	],
};

export default meta;

type Story = StoryObj<typeof Field>;

const sampleControl = (
	<input
		placeholder="Custom control"
		className={cn(controlBase, controlValid, controlSizes.md)}
	/>
);

export const Default: Story = {
	args: {
		label: 'Field label',
		htmlFor: 'demo',
		children: sampleControl,
	},
};

export const Required: Story = {
	args: {
		label: 'Field label',
		required: true,
		children: sampleControl,
	},
};

export const WithHint: Story = {
	args: {
		label: 'Field label',
		hint: 'Helper text appears below the control.',
		children: sampleControl,
	},
};

export const WithError: Story = {
	args: {
		label: 'Field label',
		error: 'Something needs fixing.',
		children: sampleControl,
	},
};
