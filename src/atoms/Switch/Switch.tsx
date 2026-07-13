import { forwardRef, useId, type InputHTMLAttributes } from 'react';
import { cn } from '../../utils/cn';
import type { FieldSize } from '../Field';

export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
	label?: string;
	hint?: string;
	error?: string;
	size?: FieldSize;
}

const sizeMap: Record<FieldSize, { track: string; thumb: string; translate: string }> = {
	sm: { track: 'h-5 w-9', thumb: 'h-4 w-4', translate: 'peer-checked:translate-x-4' },
	md: { track: 'h-6 w-11', thumb: 'h-5 w-5', translate: 'peer-checked:translate-x-5' },
};

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(function Switch(
	{
		label,
		hint,
		error,
		size = 'md',
		required,
		disabled,
		id: idProp,
		className,
		...props
	},
	ref,
) {
	const reactId = useId();
	const id = idProp ?? reactId;
	const describedById = error || hint ? `${id}-desc` : undefined;
	const dims = sizeMap[size];
	const message = error ?? hint;

	return (
		<div className="flex flex-col gap-1.5">
			<label
				className={cn(
					'inline-flex items-center gap-3 select-none',
					disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer',
				)}
			>
				<span className={cn('relative inline-flex shrink-0 items-center', dims.track)}>
					<input
						ref={ref}
						type="checkbox"
						role="switch"
						id={id}
						required={required}
						disabled={disabled}
						aria-invalid={error ? true : undefined}
						aria-describedby={describedById}
						className={cn('peer sr-only', className)}
						{...props}
					/>
					<span
						className={cn(
							'absolute inset-0 rounded-full bg-[var(--ds-border-strong)] transition-colors',
							'peer-checked:bg-[var(--ds-brand-600)]',
							'peer-focus-visible:ring-2 peer-focus-visible:ring-[var(--ds-ring)] peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-[var(--ds-bg)]',
						)}
						aria-hidden="true"
					/>
					<span
						className={cn(
							'pointer-events-none absolute left-0.5 rounded-full bg-white shadow-sm transition-transform',
							dims.thumb,
							dims.translate,
						)}
						aria-hidden="true"
					/>
				</span>
				{label && (
					<span className="text-sm leading-snug text-[var(--ds-text)]">
						{label}
						{required && (
							<span className="ml-0.5 text-[var(--ds-danger)]" aria-hidden="true">
								*
							</span>
						)}
					</span>
				)}
			</label>
			{message && (
				<p
					id={describedById}
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
});
