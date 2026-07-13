import {
	forwardRef,
	useEffect,
	useId,
	useRef,
	type InputHTMLAttributes,
	type MutableRefObject,
} from 'react';
import { Check, Minus } from 'lucide-react';
import { cn } from '../../utils/cn';
import type { FieldSize } from '../Field';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
	label?: string;
	hint?: string;
	error?: string;
	size?: FieldSize;
	indeterminate?: boolean;
}

const boxSizes: Record<FieldSize, string> = {
	sm: 'h-4 w-4',
	md: 'h-5 w-5',
};

const iconSizes: Record<FieldSize, string> = {
	sm: 'h-3 w-3',
	md: 'h-3.5 w-3.5',
};

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
	{
		label,
		hint,
		error,
		size = 'md',
		indeterminate = false,
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

	const innerRef = useRef<HTMLInputElement>(null);
	useEffect(() => {
		if (innerRef.current) innerRef.current.indeterminate = indeterminate;
	}, [indeterminate]);

	const assignRef = (node: HTMLInputElement | null) => {
		innerRef.current = node;
		if (typeof ref === 'function') ref(node);
		else if (ref) (ref as MutableRefObject<HTMLInputElement | null>).current = node;
	};

	const message = error ?? hint;

	return (
		<div className="flex flex-col gap-1.5">
			<label
				className={cn(
					'inline-flex items-center gap-2.5 select-none',
					disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer',
				)}
			>
				<span className={cn('relative inline-flex shrink-0', boxSizes[size])}>
					<input
						ref={assignRef}
						type="checkbox"
						id={id}
						required={required}
						disabled={disabled}
						aria-invalid={error ? true : undefined}
						aria-describedby={describedById}
						className={cn(
							'peer absolute inset-0 h-full w-full cursor-pointer appearance-none rounded-[var(--ds-radius-sm)] border bg-[var(--ds-surface)] transition-colors',
							'checked:border-[var(--ds-brand-600)] checked:bg-[var(--ds-brand-600)]',
							'indeterminate:border-[var(--ds-brand-600)] indeterminate:bg-[var(--ds-brand-600)]',
							'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ds-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ds-bg)]',
							'disabled:cursor-not-allowed',
							error ? 'border-[var(--ds-danger)]' : 'border-[var(--ds-border-strong)]',
							className,
						)}
						{...props}
					/>
					{indeterminate ? (
						<Minus
							className={cn(
								'pointer-events-none absolute inset-0 m-auto text-white',
								iconSizes[size],
							)}
							aria-hidden="true"
						/>
					) : (
						<Check
							className={cn(
								'pointer-events-none absolute inset-0 m-auto text-white opacity-0 peer-checked:opacity-100',
								iconSizes[size],
							)}
							aria-hidden="true"
						/>
					)}
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
