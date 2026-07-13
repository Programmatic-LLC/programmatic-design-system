import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Section } from './Section';

const reduced = vi.hoisted(() => ({ value: false }));

vi.mock('motion/react', async (importOriginal) => {
	const actual = await importOriginal<typeof import('motion/react')>();
	return { ...actual, useReducedMotion: () => reduced.value };
});

describe('Section', () => {
	beforeEach(() => {
		reduced.value = false;
	});

	it('renders children without a header when no title, action, or eyebrow is given', () => {
		render(
			<Section>
				<p>Body content</p>
			</Section>,
		);
		expect(screen.getByText('Body content')).toBeInTheDocument();
		expect(screen.queryByRole('banner')).not.toBeInTheDocument();
		expect(document.querySelector('header')).toBeNull();
	});

	it('renders title as a heading with the default level', () => {
		render(<Section title="Nearby Attractions" />);
		expect(screen.getByRole('heading', { level: 2, name: 'Nearby Attractions' })).toBeInTheDocument();
	});

	it('supports custom heading levels', () => {
		render(<Section title="Sub Section" headingLevel="h3" />);
		expect(screen.getByRole('heading', { level: 3, name: 'Sub Section' })).toBeInTheDocument();
	});

	it('renders eyebrow, description, and action', () => {
		render(
			<Section
				eyebrow="Explore"
				title="Trails"
				description="Walkable paths around town"
				action={<button type="button">View all</button>}
			/>,
		);
		expect(screen.getByText('Explore')).toBeInTheDocument();
		expect(screen.getByText('Walkable paths around town')).toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'View all' })).toBeInTheDocument();
	});

	it('does not render the description when there is no header content', () => {
		render(<Section description="Orphan description" />);
		expect(screen.queryByText('Orphan description')).not.toBeInTheDocument();
	});

	it('applies id, className, and aria attributes to the section', () => {
		render(
			<Section id="things-to-do" className="custom" aria-label="Things to do">
				<p>Content</p>
			</Section>,
		);
		const section = document.getElementById('things-to-do');
		expect(section?.tagName).toBe('SECTION');
		expect(section).toHaveClass('custom');
		expect(section).toHaveAttribute('aria-label', 'Things to do');
	});

	it('supports aria-labelledby', () => {
		render(
			<Section aria-labelledby="external-heading">
				<p>Content</p>
			</Section>,
		);
		expect(document.querySelector('section')).toHaveAttribute('aria-labelledby', 'external-heading');
	});

	it('renders statically when animate is false', () => {
		render(
			<Section animate={false} title="Static Section">
				<p>Static body</p>
			</Section>,
		);
		expect(screen.getByText('Static body')).toBeInTheDocument();
		expect(screen.getByRole('heading', { name: 'Static Section' })).toBeInTheDocument();
	});

	it('renders statically when reduced motion is preferred', () => {
		reduced.value = true;
		render(
			<Section title="Calm Section">
				<p>Calm body</p>
			</Section>,
		);
		expect(screen.getByText('Calm body')).toBeInTheDocument();
	});
});
