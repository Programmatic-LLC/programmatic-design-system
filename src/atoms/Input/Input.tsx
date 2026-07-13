import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../utils/cn';
import {
	Field,
	controlBase,
	controlInvalid,
	controlSizes,
	controlValid,
	type FieldSize,
} from '../Field';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
	label?: string;
	hint?: string;
	error?: string;
	size?: FieldSize;
	leftIcon?: ReactNode;
	rightIcon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
	{
		label,
		hint,
		error,
		size = 'md',
		leftIcon,
		rightIcon,
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

	return (
		<Field
			htmlFor={id}
			label={label}
			required={required}
			hint={hint}
			error={error}
			disabled={disabled}
			descriptionId={describedById}
		>
			<div className="relative">
				{leftIcon && (
					<span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-[var(--ds-text-subtle)]">
						{leftIcon}
					</span>
				)}
				<input
					ref={ref}
					id={id}
					required={required}
					disabled={disabled}
					aria-invalid={error ? true : undefined}
					aria-describedby={describedById}
					className={cn(
						controlBase,
						error ? controlInvalid : controlValid,
						controlSizes[size],
						leftIcon && 'pl-10',
						rightIcon && 'pr-10',
						className,
					)}
					{...props}
				/>
				{rightIcon && (
					<span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-[var(--ds-text-subtle)]">
						{rightIcon}
					</span>
				)}
			</div>
		</Field>
	);
});
