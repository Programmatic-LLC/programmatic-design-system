import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Spinner } from './Spinner';

describe('Spinner', () => {
	it('announces itself as a polite status', () => {
		render(<Spinner />);
		const status = screen.getByRole('status');
		expect(status).toHaveAttribute('aria-live', 'polite');
		expect(status).toHaveTextContent('Loading');
	});

	it('hides the icon from assistive technology', () => {
		render(<Spinner />);
		const icon = screen.getByRole('status').querySelector('svg');
		expect(icon).toHaveAttribute('aria-hidden', 'true');
		expect(icon).toHaveClass('animate-spin');
	});

	it('uses the medium size by default', () => {
		render(<Spinner />);
		expect(screen.getByRole('status').querySelector('svg')).toHaveClass('h-6');
	});

	it('supports small and large sizes', () => {
		const { rerender } = render(<Spinner size="sm" />);
		expect(screen.getByRole('status').querySelector('svg')).toHaveClass('h-4');
		rerender(<Spinner size="lg" />);
		expect(screen.getByRole('status').querySelector('svg')).toHaveClass('h-10');
	});

	it('renders a custom accessible label', () => {
		render(<Spinner label="Fetching tours" />);
		expect(screen.getByRole('status')).toHaveTextContent('Fetching tours');
	});

	it('merges custom classes', () => {
		render(<Spinner className="text-red-500" />);
		expect(screen.getByRole('status')).toHaveClass('text-red-500');
	});
});
