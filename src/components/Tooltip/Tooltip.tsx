'use client';

import {
	cloneElement,
	useEffect,
	useId,
	useState,
	type ReactElement,
	type ReactNode,
} from 'react';
import { cn } from '../../utils/cn';

export interface TooltipProps {
	content: ReactNode;
	children: ReactElement<{ 'aria-describedby'?: string }>;
	className?: string;
}

export function Tooltip({ content, children, className }: TooltipProps) {
	const [open, setOpen] = useState(false);
	const tooltipId = useId();

	useEffect(() => {
		if (!open) return;
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Escape') setOpen(false);
		};
		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [open]);

	return (
		<span
			className={cn('relative inline-flex', className)}
			onMouseEnter={() => setOpen(true)}
			onMouseLeave={() => setOpen(false)}
			onFocus={() => setOpen(true)}
			onBlur={() => setOpen(false)}
		>
			{cloneElement(children, { 'aria-describedby': tooltipId })}
			<span
				role="tooltip"
				id={tooltipId}
				className={cn(
					'absolute left-0 top-full z-20 w-64 pt-2 transition-opacity',
					open ? 'opacity-100' : 'pointer-events-none invisible opacity-0',
				)}
			>
				<span className="block rounded-[var(--ds-radius-md)] bg-gray-900 p-3 text-xs text-white shadow-lg">
					{content}
				</span>
			</span>
		</span>
	);
}
