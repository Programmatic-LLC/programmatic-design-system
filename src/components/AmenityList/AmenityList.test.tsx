import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AmenityList } from './AmenityList';

const items = [
	{ icon: <svg data-testid="wifi-icon" />, label: 'Wifi', description: 'Free' },
	{ label: 'Parking' },
	{ label: 'Pool', key: 'pool' },
];

describe('AmenityList', () => {
	it('renders nothing for empty items', () => {
		const { container } = render(<AmenityList items={[]} />);
		expect(container).toBeEmptyDOMElement();
	});

	it('renders tiles by default with labels, icons, and descriptions', () => {
		render(<AmenityList items={items} data-testid="list" />);
		const list = screen.getByTestId('list');
		expect(list.tagName).toBe('UL');
		expect(list).toHaveClass('grid-cols-2', 'md:grid-cols-3');
		expect(screen.getByText('Wifi')).toBeInTheDocument();
		expect(screen.getByText('Free')).toBeInTheDocument();
		expect(screen.getByTestId('wifi-icon')).toBeInTheDocument();
		expect(screen.getAllByRole('listitem')).toHaveLength(3);
	});

	it('applies column variants', () => {
		const { rerender } = render(<AmenityList items={items} columns={2} data-testid="list" />);
		expect(screen.getByTestId('list')).toHaveClass('grid-cols-2');
		rerender(<AmenityList items={items} columns={4} data-testid="list" />);
		expect(screen.getByTestId('list')).toHaveClass('lg:grid-cols-4');
	});

	it('renders the chips variant without list semantics', () => {
		render(<AmenityList items={items} variant="chips" data-testid="list" />);
		expect(screen.getByTestId('list')).toHaveClass('flex-wrap');
		expect(screen.queryByRole('list')).not.toBeInTheDocument();
		expect(screen.getByText('Parking')).toBeInTheDocument();
		expect(screen.getByTestId('wifi-icon')).toBeInTheDocument();
	});

	it('renders the list variant with separated descriptions', () => {
		render(<AmenityList items={items} variant="list" />);
		expect(screen.getByRole('list')).toBeInTheDocument();
		expect(screen.getAllByRole('listitem')).toHaveLength(3);
		expect(screen.getByText('· Free')).toBeInTheDocument();
	});
});
