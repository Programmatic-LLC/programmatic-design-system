import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ActionBar } from './ActionBar';

describe('ActionBar', () => {
	it('renders children with default alignment', () => {
		render(
			<ActionBar data-testid="bar">
				<button>Save</button>
			</ActionBar>,
		);
		const bar = screen.getByTestId('bar');
		expect(bar).toHaveClass('justify-start');
		expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
	});

	it.each([
		['center', 'justify-center'],
		['end', 'justify-end'],
		['between', 'justify-between'],
	] as const)('applies %s alignment', (align, expected) => {
		render(
			<ActionBar data-testid="bar" align={align}>
				content
			</ActionBar>,
		);
		expect(screen.getByTestId('bar')).toHaveClass(expected);
	});

	it('merges a custom className with base classes', () => {
		render(
			<ActionBar data-testid="bar" className="extra">
				content
			</ActionBar>,
		);
		expect(screen.getByTestId('bar')).toHaveClass('extra', 'flex', 'flex-wrap');
	});
});
