import { isValidElement, type ElementType, type HTMLAttributes, type ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { cn } from '../../utils/cn';
import { Text } from '../../atoms/Text';

export interface EmptyStateProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
	icon?: ElementType | ReactNode;
	title: ReactNode;
	description?: ReactNode;
	action?: ReactNode;
	tone?: 'default' | 'error';
	headingLevel?: 'h1' | 'h2' | 'h3';
}

function renderIcon(icon: EmptyStateProps['icon']) {
	if (!icon) return null;
	if (isValidElement(icon)) return icon;
	const Icon = icon as ElementType;
	return <Icon className="h-8 w-8" aria-hidden="true" />;
}

export function EmptyState({
	icon,
	title,
	description,
	action,
	tone = 'default',
	headingLevel = 'h2',
	className,
	...props
}: EmptyStateProps) {
	const reduceMotion = useReducedMotion();
	const iconNode = renderIcon(icon);

	const stagger = reduceMotion
		? { initial: false, animate: false }
		: {
			initial: 'hidden' as const,
			animate: 'show' as const,
			variants: {
				hidden: {},
				show: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
			},
		};

	const item = reduceMotion
		? {}
		: {
			variants: {
				hidden: { opacity: 0, y: 10 },
				show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
			},
		};

	const badgeColors =
		tone === 'error'
			? 'bg-[var(--ds-danger-soft,#fee2e2)] text-[var(--ds-danger,#dc2626)] ring-1 ring-inset ring-[var(--ds-danger,#dc2626)]/15'
			: 'bg-[var(--ds-brand-100)] text-[var(--ds-brand-700)] ring-1 ring-inset ring-[var(--ds-brand-600)]/10';

	return (
		<div
			className={cn(
				'relative flex w-full flex-1 items-center justify-center overflow-hidden px-6 py-16 min-h-[60vh]',
				className,
			)}
			{...props}
		>
			<div
				aria-hidden="true"
				className={cn(
					'pointer-events-none absolute inset-0 -z-10',
					tone === 'error'
						? 'bg-[var(--ds-bg)]'
						: 'bg-gradient-to-b from-[var(--ds-brand-50)] via-[var(--ds-bg)] to-[var(--ds-bg)] opacity-60',
				)}
			/>
			<motion.div
				{...stagger}
				className="flex max-w-md flex-col items-center gap-5 text-center"
			>
				{iconNode && (
					<motion.div
						{...item}
						className={cn(
							'grid h-20 w-20 place-items-center rounded-full shadow-sm',
							badgeColors,
						)}
					>
						{iconNode}
					</motion.div>
				)}
				<motion.div {...item} className="flex flex-col gap-2">
					<Text variant={headingLevel} as={headingLevel} className="tracking-tight">
						{title}
					</Text>
					{description && (
						<Text variant="body" color="muted">
							{description}
						</Text>
					)}
				</motion.div>
				{action && (
					<motion.div {...item} className="pt-1">
						{action}
					</motion.div>
				)}
			</motion.div>
		</div>
	);
}
