import type { Meta, StoryObj } from '@storybook/react';
import { Section } from './Section';
import { Button } from '../../atoms/Button';

const meta: Meta<typeof Section> = {
	title: 'Design System/Components/Section',
	component: Section,
	parameters: { layout: 'padded' },
	tags: ['autodocs'],
	argTypes: {
		headingLevel: { control: 'radio', options: ['h2', 'h3', 'h4'] },
		animate: { control: 'boolean' },
	},
};

export default meta;

type Story = StoryObj<typeof Section>;

export const Basic: Story = {
	args: {
		title: 'About this place',
		description: 'A short subtitle that adds context to the section.',
		children: (
			<p className="text-[var(--ds-text)] leading-relaxed">
				Tucked into a quiet bend of the river, this trailhead is one of three put-ins maintained
				by the local watershed council. Interpretive signage along the path covers the bend&apos;s
				19th-century mill history.
			</p>
		),
	},
};

export const WithAction: Story = {
	args: {
		title: 'Related tours',
		action: (
			<Button variant="link" size="sm">
				See all
			</Button>
		),
		children: (
			<div className="grid gap-3 sm:grid-cols-3">
				{['Riverwalk loop', 'Mill heritage walk', 'Sunset overlook'].map((t) => (
					<div
						key={t}
						className="rounded-[var(--ds-radius-md)] border border-[var(--ds-border)] bg-[var(--ds-surface)] p-4 text-sm"
					>
						{t}
					</div>
				))}
			</div>
		),
	},
};

export const Headless: Story = {
	args: {
		children: (
			<p className="text-[var(--ds-text)]">
				A Section without a title — useful when you want the mount animation and spacing without
				a heading.
			</p>
		),
	},
};
