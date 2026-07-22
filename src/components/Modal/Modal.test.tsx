import { createRef } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Modal, ModalSection } from './Modal';

const motionState = vi.hoisted(() => ({ reduced: false }));

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
		useDragControls: () => ({ start: vi.fn() }),
	};
});

afterEach(() => {
	motionState.reduced = false;
});

describe('Modal', () => {
	it('renders nothing when closed', () => {
		render(
			<Modal open={false} onClose={() => {}} title="Hidden">
				Body
			</Modal>,
		);
		expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
	});

	it('renders a dialog named by its string title', () => {
		render(
			<Modal open onClose={() => {}} title="Edit trail">
				Body content
			</Modal>,
		);
		const dialog = screen.getByRole('dialog', { name: 'Edit trail' });
		expect(dialog).toHaveAttribute('aria-modal', 'true');
		expect(screen.getByRole('heading', { level: 2, name: 'Edit trail' })).toBeInTheDocument();
		expect(screen.getByText('Body content')).toBeInTheDocument();
	});

	it('falls back to ariaLabel for non-string titles', () => {
		render(
			<Modal open onClose={() => {}} title={<em>Fancy</em>} ariaLabel="Fancy dialog">
				Body
			</Modal>,
		);
		expect(screen.getByRole('dialog', { name: 'Fancy dialog' })).toBeInTheDocument();
	});

	it('closes via the close button', async () => {
		const user = userEvent.setup();
		const onClose = vi.fn();
		render(
			<Modal open onClose={onClose} title="Closable">
				Body
			</Modal>,
		);
		await user.click(screen.getByRole('button', { name: 'Close' }));
		expect(onClose).toHaveBeenCalledTimes(1);
	});

	it('hides the close button when requested', () => {
		render(
			<Modal open onClose={() => {}} title="No close" hideCloseButton>
				Body
			</Modal>,
		);
		expect(screen.queryByRole('button', { name: 'Close' })).not.toBeInTheDocument();
	});

	it('closes on Escape unless disabled', () => {
		const onClose = vi.fn();
		const { rerender } = render(
			<Modal open onClose={onClose} title="Esc">
				Body
			</Modal>,
		);
		fireEvent.keyDown(window, { key: 'Escape' });
		expect(onClose).toHaveBeenCalledTimes(1);

		rerender(
			<Modal open onClose={onClose} title="Esc" dismissOnEsc={false}>
				Body
			</Modal>,
		);
		fireEvent.keyDown(window, { key: 'Escape' });
		expect(onClose).toHaveBeenCalledTimes(1);
	});

	it('closes on backdrop click unless disabled', () => {
		const onClose = vi.fn();
		const { rerender } = render(
			<Modal open onClose={onClose} title="Backdrop">
				Body
			</Modal>,
		);
		const backdrop = document.querySelector('.bg-slate-950\\/60');
		expect(backdrop).not.toBeNull();
		fireEvent.click(backdrop as Element);
		expect(onClose).toHaveBeenCalledTimes(1);

		rerender(
			<Modal open onClose={onClose} title="Backdrop" dismissOnBackdrop={false}>
				Body
			</Modal>,
		);
		fireEvent.click(document.querySelector('.bg-slate-950\\/60') as Element);
		expect(onClose).toHaveBeenCalledTimes(1);
	});

	it('disables all dismissal when onCloseDisabled is set', () => {
		const onClose = vi.fn();
		render(
			<Modal open onClose={onClose} title="Locked" onCloseDisabled>
				Body
			</Modal>,
		);
		expect(screen.getByRole('button', { name: 'Close' })).toBeDisabled();
		fireEvent.keyDown(window, { key: 'Escape' });
		fireEvent.click(document.querySelector('.bg-slate-950\\/60') as Element);
		expect(onClose).not.toHaveBeenCalled();
	});

	it('renders icon, accessory, header content, and footer', () => {
		render(
			<Modal
				open
				onClose={() => {}}
				title="Full"
				icon={<svg data-testid="icon" />}
				titleAccessory={<span data-testid="accessory" />}
				headerContent={<div data-testid="header-content" />}
				footer={<button>Save</button>}
			>
				Body
			</Modal>,
		);
		expect(screen.getByTestId('icon')).toBeInTheDocument();
		expect(screen.getByTestId('accessory')).toBeInTheDocument();
		expect(screen.getByTestId('header-content')).toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
	});

	it('renders the brand accent by default and omits it for neutral tone', () => {
		const { rerender } = render(
			<Modal open onClose={() => {}} title="Tone">
				Body
			</Modal>,
		);
		expect(document.querySelector('header .bg-\\[var\\(--ds-brand-600\\)\\]')).not.toBeNull();
		rerender(
			<Modal open onClose={() => {}} title="Tone" tone="neutral" icon={<svg data-testid="neutral-icon" />}>
				Body
			</Modal>,
		);
		expect(document.querySelector('header .bg-\\[var\\(--ds-brand-600\\)\\]')).toBeNull();
		expect(screen.getByTestId('neutral-icon').parentElement).toHaveClass('bg-gray-100');
	});

	it('applies size and height variants', () => {
		render(
			<Modal open onClose={() => {}} title="Sized" size="xl" height="tall">
				Body
			</Modal>,
		);
		const panel = screen.getByRole('dialog').querySelector('.max-w-5xl');
		expect(panel).not.toBeNull();
		expect(panel).toHaveClass('h-[90dvh]');
	});

	it('renders as a bottom sheet', () => {
		render(
			<Modal open onClose={() => {}} title="Sheet" asSheet>
				Body
			</Modal>,
		);
		expect(screen.getByRole('dialog')).toHaveClass('items-end');
		expect(
			screen.getByRole('dialog').querySelector('.rounded-t-\\[var\\(--ds-radius-xl\\)\\]'),
		).not.toBeNull();
	});

	it('locks body scroll while open and restores on close', () => {
		const { rerender } = render(
			<Modal open onClose={() => {}} title="Scroll">
				Body
			</Modal>,
		);
		expect(document.body.style.overflow).toBe('hidden');
		rerender(
			<Modal open={false} onClose={() => {}} title="Scroll">
				Body
			</Modal>,
		);
		expect(document.body.style.overflow).toBe('');
	});

	it('focuses the initial focus ref when provided', () => {
		const ref = createRef<HTMLButtonElement>();
		render(
			<Modal open onClose={() => {}} title="Focus" footer={<button ref={ref}>Primary</button>} initialFocusRef={ref}>
				Body
			</Modal>,
		);
		expect(screen.getByRole('button', { name: 'Primary' })).toHaveFocus();
	});

	it('keeps focus trapped inside the panel', () => {
		render(
			<Modal open onClose={() => {}} title="Trap">
				<button>Inner</button>
			</Modal>,
		);
		const inner = screen.getByRole('button', { name: 'Inner' });
		inner.focus();
		fireEvent.keyDown(document, { key: 'Tab' });
		expect(document.activeElement).toBe(inner);
	});

	it('renders under reduced motion', () => {
		motionState.reduced = true;
		render(
			<Modal open onClose={() => {}} title="Calm" asSheet>
				Body
			</Modal>,
		);
		expect(screen.getByRole('dialog', { name: 'Calm' })).toBeInTheDocument();
	});
});

describe('ModalSection', () => {
	it('renders title, description, and children', () => {
		render(
			<ModalSection title="Details" description="Basic info">
				<input aria-label="Name" />
			</ModalSection>,
		);
		expect(screen.getByText('Details')).toBeInTheDocument();
		expect(screen.getByText('Basic info')).toBeInTheDocument();
		expect(screen.getByRole('textbox', { name: 'Name' })).toBeInTheDocument();
	});

	it('omits the header block without title or description', () => {
		const { container } = render(
			<ModalSection data-testid="section">
				<span>Only child</span>
			</ModalSection>,
		);
		expect(screen.getByText('Only child')).toBeInTheDocument();
		expect(container.querySelectorAll('section > div')).toHaveLength(0);
	});
});
