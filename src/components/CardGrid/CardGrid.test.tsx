import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CardGrid } from './CardGrid';

describe('CardGrid', () => {
	it('renders children in a grid with default variants', () => {
		render(
			<CardGrid data-testid="grid">
				<div>Card A</div>
				<div>Card B</div>
			</CardGrid>,
		);
		const grid = screen.getByTestId('grid');
		expect(grid).toHaveClass('grid', 'grid-cols-1', 'sm:grid-cols-2', 'lg:grid-cols-3');
		expect(screen.getByText('Card A')).toBeInTheDocument();
		expect(screen.getByText('Card B')).toBeInTheDocument();
	});

	it('applies column and gap variants', () => {
		const { rerender } = render(<CardGrid data-testid="grid" columns="2-3" gap="sm" />);
		expect(screen.getByTestId('grid')).toHaveClass('grid-cols-2', 'lg:grid-cols-3', 'gap-4');
		rerender(<CardGrid data-testid="grid" columns="1-2-4" gap="lg" />);
		expect(screen.getByTestId('grid')).toHaveClass('lg:grid-cols-4', 'gap-6');
	});

	it('renders skeletons in loading state', () => {
		render(<CardGrid loading />);
		const status = screen.getByRole('status', { name: 'Loading' });
		expect(status.children).toHaveLength(6);
	});

	it('honors skeletonCount and skeletonAspect', () => {
		render(<CardGrid loading skeletonCount={3} skeletonAspect="16/9" />);
		const status = screen.getByRole('status', { name: 'Loading' });
		expect(status.children).toHaveLength(3);
		expect(status.querySelector('.aspect-video')).not.toBeNull();
	});

	it('does not render children while loading', () => {
		render(
			<CardGrid loading>
				<div>Card A</div>
			</CardGrid>,
		);
		expect(screen.queryByText('Card A')).not.toBeInTheDocument();
	});
});
