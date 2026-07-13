import { useState } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ConfirmProvider, useConfirm, type ConfirmOptions } from './ConfirmDialog';

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
		useReducedMotion: () => false,
		useDragControls: () => ({ start: vi.fn() }),
	};
});

function Harness({ options }: { options: ConfirmOptions }) {
	const { confirm } = useConfirm();
	const [result, setResult] = useState('pending');
	return (
		<div>
			<button
				onClick={() => {
					void confirm(options).then((value) => setResult(String(value)));
				}}
			>
				Ask
			</button>
			<output data-testid="result">{result}</output>
		</div>
	);
}

function renderHarness(options: ConfirmOptions) {
	return render(
		<ConfirmProvider>
			<Harness options={options} />
		</ConfirmProvider>,
	);
}

describe('ConfirmDialog', () => {
	it('throws when useConfirm is used outside the provider', () => {
		const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
		expect(() => render(<Harness options={{ title: 'T', message: 'M' }} />)).toThrow(
			'useConfirm must be used within ConfirmProvider',
		);
		spy.mockRestore();
	});

	it('opens with title, message, and custom confirm text', async () => {
		const user = userEvent.setup();
		renderHarness({ title: 'Delete trail', message: 'This cannot be undone.', confirmText: 'Delete', variant: 'danger' });
		await user.click(screen.getByRole('button', { name: 'Ask' }));
		expect(screen.getByRole('dialog', { name: 'Delete trail' })).toBeInTheDocument();
		expect(screen.getByRole('heading', { level: 3, name: 'Delete trail' })).toBeInTheDocument();
		expect(screen.getByText('This cannot be undone.')).toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument();
	});

	it('focuses the confirm button initially', async () => {
		const user = userEvent.setup();
		renderHarness({ title: 'Publish', message: 'Ready?' });
		await user.click(screen.getByRole('button', { name: 'Ask' }));
		expect(screen.getByRole('button', { name: 'Confirm' })).toHaveFocus();
	});

	it('resolves true on confirm and closes', async () => {
		const user = userEvent.setup();
		renderHarness({ title: 'Publish', message: 'Ready?' });
		await user.click(screen.getByRole('button', { name: 'Ask' }));
		await user.click(screen.getByRole('button', { name: 'Confirm' }));
		await waitFor(() => expect(screen.getByTestId('result')).toHaveTextContent('true'));
		expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
	});

	it('resolves false on cancel', async () => {
		const user = userEvent.setup();
		renderHarness({ title: 'Publish', message: 'Ready?' });
		await user.click(screen.getByRole('button', { name: 'Ask' }));
		await user.click(screen.getByRole('button', { name: 'Cancel' }));
		await waitFor(() => expect(screen.getByTestId('result')).toHaveTextContent('false'));
	});

	it('resolves false when dismissed with Escape', async () => {
		const user = userEvent.setup();
		renderHarness({ title: 'Publish', message: 'Ready?' });
		await user.click(screen.getByRole('button', { name: 'Ask' }));
		await user.keyboard('{Escape}');
		await waitFor(() => expect(screen.getByTestId('result')).toHaveTextContent('false'));
	});

	it.each([
		['danger', 'ds-danger-surface'],
		['warning', 'ds-warning-surface'],
		['info', 'ds-info-surface'],
		['default', 'ds-surface-muted'],
	] as const)('styles the %s variant icon', async (variant, expectedClass) => {
		const user = userEvent.setup();
		renderHarness({ title: 'Variant', message: 'Check icon', variant });
		await user.click(screen.getByRole('button', { name: 'Ask' }));
		const dialog = screen.getByRole('dialog');
		const badge = dialog.querySelector('.rounded-full');
		expect(badge?.className).toContain(expectedClass);
	});
});
