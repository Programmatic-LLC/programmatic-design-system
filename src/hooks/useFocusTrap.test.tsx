import { useRef } from 'react';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { useFocusTrap } from './useFocusTrap';

interface HarnessProps {
	active: boolean;
	withButtons?: boolean;
	withInitial?: boolean;
}

function Harness({ active, withButtons = true, withInitial = false }: HarnessProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const initialRef = useRef<HTMLButtonElement>(null);
	useFocusTrap(active, containerRef, withInitial ? initialRef : undefined);
	return (
		<div>
			<button type="button">outside</button>
			<div ref={containerRef} tabIndex={-1} data-testid="trap">
				{withButtons && (
					<>
						<button type="button">first</button>
						<button type="button" ref={initialRef}>middle</button>
						<button type="button">last</button>
					</>
				)}
			</div>
		</div>
	);
}

describe('useFocusTrap', () => {
	beforeAll(() => {
		Object.defineProperty(HTMLElement.prototype, 'offsetParent', {
			configurable: true,
			get(this: HTMLElement) {
				return this.parentElement;
			},
		});
	});

	afterAll(() => {
		delete (HTMLElement.prototype as unknown as Record<string, unknown>).offsetParent;
	});

	it('focuses the container when active without an initial focus ref', () => {
		render(<Harness active />);
		expect(screen.getByTestId('trap')).toHaveFocus();
	});

	it('focuses the initial focus ref when provided', () => {
		render(<Harness active withInitial />);
		expect(screen.getByRole('button', { name: 'middle' })).toHaveFocus();
	});

	it('does nothing while inactive', () => {
		render(<Harness active={false} />);
		expect(screen.getByTestId('trap')).not.toHaveFocus();
		fireEvent.keyDown(document, { key: 'Tab' });
		expect(screen.getByTestId('trap')).not.toHaveFocus();
	});

	it('wraps forward tabbing from the last element to the first', () => {
		render(<Harness active />);
		screen.getByRole('button', { name: 'last' }).focus();
		fireEvent.keyDown(document, { key: 'Tab' });
		expect(screen.getByRole('button', { name: 'first' })).toHaveFocus();
	});

	it('leaves forward tabbing alone in the middle of the trap', () => {
		render(<Harness active />);
		screen.getByRole('button', { name: 'middle' }).focus();
		fireEvent.keyDown(document, { key: 'Tab' });
		expect(screen.getByRole('button', { name: 'middle' })).toHaveFocus();
	});

	it('wraps shift-tabbing from the first element to the last', () => {
		render(<Harness active />);
		screen.getByRole('button', { name: 'first' }).focus();
		fireEvent.keyDown(document, { key: 'Tab', shiftKey: true });
		expect(screen.getByRole('button', { name: 'last' })).toHaveFocus();
	});

	it('sends shift-tab from the container itself to the last element', () => {
		render(<Harness active />);
		screen.getByTestId('trap').focus();
		fireEvent.keyDown(document, { key: 'Tab', shiftKey: true });
		expect(screen.getByRole('button', { name: 'last' })).toHaveFocus();
	});

	it('keeps focus on the container when nothing inside is focusable', () => {
		render(<Harness active withButtons={false} />);
		screen.getByRole('button', { name: 'outside' }).focus();
		fireEvent.keyDown(document, { key: 'Tab' });
		expect(screen.getByTestId('trap')).toHaveFocus();
	});

	it('ignores keys other than Tab', () => {
		render(<Harness active />);
		screen.getByRole('button', { name: 'last' }).focus();
		fireEvent.keyDown(document, { key: 'Enter' });
		expect(screen.getByRole('button', { name: 'last' })).toHaveFocus();
	});

	it('restores focus to the previously focused element on deactivation', () => {
		const { rerender } = render(<Harness active={false} />);
		screen.getByRole('button', { name: 'outside' }).focus();
		rerender(<Harness active />);
		expect(screen.getByTestId('trap')).toHaveFocus();
		rerender(<Harness active={false} />);
		expect(screen.getByRole('button', { name: 'outside' })).toHaveFocus();
	});
});
