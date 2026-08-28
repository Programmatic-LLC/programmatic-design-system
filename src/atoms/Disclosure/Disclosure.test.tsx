import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Disclosure } from './Disclosure';

describe('Disclosure', () => {
	it('renders a closed details element by default', () => {
		const { container } = render(<Disclosure label="Transcript">Body text</Disclosure>);
		const details = container.querySelector('details');
		expect(details).not.toHaveAttribute('open');
		expect(screen.getByText('Transcript')).toBeInTheDocument();
		expect(screen.getByText('Body text')).toBeInTheDocument();
	});

	it('starts open with defaultOpen', () => {
		const { container } = render(
			<Disclosure label="Transcript" defaultOpen>
				Body text
			</Disclosure>,
		);
		expect(container.querySelector('details')).toHaveAttribute('open');
	});

	it('uses a summary as the toggle control', () => {
		const { container } = render(<Disclosure label="Transcript">Body text</Disclosure>);
		const summary = container.querySelector('summary');
		expect(summary).toHaveTextContent('Transcript');
		expect(summary?.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
	});

	it('styles the default tone with brand text', () => {
		const { container } = render(<Disclosure label="Transcript">Body</Disclosure>);
		expect(container.querySelector('summary')).toHaveClass('text-[var(--ds-brand-600)]');
		expect(container.querySelector('details')).toHaveClass('bg-[var(--ds-bg)]');
	});

	it('styles the onDark tone with white text', () => {
		const { container } = render(
			<Disclosure label="Transcript" tone="onDark">
				Body
			</Disclosure>,
		);
		expect(container.querySelector('summary')).toHaveClass('text-white');
		expect(container.querySelector('details')).toHaveClass('bg-white/10');
	});

	it('draws the default tone focus indicator inside the summary so the panel cannot clip it', () => {
		const { container } = render(<Disclosure label="Transcript">Body</Disclosure>);
		const summary = container.querySelector('summary');
		expect(summary).toHaveClass('focus-visible:outline-2');
		expect(summary).toHaveClass('focus-visible:-outline-offset-2');
		expect(summary).toHaveClass('focus-visible:outline-[var(--ds-ring)]');
	});

	it('draws the onDark tone focus indicator inside the summary', () => {
		const { container } = render(
			<Disclosure label="Transcript" tone="onDark">
				Body
			</Disclosure>,
		);
		const summary = container.querySelector('summary');
		expect(summary).toHaveClass('focus-visible:outline-2');
		expect(summary).toHaveClass('focus-visible:-outline-offset-2');
		expect(summary).toHaveClass('focus-visible:outline-white/70');
	});

	it('keeps a focus indicator rather than suppressing the outline', () => {
		const { container } = render(<Disclosure label="Transcript">Body</Disclosure>);
		const summary = container.querySelector('summary');
		expect(summary).not.toHaveClass('focus-visible:outline-none');
		expect(summary?.className).not.toMatch(/focus-visible:ring/);
	});

	it('merges a custom class onto the details element', () => {
		const { container } = render(
			<Disclosure label="Transcript" className="custom-class">
				Body
			</Disclosure>,
		);
		expect(container.querySelector('details')).toHaveClass('custom-class');
	});
});
