import { forwardRef, type ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { cn } from '../../utils/cn';

export interface RevealProps {
	children: ReactNode;
	delay?: number;
	y?: number;
	duration?: number;
	viewportMargin?: string;
	className?: string;
}

export const Reveal = forwardRef<HTMLDivElement, RevealProps>(function Reveal(
	{ children, delay = 0, y = 14, duration = 0.42, viewportMargin = '-40px', className },
	ref,
) {
	const reduceMotion = useReducedMotion();
	if (reduceMotion) {
		return (
			<div ref={ref} className={cn(className)}>
				{children}
			</div>
		);
	}
	return (
		<motion.div
			ref={ref}
			initial={{ opacity: 0, y }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, margin: viewportMargin }}
			transition={{ duration, ease: 'easeOut', delay }}
			className={cn(className)}
		>
			{children}
		</motion.div>
	);
});
