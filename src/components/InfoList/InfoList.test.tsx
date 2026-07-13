import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { InfoList } from './InfoList';

const items = [
	{ icon: <svg data-testid="phone-icon" />, label: 'Phone', value: '555-0100' },
	{ label: 'Hours', value: '9-5', key: 'hours' },
];

describe('InfoList', () => {
	it('renders rows variant with dividers by default', () => {
		render(<InfoList data-testid="list" items={items} />);
		const list = screen.getByTestId('list');
		expect(list.tagName).toBe('DL');
		expect(list).toHaveClass('divide-y');
		expect(screen.getByText('Phone')).toBeInTheDocument();
		expect(screen.getByText('555-0100')).toBeInTheDocument();
		expect(screen.getByTestId('phone-icon')).toBeInTheDocument();
	});

	it('can disable dividers explicitly', () => {
		render(<InfoList data-testid="list" items={items} divided={false} />);
		expect(screen.getByTestId('list')).not.toHaveClass('divide-y');
	});

	it('renders stacked variant without dividers', () => {
		render(<InfoList data-testid="list" items={items} variant="stacked" />);
		const list = screen.getByTestId('list');
		expect(list).not.toHaveClass('divide-y');
		expect(list).toHaveClass('gap-4');
	});

	it('renders icon variant with plain entries', () => {
		render(<InfoList items={items} variant="icon" />);
		expect(screen.getByText('Phone')).toBeInTheDocument();
		expect(screen.getByText('9-5')).toBeInTheDocument();
		expect(screen.queryByRole('link')).not.toBeInTheDocument();
	});

	it('renders icon variant links with external attributes', () => {
		render(
			<InfoList
				variant="icon"
				items={[
					{ label: 'Website', value: 'example.com', href: 'https://example.com', external: true },
					{ label: 'Call', value: '555-0100', href: 'tel:5550100' },
				]}
			/>,
		);
		const external = screen.getByRole('link', { name: /Website/ });
		expect(external).toHaveAttribute('target', '_blank');
		expect(external).toHaveAttribute('rel', 'noopener noreferrer');
		const internal = screen.getByRole('link', { name: /Call/ });
		expect(internal).not.toHaveAttribute('target');
		expect(internal).not.toHaveAttribute('rel');
	});
});
