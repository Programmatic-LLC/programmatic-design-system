import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge } from './Badge';

describe('Badge', () => {
	it('renders its children', () => {
		render(<Badge>New</Badge>);
		expect(screen.getByText('New')).toBeInTheDocument();
	});

	it('defaults to the neutral rounded small style', () => {
		render(<Badge>New</Badge>);
		const badge = screen.getByText('New');
		expect(badge).toHaveClass('bg-[var(--ds-surface-muted)]');
		expect(badge).toHaveClass('text-xs');
		expect(badge).toHaveClass('rounded-[var(--ds-radius-sm)]');
	});

	it('applies variant, size, and shape classes', () => {
		render(
			<Badge variant="solid" size="md" shape="pill">
				Live
			</Badge>,
		);
		const badge = screen.getByText('Live');
		expect(badge).toHaveClass('bg-[var(--ds-brand-600)]');
		expect(badge).toHaveClass('text-sm');
		expect(badge).toHaveClass('rounded-full');
	});

	it('renders a left icon before the content', () => {
		render(<Badge leftIcon={<svg data-testid="icon" />}>Tagged</Badge>);
		const badge = screen.getByText('Tagged');
		expect(badge.firstElementChild).toBe(screen.getByTestId('icon'));
	});

	it('paints a custom color as background with readable text', () => {
		render(<Badge color="#158474">Brand</Badge>);
		const badge = screen.getByText('Brand');
		expect(badge).toHaveStyle({
			backgroundColor: '#158474',
			color: '#ffffff',
			borderColor: 'transparent',
		});
	});

	it('picks dark text on light custom colors', () => {
		render(<Badge color="#ffffff">Light</Badge>);
		expect(screen.getByText('Light')).toHaveStyle({ color: '#0f172a' });
	});

	it('uses the custom color as border and text for the outline variant', () => {
		render(
			<Badge variant="outline" color="#158474">
				Outlined
			</Badge>,
		);
		expect(screen.getByText('Outlined')).toHaveStyle({
			borderColor: '#158474',
			color: '#158474',
		});
	});

	it('lets caller style win over the color style', () => {
		render(
			<Badge color="#158474" style={{ color: '#000000' }}>
				Styled
			</Badge>,
		);
		expect(screen.getByText('Styled')).toHaveStyle({ color: '#000000' });
	});

	it('merges custom classes and forwards the ref', () => {
		const ref = createRef<HTMLSpanElement>();
		render(
			<Badge ref={ref} className="custom-class">
				Ref
			</Badge>,
		);
		expect(ref.current).toBe(screen.getByText('Ref'));
		expect(ref.current).toHaveClass('custom-class');
	});
});
