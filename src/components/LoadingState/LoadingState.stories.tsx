import type { Meta, StoryObj } from '@storybook/react';
import { LoadingState } from './LoadingState';

const meta: Meta<typeof LoadingState> = {
	title: 'Design System/Components/LoadingState',
	component: LoadingState,
	parameters: { layout: 'fullscreen' },
	tags: ['autodocs'],
	argTypes: {
		variant: { control: 'radio', options: ['inline', 'block', 'page'] },
		isLoading: { control: 'boolean' },
		label: { control: 'text' },
	},
};

export default meta;

type Story = StoryObj<typeof LoadingState>;

export const Block: Story = {
	args: { variant: 'block', isLoading: true, label: 'Loading…' },
};

export const Page: Story = {
	args: { variant: 'page', isLoading: true, label: 'Loading the page…' },
};

export const Inline: Story = {
	render: (args) => (
		<p className="p-8 text-sm">
			Saving your changes <LoadingState {...args} />
		</p>
	),
	args: { variant: 'inline', isLoading: true, label: 'Saving' },
};

export const NoLabel: Story = {
	args: { variant: 'block', isLoading: true, label: null },
};

export const NotLoading: Story = {
	args: { variant: 'block', isLoading: false },
};
