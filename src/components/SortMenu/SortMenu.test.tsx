import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SortMenu, type SortMenuOption } from './SortMenu';

const reduced = vi.hoisted(() => ({ value: true }));

vi.mock('motion/react', async (importOriginal) => {
	const actual = await importOriginal<typeof import('motion/react')>();
	return { ...actual, useReducedMotion: () => reduced.value };
});

const options: SortMenuOption[] = [
	{ value: 'name', label: 'Name' },
	{ value: 'distance', label: 'Distance', description: 'Closest first' },
	{ value: 'newest', label: 'Newest', disabled: true },
];

describe('SortMenu', () => {
	beforeEach(() => {
		reduced.value = true;
	});

	it('shows the current option label on the trigger', () => {
		render(<SortMenu value="distance" onChange={vi.fn()} options={options} />);
		expect(screen.getByRole('button', { name: /Sort/ })).toHaveTextContent('Distance');
	});

	it('falls back to the first option label for an unknown value', () => {
		render(<SortMenu value="missing" onChange={vi.fn()} options={options} />);
		expect(screen.getByRole('button', { name: /Sort/ })).toHaveTextContent('Name');
	});

	it('prefers an explicit trigger label', () => {
		render(
			<SortMenu value="name" onChange={vi.fn()} options={options} triggerLabel="Sort results" />,
		);
		expect(screen.getByRole('button', { name: /Sort/ })).toHaveTextContent('Sort results');
	});

	it('opens the listbox and marks the selected option', async () => {
		const user = userEvent.setup();
		render(<SortMenu value="name" onChange={vi.fn()} options={options} />);
		const trigger = screen.getByRole('button', { name: /Sort/ });
		expect(trigger).toHaveAttribute('aria-expanded', 'false');
		await user.click(trigger);
		expect(trigger).toHaveAttribute('aria-expanded', 'true');
		const listbox = screen.getByRole('listbox', { name: 'Sort' });
		expect(listbox).toBeInTheDocument();
		expect(screen.getByRole('option', { name: 'Name' })).toHaveAttribute('aria-selected', 'true');
		expect(screen.getByRole('option', { name: /Distance/ })).toHaveAttribute('aria-selected', 'false');
		expect(screen.getByText('Closest first')).toBeInTheDocument();
	});

	it('selects an option and closes', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(<SortMenu value="name" onChange={onChange} options={options} />);
		await user.click(screen.getByRole('button', { name: /Sort/ }));
		await user.click(screen.getByRole('option', { name: /Distance/ }));
		expect(onChange).toHaveBeenCalledWith('distance');
		await waitFor(() => expect(screen.queryByRole('listbox')).not.toBeInTheDocument());
	});

	it('does not call onChange when selecting the current value', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(<SortMenu value="name" onChange={onChange} options={options} />);
		await user.click(screen.getByRole('button', { name: /Sort/ }));
		await user.click(screen.getByRole('option', { name: 'Name' }));
		expect(onChange).not.toHaveBeenCalled();
		await waitFor(() => expect(screen.queryByRole('listbox')).not.toBeInTheDocument());
	});

	it('ignores clicks on disabled options', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(<SortMenu value="name" onChange={onChange} options={options} />);
		await user.click(screen.getByRole('button', { name: /Sort/ }));
		expect(screen.getByRole('option', { name: 'Newest' })).toBeDisabled();
		await user.click(screen.getByRole('option', { name: 'Newest' }));
		expect(onChange).not.toHaveBeenCalled();
	});

	it('closes on Escape', async () => {
		const user = userEvent.setup();
		render(<SortMenu value="name" onChange={vi.fn()} options={options} />);
		await user.click(screen.getByRole('button', { name: /Sort/ }));
		expect(screen.getByRole('listbox')).toBeInTheDocument();
		await user.keyboard('{Escape}');
		await waitFor(() => expect(screen.queryByRole('listbox')).not.toBeInTheDocument());
	});

	it('closes when clicking outside', async () => {
		const user = userEvent.setup();
		render(
			<div>
				<SortMenu value="name" onChange={vi.fn()} options={options} />
				<button type="button">Outside</button>
			</div>,
		);
		await user.click(screen.getByRole('button', { name: /Sort/ }));
		expect(screen.getByRole('listbox')).toBeInTheDocument();
		await user.click(screen.getByRole('button', { name: 'Outside' }));
		await waitFor(() => expect(screen.queryByRole('listbox')).not.toBeInTheDocument());
	});

	it('stays open when clicking inside the popover area', async () => {
		const user = userEvent.setup();
		render(<SortMenu value="name" onChange={vi.fn()} options={options} />);
		const trigger = screen.getByRole('button', { name: /Sort/ });
		await user.click(trigger);
		await user.pointer({ keys: '[MouseLeft>]', target: screen.getByRole('listbox') });
		expect(screen.getByRole('listbox')).toBeInTheDocument();
	});

	it('respects the disabled prop on the trigger', () => {
		render(<SortMenu value="name" onChange={vi.fn()} options={options} disabled />);
		expect(screen.getByRole('button', { name: /Sort/ })).toBeDisabled();
	});

	it('uses a custom accessible label', async () => {
		const user = userEvent.setup();
		render(<SortMenu value="name" onChange={vi.fn()} options={options} label="Order results" />);
		await user.click(screen.getByRole('button', { name: /Order results/ }));
		expect(screen.getByRole('listbox', { name: 'Order results' })).toBeInTheDocument();
	});

	it('renders an empty trigger label when there are no options', () => {
		render(<SortMenu value="anything" onChange={vi.fn()} options={[]} />);
		const trigger = screen.getByRole('button', { name: /Sort/ });
		expect(trigger.querySelector('.text-sm.font-semibold')).toHaveTextContent('');
	});

	it('animates the popover open and closed when motion is allowed', async () => {
		reduced.value = false;
		const user = userEvent.setup();
		render(<SortMenu value="name" onChange={vi.fn()} options={options} />);
		await user.click(screen.getByRole('button', { name: /Sort/ }));
		expect(screen.getByRole('listbox')).toBeInTheDocument();
		await user.keyboard('{Escape}');
		await waitFor(() => expect(screen.queryByRole('listbox')).not.toBeInTheDocument());
	});

	it('renders a bottom sheet with a title on mobile', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(
			<SortMenu
				value="name"
				onChange={onChange}
				options={options}
				isMobile
				sheetTitle="Order by"
			/>,
		);
		await user.click(screen.getByRole('button', { name: /Sort/ }));
		const dialog = await screen.findByRole('dialog', { name: 'Order by' });
		expect(dialog).toBeInTheDocument();
		expect(screen.getByRole('heading', { name: 'Order by' })).toBeInTheDocument();
		await user.click(screen.getByRole('option', { name: /Distance/ }));
		expect(onChange).toHaveBeenCalledWith('distance');
		await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
	});
});
