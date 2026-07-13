import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Select } from './Select';

const options = [
	{ value: 'a', label: 'Alpha' },
	{ value: 'b', label: 'Beta' },
];

describe('Select', () => {
	it('renders a labeled select with options', () => {
		render(<Select label="Letter" options={options} />);
		const select = screen.getByLabelText('Letter');
		expect(select).toBeInTheDocument();
		expect(screen.getByRole('option', { name: 'Alpha' })).toHaveValue('a');
		expect(screen.getByRole('option', { name: 'Beta' })).toHaveValue('b');
	});

	it('changes value with user selection', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(<Select label="Letter" options={options} defaultValue="a" onChange={onChange} />);
		await user.selectOptions(screen.getByLabelText('Letter'), 'b');
		expect(onChange).toHaveBeenCalledTimes(1);
		expect(screen.getByLabelText('Letter')).toHaveValue('b');
	});

	it('renders a disabled empty placeholder option', () => {
		render(<Select label="Letter" options={options} placeholder="Pick a letter" defaultValue="" />);
		const placeholder = screen.getByRole('option', { name: 'Pick a letter' }) as HTMLOptionElement;
		expect(placeholder).toBeDisabled();
		expect(placeholder).toHaveValue('');
		expect(screen.getByLabelText('Letter')).toHaveValue('');
	});

	it('supports option children instead of the options prop', () => {
		render(
			<Select label="Letter">
				<option value="x">Custom X</option>
			</Select>,
		);
		expect(screen.getByRole('option', { name: 'Custom X' })).toHaveValue('x');
	});

	it('disables individual options', () => {
		render(
			<Select
				label="Letter"
				options={[options[0], { value: 'b', label: 'Beta', disabled: true }]}
			/>,
		);
		expect(screen.getByRole('option', { name: 'Beta' })).toBeDisabled();
	});

	it('describes the select with a hint', () => {
		render(<Select label="Letter" options={options} hint="Choose wisely" id="letter" />);
		expect(screen.getByLabelText('Letter')).toHaveAttribute('aria-describedby', 'letter-desc');
		expect(screen.getByText('Choose wisely')).toHaveAttribute('id', 'letter-desc');
	});

	it('flags errors with aria-invalid and an alert', () => {
		render(<Select label="Letter" options={options} error="Selection required" />);
		const select = screen.getByLabelText('Letter');
		expect(select).toHaveAttribute('aria-invalid', 'true');
		expect(select).toHaveClass('border-[var(--ds-danger)]');
		expect(screen.getByRole('alert')).toHaveTextContent('Selection required');
	});

	it('marks required and disabled states', () => {
		const { rerender } = render(<Select label="Letter" options={options} required />);
		expect(screen.getByLabelText(/Letter/)).toBeRequired();
		rerender(<Select label="Letter" options={options} disabled />);
		expect(screen.getByLabelText('Letter')).toBeDisabled();
	});

	it('uses the small size classes', () => {
		render(<Select label="Letter" options={options} size="sm" />);
		expect(screen.getByLabelText('Letter')).toHaveClass('h-9');
	});

	it('merges custom classes and forwards the ref', () => {
		const ref = createRef<HTMLSelectElement>();
		render(<Select label="Letter" options={options} ref={ref} className="custom-class" />);
		expect(ref.current).toBe(screen.getByLabelText('Letter'));
		expect(ref.current).toHaveClass('custom-class');
	});
});
