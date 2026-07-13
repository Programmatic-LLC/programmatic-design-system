import type { ReactNode } from 'react';
import { cn } from '../../utils/cn';

export interface FieldProps {
	htmlFor?: string;
	label?: string;
	required?: boolean;
	hint?: string;
	error?: string;
	disabled?: boolean;
	descriptionId?: string;
	className?: string;
	children: ReactNode;
}

export function Field({
	htmlFor,
	label,
	required,
	hint,
	error,
	disabled,
	descriptionId,
	className,
	children,
}: FieldProps) {
	const message = error ?? hint;

	return (
		<div className={cn('flex flex-col gap-1.5', className)}>
			{label && (
				<label
					htmlFor={htmlFor}
					className={cn(
						'text-sm font-medium text-[var(--ds-text)]',
						disabled && 'opacity-60',
					)}
				>
					{label}
					{required && (
						<span className="ml-0.5 text-[var(--ds-danger)]" aria-hidden="true">
							*
						</span>
					)}
				</label>
			)}
			{children}
			{message && (
				<p
					id={descriptionId}
					role={error ? 'alert' : undefined}
					className={cn(
						'text-sm',
						error ? 'text-[var(--ds-danger)]' : 'text-[var(--ds-text-muted)]',
					)}
				>
					{message}
				</p>
			)}
		</div>
	);
}
