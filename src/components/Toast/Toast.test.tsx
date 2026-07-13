import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ToastProvider, useToast, type ToastType } from './Toast';

function Probe() {
	const toast = useToast();
	return (
		<div>
			<button type="button" onClick={() => toast.success('Saved', 'Success')}>success</button>
			<button type="button" onClick={() => toast.error('Failed', 'Error')}>error</button>
			<button type="button" onClick={() => toast.warning('Careful')}>warning</button>
			<button type="button" onClick={() => toast.info('FYI')}>info</button>
			<button
				type="button"
				onClick={() => toast.showToast({ type: 'info' as ToastType, message: 'Short lived', duration: 1000 })}
			>
				custom
			</button>
		</div>
	);
}

function renderWithProvider() {
	return render(
		<ToastProvider>
			<Probe />
		</ToastProvider>,
	);
}

describe('useToast', () => {
	it('throws when used outside a ToastProvider', () => {
		const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
		expect(() => render(<Probe />)).toThrow('useToast must be used within ToastProvider');
		spy.mockRestore();
	});
});

describe('ToastProvider', () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		act(() => {
			vi.runOnlyPendingTimers();
		});
		vi.useRealTimers();
	});

	it('shows a success toast with title and message', () => {
		renderWithProvider();
		fireEvent.click(screen.getByRole('button', { name: 'success' }));
		expect(screen.getAllByText('Saved').length).toBeGreaterThan(0);
		expect(screen.getByRole('heading', { name: 'Success' })).toBeInTheDocument();
	});

	it('announces non-error toasts in the polite live region', () => {
		renderWithProvider();
		fireEvent.click(screen.getByRole('button', { name: 'info' }));
		const status = screen.getByRole('status');
		expect(status).toHaveTextContent('FYI');
		expect(screen.getByRole('alert')).toBeEmptyDOMElement();
	});

	it('announces error toasts in the assertive live region', () => {
		renderWithProvider();
		fireEvent.click(screen.getByRole('button', { name: 'error' }));
		expect(screen.getByRole('alert')).toHaveTextContent('Error: Failed');
	});

	it('auto-dismisses success toasts after five seconds', () => {
		renderWithProvider();
		fireEvent.click(screen.getByRole('button', { name: 'success' }));
		expect(screen.getAllByText('Saved').length).toBeGreaterThan(0);
		act(() => {
			vi.advanceTimersByTime(5000);
		});
		expect(screen.queryByText('Saved')).not.toBeInTheDocument();
	});

	it('keeps error and warning toasts until dismissed', () => {
		renderWithProvider();
		fireEvent.click(screen.getByRole('button', { name: 'error' }));
		fireEvent.click(screen.getByRole('button', { name: 'warning' }));
		act(() => {
			vi.advanceTimersByTime(60000);
		});
		expect(screen.getAllByText('Failed').length).toBeGreaterThan(0);
		expect(screen.getAllByText('Careful').length).toBeGreaterThan(0);
	});

	it('honors a custom duration', () => {
		renderWithProvider();
		fireEvent.click(screen.getByRole('button', { name: 'custom' }));
		expect(screen.getAllByText('Short lived').length).toBeGreaterThan(0);
		act(() => {
			vi.advanceTimersByTime(1000);
		});
		expect(screen.queryByText('Short lived')).not.toBeInTheDocument();
	});

	it('dismisses a toast via the close button after the exit transition', () => {
		renderWithProvider();
		fireEvent.click(screen.getByRole('button', { name: 'warning' }));
		fireEvent.click(screen.getByRole('button', { name: 'Dismiss notification' }));
		expect(screen.getAllByText('Careful').length).toBeGreaterThan(0);
		act(() => {
			vi.advanceTimersByTime(300);
		});
		expect(screen.queryByText('Careful')).not.toBeInTheDocument();
	});

	it('stacks multiple toasts', () => {
		renderWithProvider();
		fireEvent.click(screen.getByRole('button', { name: 'info' }));
		fireEvent.click(screen.getByRole('button', { name: 'warning' }));
		expect(screen.getAllByRole('button', { name: 'Dismiss notification' })).toHaveLength(2);
	});
});
