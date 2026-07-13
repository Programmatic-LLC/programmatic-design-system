import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button', () => {
	it('renders a button with its label', () => {
		render(<Button>Save</Button>);
		expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
	});

	it('fires the click handler', async () => {
		const user = userEvent.setup();
		const onClick = vi.fn();
		render(<Button onClick={onClick}>Save</Button>);
		await user.click(screen.getByRole('button', { name: 'Save' }));
		expect(onClick).toHaveBeenCalledTimes(1);
	});

	it('blocks clicks while disabled', async () => {
		const user = userEvent.setup();
		const onClick = vi.fn();
		render(
			<Button disabled onClick={onClick}>
				Save
			</Button>,
		);
		const button = screen.getByRole('button', { name: 'Save' });
		expect(button).toBeDisabled();
		await user.click(button);
		expect(onClick).not.toHaveBeenCalled();
	});

	it('defaults to the primary md variant', () => {
		render(<Button>Go</Button>);
		const button = screen.getByRole('button', { name: 'Go' });
		expect(button).toHaveClass('bg-[var(--ds-brand-600)]');
		expect(button).toHaveClass('h-11');
	});

	it('applies variant and size classes', () => {
		render(
			<Button variant="danger" size="sm">
				Delete
			</Button>,
		);
		const button = screen.getByRole('button', { name: 'Delete' });
		expect(button).toHaveClass('bg-[var(--ds-danger)]');
		expect(button).toHaveClass('h-9');
	});

	it('collapses height and padding for the link variant', () => {
		render(<Button variant="link">Read more</Button>);
		const button = screen.getByRole('button', { name: 'Read more' });
		expect(button).toHaveClass('h-auto');
		expect(button).toHaveClass('px-0');
	});

	it('stretches full width when asked', () => {
		render(<Button fullWidth>Wide</Button>);
		expect(screen.getByRole('button', { name: 'Wide' })).toHaveClass('w-full');
	});

	it('renders left and right icons around the label', () => {
		render(
			<Button leftIcon={<svg data-testid="left" />} rightIcon={<svg data-testid="right" />}>
				Both
			</Button>,
		);
		expect(screen.getByTestId('left')).toBeInTheDocument();
		expect(screen.getByTestId('right')).toBeInTheDocument();
	});

	it('shows a spinner and disables itself while loading', () => {
		render(
			<Button isLoading leftIcon={<svg data-testid="left" />} rightIcon={<svg data-testid="right" />}>
				Saving
			</Button>,
		);
		const button = screen.getByRole('button', { name: 'Saving' });
		expect(button).toBeDisabled();
		expect(button).toHaveAttribute('aria-busy', 'true');
		expect(button.querySelector('.animate-spin')).toBeInTheDocument();
		expect(screen.queryByTestId('left')).not.toBeInTheDocument();
		expect(screen.queryByTestId('right')).not.toBeInTheDocument();
	});

	it('does not set aria-busy when idle', () => {
		render(<Button>Idle</Button>);
		expect(screen.getByRole('button', { name: 'Idle' })).not.toHaveAttribute('aria-busy');
	});

	it('merges custom classes and forwards the ref', () => {
		const ref = createRef<HTMLButtonElement>();
		render(
			<Button ref={ref} className="custom-class" type="submit">
				Ref
			</Button>,
		);
		expect(ref.current).toBe(screen.getByRole('button', { name: 'Ref' }));
		expect(ref.current).toHaveClass('custom-class');
		expect(ref.current).toHaveAttribute('type', 'submit');
	});
});
