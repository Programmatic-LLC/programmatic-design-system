import type { Meta, StoryObj } from '@storybook/react';
import { Spinner } from './Spinner';

const meta: Meta<typeof Spinner> = {
	title: 'Design System/Atoms/Spinner',
	component: Spinner,
	parameters: { layout: 'centered' },
	tags: ['autodocs'],
	argTypes: {
		size: { control: 'radio', options: ['sm', 'md', 'lg'] },
		label: { control: 'text' },
	},
};

export default meta;

type Story = StoryObj<typeof Spinner>;

export const Default: Story = { args: { size: 'md' } };
export const Small: Story = { args: { size: 'sm' } };
export const Large: Story = { args: { size: 'lg' } };

export const Themed: Story = {
	name: 'In a brand-themed subtree',
	render: (args) => (
		<div style={{ ['--ds-brand-600' as string]: '#ea580c' }} className="p-4">
			<Spinner {...args} />
		</div>
	),
	args: { size: 'lg' },
};
