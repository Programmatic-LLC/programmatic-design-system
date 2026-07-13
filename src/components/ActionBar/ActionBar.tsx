import type { HTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

export interface ActionBarProps extends HTMLAttributes<HTMLDivElement> {
	align?: 'start' | 'center' | 'end' | 'between';
}

const alignClasses: Record<NonNullable<ActionBarProps['align']>, string> = {
	start: 'justify-start',
	center: 'justify-center',
	end: 'justify-end',
	between: 'justify-between',
};

export function ActionBar({
	align = 'start',
	className,
	children,
	...props
}: ActionBarProps) {
	return (
		<div
			className={cn(
				'flex flex-wrap items-center gap-3',
				alignClasses[align],
				className,
			)}
			{...props}
		>
			{children}
		</div>
	);
}
