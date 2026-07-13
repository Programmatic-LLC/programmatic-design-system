import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { LoadingState } from './LoadingState';

const motionState = vi.hoisted(() => ({ reduced: false }));

vi.mock('motion/react', async (importOriginal) => {
	const actual = await importOriginal<typeof import('motion/react')>();
	return {
		...actual,
		useReducedMotion: () => motionState.reduced,
	};
});

afterEach(() => {
	motionState.reduced = false;
});

describe('LoadingState', () => {
	it('renders nothing when isLoading is false', () => {
		const { container } = render(<LoadingState isLoading={false} />);
		expect(container).toBeEmptyDOMElement();
	});

	it('renders the block variant with a polite status', () => {
		render(<LoadingState />);
		const status = screen.getAllByRole('status')[0];
		expect(status).toHaveAttribute('aria-live', 'polite');
		expect(screen.getByText('Loading…')).toBeInTheDocument();
	});

	it('renders the inline variant with a custom label', () => {
		render(<LoadingState variant="inline" label="Fetching trails" />);
		const status = screen.getAllByRole('status')[0];
		expect(status.tagName).toBe('SPAN');
		expect(status).toHaveClass('inline-flex');
		expect(screen.getByText('Fetching trails')).toBeInTheDocument();
	});

	it('hides the label when label is null', () => {
		const { container } = render(<LoadingState variant="inline" label={null} />);
		expect(container.textContent).toBe('');
	});

	it('renders the page variant wrapper', () => {
		const { container } = render(<LoadingState variant="page" data-testid="page" />);
		expect(screen.getByTestId('page')).toHaveClass('min-h-[60vh]');
		expect(container.querySelector('.bg-\\[var\\(--ds-brand-500\\)\\]\\/15')).not.toBeNull();
	});

	it('omits the pulse ring under reduced motion', () => {
		motionState.reduced = true;
		const { container } = render(<LoadingState variant="page" label={null} />);
		expect(container.querySelector('.bg-\\[var\\(--ds-brand-500\\)\\]\\/15')).toBeNull();
		expect(screen.getAllByRole('status').length).toBeGreaterThanOrEqual(1);
	});
});
