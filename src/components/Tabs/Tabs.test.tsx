import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Tabs, type TabItem } from './Tabs';

function DummyIcon({ className }: { className?: string }) {
	return <svg className={className} data-testid="tab-icon" />;
}

const tabs: TabItem[] = [
	{ id: 'overview', label: 'Overview', icon: DummyIcon },
	{ id: 'photos', label: 'Photos', icon: DummyIcon, count: 12 },
	{ id: 'reviews', label: 'Reviews', icon: DummyIcon, count: 0 },
	{ id: 'hidden', label: 'Hidden', icon: DummyIcon, visible: false },
];

function ControlledTabs({ onChange }: { onChange?: (id: string) => void }) {
	const [active, setActive] = useState('overview');
	return (
		<Tabs
			tabs={tabs}
			activeTab={active}
			onChange={(id) => {
				setActive(id);
				onChange?.(id);
			}}
		/>
	);
}

describe('Tabs', () => {
	it('renders only visible tabs in a tablist', () => {
		render(<Tabs tabs={tabs} activeTab="overview" onChange={vi.fn()} />);
		expect(screen.getByRole('tablist')).toBeInTheDocument();
		expect(screen.getAllByRole('tab')).toHaveLength(3);
		expect(screen.queryByText('Hidden')).not.toBeInTheDocument();
	});

	it('marks the active tab as selected and focusable', () => {
		render(<Tabs tabs={tabs} activeTab="photos" onChange={vi.fn()} />);
		const active = screen.getByRole('tab', { name: /Photos/ });
		const inactive = screen.getByRole('tab', { name: /Overview/ });
		expect(active).toHaveAttribute('aria-selected', 'true');
		expect(active).toHaveAttribute('tabindex', '0');
		expect(inactive).toHaveAttribute('aria-selected', 'false');
		expect(inactive).toHaveAttribute('tabindex', '-1');
	});

	it('renders counts when provided, including zero', () => {
		render(<Tabs tabs={tabs} activeTab="overview" onChange={vi.fn()} />);
		expect(screen.getByText('12')).toBeInTheDocument();
		expect(screen.getByText('0')).toBeInTheDocument();
	});

	it('calls onChange on click', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(<Tabs tabs={tabs} activeTab="overview" onChange={onChange} />);
		await user.click(screen.getByRole('tab', { name: /Reviews/ }));
		expect(onChange).toHaveBeenCalledWith('reviews');
	});

	it('moves selection and focus with arrow keys, wrapping around', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(<ControlledTabs onChange={onChange} />);
		await user.click(screen.getByRole('tab', { name: /Overview/ }));
		await user.keyboard('{ArrowRight}');
		expect(onChange).toHaveBeenCalledWith('photos');
		expect(screen.getByRole('tab', { name: /Photos/ })).toHaveFocus();
		await user.keyboard('{ArrowRight}{ArrowRight}');
		expect(onChange).toHaveBeenCalledWith('overview');
		expect(screen.getByRole('tab', { name: /Overview/ })).toHaveFocus();
		await user.keyboard('{ArrowLeft}');
		expect(onChange).toHaveBeenCalledWith('reviews');
		expect(screen.getByRole('tab', { name: /Reviews/ })).toHaveFocus();
	});

	it('jumps to first and last tabs with Home and End', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(<ControlledTabs onChange={onChange} />);
		await user.click(screen.getByRole('tab', { name: /Photos/ }));
		await user.keyboard('{End}');
		expect(onChange).toHaveBeenCalledWith('reviews');
		expect(screen.getByRole('tab', { name: /Reviews/ })).toHaveFocus();
		await user.keyboard('{Home}');
		expect(onChange).toHaveBeenCalledWith('overview');
		expect(screen.getByRole('tab', { name: /Overview/ })).toHaveFocus();
	});

	it('ignores unrelated keys', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(<Tabs tabs={tabs} activeTab="overview" onChange={onChange} />);
		screen.getByRole('tab', { name: /Overview/ }).focus();
		await user.keyboard('{ArrowDown}a');
		expect(onChange).not.toHaveBeenCalled();
	});

	it('applies a custom className to the wrapper', () => {
		const { container } = render(
			<Tabs tabs={tabs} activeTab="overview" onChange={vi.fn()} className="custom-tabs" />,
		);
		expect(container.firstElementChild).toHaveClass('custom-tabs');
	});
});
