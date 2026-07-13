import type { Meta, StoryObj } from '@storybook/react';
import { Container } from './Container';

const meta: Meta<typeof Container> = {
	title: 'Design System/Layouts/Container',
	component: Container,
	parameters: { layout: 'fullscreen' },
	tags: ['autodocs'],
	argTypes: {
		size: { control: 'select', options: ['sm', 'md', 'lg', 'xl', 'full'] },
	},
};

export default meta;

type Story = StoryObj<typeof Container>;

const Frame = ({ children }: { children: React.ReactNode }) => (
	<div className="min-h-screen bg-[var(--ds-surface-subtle)] py-8">{children}</div>
);

export const Default: Story = {
	args: { size: 'lg' },
	render: (args) => (
		<Frame>
			<Container {...args}>
				<div className="rounded-[var(--ds-radius-lg)] border border-[var(--ds-border)] bg-[var(--ds-surface)] p-6">
					<p className="text-sm text-[var(--ds-text-muted)]">
						Container size: <strong>{args.size}</strong>. Resize the window to see the responsive
						padding adjust.
					</p>
				</div>
			</Container>
		</Frame>
	),
};

export const Small: Story = { ...Default, args: { size: 'sm' } };
export const Medium: Story = { ...Default, args: { size: 'md' } };
export const ExtraLarge: Story = { ...Default, args: { size: 'xl' } };
export const Full: Story = { ...Default, args: { size: 'full' } };
