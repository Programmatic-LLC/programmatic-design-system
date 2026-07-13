import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { cn } from '../../utils/cn';
import { Text } from '../../atoms/Text';

export interface SectionProps {
	title?: ReactNode;
	description?: ReactNode;
	eyebrow?: ReactNode;
	action?: ReactNode;
	headingLevel?: 'h2' | 'h3' | 'h4';
	animate?: boolean;
	className?: string;
	id?: string;
	'aria-label'?: string;
	'aria-labelledby'?: string;
	children?: ReactNode;
}

export function Section({
	title,
	description,
	eyebrow,
	action,
	headingLevel = 'h2',
	animate = true,
	className,
	id,
	children,
	...ariaProps
}: SectionProps) {
	const reduceMotion = useReducedMotion();
	const shouldAnimate = animate && !reduceMotion;

	return (
		<section
			id={id}
			className={cn(className)}
			aria-label={ariaProps['aria-label']}
			aria-labelledby={ariaProps['aria-labelledby']}
		>
			<motion.div
				{...(shouldAnimate
					? {
						initial: { opacity: 0, y: 18 },
						whileInView: { opacity: 1, y: 0 },
						viewport: { once: true, margin: '-60px' },
						transition: { duration: 0.5, ease: 'easeOut' as const },
					}
					: { initial: false, animate: false })}
				className="flex flex-col gap-4"
			>
				{(title || action || eyebrow) && (
					<header className="flex items-end justify-between gap-3">
						<div className="flex flex-col gap-1.5">
							{eyebrow && (
								<Text
									variant="overline"
									color="brand"
									className="tracking-[0.18em]"
								>
									{eyebrow}
								</Text>
							)}
							{title && (
								<Text
									variant={headingLevel}
									className="leading-tight tracking-tight"
								>
									{title}
								</Text>
							)}
							{description && (
								<Text variant="body-sm" color="muted">
									{description}
								</Text>
							)}
						</div>
						{action && <div className="shrink-0">{action}</div>}
					</header>
				)}
				{children}
			</motion.div>
		</section>
	);
}
