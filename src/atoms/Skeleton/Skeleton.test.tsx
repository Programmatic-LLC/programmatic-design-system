import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Skeleton } from './Skeleton';

describe('Skeleton', () => {
	it('is hidden from assistive technology', () => {
		render(<Skeleton data-testid="skeleton" />);
		expect(screen.getByTestId('skeleton')).toHaveAttribute('aria-hidden', 'true');
	});

	it('uses the shimmer overlay by default', () => {
		render(<Skeleton data-testid="skeleton" />);
		const skeleton = screen.getByTestId('skeleton');
		expect(skeleton.className).toContain('after:absolute');
		expect(skeleton).not.toHaveClass('animate-pulse');
	});

	it('falls back to pulsing when shimmer is off', () => {
		render(<Skeleton data-testid="skeleton" shimmer={false} />);
		const skeleton = screen.getByTestId('skeleton');
		expect(skeleton).toHaveClass('animate-pulse');
		expect(skeleton.className).not.toContain('after:absolute');
	});

	it('merges custom classes for sizing', () => {
		render(<Skeleton data-testid="skeleton" className="h-4 w-32" />);
		const skeleton = screen.getByTestId('skeleton');
		expect(skeleton).toHaveClass('h-4');
		expect(skeleton).toHaveClass('w-32');
		expect(skeleton).toHaveClass('bg-[var(--ds-surface-muted)]');
	});
});
