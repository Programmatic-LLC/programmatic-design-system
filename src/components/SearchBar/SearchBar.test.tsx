import { useState, type ChangeEvent } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { SearchBar } from './SearchBar';

function ControlledSearchBar(props: { onChange?: (e: ChangeEvent<HTMLInputElement>) => void }) {
	const [value, setValue] = useState('');
	return (
		<SearchBar
			value={value}
			onChange={(e) => {
				setValue(e.target.value);
				props.onChange?.(e);
			}}
		/>
	);
}

describe('SearchBar', () => {
	it('renders with the default placeholder and aria label', () => {
		render(<SearchBar value="" onChange={vi.fn()} />);
		const input = screen.getByRole('textbox', { name: 'Search...' });
		expect(input).toHaveAttribute('placeholder', 'Search...');
	});

	it('renders a custom placeholder', () => {
		render(<SearchBar value="" onChange={vi.fn()} placeholder="Find places" />);
		expect(screen.getByRole('textbox', { name: 'Find places' })).toBeInTheDocument();
	});

	it('displays the controlled value', () => {
		render(<SearchBar value="museum" onChange={vi.fn()} />);
		expect(screen.getByRole('textbox')).toHaveValue('museum');
	});

	it('calls onChange as the user types', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(<ControlledSearchBar onChange={onChange} />);
		await user.type(screen.getByRole('textbox'), 'art');
		expect(onChange).toHaveBeenCalledTimes(3);
		expect(screen.getByRole('textbox')).toHaveValue('art');
	});

	it('applies the brand color to the outline style', () => {
		render(<SearchBar value="" onChange={vi.fn()} brandColor="#ff0000" />);
		expect(screen.getByRole('textbox')).toHaveStyle({ outlineColor: '#ff0000' });
	});

	it('falls back to the brand token when no brand color is provided', () => {
		render(<SearchBar value="" onChange={vi.fn()} />);
		expect(screen.getByRole('textbox').style.outlineColor).toBe('var(--ds-brand-600)');
	});

	it('applies map variant styling', () => {
		const { container } = render(<SearchBar value="" onChange={vi.fn()} variant="map" />);
		expect(container.firstElementChild).toHaveClass('shadow-lg');
		expect(screen.getByRole('textbox')).toHaveClass('border-none', 'bg-white');
	});

	it('applies hero variant styling', () => {
		render(<SearchBar value="" onChange={vi.fn()} variant="hero" />);
		expect(screen.getByRole('textbox')).toHaveClass('rounded-xl', 'text-white');
	});
});
