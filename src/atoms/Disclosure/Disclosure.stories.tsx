import type { Meta, StoryObj } from '@storybook/react';
import { Disclosure } from './Disclosure';

const meta: Meta<typeof Disclosure> = {
	title: 'Design System/Atoms/Disclosure',
	component: Disclosure,
	parameters: { layout: 'centered' },
	tags: ['autodocs'],
	argTypes: {
		tone: { control: 'radio', options: ['default', 'onDark'] },
		defaultOpen: { control: 'boolean' },
	},
	decorators: [
		(Story) => (
			<div className="w-80">
				<Story />
			</div>
		),
	],
};

export default meta;

type Story = StoryObj<typeof Disclosure>;

const sampleTranscript =
	'Welcome to the old courthouse. Built in 1887, its clock tower was the tallest structure in the county for nearly fifty years. Step inside to see the restored courtroom on the second floor.';

export const Transcript: Story = {
	args: {
		label: 'Transcript',
		children: sampleTranscript,
	},
};

export const Open: Story = {
	args: {
		label: 'Transcript / text alternative',
		defaultOpen: true,
		children: sampleTranscript,
	},
};

export const OnDark: Story = {
	args: {
		label: 'Transcript',
		tone: 'onDark',
		children: sampleTranscript,
	},
	decorators: [
		(Story) => (
			<div className="w-80 rounded-lg bg-neutral-900 p-6">
				<Story />
			</div>
		),
	],
};
