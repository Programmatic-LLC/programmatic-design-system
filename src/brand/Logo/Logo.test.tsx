import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { Lockup, Logomark, Wordmark } from './index';

function getSvg(container: HTMLElement): SVGSVGElement {
	return container.querySelector('svg') as SVGSVGElement;
}

describe('Logomark', () => {
	it('is decorative by default', () => {
		const { container } = render(<Logomark />);
		const svg = getSvg(container);
		expect(svg).toHaveAttribute('aria-hidden', 'true');
		expect(svg).not.toHaveAttribute('role');
		expect(svg).not.toHaveAttribute('aria-label');
		expect(container.querySelector('title')).not.toBeInTheDocument();
	});

	it('becomes an accessible image when titled', () => {
		const { container } = render(<Logomark title="DestinationHub" />);
		const svg = getSvg(container);
		expect(svg).toHaveAttribute('role', 'img');
		expect(svg).toHaveAttribute('aria-label', 'DestinationHub');
		expect(svg).not.toHaveAttribute('aria-hidden');
		expect(container.querySelector('title')).toHaveTextContent('DestinationHub');
	});

	it('sizes from the height with a fixed aspect ratio', () => {
		const { container } = render(<Logomark size={320} />);
		const svg = getSvg(container);
		expect(svg).toHaveAttribute('height', '320');
		expect(svg).toHaveAttribute('width', '290');
	});

	it('applies the color through inline style', () => {
		const { container } = render(<Logomark color="#158474" style={{ opacity: 0.5 }} />);
		const svg = getSvg(container);
		expect(svg).toHaveStyle({ color: '#158474', opacity: 0.5 });
	});
});

describe('Wordmark', () => {
	it('is decorative by default and titled when asked', () => {
		const { container, rerender } = render(<Wordmark />);
		expect(getSvg(container)).toHaveAttribute('aria-hidden', 'true');
		rerender(<Wordmark title="Programmatic" />);
		const svg = getSvg(container);
		expect(svg).toHaveAttribute('role', 'img');
		expect(svg).toHaveAttribute('aria-label', 'Programmatic');
	});

	it('sizes from the height with a fixed aspect ratio', () => {
		const { container } = render(<Wordmark size={31} />);
		const svg = getSvg(container);
		expect(svg).toHaveAttribute('height', '31');
		expect(svg).toHaveAttribute('width', '287');
	});
});

describe('Lockup', () => {
	it('is decorative by default and titled when asked', () => {
		const { container, rerender } = render(<Lockup />);
		expect(getSvg(container)).toHaveAttribute('aria-hidden', 'true');
		rerender(<Lockup title="Programmatic lockup" />);
		expect(getSvg(container)).toHaveAttribute('aria-label', 'Programmatic lockup');
	});

	it('sizes from the height with a fixed aspect ratio', () => {
		const { container } = render(<Lockup size={97} />);
		const svg = getSvg(container);
		expect(svg).toHaveAttribute('height', '97');
		expect(svg).toHaveAttribute('width', '400');
	});

	it('defaults both paths to currentColor', () => {
		const { container } = render(<Lockup />);
		const paths = container.querySelectorAll('path');
		expect(paths).toHaveLength(2);
		expect(paths[0]).toHaveAttribute('fill', 'currentColor');
		expect(paths[1]).toHaveAttribute('fill', 'currentColor');
	});

	it('applies distinct icon and text colors', () => {
		const { container } = render(<Lockup iconColor="#158474" textColor="#0f172a" />);
		const paths = container.querySelectorAll('path');
		expect(paths[0]).toHaveAttribute('fill', '#158474');
		expect(paths[1]).toHaveAttribute('fill', '#0f172a');
	});
});
