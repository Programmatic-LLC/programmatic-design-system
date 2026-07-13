import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from './Input';

describe('Input', () => {
	it('renders a labeled input', () => {
		render(<Input label="Email" />);
		expect(screen.getByLabelText('Email')).toBeInTheDocument();
	});

	it('accepts typed text', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(<Input label="Email" onChange={onChange} />);
		const input = screen.getByLabelText('Email');
		await user.type(input, 'hi@example.com');
		expect(input).toHaveValue('hi@example.com');
		expect(onChange).toHaveBeenCalled();
	});

	it('respects an explicit id', () => {
		render(<Input label="Email" id="email-field" />);
		expect(screen.getByLabelText('Email')).toHaveAttribute('id', 'email-field');
	});

	it('describes the input with a hint', () => {
		render(<Input label="Email" hint="Work email preferred" id="email" />);
		const input = screen.getByLabelText('Email');
		expect(input).toHaveAttribute('aria-describedby', 'email-desc');
		expect(input).not.toHaveAttribute('aria-invalid');
		expect(screen.getByText('Work email preferred')).toHaveAttribute('id', 'email-desc');
	});

	it('flags errors with aria-invalid and an alert', () => {
		render(<Input label="Email" error="Invalid email" />);
		const input = screen.getByLabelText('Email');
		expect(input).toHaveAttribute('aria-invalid', 'true');
		expect(input).toHaveClass('border-[var(--ds-danger)]');
		expect(screen.getByRole('alert')).toHaveTextContent('Invalid email');
	});

	it('marks required inputs', () => {
		render(<Input label="Email" required />);
		expect(screen.getByLabelText(/Email/)).toBeRequired();
		expect(screen.getByText('*')).toBeInTheDocument();
	});

	it('disables the control', () => {
		render(<Input label="Email" disabled />);
		expect(screen.getByLabelText('Email')).toBeDisabled();
	});

	it('uses the small size classes', () => {
		render(<Input label="Email" size="sm" />);
		expect(screen.getByLabelText('Email')).toHaveClass('h-9');
	});

	it('pads for a left icon', () => {
		render(<Input label="Search" leftIcon={<svg data-testid="left" />} />);
		expect(screen.getByTestId('left')).toBeInTheDocument();
		expect(screen.getByLabelText('Search')).toHaveClass('pl-10');
	});

	it('pads for a right icon', () => {
		render(<Input label="Search" rightIcon={<svg data-testid="right" />} />);
		expect(screen.getByTestId('right')).toBeInTheDocument();
		expect(screen.getByLabelText('Search')).toHaveClass('pr-10');
	});

	it('merges custom classes and forwards the ref', () => {
		const ref = createRef<HTMLInputElement>();
		render(<Input label="Email" ref={ref} className="custom-class" placeholder="you@site.com" />);
		expect(ref.current).toBe(screen.getByLabelText('Email'));
		expect(ref.current).toHaveClass('custom-class');
		expect(ref.current).toHaveAttribute('placeholder', 'you@site.com');
	});
});
