import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Radio, RadioGroup } from './Radio';

const options = [
	{ value: 'a', label: 'Alpha' },
	{ value: 'b', label: 'Beta' },
	{ value: 'c', label: 'Gamma' },
];

describe('Radio', () => {
	it('renders a labeled radio outside a group', () => {
		render(<Radio label="Solo" value="solo" checked={false} onChange={() => {}} />);
		expect(screen.getByRole('radio', { name: 'Solo' })).not.toBeChecked();
	});

	it('fires onChange when clicked', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(<Radio label="Solo" value="solo" onChange={onChange} />);
		await user.click(screen.getByRole('radio', { name: 'Solo' }));
		expect(onChange).toHaveBeenCalledTimes(1);
	});

	it('applies the small size to the control box', () => {
		render(<Radio label="Small" value="s" size="sm" onChange={() => {}} />);
		expect(screen.getByRole('radio').parentElement).toHaveClass('h-4');
	});

	it('renders without a label', () => {
		render(<Radio aria-label="bare" value="bare" onChange={() => {}} />);
		expect(screen.getByRole('radio', { name: 'bare' })).toBeInTheDocument();
	});
});

describe('RadioGroup', () => {
	it('renders options with a shared name and legend', () => {
		render(<RadioGroup label="Choices" options={options} />);
		expect(screen.getByText('Choices')).toBeInTheDocument();
		const radios = screen.getAllByRole('radio') as HTMLInputElement[];
		expect(radios).toHaveLength(3);
		expect(new Set(radios.map((radio) => radio.name)).size).toBe(1);
	});

	it('starts from the defaultValue when uncontrolled', () => {
		render(<RadioGroup options={options} defaultValue="b" />);
		expect(screen.getByRole('radio', { name: 'Beta' })).toBeChecked();
	});

	it('changes selection on click and reports the value', async () => {
		const user = userEvent.setup();
		const onValueChange = vi.fn();
		render(<RadioGroup options={options} defaultValue="a" onValueChange={onValueChange} />);
		await user.click(screen.getByRole('radio', { name: 'Gamma' }));
		expect(onValueChange).toHaveBeenCalledWith('c');
		expect(screen.getByRole('radio', { name: 'Gamma' })).toBeChecked();
		expect(screen.getByRole('radio', { name: 'Alpha' })).not.toBeChecked();
	});

	it('keeps the controlled value until the prop changes', async () => {
		const user = userEvent.setup();
		const onValueChange = vi.fn();
		const { rerender } = render(
			<RadioGroup options={options} value="a" onValueChange={onValueChange} />,
		);
		await user.click(screen.getByRole('radio', { name: 'Beta' }));
		expect(onValueChange).toHaveBeenCalledWith('b');
		expect(screen.getByRole('radio', { name: 'Alpha' })).toBeChecked();
		rerender(<RadioGroup options={options} value="b" onValueChange={onValueChange} />);
		expect(screen.getByRole('radio', { name: 'Beta' })).toBeChecked();
	});

	it('disables every radio when the group is disabled', () => {
		render(<RadioGroup options={options} disabled />);
		screen.getAllByRole('radio').forEach((radio) => {
			expect(radio).toBeDisabled();
		});
	});

	it('disables a single option', () => {
		render(
			<RadioGroup
				options={[options[0], { value: 'b', label: 'Beta', disabled: true }]}
			/>,
		);
		expect(screen.getByRole('radio', { name: 'Beta' })).toBeDisabled();
		expect(screen.getByRole('radio', { name: 'Alpha' })).toBeEnabled();
	});

	it('renders a hint message', () => {
		render(<RadioGroup options={options} hint="Pick one" />);
		expect(screen.getByText('Pick one')).toHaveClass('text-[var(--ds-text-muted)]');
	});

	it('renders an error message instead of the hint', () => {
		render(<RadioGroup options={options} hint="Pick one" error="Selection required" />);
		expect(screen.getByText('Selection required')).toHaveClass('text-[var(--ds-danger)]');
		expect(screen.queryByText('Pick one')).not.toBeInTheDocument();
	});

	it('lays out horizontally when asked', () => {
		const { container } = render(<RadioGroup options={options} orientation="horizontal" />);
		expect(container.querySelector('.flex-row')).toBeInTheDocument();
	});

	it('passes the group size down to radios', () => {
		render(<RadioGroup options={options} size="sm" />);
		expect(screen.getByRole('radio', { name: 'Alpha' }).parentElement).toHaveClass('h-4');
	});

	it('supports child Radio elements instead of options', async () => {
		const user = userEvent.setup();
		const onValueChange = vi.fn();
		render(
			<RadioGroup onValueChange={onValueChange}>
				<Radio value="x" label="Custom X" />
				<Radio value="y" label="Custom Y" />
			</RadioGroup>,
		);
		await user.click(screen.getByRole('radio', { name: 'Custom Y' }));
		expect(onValueChange).toHaveBeenCalledWith('y');
		expect(screen.getByRole('radio', { name: 'Custom Y' })).toBeChecked();
	});
});
