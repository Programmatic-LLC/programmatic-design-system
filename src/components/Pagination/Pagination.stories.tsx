import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Pagination } from './Pagination';

const meta: Meta<typeof Pagination> = {
	title: 'Design System/Components/Pagination',
	component: Pagination,
	parameters: { layout: 'centered' },
	tags: ['autodocs'],
	argTypes: {
		totalPages: { control: { type: 'number', min: 1, max: 50 } },
		siblingCount: { control: { type: 'number', min: 0, max: 3 } },
	},
};

export default meta;

type Story = StoryObj<typeof Pagination>;

function Demo({ totalPages, siblingCount }: { totalPages: number; siblingCount?: number }) {
	const [page, setPage] = useState(1);
	return (
		<Pagination
			currentPage={page}
			totalPages={totalPages}
			onPageChange={setPage}
			siblingCount={siblingCount}
		/>
	);
}

export const Few: Story = {
	args: { totalPages: 5 },
	render: (args) => <Demo totalPages={args.totalPages ?? 5} siblingCount={args.siblingCount} />,
};

export const Many: Story = {
	args: { totalPages: 24, siblingCount: 1 },
	render: (args) => <Demo totalPages={args.totalPages ?? 24} siblingCount={args.siblingCount} />,
};
