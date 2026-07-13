import type { HTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

export interface DividerProps extends HTMLAttributes<HTMLDivElement> {
	orientation?: 'horizontal' | 'vertical';
}

export function Divider({
	orientation = 'horizontal',
	className,
	...props
}: DividerProps) {
	return (
		<div
			role="separator"
			aria-orientation={orientation}
			className={cn(
				'bg-[var(--ds-border)]',
				orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px self-stretch',
				className,
			)}
			{...props}
		/>
	);
}
