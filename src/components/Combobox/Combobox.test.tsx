import { useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Combobox, type ComboboxProps } from './Combobox';

const defaultItems = ['Alpha', 'Beta', 'Gamma'];

function renderCombobox(overrides: Partial<ComboboxProps<string>> = {}) {
	const props: ComboboxProps<string> = {
		value: '',
		onValueChange: vi.fn(),
		open: false,
		onOpenChange: vi.fn(),
		items: defaultItems,
		onSelect: vi.fn(),
		getItemKey: (item) => item,
		renderItem: (item, state) => (
			<span data-active={state.active}>{item}</span>
		),
		ariaLabel: 'Search entities',
		...overrides,
	};
	const view = render(<Combobox {...props} />);
	return { props, view };
}

function Harness({ onSelect }: { onSelect: (item: string) => void }) {
	const [value, setValue] = useState('');
	const [open, setOpen] = useState(false);
	return (
		<Combobox
			value={value}
			onValueChange={(next) => {
				setValue(next);
				setOpen(true);
			}}
			open={open}
			onOpenChange={setOpen}
			items={defaultItems.filter((item) => item.toLowerCase().includes(value.toLowerCase()))}
			onSelect={onSelect}
			getItemKey={(item) => item}
			renderItem={(item) => <span>{item}</span>}
			ariaLabel="Search entities"
			placeholder="Search…"
		/>
	);
}

describe('Combobox', () => {
	it('renders a closed combobox input', () => {
		renderCombobox({ placeholder: 'Search…' });
		const input = screen.getByRole('combobox', { name: 'Search entities' });
		expect(input).toHaveAttribute('aria-expanded', 'false');
		expect(input).toHaveAttribute('placeholder', 'Search…');
		expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
	});

	it('emits value changes while typing', async () => {
		const user = userEvent.setup();
		const onValueChange = vi.fn();
		renderCombobox({ onValueChange });
		await user.type(screen.getByRole('combobox'), 'a');
		expect(onValueChange).toHaveBeenCalledWith('a');
	});

	it('shows options when open', () => {
		renderCombobox({ open: true });
		expect(screen.getByRole('listbox', { name: 'Search entities' })).toBeInTheDocument();
		expect(screen.getAllByRole('option')).toHaveLength(3);
	});

	it('keeps the list closed when open with no items and no empty state', () => {
		renderCombobox({ open: true, items: [] });
		expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
	});

	it('shows the empty state when open with no items', () => {
		renderCombobox({ open: true, items: [], emptyState: 'No matches' });
		expect(screen.getByText('No matches')).toBeInTheDocument();
	});

	it('opens on ArrowDown when closed', () => {
		const onOpenChange = vi.fn();
		renderCombobox({ onOpenChange });
		fireEvent.keyDown(screen.getByRole('combobox'), { key: 'ArrowDown' });
		expect(onOpenChange).toHaveBeenCalledWith(true);
	});

	it('navigates options with arrow keys and selects with Enter', () => {
		const onSelect = vi.fn();
		const onOpenChange = vi.fn();
		renderCombobox({ open: true, onSelect, onOpenChange });
		const input = screen.getByRole('combobox');

		fireEvent.keyDown(input, { key: 'ArrowDown' });
		fireEvent.keyDown(input, { key: 'ArrowDown' });
		const options = screen.getAllByRole('option');
		expect(options[1]).toHaveAttribute('aria-selected', 'true');
		expect(input).toHaveAttribute('aria-activedescendant', options[1].id);

		fireEvent.keyDown(input, { key: 'ArrowUp' });
		expect(options[0]).toHaveAttribute('aria-selected', 'true');

		fireEvent.keyDown(input, { key: 'Enter' });
		expect(onSelect).toHaveBeenCalledWith('Alpha');
		expect(onOpenChange).toHaveBeenCalledWith(false);
	});

	it('stops at the last option with ArrowDown', () => {
		renderCombobox({ open: true });
		const input = screen.getByRole('combobox');
		fireEvent.keyDown(input, { key: 'ArrowDown' });
		fireEvent.keyDown(input, { key: 'ArrowDown' });
		fireEvent.keyDown(input, { key: 'ArrowDown' });
		fireEvent.keyDown(input, { key: 'ArrowDown' });
		expect(screen.getAllByRole('option')[2]).toHaveAttribute('aria-selected', 'true');
	});

	it('moves back to no active option with ArrowUp at the top', () => {
		renderCombobox({ open: true });
		const input = screen.getByRole('combobox');
		fireEvent.keyDown(input, { key: 'ArrowDown' });
		fireEvent.keyDown(input, { key: 'ArrowUp' });
		expect(input).not.toHaveAttribute('aria-activedescendant');
	});

	it('does not select on Enter without an active option', () => {
		const onSelect = vi.fn();
		renderCombobox({ open: true, onSelect });
		fireEvent.keyDown(screen.getByRole('combobox'), { key: 'Enter' });
		expect(onSelect).not.toHaveBeenCalled();
	});

	it('closes on Escape and Tab', () => {
		const onOpenChange = vi.fn();
		renderCombobox({ open: true, onOpenChange });
		const input = screen.getByRole('combobox');
		fireEvent.keyDown(input, { key: 'Escape' });
		expect(onOpenChange).toHaveBeenLastCalledWith(false);
		fireEvent.keyDown(input, { key: 'Tab' });
		expect(onOpenChange).toHaveBeenCalledTimes(2);
	});

	it('respects consumer key handlers that prevent default', () => {
		const onOpenChange = vi.fn();
		renderCombobox({
			onOpenChange,
			inputProps: { onKeyDown: (event) => event.preventDefault() },
		});
		fireEvent.keyDown(screen.getByRole('combobox'), { key: 'ArrowDown' });
		expect(onOpenChange).not.toHaveBeenCalled();
	});

	it('selects an option on click and activates on pointer enter', () => {
		const onSelect = vi.fn();
		renderCombobox({ open: true, onSelect });
		const options = screen.getAllByRole('option');
		fireEvent.pointerEnter(options[2]);
		expect(options[2]).toHaveAttribute('aria-selected', 'true');
		fireEvent.click(options[2]);
		expect(onSelect).toHaveBeenCalledWith('Gamma');
	});

	it('closes when pointing down outside the wrapper', () => {
		const onOpenChange = vi.fn();
		renderCombobox({ open: true, onOpenChange });
		fireEvent.pointerDown(document.body);
		expect(onOpenChange).toHaveBeenCalledWith(false);
	});

	it('stays open when pointing down inside the wrapper', () => {
		const onOpenChange = vi.fn();
		renderCombobox({ open: true, onOpenChange });
		fireEvent.pointerDown(screen.getByRole('combobox'));
		expect(onOpenChange).not.toHaveBeenCalled();
	});

	it('renders adornments and disabled state', () => {
		renderCombobox({
			disabled: true,
			startAdornment: <span data-testid="start" />,
			endAdornment: <span data-testid="end" />,
		});
		expect(screen.getByTestId('start')).toBeInTheDocument();
		expect(screen.getByTestId('end')).toBeInTheDocument();
		expect(screen.getByRole('combobox')).toBeDisabled();
	});

	it('supports a full type-and-select flow', async () => {
		const user = userEvent.setup();
		const onSelect = vi.fn();
		render(<Harness onSelect={onSelect} />);
		const input = screen.getByRole('combobox');
		await user.type(input, 'be');
		expect(screen.getAllByRole('option')).toHaveLength(1);
		await user.keyboard('{ArrowDown}{Enter}');
		expect(onSelect).toHaveBeenCalledWith('Beta');
		expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
	});
});
