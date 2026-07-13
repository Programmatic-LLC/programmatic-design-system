import type { HTMLAttributes, ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { cn } from '../../utils/cn';
import { Spinner } from '../../atoms/Spinner';
import { Text } from '../../atoms/Text';

export interface LoadingStateProps extends HTMLAttributes<HTMLDivElement> {
	isLoading?: boolean;
	variant?: 'inline' | 'block' | 'page';
	label?: ReactNode;
}

export function LoadingState({
	isLoading = true,
	variant = 'block',
	label = 'Loading…',
	className,
	...props
}: LoadingStateProps) {
	const reduceMotion = useReducedMotion();
	if (!isLoading) return null;

	const fade = reduceMotion
		? { initial: false, animate: false }
		: {
			initial: { opacity: 0, y: 6 },
			animate: { opacity: 1, y: 0 },
			transition: { duration: 0.35, ease: 'easeOut' as const },
		};

	if (variant === 'inline') {
		return (
			<span
				className={cn('inline-flex items-center gap-2', className)}
				role="status"
				aria-live="polite"
				{...(props as HTMLAttributes<HTMLSpanElement>)}
			>
				<Spinner size="sm" label="" />
				{label !== null && (
					<Text as="span" variant="body-sm" color="muted">
						{label}
					</Text>
				)}
			</span>
		);
	}

	const inner = (
		<motion.div
			{...fade}
			className="flex flex-col items-center gap-3"
			role="status"
			aria-live="polite"
		>
			<span className="relative inline-flex">
				{!reduceMotion && (
					<motion.span
						aria-hidden="true"
						className="absolute inset-0 -m-2 rounded-full bg-[var(--ds-brand-500)]/15"
						initial={{ scale: 0.85, opacity: 0.7 }}
						animate={{ scale: 1.25, opacity: 0 }}
						transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut' }}
					/>
				)}
				<Spinner size={variant === 'page' ? 'lg' : 'md'} label="" />
			</span>
			{label !== null && (
				<Text variant="body-sm" color="muted">
					{label}
				</Text>
			)}
		</motion.div>
	);

	if (variant === 'page') {
		return (
			<div
				className={cn(
					'relative grid min-h-[60vh] w-full place-items-center overflow-hidden bg-gradient-to-b from-[var(--ds-brand-50)] via-[var(--ds-bg)] to-[var(--ds-bg)] px-6 py-16',
					className,
				)}
				{...props}
			>
				{inner}
			</div>
		);
	}

	return (
		<div
			className={cn('flex w-full items-center justify-center px-6 py-12', className)}
			{...props}
		>
			{inner}
		</div>
	);
}
