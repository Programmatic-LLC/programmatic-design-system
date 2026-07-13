import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Container } from './Container';

describe('Container', () => {
	it('renders a div with default size classes', () => {
		render(<Container data-testid="container">Content</Container>);
		const el = screen.getByTestId('container');
		expect(el.tagName).toBe('DIV');
		expect(el).toHaveClass('mx-auto', 'w-full', 'max-w-7xl');
		expect(el).toHaveTextContent('Content');
	});

	it.each([
		['sm', 'max-w-3xl'],
		['md', 'max-w-5xl'],
		['lg', 'max-w-7xl'],
		['xl', 'max-w-screen-2xl'],
		['full', 'max-w-none'],
	] as const)('applies the %s size variant', (size, expected) => {
		render(<Container data-testid="container" size={size} />);
		expect(screen.getByTestId('container')).toHaveClass(expected);
	});

	it('renders as a custom element', () => {
		render(<Container as="section" data-testid="container" />);
		expect(screen.getByTestId('container').tagName).toBe('SECTION');
	});

	it('merges custom classNames and forwards props', () => {
		render(<Container data-testid="container" className="pt-10" id="page-shell" />);
		const el = screen.getByTestId('container');
		expect(el).toHaveClass('pt-10');
		expect(el).toHaveAttribute('id', 'page-shell');
	});
});
