import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { MapPin } from 'lucide-react';
import { EmptyState } from './EmptyState';

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

describe('EmptyState', () => {
	it('renders the title as an h2 by default', () => {
		render(<EmptyState title="Nothing here" />);
		expect(screen.getByRole('heading', { level: 2, name: 'Nothing here' })).toBeInTheDocument();
	});

	it('renders description and action', () => {
		render(
			<EmptyState
				title="No trails"
				description="Try widening the filters."
				action={<button>Reset filters</button>}
			/>,
		);
		expect(screen.getByText('Try widening the filters.')).toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'Reset filters' })).toBeInTheDocument();
	});

	it('supports a custom heading level', () => {
		render(<EmptyState title="Empty" headingLevel="h1" />);
		expect(screen.getByRole('heading', { level: 1, name: 'Empty' })).toBeInTheDocument();
	});

	it('renders an icon passed as a component type', () => {
		const { container } = render(<EmptyState title="Empty" icon={MapPin} />);
		expect(container.querySelector('svg')).not.toBeNull();
	});

	it('renders an icon passed as an element', () => {
		render(<EmptyState title="Empty" icon={<span data-testid="custom-icon" />} />);
		expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
	});

	it('applies error tone styling to the badge', () => {
		render(<EmptyState title="Broken" tone="error" icon={<span data-testid="icon" />} />);
		const badge = screen.getByTestId('icon').parentElement;
		expect(badge?.className).toContain('ds-danger');
	});

	it('skips animation when reduced motion is preferred', () => {
		motionState.reduced = true;
		render(<EmptyState title="Calm" description="Still here" />);
		expect(screen.getByText('Still here')).toBeInTheDocument();
	});
});
