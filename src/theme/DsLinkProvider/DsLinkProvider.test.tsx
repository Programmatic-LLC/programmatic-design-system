import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DsLinkProvider, useDsLinkComponent } from './DsLinkProvider';
import type { DsLinkComponentProps } from './dsLinkContext';

function Consumer() {
	const Link = useDsLinkComponent();
	return (
		<Link href="/destinations/1" className="link-class">
			View destination
		</Link>
	);
}

function CustomLink({ href, className, children }: DsLinkComponentProps) {
	return (
		<button type="button" data-href={href} className={className}>
			{children}
		</button>
	);
}

describe('DsLinkProvider', () => {
	it('falls back to a plain anchor outside a provider', () => {
		render(<Consumer />);
		const anchor = screen.getByRole('link', { name: 'View destination' });
		expect(anchor).toHaveAttribute('href', '/destinations/1');
		expect(anchor).toHaveClass('link-class');
	});

	it('renders the injected component inside a provider', () => {
		render(
			<DsLinkProvider component={CustomLink}>
				<Consumer />
			</DsLinkProvider>,
		);
		expect(screen.queryByRole('link')).not.toBeInTheDocument();
		const button = screen.getByRole('button', { name: 'View destination' });
		expect(button).toHaveAttribute('data-href', '/destinations/1');
		expect(button).toHaveClass('link-class');
	});

	it('renders provider children directly', () => {
		render(
			<DsLinkProvider component={CustomLink}>
				<p>plain child</p>
			</DsLinkProvider>,
		);
		expect(screen.getByText('plain child')).toBeInTheDocument();
	});
});
