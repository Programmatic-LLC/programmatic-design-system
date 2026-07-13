import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Textarea } from './Textarea';

describe('Textarea', () => {
	it('renders a labeled textarea with four rows by default', () => {
		render(<Textarea label="Description" />);
		const textarea = screen.getByLabelText('Description');
		expect(textarea.tagName).toBe('TEXTAREA');
		expect(textarea).toHaveAttribute('rows', '4');
	});

	it('accepts a custom row count', () => {
		render(<Textarea label="Description" rows={8} />);
		expect(screen.getByLabelText('Description')).toHaveAttribute('rows', '8');
	});

	it('accepts typed text', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(<Textarea label="Description" onChange={onChange} />);
		const textarea = screen.getByLabelText('Description');
		await user.type(textarea, 'A scenic overlook');
		expect(textarea).toHaveValue('A scenic overlook');
		expect(onChange).toHaveBeenCalled();
	});

	it('describes the textarea with a hint', () => {
		render(<Textarea label="Description" hint="Max 500 chars" id="desc" />);
		expect(screen.getByLabelText('Description')).toHaveAttribute('aria-describedby', 'desc-desc');
		expect(screen.getByText('Max 500 chars')).toHaveAttribute('id', 'desc-desc');
	});

	it('flags errors with aria-invalid and an alert', () => {
		render(<Textarea label="Description" error="Too long" />);
		const textarea = screen.getByLabelText('Description');
		expect(textarea).toHaveAttribute('aria-invalid', 'true');
		expect(textarea).toHaveClass('border-[var(--ds-danger)]');
		expect(screen.getByRole('alert')).toHaveTextContent('Too long');
	});

	it('marks required and disabled states', () => {
		const { rerender } = render(<Textarea label="Description" required />);
		expect(screen.getByLabelText(/Description/)).toBeRequired();
		rerender(<Textarea label="Description" disabled />);
		expect(screen.getByLabelText('Description')).toBeDisabled();
	});

	it('resizes vertically by default and supports other modes', () => {
		const { rerender } = render(<Textarea label="Description" />);
		expect(screen.getByLabelText('Description')).toHaveClass('resize-y');
		rerender(<Textarea label="Description" resize="none" />);
		expect(screen.getByLabelText('Description')).toHaveClass('resize-none');
		rerender(<Textarea label="Description" resize="both" />);
		expect(screen.getByLabelText('Description')).toHaveClass('resize');
	});

	it('uses the small size text classes', () => {
		render(<Textarea label="Description" size="sm" />);
		expect(screen.getByLabelText('Description')).toHaveClass('text-sm');
	});

	it('merges custom classes and forwards the ref', () => {
		const ref = createRef<HTMLTextAreaElement>();
		render(<Textarea label="Description" ref={ref} className="custom-class" />);
		expect(ref.current).toBe(screen.getByLabelText('Description'));
		expect(ref.current).toHaveClass('custom-class');
	});
});
