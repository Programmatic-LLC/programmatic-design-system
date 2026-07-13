import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ViewToggle, type ViewToggleOption } from './ViewToggle';

function GridIcon({ className }: { className?: string }) {
	return <svg className={className} data-testid="grid-icon" />;
}

function MapIcon({ className }: { className?: string }) {
	return <svg className={className} data-testid="map-icon" />;
}

const options: ViewToggleOption[] = [
	{ value: 'grid', label: 'Grid', icon: GridIcon, ariaLabel: 'Grid view' },
	{ value: 'map', label: 'Map', icon: MapIcon, ariaLabel: 'Map view' },
];

describe('ViewToggle', () => {
	it('renders a tablist with the default aria label', () => {
		render(<ViewToggle value="grid" onChange={vi.fn()} options={options} />);
		expect(screen.getByRole('tablist', { name: 'Change view' })).toBeInTheDocument();
		expect(screen.getAllByRole('tab')).toHaveLength(2);
	});

	it('marks the active option as selected', () => {
		render(<ViewToggle value="map" onChange={vi.fn()} options={options} />);
		expect(screen.getByRole('tab', { name: 'Map view' })).toHaveAttribute('aria-selected', 'true');
		expect(screen.getByRole('tab', { name: 'Grid view' })).toHaveAttribute('aria-selected', 'false');
	});

	it('calls onChange with the option value on click', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(<ViewToggle value="grid" onChange={onChange} options={options} />);
		await user.click(screen.getByRole('tab', { name: 'Map view' }));
		expect(onChange).toHaveBeenCalledWith('map');
	});

	it('renders labels and icons together by default', () => {
		render(<ViewToggle value="grid" onChange={vi.fn()} options={options} />);
		expect(screen.getByText('Grid')).toBeInTheDocument();
		expect(screen.getByTestId('grid-icon')).toBeInTheDocument();
		expect(screen.getByTestId('map-icon')).toBeInTheDocument();
	});

	it('hides labels in iconOnly mode', () => {
		render(<ViewToggle value="grid" onChange={vi.fn()} options={options} iconOnly />);
		expect(screen.queryByText('Grid')).not.toBeInTheDocument();
		expect(screen.getByTestId('grid-icon')).toBeInTheDocument();
	});

	it('renders options without icons or labels', () => {
		render(
			<ViewToggle
				value="a"
				onChange={vi.fn()}
				options={[{ value: 'a', ariaLabel: 'Option A' }, { value: 'b', label: 'B' }]}
			/>,
		);
		expect(screen.getByRole('tab', { name: 'Option A' })).toBeEmptyDOMElement();
		expect(screen.getByRole('tab', { name: 'B' })).toBeInTheDocument();
	});

	it('applies overlay variant container styling', () => {
		render(<ViewToggle value="grid" onChange={vi.fn()} options={options} variant="overlay" />);
		expect(screen.getByRole('tablist')).toHaveClass('shadow-lg');
	});

	it('wraps the floating variant in a fixed positioned container', () => {
		const { container } = render(
			<ViewToggle
				value="grid"
				onChange={vi.fn()}
				options={options}
				variant="floating"
				className="float-extra"
			/>,
		);
		const outer = container.firstElementChild;
		expect(outer).toHaveClass('fixed', 'float-extra');
		expect(screen.getByRole('tablist')).toHaveClass('rounded-full');
	});

	it('renders floating icon-only buttons as circles', () => {
		render(
			<ViewToggle
				value="grid"
				onChange={vi.fn()}
				options={options}
				variant="floating"
				iconOnly
			/>,
		);
		expect(screen.getByRole('tab', { name: 'Grid view' })).toHaveClass('w-10', 'rounded-full');
	});

	it('uses a custom aria label and className on the tablist', () => {
		render(
			<ViewToggle
				value="grid"
				onChange={vi.fn()}
				options={options}
				ariaLabel="Switch layout"
				className="toggle-extra"
			/>,
		);
		expect(screen.getByRole('tablist', { name: 'Switch layout' })).toHaveClass('toggle-extra');
	});
});
