import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { BottomSheet } from './BottomSheet';

const motionState = vi.hoisted(() => ({
	reduced: false,
	dragStart: vi.fn(),
	lastDragEnd: null as ((event: unknown, info: unknown) => void) | null,
}));

vi.mock('motion/react', async () => {
	const { createElement, forwardRef } = await import('react');
	const stripped = new Set([
		'initial',
		'animate',
		'exit',
		'transition',
		'variants',
		'custom',
		'drag',
		'dragControls',
		'dragListener',
		'dragConstraints',
		'dragElastic',
		'dragMomentum',
		'onDragEnd',
		'whileHover',
		'whileTap',
		'layout',
	]);
	const cache = new Map<string, unknown>();
	const motion = new Proxy({} as Record<string, unknown>, {
		get(_target, tag: string) {
			if (!cache.has(tag)) {
				cache.set(
					tag,
					forwardRef(function MotionStub(props: Record<string, unknown>, ref) {
						const clean: Record<string, unknown> = { ref };
						for (const [key, value] of Object.entries(props)) {
							if (key === 'onDragEnd') {
								motionState.lastDragEnd = value as (event: unknown, info: unknown) => void;
							}
							if (!stripped.has(key)) clean[key] = value;
						}
						return createElement(tag, clean);
					}),
				);
			}
			return cache.get(tag);
		},
	});
	return {
		motion,
		AnimatePresence: ({ children }: { children?: React.ReactNode }) => children ?? null,
		useReducedMotion: () => motionState.reduced,
		useDragControls: () => ({ start: motionState.dragStart }),
	};
});

afterEach(() => {
	motionState.reduced = false;
	motionState.dragStart.mockClear();
	motionState.lastDragEnd = null;
});

describe('BottomSheet', () => {
	it('renders nothing when closed', () => {
		render(
			<BottomSheet isOpen={false} onClose={() => {}}>
				Content
			</BottomSheet>,
		);
		expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
	});

	it('renders an open dialog with the default label', () => {
		render(
			<BottomSheet isOpen onClose={() => {}}>
				Content
			</BottomSheet>,
		);
		const dialog = screen.getByRole('dialog', { name: 'Details panel' });
		expect(dialog).toBeInTheDocument();
		expect(dialog).not.toHaveAttribute('aria-modal');
		expect(screen.getByText('Content')).toBeInTheDocument();
	});

	it('uses a custom aria label instead of the hidden heading', () => {
		render(
			<BottomSheet isOpen onClose={() => {}} ariaLabel="Filters">
				Content
			</BottomSheet>,
		);
		expect(screen.getByRole('dialog', { name: 'Filters' })).toBeInTheDocument();
		expect(screen.queryByText('Details panel')).not.toBeInTheDocument();
	});

	it('closes on Escape', () => {
		const onClose = vi.fn();
		render(
			<BottomSheet isOpen onClose={onClose}>
				Content
			</BottomSheet>,
		);
		fireEvent.keyDown(window, { key: 'Escape' });
		expect(onClose).toHaveBeenCalledTimes(1);
	});

	it('renders a backdrop that closes on click and sets aria-modal', () => {
		const onClose = vi.fn();
		const { container } = render(
			<BottomSheet isOpen onClose={onClose} withBackdrop>
				Content
			</BottomSheet>,
		);
		expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
		const backdrop = container.querySelector('.z-40');
		expect(backdrop).not.toBeNull();
		fireEvent.click(backdrop as Element);
		expect(onClose).toHaveBeenCalledTimes(1);
	});

	it('traps focus in the panel when the backdrop is shown', () => {
		render(
			<BottomSheet isOpen onClose={() => {}} withBackdrop>
				<button>Inner</button>
			</BottomSheet>,
		);
		expect(screen.getByRole('dialog')).toHaveFocus();
		const inner = screen.getByRole('button', { name: 'Inner' });
		inner.focus();
		fireEvent.keyDown(document, { key: 'Tab' });
		expect(document.activeElement).toBe(inner);
	});

	it('locks body scroll when requested and restores on close', () => {
		const { rerender } = render(
			<BottomSheet isOpen onClose={() => {}} lockBodyScroll>
				Content
			</BottomSheet>,
		);
		expect(document.body.style.overflow).toBe('hidden');
		rerender(
			<BottomSheet isOpen={false} onClose={() => {}} lockBodyScroll>
				Content
			</BottomSheet>,
		);
		expect(document.body.style.overflow).toBe('');
	});

	it('starts drag from the default handle', () => {
		const { container } = render(
			<BottomSheet isOpen onClose={() => {}}>
				Content
			</BottomSheet>,
		);
		const handle = container.querySelector('.cursor-grab');
		expect(handle).not.toBeNull();
		fireEvent.pointerDown(handle as Element);
		expect(motionState.dragStart).toHaveBeenCalledTimes(1);
	});

	it('renders the overlay handle variant and starts drag from it', () => {
		const { container } = render(
			<BottomSheet isOpen onClose={() => {}} handleOverlay>
				Content
			</BottomSheet>,
		);
		const overlayWrap = container.querySelector('.pointer-events-none.absolute');
		expect(overlayWrap).not.toBeNull();
		expect(overlayWrap?.querySelector('.bg-white\\/85')).not.toBeNull();
		fireEvent.pointerDown(overlayWrap?.querySelector('.cursor-grab') as Element);
		expect(motionState.dragStart).toHaveBeenCalledTimes(1);
	});

	it('dismisses when dragged past the offset or velocity threshold', () => {
		const onClose = vi.fn();
		render(
			<BottomSheet isOpen onClose={onClose}>
				Content
			</BottomSheet>,
		);
		expect(motionState.lastDragEnd).not.toBeNull();

		motionState.lastDragEnd?.(null, { offset: { y: 10 }, velocity: { y: 100 } });
		expect(onClose).not.toHaveBeenCalled();

		motionState.lastDragEnd?.(null, { offset: { y: 200 }, velocity: { y: 0 } });
		expect(onClose).toHaveBeenCalledTimes(1);

		motionState.lastDragEnd?.(null, { offset: { y: 0 }, velocity: { y: 700 } });
		expect(onClose).toHaveBeenCalledTimes(2);
	});

	it('hides the handle when showHandle is false', () => {
		const { container } = render(
			<BottomSheet isOpen onClose={() => {}} showHandle={false}>
				Content
			</BottomSheet>,
		);
		expect(container.querySelector('.cursor-grab')).toBeNull();
		expect(container.querySelector('.h-1\\.5')).toBeNull();
	});

	it('disables dragging under reduced motion', () => {
		motionState.reduced = true;
		const { container } = render(
			<BottomSheet isOpen onClose={() => {}}>
				Content
			</BottomSheet>,
		);
		const handle = container.querySelector('.h-1\\.5')?.parentElement;
		expect(handle).not.toBeNull();
		expect(handle).not.toHaveClass('cursor-grab');
		fireEvent.pointerDown(handle as Element);
		expect(motionState.dragStart).not.toHaveBeenCalled();
	});

	it('disables dragging when dragToDismiss is false', () => {
		const { container } = render(
			<BottomSheet isOpen onClose={() => {}} dragToDismiss={false}>
				Content
			</BottomSheet>,
		);
		expect(container.querySelector('.cursor-grab')).toBeNull();
	});
});
