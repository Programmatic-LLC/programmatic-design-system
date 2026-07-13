import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { FeaturedTours } from './FeaturedTours';

const items = [
	{ id: 't1', title: 'Downtown Loop', preview: 'A walk through downtown.', image: '/loop.jpg' },
	{ id: 't2', title: 'Mural Mile' },
	{ title: 'Night Lights' },
];

describe('FeaturedTours', () => {
	it('renders nothing for empty items', () => {
		const { container } = render(<FeaturedTours items={[]} />);
		expect(container).toBeEmptyDOMElement();
	});

	it('renders static cards without onSelect', () => {
		render(<FeaturedTours items={items} aria-label="Featured tours" />);
		expect(screen.getByRole('region', { name: 'Featured tours' })).toBeInTheDocument();
		expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(3);
		expect(screen.getByText('A walk through downtown.')).toBeInTheDocument();
		expect(
			screen.queryByRole('button', { name: /Downtown Loop/ }),
		).not.toBeInTheDocument();
	});

	it('renders the image when set and a fallback icon otherwise', () => {
		const { container } = render(<FeaturedTours items={items} />);
		const img = container.querySelector('img');
		expect(img).toHaveAttribute('src', '/loop.jpg');
		expect(container.querySelectorAll('.lucide-route')).toHaveLength(2);
	});

	it('renders buttons and fires onSelect with the item and index', async () => {
		const user = userEvent.setup();
		const onSelect = vi.fn();
		render(<FeaturedTours items={items} onSelect={onSelect} />);
		await user.click(screen.getByRole('button', { name: /Mural Mile/ }));
		expect(onSelect).toHaveBeenCalledWith(items[1], 1);
	});
});
