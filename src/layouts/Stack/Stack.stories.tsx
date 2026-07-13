import type { Meta, StoryObj } from '@storybook/react';
import { Stack } from './Stack';
import { Button } from '../../atoms/Button';

const Box = ({ children }: { children: React.ReactNode }) => (
	<div className="flex items-center justify-center rounded-[var(--ds-radius-md)] border border-[var(--ds-border)] bg-[var(--ds-surface-subtle)] px-4 py-3 text-sm text-[var(--ds-text-muted)]">
		{children}
	</div>
);

const meta: Meta<typeof Stack> = {
	title: 'Design System/Layouts/Stack',
	component: Stack,
	parameters: { layout: 'padded' },
	tags: ['autodocs'],
	argTypes: {
		direction: { control: 'radio', options: ['row', 'column'] },
		gap: { control: 'select', options: [0, 1, 2, 3, 4, 6, 8, 12] },
		align: { control: 'select', options: ['start', 'center', 'end', 'stretch'] },
		justify: {
			control: 'select',
			options: ['start', 'center', 'end', 'between', 'around', 'evenly'],
		},
		wrap: { control: 'boolean' },
	},
};

export default meta;

type Story = StoryObj<typeof Stack>;

export const Column: Story = {
	args: { direction: 'column', gap: 4 },
	render: (args) => (
		<Stack {...args}>
			<Box>One</Box>
			<Box>Two</Box>
			<Box>Three</Box>
		</Stack>
	),
};

export const Row: Story = {
	args: { direction: 'row', gap: 3, align: 'center' },
	render: (args) => (
		<Stack {...args}>
			<Button variant="outline">Cancel</Button>
			<Button>Save</Button>
		</Stack>
	),
};

export const RowWrap: Story = {
	args: { direction: 'row', gap: 2, wrap: true },
	render: (args) => (
		<Stack {...args}>
			{Array.from({ length: 12 }).map((_, i) => (
				<Box key={i}>Tag {i + 1}</Box>
			))}
		</Stack>
	),
};

export const Justified: Story = {
	args: { direction: 'row', gap: 4, justify: 'between', align: 'center' },
	render: (args) => (
		<div className="w-96 rounded-[var(--ds-radius-lg)] border border-[var(--ds-border)] p-4">
			<Stack {...args}>
				<Box>Left</Box>
				<Box>Right</Box>
			</Stack>
		</div>
	),
};
