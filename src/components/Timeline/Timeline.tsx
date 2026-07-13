import { Children, isValidElement, type HTMLAttributes, type ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { cn } from '../../utils/cn';

export interface TimelineProps extends HTMLAttributes<HTMLOListElement> {
	gap?: 'sm' | 'md' | 'lg';
	animate?: boolean;
}

const gapClass: Record<NonNullable<TimelineProps['gap']>, string> = {
	sm: 'gap-y-3',
	md: 'gap-y-5',
	lg: 'gap-y-8',
};

export function Timeline({
	gap = 'md',
	animate = true,
	className,
	children,
	...props
}: TimelineProps) {
	const itemArray = Children.toArray(children).filter(isValidElement);
	const total = itemArray.length;

	return (
		<ol
			className={cn('relative flex flex-col', gapClass[gap], className)}
			{...props}
		>
			{itemArray.map((child, index) => (
				<TimelineRow
					key={child.key ?? index}
					index={index}
					isLast={index === total - 1}
					animate={animate}
				>
					{child}
				</TimelineRow>
			))}
		</ol>
	);
}

interface TimelineRowProps {
	index: number;
	isLast: boolean;
	animate: boolean;
	children: ReactNode;
}

function TimelineRow({ index, isLast, animate, children }: TimelineRowProps) {
	const reduceMotion = useReducedMotion();
	const shouldAnimate = animate && !reduceMotion;

	const anim = shouldAnimate
		? {
			initial: { opacity: 0, y: 12 },
			whileInView: { opacity: 1, y: 0 },
			viewport: { once: true, margin: '-40px' as const },
			transition: { duration: 0.42, ease: 'easeOut' as const, delay: Math.min(index * 0.04, 0.2) },
		}
		: { initial: false, animate: false };

	return (
		<motion.li {...anim} className="relative">
			{!isLast && (
				<span
					aria-hidden="true"
					className="absolute left-5 top-12 bottom-0 w-px bg-[var(--ds-border)] -translate-x-1/2"
				/>
			)}
			{children}
		</motion.li>
	);
}

export interface TimelineItemProps extends HTMLAttributes<HTMLDivElement> {
	marker: ReactNode;
	state?: 'active' | 'muted' | 'completed';
	accessory?: ReactNode;
	onSelect?: () => void;
	selectLabel?: string;
	highlighted?: boolean;
	children?: ReactNode;
}

export function TimelineItem({
	marker,
	state = 'active',
	accessory,
	onSelect,
	selectLabel,
	highlighted,
	className,
	children,
	...props
}: TimelineItemProps) {
	const markerClasses = cn(
		'relative z-10 grid h-10 w-10 shrink-0 place-items-center rounded-full text-sm font-bold shadow-[0_2px_8px_rgba(15,23,42,0.18)] ring-4 ring-[var(--ds-surface)] transition-colors',
		state === 'active' && 'bg-[var(--ds-brand-600)] text-[var(--ds-text-on-brand)]',
		state === 'muted' && 'bg-[var(--ds-surface-muted)] text-[var(--ds-text-subtle)]',
		state === 'completed' && 'bg-[var(--ds-brand-700)] text-[var(--ds-text-on-brand)]',
	);

	const bodyClasses = cn(
		'min-w-0 flex-1 rounded-[var(--ds-radius-lg)] transition-all',
		onSelect && 'cursor-pointer hover:bg-[var(--ds-surface-subtle)]',
		highlighted && 'ring-2 ring-[var(--ds-brand-500)] ring-offset-2 ring-offset-[var(--ds-bg)]',
		state === 'muted' && 'opacity-60',
	);

	const inner = (
		<div className="flex min-w-0 items-start gap-4" {...props}>
			<div className={markerClasses} aria-hidden="true">
				{marker}
			</div>
			<div className={cn(bodyClasses, className)}>{children}</div>
			{accessory && <div className="shrink-0">{accessory}</div>}
		</div>
	);

	if (onSelect) {
		return (
			<button
				type="button"
				onClick={onSelect}
				aria-label={selectLabel}
				className="block w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ds-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ds-bg)] rounded-[var(--ds-radius-lg)]"
			>
				{inner}
			</button>
		);
	}

	return inner;
}
