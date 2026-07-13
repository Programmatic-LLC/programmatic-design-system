import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { MetaRow } from './MetaRow';

describe('MetaRow', () => {
	it('renders items separated by the default dot', () => {
		render(
			<MetaRow
				items={[
					{ label: 'Open now' },
					{ label: '2.4 mi', key: 'distance' },
					{ label: 'Free entry' },
				]}
			/>,
		);
		expect(screen.getByText('Open now')).toBeInTheDocument();
		expect(screen.getByText('Free entry')).toBeInTheDocument();
		expect(screen.getAllByText('·')).toHaveLength(2);
	});

	it('renders icons as decorative', () => {
		render(<MetaRow items={[{ icon: <svg data-testid="clock" />, label: 'Open now' }]} />);
		const icon = screen.getByTestId('clock');
		expect(icon.parentElement).toHaveAttribute('aria-hidden', 'true');
	});

	it('supports a custom separator', () => {
		render(
			<MetaRow
				separator={<span data-testid="sep">|</span>}
				items={[{ label: 'A' }, { label: 'B' }]}
			/>,
		);
		expect(screen.getByTestId('sep')).toBeInTheDocument();
		expect(screen.queryByText('·')).not.toBeInTheDocument();
	});

	it('applies size classes', () => {
		const { rerender } = render(<MetaRow data-testid="row" items={[{ label: 'A' }]} />);
		expect(screen.getByTestId('row')).toHaveClass('text-sm');
		rerender(<MetaRow data-testid="row" size="md" items={[{ label: 'A' }]} />);
		expect(screen.getByTestId('row')).toHaveClass('text-base');
	});
});
