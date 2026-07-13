import type { HTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
	shimmer?: boolean;
}

export function Skeleton({ shimmer = true, className, ...props }: SkeletonProps) {
	return (
		<div
			aria-hidden="true"
			className={cn(
				'relative isolate overflow-hidden rounded-[var(--ds-radius-md)] bg-[var(--ds-surface-muted)]',
				!shimmer && 'animate-pulse',
				shimmer &&
					"after:absolute after:inset-0 after:bg-gradient-to-r after:from-transparent after:via-white/55 after:to-transparent after:content-[''] after:[animation:ds-shimmer_1.8s_ease-in-out_infinite] motion-reduce:after:hidden motion-reduce:animate-pulse",
				className,
			)}
			{...props}
		/>
	);
}
