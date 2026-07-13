import type { Meta, StoryObj } from '@storybook/react';
import { Card } from '../../atoms/Card';
import { Reveal } from './Reveal';

const meta: Meta<typeof Reveal> = {
	title: 'Design System/Components/Reveal',
	component: Reveal,
	parameters: { layout: 'padded' },
	tags: ['autodocs'],
	argTypes: {
		delay: { control: { type: 'number', min: 0, max: 1, step: 0.05 } },
		y: { control: { type: 'number', min: 0, max: 48, step: 2 } },
		duration: { control: { type: 'number', min: 0.1, max: 1.5, step: 0.05 } },
	},
};

export default meta;

type Story = StoryObj<typeof Reveal>;

export const Default: Story = {
	render: (args) => (
		<div className="flex max-w-md flex-col gap-6">
			<p className="text-sm text-[var(--ds-text-muted)]">
				Scroll the content into view to trigger the reveal animation. Respects
				prefers-reduced-motion.
			</p>
			<Reveal {...args}>
				<Card className="p-6">
					<p className="text-sm text-[var(--ds-text)]">
						This card fades and slides into view when it enters the viewport.
					</p>
				</Card>
			</Reveal>
		</div>
	),
};

export const Staggered: Story = {
	render: () => (
		<div className="flex max-w-md flex-col gap-4">
			{[0, 1, 2].map((index) => (
				<Reveal key={index} delay={index * 0.12}>
					<Card className="p-4">
						<p className="text-sm text-[var(--ds-text)]">Item {index + 1}</p>
					</Card>
				</Reveal>
			))}
		</div>
	),
};
