import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Reveal } from './Reveal';

const reduced = vi.hoisted(() => ({ value: false }));

vi.mock('motion/react', async (importOriginal) => {
	const actual = await importOriginal<typeof import('motion/react')>();
	return { ...actual, useReducedMotion: () => reduced.value };
});

describe('Reveal', () => {
	beforeEach(() => {
		reduced.value = false;
	});

	it('renders children inside a motion wrapper', () => {
		render(
			<Reveal className="wrapper">
				<p>Animated content</p>
			</Reveal>,
		);
		const content = screen.getByText('Animated content');
		expect(content).toBeInTheDocument();
		expect(content.parentElement).toHaveClass('wrapper');
	});

	it('forwards the ref to the animated element', () => {
		const ref = createRef<HTMLDivElement>();
		render(
			<Reveal ref={ref}>
				<span>Content</span>
			</Reveal>,
		);
		expect(ref.current).toBeInstanceOf(HTMLDivElement);
	});

	it('renders a plain div when reduced motion is preferred', () => {
		reduced.value = true;
		const ref = createRef<HTMLDivElement>();
		render(
			<Reveal ref={ref} className="static-wrapper">
				<p>Static content</p>
			</Reveal>,
		);
		expect(screen.getByText('Static content')).toBeInTheDocument();
		expect(ref.current).toHaveClass('static-wrapper');
		expect(ref.current?.getAttribute('style')).toBeNull();
	});

	it('accepts custom animation props without breaking rendering', () => {
		render(
			<Reveal delay={0.2} y={30} duration={0.8} viewportMargin="-10px">
				<p>Custom timing</p>
			</Reveal>,
		);
		expect(screen.getByText('Custom timing')).toBeInTheDocument();
	});
});
