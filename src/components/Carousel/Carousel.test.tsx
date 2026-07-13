import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Carousel } from './Carousel';

function setScrollMetrics(el: HTMLElement, { scrollWidth = 1000, clientWidth = 500, scrollLeft = 0 } = {}) {
	Object.defineProperty(el, 'scrollWidth', { configurable: true, value: scrollWidth });
	Object.defineProperty(el, 'clientWidth', { configurable: true, value: clientWidth });
	Object.defineProperty(el, 'scrollLeft', { configurable: true, writable: true, value: scrollLeft });
}

describe('Carousel', () => {
	it('renders a labeled region and wraps children in snap containers', () => {
		render(
			<Carousel aria-label="Featured">
				<div data-testid="slide-a">A</div>
				<div data-testid="slide-b">B</div>
			</Carousel>,
		);
		const region = screen.getByRole('region', { name: 'Featured' });
		expect(region).toBeInTheDocument();
		expect(screen.getByTestId('slide-a').parentElement).toHaveClass('snap-start');
		expect(screen.getByTestId('slide-b').parentElement).toHaveClass('snap-start');
	});

	it('renders raw children when snap is disabled', () => {
		render(
			<Carousel aria-label="Plain" snap={false}>
				<div data-testid="slide">A</div>
			</Carousel>,
		);
		expect(screen.getByTestId('slide').parentElement).not.toHaveClass('snap-start');
	});

	it('wraps a single non-array child', () => {
		render(
			<Carousel aria-label="Solo">
				<div data-testid="only">A</div>
			</Carousel>,
		);
		expect(screen.getByTestId('only').parentElement).toHaveClass('snap-start');
	});

	it('disables both controls when there is no overflow', () => {
		render(
			<Carousel aria-label="Short">
				<div>A</div>
			</Carousel>,
		);
		expect(screen.getByRole('button', { name: 'Scroll left' })).toBeDisabled();
		expect(screen.getByRole('button', { name: 'Scroll right' })).toBeDisabled();
	});

	it('enables controls based on scroll position and scrolls on click', () => {
		render(
			<Carousel aria-label="Long">
				<div>A</div>
			</Carousel>,
		);
		const region = screen.getByRole('region', { name: 'Long' });
		const scrollBy = vi.fn();
		Object.defineProperty(region, 'scrollBy', { configurable: true, value: scrollBy });
		setScrollMetrics(region, { scrollLeft: 100 });
		fireEvent.scroll(region);

		const left = screen.getByRole('button', { name: 'Scroll left' });
		const right = screen.getByRole('button', { name: 'Scroll right' });
		expect(left).toBeEnabled();
		expect(right).toBeEnabled();

		fireEvent.click(right);
		expect(scrollBy).toHaveBeenCalledWith({ left: 425, behavior: 'smooth' });
		fireEvent.click(left);
		expect(scrollBy).toHaveBeenCalledWith({ left: -425, behavior: 'smooth' });
	});

	it('toggles edge fades with scroll position', () => {
		const { container } = render(
			<Carousel aria-label="Fades">
				<div>A</div>
			</Carousel>,
		);
		const region = screen.getByRole('region', { name: 'Fades' });
		const fades = container.querySelectorAll('.bg-gradient-to-r, .bg-gradient-to-l');
		expect(fades).toHaveLength(2);
		expect(fades[0]).toHaveClass('opacity-0');

		setScrollMetrics(region, { scrollLeft: 200 });
		fireEvent.scroll(region);
		expect(fades[0]).toHaveClass('opacity-100');
		expect(fades[1]).toHaveClass('opacity-100');
	});

	it('omits controls and edge fades when disabled', () => {
		const { container } = render(
			<Carousel aria-label="Bare" controls={false} edgeFade={false}>
				<div>A</div>
			</Carousel>,
		);
		expect(screen.queryByRole('button')).not.toBeInTheDocument();
		expect(container.querySelector('.bg-gradient-to-r')).toBeNull();
	});
});
