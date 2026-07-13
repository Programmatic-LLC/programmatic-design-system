import type { HTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface SpinnerProps extends HTMLAttributes<HTMLSpanElement> {
	size?: 'sm' | 'md' | 'lg';
	label?: string;
}

const sizeClass: Record<NonNullable<SpinnerProps['size']>, string> = {
	sm: 'h-4 w-4',
	md: 'h-6 w-6',
	lg: 'h-10 w-10',
};

export function Spinner({
	size = 'md',
	label = 'Loading',
	className,
	...props
}: SpinnerProps) {
	return (
		<span
			role="status"
			aria-live="polite"
			className={cn('inline-flex text-[var(--ds-brand-600)]', className)}
			{...props}
		>
			<Loader2 className={cn(sizeClass[size], 'animate-spin')} aria-hidden="true" />
			<span className="sr-only">{label}</span>
		</span>
	);
}
