import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Hero } from './Hero';

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
	document.body.innerHTML = '';
});

describe('Hero', () => {
	it('renders eyebrow, title, subtitle, and actions', () => {
		render(
			<Hero
				eyebrow="Explore"
				title="Downtown Walking Tour"
				subtitle="Twelve stops through history."
				actions={<button>Start tour</button>}
			/>,
		);
		expect(screen.getByText('Explore')).toBeInTheDocument();
		expect(screen.getByText('Downtown Walking Tour')).toBeInTheDocument();
		expect(screen.getByText('Twelve stops through history.')).toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'Start tour' })).toBeInTheDocument();
	});

	it('renders children instead of the default content stack', () => {
		render(
			<Hero title="Ignored">
				<div data-testid="custom-content" />
			</Hero>,
		);
		expect(screen.getByTestId('custom-content')).toBeInTheDocument();
		expect(screen.queryByText('Ignored')).not.toBeInTheDocument();
	});

	it('renders media and corner slots', () => {
		render(
			<Hero
				media={<img src="/hero.jpg" alt="Skyline" />}
				topLeft={<span data-testid="top-left" />}
				topRight={<span data-testid="top-right" />}
			/>,
		);
		expect(screen.getByAltText('Skyline')).toBeInTheDocument();
		expect(screen.getByTestId('top-left')).toBeInTheDocument();
		expect(screen.getByTestId('top-right')).toBeInTheDocument();
	});

	it('applies overlay, height, rounded, and align variants', () => {
		const { container } = render(
			<Hero overlay="scrim" height="sm" rounded="xl" align="center" title="T" />,
		);
		const section = container.querySelector('section');
		expect(section).toHaveClass('min-h-[18rem]', 'sm:rounded-[2rem]');
		expect(container.querySelector('.from-black\\/85')).not.toBeNull();
		expect(container.querySelector('.items-center.justify-center')).not.toBeNull();
	});

	it('hides the overlay when set to none', () => {
		const { container } = render(<Hero overlay="none" title="T" />);
		expect(container.querySelector('.pointer-events-none.absolute.inset-0')).toHaveClass('hidden');
	});

	it('scrolls to the target when the scroll button is clicked', async () => {
		const user = userEvent.setup();
		const target = document.createElement('div');
		target.id = 'content';
		document.body.appendChild(target);
		const spy = vi.spyOn(target, 'scrollIntoView');
		render(<Hero scrollTargetId="content" scrollTargetLabel="Jump to content" />);
		await user.click(screen.getByRole('button', { name: 'Jump to content' }));
		expect(spy).toHaveBeenCalledWith({ behavior: 'smooth' });
	});

	it('omits the scroll button without a target id', () => {
		render(<Hero title="T" />);
		expect(screen.queryByRole('button', { name: 'Scroll to content' })).not.toBeInTheDocument();
	});

	it('renders without animation when disabled or reduced', () => {
		const { rerender } = render(<Hero title="Static" animate={false} />);
		expect(screen.getByText('Static')).toBeInTheDocument();
		motionState.reduced = true;
		rerender(<Hero title="Calm" media={<img alt="pic" src="/x.jpg" />} />);
		expect(screen.getByText('Calm')).toBeInTheDocument();
	});
});
