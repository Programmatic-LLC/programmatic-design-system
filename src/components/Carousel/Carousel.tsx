import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

const trackVariants = cva('flex pb-4', {
	variants: {
		gap: {
			sm: 'gap-3',
			md: 'gap-4 sm:gap-5',
			lg: 'gap-5 sm:gap-6',
		},
		snap: {
			true: 'snap-x snap-mandatory',
			false: '',
		},
	},
	defaultVariants: { gap: 'md', snap: true },
});

export interface CarouselProps extends VariantProps<typeof trackVariants> {
	children: ReactNode;
	className?: string;
	controls?: boolean;
	edgeFade?: boolean;
	'aria-label'?: string;
}

export function Carousel({
	children,
	className,
	gap,
	snap = true,
	controls = true,
	edgeFade = true,
	'aria-label': ariaLabel,
}: CarouselProps) {
	const trackRef = useRef<HTMLDivElement | null>(null);
	const [canLeft, setCanLeft] = useState(false);
	const [canRight, setCanRight] = useState(false);

	const update = useCallback(() => {
		const el = trackRef.current;
		if (!el) return;
		const maxScroll = el.scrollWidth - el.clientWidth;
		setCanLeft(el.scrollLeft > 4);
		setCanRight(el.scrollLeft < maxScroll - 4);
	}, []);

	useEffect(() => {
		const el = trackRef.current;
		if (!el) return;
		update();
		el.addEventListener('scroll', update, { passive: true });
		const ro = new ResizeObserver(update);
		ro.observe(el);
		return () => {
			el.removeEventListener('scroll', update);
			ro.disconnect();
		};
	}, [update]);

	const scrollBy = useCallback((direction: 1 | -1) => {
		const el = trackRef.current;
		if (!el) return;
		const amount = Math.max(280, el.clientWidth * 0.85);
		el.scrollBy({ left: amount * direction, behavior: 'smooth' });
	}, []);

	return (
		<div className={cn('group relative -mx-4 sm:-mx-6 lg:-mx-8', className)}>
			<div
				ref={trackRef}
				role="region"
				aria-label={ariaLabel}
				className="no-scrollbar overflow-x-auto px-4 sm:px-6 lg:px-8"
			>
				<div className={cn(trackVariants({ gap, snap }))}>
					{snap ? wrapChildrenForSnap(children) : children}
				</div>
			</div>

			{edgeFade && (
				<>
					<div
						aria-hidden="true"
						className={cn(
							'pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-[var(--ds-bg)] to-transparent transition-opacity duration-200 sm:w-16 lg:w-20',
							canLeft ? 'opacity-100' : 'opacity-0',
						)}
					/>
					<div
						aria-hidden="true"
						className={cn(
							'pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-[var(--ds-bg)] to-transparent transition-opacity duration-200 sm:w-16 lg:w-20',
							canRight ? 'opacity-100' : 'opacity-0',
						)}
					/>
				</>
			)}

			{controls && (
				<>
					<button
						type="button"
						aria-label="Scroll left"
						onClick={() => scrollBy(-1)}
						disabled={!canLeft}
						className={cn(
							'absolute left-2 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--ds-border)] bg-[var(--ds-surface)] text-[var(--ds-text)] shadow-md transition lg:flex',
							'opacity-0 group-hover:opacity-100 focus-visible:opacity-100',
							'hover:scale-105 disabled:pointer-events-none disabled:opacity-0',
						)}
					>
						<ChevronLeft className="h-5 w-5" />
					</button>
					<button
						type="button"
						aria-label="Scroll right"
						onClick={() => scrollBy(1)}
						disabled={!canRight}
						className={cn(
							'absolute right-2 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--ds-border)] bg-[var(--ds-surface)] text-[var(--ds-text)] shadow-md transition lg:flex',
							'opacity-0 group-hover:opacity-100 focus-visible:opacity-100',
							'hover:scale-105 disabled:pointer-events-none disabled:opacity-0',
						)}
					>
						<ChevronRight className="h-5 w-5" />
					</button>
				</>
			)}
		</div>
	);
}

function wrapChildrenForSnap(children: ReactNode) {
	const arr = Array.isArray(children) ? children : [children];
	return arr.map((child, i) => (
		<div key={(child as { key?: string })?.key ?? i} className="flex snap-start">
			{child}
		</div>
	));
}
