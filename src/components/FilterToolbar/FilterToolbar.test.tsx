import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import {
	ActiveFilterChip,
	FilterButton,
	FilterSearchInput,
	FilterToolbar,
	FilterToolbarActions,
	FilterToolbarPrimary,
} from './FilterToolbar';

describe('FilterToolbar', () => {
	it('renders children in the styled shell by default', () => {
		render(
			<FilterToolbar data-testid="toolbar">
				<FilterToolbarPrimary data-testid="primary">search</FilterToolbarPrimary>
				<FilterToolbarActions data-testid="actions">buttons</FilterToolbarActions>
			</FilterToolbar>,
		);
		expect(screen.getByTestId('toolbar')).toHaveClass('rounded-[var(--ds-radius-xl)]');
		expect(screen.getByTestId('primary')).toHaveClass('flex-1');
		expect(screen.getByTestId('actions')).toHaveClass('shrink-0');
	});

	it('renders bare without shell styling and shows the notice', () => {
		render(
			<FilterToolbar data-testid="toolbar" bare notice={<span>3 results</span>}>
				content
			</FilterToolbar>,
		);
		expect(screen.getByTestId('toolbar')).not.toHaveClass('rounded-[var(--ds-radius-xl)]');
		expect(screen.getByText('3 results')).toBeInTheDocument();
	});
});

describe('FilterSearchInput', () => {
	it('renders with placeholder as accessible name and no clear button when empty', () => {
		render(<FilterSearchInput value="" onChange={() => {}} />);
		expect(screen.getByRole('textbox', { name: 'Search…' })).toBeInTheDocument();
		expect(screen.queryByRole('button', { name: 'Clear search' })).not.toBeInTheDocument();
	});

	it('calls onChange while typing', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(<FilterSearchInput value="" onChange={onChange} placeholder="Find places" />);
		await user.type(screen.getByRole('textbox', { name: 'Find places' }), 'a');
		expect(onChange).toHaveBeenCalled();
	});

	it('clears via onClear when provided', async () => {
		const user = userEvent.setup();
		const onClear = vi.fn();
		const onChange = vi.fn();
		render(<FilterSearchInput value="mural" onChange={onChange} onClear={onClear} />);
		await user.click(screen.getByRole('button', { name: 'Clear search' }));
		expect(onClear).toHaveBeenCalledTimes(1);
		expect(onChange).not.toHaveBeenCalled();
	});

	it('falls back to a synthetic empty change without onClear', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(<FilterSearchInput value="mural" onChange={onChange} />);
		await user.click(screen.getByRole('button', { name: 'Clear search' }));
		expect(onChange).toHaveBeenCalledTimes(1);
		expect(onChange.mock.calls[0][0].target.value).toBe('');
	});

	it('renders a custom icon', () => {
		render(<FilterSearchInput value="" onChange={() => {}} icon={<svg data-testid="icon" />} />);
		expect(screen.getByTestId('icon')).toBeInTheDocument();
	});
});

describe('FilterButton', () => {
	it('renders the inactive default state', () => {
		render(<FilterButton />);
		const button = screen.getByRole('button', { name: 'Filters' });
		expect(button).toHaveTextContent('Filters');
		expect(button).not.toHaveTextContent('0');
	});

	it('shows the active count in label and badge', () => {
		render(<FilterButton activeCount={2} />);
		const button = screen.getByRole('button', { name: 'Filters, 2 active' });
		expect(button).toHaveTextContent('2');
		expect(button).toHaveClass('bg-[var(--ds-brand-600)]');
	});

	it('uses the brand color when active', () => {
		render(<FilterButton activeCount={1} brandColor="#158474" />);
		const button = screen.getByRole('button', { name: 'Filters, 1 active' });
		expect(button).toHaveStyle({ backgroundColor: '#158474' });
	});

	it('renders compact without the visible label', () => {
		render(<FilterButton compact activeCount={3} brandColor="#158474" label="Filters" />);
		const button = screen.getByRole('button', { name: 'Filters, 3 active' });
		expect(button).toHaveClass('w-11');
		expect(button).toHaveTextContent('3');
	});

	it('fires onClick and accepts a custom icon and label node', async () => {
		const user = userEvent.setup();
		const onClick = vi.fn();
		render(<FilterButton onClick={onClick} icon={<svg data-testid="icon" />} label={<em>Refine</em>} />);
		expect(screen.getByTestId('icon')).toBeInTheDocument();
		await user.click(screen.getByRole('button', { name: 'Filters' }));
		expect(onClick).toHaveBeenCalledTimes(1);
	});
});

describe('ActiveFilterChip', () => {
	it('renders the label and removes on click', async () => {
		const user = userEvent.setup();
		const onRemove = vi.fn();
		render(<ActiveFilterChip label="Dining" onRemove={onRemove} />);
		await user.click(screen.getByRole('button', { name: 'Remove Dining filter' }));
		expect(onRemove).toHaveBeenCalledTimes(1);
	});

	it('handles non-string labels in the aria label', () => {
		render(<ActiveFilterChip label={<em>Trails</em>} onRemove={() => {}} />);
		expect(screen.getByRole('button', { name: 'Remove filter' })).toBeInTheDocument();
	});
});
