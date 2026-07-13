import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Switch } from './Switch';

describe('Switch', () => {
	it('renders a labeled switch', () => {
		render(<Switch label="Notifications" />);
		expect(screen.getByRole('switch', { name: 'Notifications' })).not.toBeChecked();
	});

	it('toggles when the label is clicked', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(<Switch label="Notifications" onChange={onChange} />);
		await user.click(screen.getByText('Notifications'));
		expect(screen.getByRole('switch')).toBeChecked();
		expect(onChange).toHaveBeenCalledTimes(1);
	});

	it('supports the controlled checked prop', () => {
		const { rerender } = render(<Switch label="Flag" checked onChange={() => {}} />);
		expect(screen.getByRole('switch')).toBeChecked();
		rerender(<Switch label="Flag" checked={false} onChange={() => {}} />);
		expect(screen.getByRole('switch')).not.toBeChecked();
	});

	it('ignores clicks while disabled', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(<Switch label="Frozen" disabled onChange={onChange} />);
		expect(screen.getByRole('switch')).toBeDisabled();
		await user.click(screen.getByText('Frozen'));
		expect(onChange).not.toHaveBeenCalled();
	});

	it('marks required labels with an asterisk', () => {
		render(<Switch label="Must" required />);
		expect(screen.getByRole('switch')).toBeRequired();
		expect(screen.getByText('*')).toBeInTheDocument();
	});

	it('describes the switch with a hint', () => {
		render(<Switch label="Flag" hint="Optional toggle" id="flag" />);
		expect(screen.getByRole('switch')).toHaveAttribute('aria-describedby', 'flag-desc');
		const hint = screen.getByText('Optional toggle');
		expect(hint).toHaveAttribute('id', 'flag-desc');
		expect(hint).not.toHaveAttribute('role');
	});

	it('announces the error state', () => {
		render(<Switch label="Flag" hint="ignored" error="Must be enabled" />);
		expect(screen.getByRole('switch')).toHaveAttribute('aria-invalid', 'true');
		expect(screen.getByRole('alert')).toHaveTextContent('Must be enabled');
		expect(screen.queryByText('ignored')).not.toBeInTheDocument();
	});

	it('sizes the track per the size prop', () => {
		const { container, rerender } = render(<Switch label="Size" />);
		expect(container.querySelector('.w-11')).toBeInTheDocument();
		rerender(<Switch label="Size" size="sm" />);
		expect(container.querySelector('.w-9')).toBeInTheDocument();
	});

	it('forwards the ref to the underlying input', () => {
		const ref = createRef<HTMLInputElement>();
		render(<Switch label="Ref" ref={ref} />);
		expect(ref.current).toBe(screen.getByRole('switch'));
	});
});
