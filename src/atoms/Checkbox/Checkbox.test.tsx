import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Checkbox } from './Checkbox';

describe('Checkbox', () => {
	it('renders a labeled checkbox', () => {
		render(<Checkbox label="Accept terms" />);
		expect(screen.getByRole('checkbox', { name: 'Accept terms' })).not.toBeChecked();
	});

	it('toggles when the label is clicked', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(<Checkbox label="Accept terms" onChange={onChange} />);
		await user.click(screen.getByText('Accept terms'));
		expect(screen.getByRole('checkbox')).toBeChecked();
		expect(onChange).toHaveBeenCalledTimes(1);
	});

	it('supports the controlled checked prop', () => {
		const { rerender } = render(<Checkbox label="Flag" checked onChange={() => {}} />);
		expect(screen.getByRole('checkbox')).toBeChecked();
		rerender(<Checkbox label="Flag" checked={false} onChange={() => {}} />);
		expect(screen.getByRole('checkbox')).not.toBeChecked();
	});

	it('ignores clicks while disabled', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(<Checkbox label="Frozen" disabled onChange={onChange} />);
		const checkbox = screen.getByRole('checkbox');
		expect(checkbox).toBeDisabled();
		await user.click(screen.getByText('Frozen'));
		expect(onChange).not.toHaveBeenCalled();
		expect(checkbox).not.toBeChecked();
	});

	it('marks the required label with an asterisk', () => {
		render(<Checkbox label="Must" required />);
		expect(screen.getByRole('checkbox')).toBeRequired();
		expect(screen.getByText('*')).toBeInTheDocument();
	});

	it('describes the checkbox with a hint', () => {
		render(<Checkbox label="Flag" hint="Optional flag" id="flag" />);
		const checkbox = screen.getByRole('checkbox');
		expect(checkbox).toHaveAttribute('aria-describedby', 'flag-desc');
		const hint = screen.getByText('Optional flag');
		expect(hint).toHaveAttribute('id', 'flag-desc');
		expect(hint).not.toHaveAttribute('role');
		expect(checkbox).not.toHaveAttribute('aria-invalid');
	});

	it('announces the error state', () => {
		render(<Checkbox label="Flag" error="Required field" hint="ignored" />);
		const checkbox = screen.getByRole('checkbox');
		expect(checkbox).toHaveAttribute('aria-invalid', 'true');
		expect(screen.getByRole('alert')).toHaveTextContent('Required field');
		expect(screen.queryByText('ignored')).not.toBeInTheDocument();
	});

	it('reflects the indeterminate prop onto the element', () => {
		const { rerender } = render(<Checkbox label="Partial" indeterminate />);
		const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
		expect(checkbox.indeterminate).toBe(true);
		rerender(<Checkbox label="Partial" />);
		expect(checkbox.indeterminate).toBe(false);
	});

	it('renders the small size box', () => {
		render(<Checkbox label="Small" size="sm" />);
		const box = screen.getByRole('checkbox').parentElement;
		expect(box).toHaveClass('h-4');
	});

	it('works without a label', () => {
		render(<Checkbox aria-label="bare" />);
		expect(screen.getByRole('checkbox', { name: 'bare' })).toBeInTheDocument();
	});

	it('forwards object and function refs', () => {
		const objectRef = createRef<HTMLInputElement>();
		const functionRef = vi.fn();
		const { rerender } = render(<Checkbox label="Ref" ref={objectRef} />);
		expect(objectRef.current).toBe(screen.getByRole('checkbox'));
		rerender(<Checkbox label="Ref" ref={functionRef} />);
		expect(functionRef).toHaveBeenCalledWith(screen.getByRole('checkbox'));
	});
});
