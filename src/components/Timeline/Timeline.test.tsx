import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Timeline, TimelineItem } from './Timeline';

const reduced = vi.hoisted(() => ({ value: false }));

vi.mock('motion/react', async (importOriginal) => {
	const actual = await importOriginal<typeof import('motion/react')>();
	return { ...actual, useReducedMotion: () => reduced.value };
});

describe('Timeline', () => {
	beforeEach(() => {
		reduced.value = false;
	});

	it('renders an ordered list with one item per child', () => {
		render(
			<Timeline>
				<TimelineItem marker="1">First stop</TimelineItem>
				<TimelineItem marker="2">Second stop</TimelineItem>
				<TimelineItem marker="3">Third stop</TimelineItem>
			</Timeline>,
		);
		expect(screen.getByRole('list')).toBeInTheDocument();
		expect(screen.getAllByRole('listitem')).toHaveLength(3);
	});

	it('draws a connector for every item except the last', () => {
		render(
			<Timeline>
				<TimelineItem marker="1">First</TimelineItem>
				<TimelineItem marker="2">Second</TimelineItem>
			</Timeline>,
		);
		const items = screen.getAllByRole('listitem');
		expect(items[0].querySelector('span[aria-hidden="true"]')).toBeInTheDocument();
		expect(items[1].querySelector(':scope > span[aria-hidden="true"]')).toBeNull();
	});

	it('applies the gap variant class', () => {
		const { rerender } = render(
			<Timeline gap="sm">
				<TimelineItem marker="1">Item</TimelineItem>
			</Timeline>,
		);
		expect(screen.getByRole('list')).toHaveClass('gap-y-3');
		rerender(
			<Timeline gap="lg">
				<TimelineItem marker="1">Item</TimelineItem>
			</Timeline>,
		);
		expect(screen.getByRole('list')).toHaveClass('gap-y-8');
	});

	it('renders without animation when animate is false or motion is reduced', () => {
		const { rerender } = render(
			<Timeline animate={false}>
				<TimelineItem marker="1">Static item</TimelineItem>
			</Timeline>,
		);
		expect(screen.getByText('Static item')).toBeInTheDocument();
		reduced.value = true;
		rerender(
			<Timeline>
				<TimelineItem marker="1">Calm item</TimelineItem>
			</Timeline>,
		);
		expect(screen.getByText('Calm item')).toBeInTheDocument();
	});

	it('forwards extra props and className to the list', () => {
		render(
			<Timeline className="custom-timeline" aria-label="Tour stops">
				<TimelineItem marker="1">Item</TimelineItem>
			</Timeline>,
		);
		const list = screen.getByRole('list', { name: 'Tour stops' });
		expect(list).toHaveClass('custom-timeline');
	});
});

describe('TimelineItem', () => {
	it('renders the marker as decorative and shows children', () => {
		render(
			<Timeline>
				<TimelineItem marker="7">Stop details</TimelineItem>
			</Timeline>,
		);
		const marker = screen.getByText('7');
		expect(marker.closest('div')).toHaveAttribute('aria-hidden', 'true');
		expect(screen.getByText('Stop details')).toBeInTheDocument();
	});

	it('applies state styling', () => {
		render(
			<Timeline>
				<TimelineItem marker="1" state="muted">Muted stop</TimelineItem>
				<TimelineItem marker="2" state="completed">Done stop</TimelineItem>
			</Timeline>,
		);
		expect(screen.getByText('1')).toHaveClass('bg-[var(--ds-surface-muted)]');
		expect(screen.getByText('2')).toHaveClass('bg-[var(--ds-brand-700)]');
		expect(screen.getByText('Muted stop')).toHaveClass('opacity-60');
	});

	it('renders an accessory when provided', () => {
		render(
			<Timeline>
				<TimelineItem marker="1" accessory={<span>2.1 mi</span>}>Stop</TimelineItem>
			</Timeline>,
		);
		expect(screen.getByText('2.1 mi')).toBeInTheDocument();
	});

	it('wraps content in a button when onSelect is provided', async () => {
		const user = userEvent.setup();
		const onSelect = vi.fn();
		render(
			<Timeline>
				<TimelineItem marker="1" onSelect={onSelect} selectLabel="Go to stop 1">
					Clickable stop
				</TimelineItem>
			</Timeline>,
		);
		const button = screen.getByRole('button', { name: 'Go to stop 1' });
		await user.click(button);
		expect(onSelect).toHaveBeenCalledTimes(1);
	});

	it('does not render a button without onSelect', () => {
		render(
			<Timeline>
				<TimelineItem marker="1">Plain stop</TimelineItem>
			</Timeline>,
		);
		expect(screen.queryByRole('button')).not.toBeInTheDocument();
	});

	it('applies the highlighted ring', () => {
		render(
			<Timeline>
				<TimelineItem marker="1" highlighted>Highlighted stop</TimelineItem>
			</Timeline>,
		);
		expect(screen.getByText('Highlighted stop')).toHaveClass('ring-2');
	});
});
