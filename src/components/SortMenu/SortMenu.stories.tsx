import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { SortMenu } from './SortMenu';

const meta: Meta<typeof SortMenu> = {
	title: 'Design System/Components/SortMenu',
	component: SortMenu,
	parameters: { layout: 'centered' },
	tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof SortMenu>;

const OPTIONS = [
	{ value: 'featured', label: 'Featured', description: 'Curated picks first' },
	{ value: 'az', label: 'A to Z' },
	{ value: 'distance', label: 'Distance', description: 'Closest first' },
	{ value: 'newest', label: 'Newest' },
];

function SortMenuDemo({ isMobile }: { isMobile?: boolean }) {
	const [value, setValue] = useState('featured');
	return (
		<div className="flex h-72 w-96 items-start justify-end p-4">
			<SortMenu value={value} onChange={setValue} options={OPTIONS} isMobile={isMobile} />
		</div>
	);
}

export const Desktop: Story = {
	render: () => <SortMenuDemo />,
};

export const MobileSheet: Story = {
	render: () => <SortMenuDemo isMobile />,
};
