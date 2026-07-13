import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Stack } from './Stack';

describe('Stack', () => {
	it('renders a column flex div with default gap', () => {
		render(<Stack data-testid="stack">Content</Stack>);
		const el = screen.getByTestId('stack');
		expect(el.tagName).toBe('DIV');
		expect(el).toHaveClass('flex', 'flex-col', 'gap-4');
		expect(el).toHaveTextContent('Content');
	});

	it('supports row direction', () => {
		render(<Stack data-testid="stack" direction="row" />);
		expect(screen.getByTestId('stack')).toHaveClass('flex-row');
	});

	it.each([
		[0, 'gap-0'],
		[1, 'gap-1'],
		[2, 'gap-2'],
		[3, 'gap-3'],
		[6, 'gap-6'],
		[8, 'gap-8'],
		[12, 'gap-12'],
	] as const)('applies gap %s', (gap, expected) => {
		render(<Stack data-testid="stack" gap={gap} />);
		expect(screen.getByTestId('stack')).toHaveClass(expected);
	});

	it('applies align, justify, and wrap variants', () => {
		render(<Stack data-testid="stack" align="center" justify="between" wrap />);
		const el = screen.getByTestId('stack');
		expect(el).toHaveClass('items-center', 'justify-between', 'flex-wrap');
	});

	it('renders as a custom element with merged className', () => {
		render(<Stack as="ul" data-testid="stack" className="list-none" />);
		const el = screen.getByTestId('stack');
		expect(el.tagName).toBe('UL');
		expect(el).toHaveClass('list-none', 'flex');
	});
});
