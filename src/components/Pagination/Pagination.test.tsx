import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Pagination } from './Pagination';

describe('Pagination', () => {
	it('renders nothing when totalPages is 1 or fewer', () => {
		const { container } = render(
			<Pagination currentPage={1} totalPages={1} onPageChange={vi.fn()} />,
		);
		expect(container).toBeEmptyDOMElement();
	});

	it('renders all pages without dots when total fits', () => {
		render(<Pagination currentPage={2} totalPages={5} onPageChange={vi.fn()} />);
		[1, 2, 3, 4, 5].forEach((p) => {
			expect(screen.getByRole('button', { name: String(p) })).toBeInTheDocument();
		});
		expect(screen.queryByText('…')).not.toBeInTheDocument();
	});

	it('shows right dots when current page is near the start', () => {
		render(<Pagination currentPage={1} totalPages={10} onPageChange={vi.fn()} />);
		expect(screen.getAllByText('…')).toHaveLength(1);
		[1, 2, 3, 4, 5, 10].forEach((p) => {
			expect(screen.getByRole('button', { name: String(p) })).toBeInTheDocument();
		});
		expect(screen.queryByRole('button', { name: '6' })).not.toBeInTheDocument();
	});

	it('shows left dots when current page is near the end', () => {
		render(<Pagination currentPage={9} totalPages={10} onPageChange={vi.fn()} />);
		expect(screen.getAllByText('…')).toHaveLength(1);
		[1, 6, 7, 8, 9, 10].forEach((p) => {
			expect(screen.getByRole('button', { name: String(p) })).toBeInTheDocument();
		});
		expect(screen.queryByRole('button', { name: '2' })).not.toBeInTheDocument();
	});

	it('shows dots on both sides when current page is in the middle', () => {
		render(<Pagination currentPage={5} totalPages={10} onPageChange={vi.fn()} />);
		expect(screen.getAllByText('…')).toHaveLength(2);
		[1, 4, 5, 6, 10].forEach((p) => {
			expect(screen.getByRole('button', { name: String(p) })).toBeInTheDocument();
		});
	});

	it('marks the current page with aria-current', () => {
		render(<Pagination currentPage={3} totalPages={5} onPageChange={vi.fn()} />);
		expect(screen.getByRole('button', { name: '3' })).toHaveAttribute('aria-current', 'page');
		expect(screen.getByRole('button', { name: '2' })).not.toHaveAttribute('aria-current');
	});

	it('calls onPageChange when a page button is clicked', async () => {
		const user = userEvent.setup();
		const onPageChange = vi.fn();
		render(<Pagination currentPage={1} totalPages={5} onPageChange={onPageChange} />);
		await user.click(screen.getByRole('button', { name: '4' }));
		expect(onPageChange).toHaveBeenCalledWith(4);
	});

	it('navigates with previous and next buttons', async () => {
		const user = userEvent.setup();
		const onPageChange = vi.fn();
		render(<Pagination currentPage={3} totalPages={5} onPageChange={onPageChange} />);
		await user.click(screen.getByRole('button', { name: 'Previous page' }));
		expect(onPageChange).toHaveBeenCalledWith(2);
		await user.click(screen.getByRole('button', { name: 'Next page' }));
		expect(onPageChange).toHaveBeenCalledWith(4);
	});

	it('disables previous on the first page and next on the last page', () => {
		const { rerender } = render(
			<Pagination currentPage={1} totalPages={5} onPageChange={vi.fn()} />,
		);
		expect(screen.getByRole('button', { name: 'Previous page' })).toBeDisabled();
		expect(screen.getByRole('button', { name: 'Next page' })).toBeEnabled();
		rerender(<Pagination currentPage={5} totalPages={5} onPageChange={vi.fn()} />);
		expect(screen.getByRole('button', { name: 'Previous page' })).toBeEnabled();
		expect(screen.getByRole('button', { name: 'Next page' })).toBeDisabled();
	});

	it('uses the provided aria label and className', () => {
		render(
			<Pagination
				currentPage={1}
				totalPages={3}
				onPageChange={vi.fn()}
				ariaLabel="Results pages"
				className="custom-class"
			/>,
		);
		const nav = screen.getByRole('navigation', { name: 'Results pages' });
		expect(nav).toHaveClass('custom-class');
	});

	it('respects a larger siblingCount', () => {
		render(
			<Pagination currentPage={6} totalPages={20} onPageChange={vi.fn()} siblingCount={2} />,
		);
		[1, 4, 5, 6, 7, 8, 20].forEach((p) => {
			expect(screen.getByRole('button', { name: String(p) })).toBeInTheDocument();
		});
		expect(screen.getAllByText('…')).toHaveLength(2);
	});
});
