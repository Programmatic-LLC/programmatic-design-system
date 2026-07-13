import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Breadcrumb } from './Breadcrumb';

describe('Breadcrumb', () => {
	it('renders nothing for empty items', () => {
		const { container } = render(<Breadcrumb items={[]} />);
		expect(container).toBeEmptyDOMElement();
	});

	it('renders nav with default aria label and marks last item current', () => {
		render(
			<Breadcrumb
				items={[
					{ label: 'Home', href: '/' },
					{ label: 'Trails', href: '/trails' },
					{ label: 'River Walk' },
				]}
			/>,
		);
		expect(screen.getByRole('navigation', { name: 'Breadcrumb' })).toBeInTheDocument();
		expect(screen.getAllByRole('link')).toHaveLength(2);
		expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');
		const current = screen.getByText('River Walk');
		expect(current).toHaveAttribute('aria-current', 'page');
		expect(current.tagName).toBe('SPAN');
	});

	it('renders button crumbs and fires onClick', async () => {
		const user = userEvent.setup();
		const onClick = vi.fn();
		render(
			<Breadcrumb
				items={[
					{ label: 'Home', onClick },
					{ label: 'Here' },
				]}
			/>,
		);
		await user.click(screen.getByRole('button', { name: 'Home' }));
		expect(onClick).toHaveBeenCalledTimes(1);
	});

	it('honors explicit current flags', () => {
		render(
			<Breadcrumb
				items={[
					{ label: 'Home', href: '/', current: true, key: 'home' },
					{ label: 'End', current: false, onClick: () => {} },
				]}
			/>,
		);
		expect(screen.getByText('Home')).toHaveAttribute('aria-current', 'page');
		expect(screen.getByRole('button', { name: 'End' })).toBeInTheDocument();
	});

	it('renders a custom aria label and separator', () => {
		render(
			<Breadcrumb
				ariaLabel="Trail path"
				separator={<span data-testid="sep">/</span>}
				items={[{ label: 'A', href: '/a' }, { label: 'B' }]}
			/>,
		);
		expect(screen.getByRole('navigation', { name: 'Trail path' })).toBeInTheDocument();
		expect(screen.getByTestId('sep')).toBeInTheDocument();
	});
});
