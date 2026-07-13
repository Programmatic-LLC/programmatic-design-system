import type { Meta, StoryObj } from '@storybook/react';
import { Slash } from 'lucide-react';
import { Breadcrumb } from './Breadcrumb';

const meta: Meta<typeof Breadcrumb> = {
	title: 'Design System/Components/Breadcrumb',
	component: Breadcrumb,
	parameters: { layout: 'padded' },
	tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof Breadcrumb>;

const baseItems = [
	{ label: 'Riverbend Tourism', onClick: () => {} },
	{ label: 'Public Art', onClick: () => {} },
	{ label: 'The Reading Sentinel' },
];

export const Default: Story = {
	args: { items: baseItems },
};

export const TwoLevels: Story = {
	args: { items: [{ label: 'Riverbend Tourism', onClick: () => {} }, { label: 'Public Art' }] },
};

export const WithLinks: Story = {
	args: {
		items: [
			{ label: 'Home', href: '/' },
			{ label: 'Sites', href: '/sites' },
			{ label: 'Detail page' },
		],
	},
};

export const CustomSeparator: Story = {
	args: {
		items: baseItems,
		separator: (
			<Slash className="h-3.5 w-3.5 -rotate-12 text-[var(--ds-text-subtle)]" aria-hidden="true" />
		),
	},
};

export const ThemedOrange: Story = {
	name: 'Themed (orange brand)',
	render: (args) => (
		<div style={{ ['--ds-brand-700' as string]: '#c2410c' }}>
			<Breadcrumb {...args} />
		</div>
	),
	args: { items: baseItems },
};
