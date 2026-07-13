import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MapPin } from 'lucide-react';
import { CategoryNav, type CategoryNavItem } from './CategoryNav';

let ioCallback: IntersectionObserverCallback | null = null;

class CapturingIntersectionObserver {
	constructor(callback: IntersectionObserverCallback) {
		ioCallback = callback;
	}

	observe = vi.fn();
	unobserve = vi.fn();
	disconnect = vi.fn();
	takeRecords = vi.fn().mockReturnValue([]);
	root = null;
	rootMargin = '';
	thresholds = [];
}

const items: CategoryNavItem[] = [
	{ key: 'art', label: 'Public Art', icon: MapPin, targetId: 'art-section', count: 4 },
	{ key: 'dining', label: 'Dining', targetId: 'dining-section' },
	{ key: 'events', label: 'Events' },
];

const originalIntersectionObserver = window.IntersectionObserver;

beforeEach(() => {
	ioCallback = null;
	window.IntersectionObserver = CapturingIntersectionObserver as unknown as typeof IntersectionObserver;
	globalThis.IntersectionObserver = window.IntersectionObserver;
	window.scrollTo = vi.fn();
});

afterEach(() => {
	window.IntersectionObserver = originalIntersectionObserver;
	globalThis.IntersectionObserver = originalIntersectionObserver;
	document.body.innerHTML = '';
});

function addSection(id: string) {
	const el = document.createElement('div');
	el.id = id;
	document.body.appendChild(el);
	return el;
}

describe('CategoryNav', () => {
	it('renders items with labels, counts, and default aria label', () => {
		render(<CategoryNav items={items} />);
		expect(screen.getByRole('navigation', { name: 'Sections' })).toBeInTheDocument();
		expect(screen.getByRole('button', { name: /Public Art/ })).toHaveTextContent('4');
		expect(screen.getByRole('button', { name: 'Dining' })).toBeInTheDocument();
	});

	it('marks the first item current by default via scroll spy state', () => {
		render(<CategoryNav items={items} />);
		expect(screen.getByRole('button', { name: /Public Art/ })).toHaveAttribute('aria-current', 'true');
	});

	it('prefers an explicit activeKey', () => {
		render(<CategoryNav items={items} activeKey="dining" />);
		expect(screen.getByRole('button', { name: 'Dining' })).toHaveAttribute('aria-current', 'true');
		expect(screen.getByRole('button', { name: /Public Art/ })).not.toHaveAttribute('aria-current');
	});

	it('updates the spy key when a section intersects', () => {
		addSection('art-section');
		const dining = addSection('dining-section');
		render(<CategoryNav items={items} />);
		expect(ioCallback).not.toBeNull();
		act(() => {
			ioCallback?.(
				[
					{ isIntersecting: true, intersectionRatio: 0.8, target: dining } as unknown as IntersectionObserverEntry,
				],
				{} as IntersectionObserver,
			);
		});
		expect(screen.getByRole('button', { name: 'Dining' })).toHaveAttribute('aria-current', 'true');
	});

	it('ignores callbacks without intersecting entries', () => {
		addSection('art-section');
		const dining = addSection('dining-section');
		render(<CategoryNav items={items} />);
		act(() => {
			ioCallback?.(
				[
					{ isIntersecting: false, intersectionRatio: 0, target: dining } as unknown as IntersectionObserverEntry,
				],
				{} as IntersectionObserver,
			);
		});
		expect(screen.getByRole('button', { name: /Public Art/ })).toHaveAttribute('aria-current', 'true');
	});

	it('fires onClick and scrolls to the target section', async () => {
		const user = userEvent.setup();
		const onClick = vi.fn();
		addSection('dining-section');
		render(
			<CategoryNav
				items={[{ key: 'dining', label: 'Dining', targetId: 'dining-section', onClick }]}
			/>,
		);
		await user.click(screen.getByRole('button', { name: 'Dining' }));
		expect(onClick).toHaveBeenCalledTimes(1);
		expect(window.scrollTo).toHaveBeenCalledWith({ top: -96, behavior: 'smooth' });
	});

	it('does not scroll when the item has no target', async () => {
		const user = userEvent.setup();
		render(<CategoryNav items={[{ key: 'events', label: 'Events' }]} />);
		await user.click(screen.getByRole('button', { name: 'Events' }));
		expect(window.scrollTo).not.toHaveBeenCalled();
	});

	it('renders the end slot and variant classes', () => {
		const { container } = render(
			<CategoryNav
				items={items}
				sticky
				bordered={false}
				aria-label="Categories"
				endSlot={<button>Map</button>}
			/>,
		);
		expect(screen.getByRole('navigation', { name: 'Categories' })).toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'Map' })).toBeInTheDocument();
		const wrapper = container.firstElementChild;
		expect(wrapper).toHaveClass('sticky');
		expect(wrapper).not.toHaveClass('border-b');
	});
});
