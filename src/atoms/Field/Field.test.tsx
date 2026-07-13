import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Field } from './Field';
import { controlBase, controlInvalid, controlSizes, controlValid } from './styles';

describe('Field', () => {
	it('renders only children when no label or message is given', () => {
		render(
			<Field>
				<input aria-label="bare" />
			</Field>,
		);
		expect(screen.getByRole('textbox', { name: 'bare' })).toBeInTheDocument();
		expect(document.querySelector('label')).not.toBeInTheDocument();
		expect(document.querySelector('p')).not.toBeInTheDocument();
	});

	it('associates the label with the control via htmlFor', () => {
		render(
			<Field htmlFor="name" label="Name">
				<input id="name" />
			</Field>,
		);
		expect(screen.getByLabelText('Name')).toBeInTheDocument();
	});

	it('marks required labels with an asterisk', () => {
		render(
			<Field label="Name" required>
				<input />
			</Field>,
		);
		expect(screen.getByText('*')).toHaveAttribute('aria-hidden', 'true');
	});

	it('dims the label while disabled', () => {
		render(
			<Field label="Name" disabled>
				<input />
			</Field>,
		);
		expect(screen.getByText('Name')).toHaveClass('opacity-60');
	});

	it('renders a hint without an alert role', () => {
		render(
			<Field label="Name" hint="Helpful hint" descriptionId="name-desc">
				<input />
			</Field>,
		);
		const hint = screen.getByText('Helpful hint');
		expect(hint).not.toHaveAttribute('role');
		expect(hint).toHaveAttribute('id', 'name-desc');
		expect(hint).toHaveClass('text-[var(--ds-text-muted)]');
	});

	it('renders an error as an alert and hides the hint', () => {
		render(
			<Field label="Name" hint="Helpful hint" error="Name is required">
				<input />
			</Field>,
		);
		expect(screen.getByRole('alert')).toHaveTextContent('Name is required');
		expect(screen.getByRole('alert')).toHaveClass('text-[var(--ds-danger)]');
		expect(screen.queryByText('Helpful hint')).not.toBeInTheDocument();
	});

	it('merges custom classes onto the wrapper', () => {
		const { container } = render(
			<Field className="custom-class">
				<input />
			</Field>,
		);
		expect(container.firstElementChild).toHaveClass('custom-class');
	});
});

describe('Field styles', () => {
	it('exposes the shared control class strings', () => {
		expect(controlBase).toContain('rounded-[var(--ds-radius-md)]');
		expect(controlValid).toContain('border-[var(--ds-border-strong)]');
		expect(controlInvalid).toContain('border-[var(--ds-danger)]');
		expect(controlSizes.sm).toContain('h-9');
		expect(controlSizes.md).toContain('h-11');
	});
});
