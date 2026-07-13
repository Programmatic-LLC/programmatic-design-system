import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Tooltip } from './Tooltip';

function renderTooltip() {
	return render(
		<Tooltip content="Helpful details">
			<button type="button">Trigger</button>
		</Tooltip>,
	);
}

describe('Tooltip', () => {
	it('is hidden by default', () => {
		renderTooltip();
		const tooltip = screen.getByRole('tooltip', { hidden: true });
		expect(tooltip).toHaveClass('invisible', 'opacity-0');
		expect(tooltip).toHaveTextContent('Helpful details');
	});

	it('links the trigger to the tooltip via aria-describedby', () => {
		renderTooltip();
		const trigger = screen.getByRole('button', { name: 'Trigger' });
		const tooltip = screen.getByRole('tooltip', { hidden: true });
		expect(trigger).toHaveAttribute('aria-describedby', tooltip.id);
	});

	it('shows on hover and hides on unhover', async () => {
		const user = userEvent.setup();
		renderTooltip();
		const trigger = screen.getByRole('button', { name: 'Trigger' });
		await user.hover(trigger);
		expect(screen.getByRole('tooltip')).toHaveClass('opacity-100');
		await user.unhover(trigger);
		expect(screen.getByRole('tooltip', { hidden: true })).toHaveClass('opacity-0');
	});

	it('shows on focus and hides on blur', async () => {
		const user = userEvent.setup();
		renderTooltip();
		await user.tab();
		expect(screen.getByRole('button', { name: 'Trigger' })).toHaveFocus();
		expect(screen.getByRole('tooltip')).toHaveClass('opacity-100');
		await user.tab();
		expect(screen.getByRole('tooltip', { hidden: true })).toHaveClass('opacity-0');
	});

	it('closes on Escape while open', async () => {
		const user = userEvent.setup();
		renderTooltip();
		await user.hover(screen.getByRole('button', { name: 'Trigger' }));
		expect(screen.getByRole('tooltip')).toHaveClass('opacity-100');
		await user.keyboard('{Escape}');
		expect(screen.getByRole('tooltip', { hidden: true })).toHaveClass('opacity-0');
	});

	it('ignores Escape while closed', async () => {
		const user = userEvent.setup();
		renderTooltip();
		await user.keyboard('{Escape}');
		expect(screen.getByRole('tooltip', { hidden: true })).toHaveClass('opacity-0');
	});

	it('applies a custom className to the wrapper', () => {
		const { container } = render(
			<Tooltip content="Info" className="custom-tip">
				<button type="button">Trigger</button>
			</Tooltip>,
		);
		expect(container.firstElementChild).toHaveClass('custom-tip');
	});
});
