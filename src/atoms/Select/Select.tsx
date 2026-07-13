import { forwardRef, useId, type ReactNode, type SelectHTMLAttributes } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../utils/cn';
import {
	Field,
	controlBase,
	controlInvalid,
	controlSizes,
	controlValid,
	type FieldSize,
} from '../Field';

export interface SelectOption {
	value: string;
	label: string;
	disabled?: boolean;
}

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
	label?: string;
	hint?: string;
	error?: string;
	size?: FieldSize;
	options?: SelectOption[];
	placeholder?: string;
	children?: ReactNode;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
	{
		label,
		hint,
		error,
		size = 'md',
		options,
		placeholder,
		required,
		disabled,
		id: idProp,
		className,
		children,
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
				<select
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
						'cursor-pointer appearance-none pr-10',
						className,
					)}
					{...props}
				>
					{placeholder && (
						<option value="" disabled>
							{placeholder}
						</option>
					)}
					{options
						? options.map((option) => (
							<option key={option.value} value={option.value} disabled={option.disabled}>
								{option.label}
							</option>
						))
						: children}
				</select>
				<ChevronDown
					className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--ds-text-subtle)]"
					aria-hidden="true"
				/>
			</div>
		</Field>
	);
});
