import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Text } from './Text';

describe('Text', () => {
	it('renders body copy as a paragraph by default', () => {
		render(<Text>Body copy</Text>);
		const text = screen.getByText('Body copy');
		expect(text.tagName).toBe('P');
		expect(text).toHaveClass('text-base');
		expect(text).toHaveClass('text-[var(--ds-text)]');
	});

	it('maps heading variants to heading tags', () => {
		render(<Text variant="h2">Section</Text>);
		expect(screen.getByRole('heading', { level: 2, name: 'Section' })).toHaveClass('font-semibold');
	});

	it('renders display as an h1', () => {
		render(<Text variant="display">Hero</Text>);
		expect(screen.getByRole('heading', { level: 1, name: 'Hero' })).toBeInTheDocument();
	});

	it('renders caption and overline as spans', () => {
		render(
			<>
				<Text variant="caption">Meta</Text>
				<Text variant="overline">Eyebrow</Text>
			</>,
		);
		expect(screen.getByText('Meta').tagName).toBe('SPAN');
		const overline = screen.getByText('Eyebrow');
		expect(overline.tagName).toBe('SPAN');
		expect(overline).toHaveClass('uppercase');
	});

	it('lets the as prop override the tag', () => {
		render(
			<Text variant="h1" as="div">
				Not a heading
			</Text>,
		);
		expect(screen.getByText('Not a heading').tagName).toBe('DIV');
		expect(screen.queryByRole('heading')).not.toBeInTheDocument();
	});

	it('applies color, weight, and alignment classes', () => {
		render(
			<Text color="danger" weight="bold" align="center">
				Warning copy
			</Text>,
		);
		const text = screen.getByText('Warning copy');
		expect(text).toHaveClass('text-[var(--ds-danger)]');
		expect(text).toHaveClass('font-bold');
		expect(text).toHaveClass('text-center');
	});

	it('applies muted color', () => {
		render(<Text color="muted">Muted</Text>);
		expect(screen.getByText('Muted')).toHaveClass('text-[var(--ds-text-muted)]');
	});

	it('truncates when asked', () => {
		render(<Text truncate>Long text</Text>);
		expect(screen.getByText('Long text')).toHaveClass('truncate');
	});

	it('falls back to the paragraph tag when variant is null', () => {
		render(<Text variant={null}>Fallback</Text>);
		expect(screen.getByText('Fallback').tagName).toBe('P');
	});

	it('merges custom classes and forwards attributes', () => {
		render(
			<Text className="custom-class" data-testid="text">
				Attr
			</Text>,
		);
		expect(screen.getByTestId('text')).toHaveClass('custom-class');
	});
});
