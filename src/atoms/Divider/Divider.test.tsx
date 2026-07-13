import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Divider } from './Divider';

describe('Divider', () => {
	it('renders a horizontal separator by default', () => {
		render(<Divider />);
		const divider = screen.getByRole('separator');
		expect(divider).toHaveAttribute('aria-orientation', 'horizontal');
		expect(divider).toHaveClass('h-px');
		expect(divider).toHaveClass('w-full');
	});

	it('renders a vertical separator', () => {
		render(<Divider orientation="vertical" />);
		const divider = screen.getByRole('separator');
		expect(divider).toHaveAttribute('aria-orientation', 'vertical');
		expect(divider).toHaveClass('w-px');
		expect(divider).toHaveClass('h-full');
	});

	it('merges custom classes and attributes', () => {
		render(<Divider className="my-4" data-testid="divider" />);
		const divider = screen.getByTestId('divider');
		expect(divider).toHaveClass('my-4');
		expect(divider).toHaveClass('bg-[var(--ds-border)]');
	});
});
