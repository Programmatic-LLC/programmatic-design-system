import { forwardRef, useId, type TextareaHTMLAttributes } from 'react';
import { cn } from '../../utils/cn';
import {
	Field,
	controlBase,
	controlInvalid,
	controlValid,
	type FieldSize,
} from '../Field';

export interface TextareaProps
	extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> {
	label?: string;
	hint?: string;
	error?: string;
	size?: FieldSize;
	resize?: 'none' | 'vertical' | 'both';
}

const resizeClasses: Record<NonNullable<TextareaProps['resize']>, string> = {
	none: 'resize-none',
	vertical: 'resize-y',
	both: 'resize',
};

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
	{
		label,
		hint,
		error,
		size = 'md',
		resize = 'vertical',
		rows = 4,
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
			<textarea
				ref={ref}
				id={id}
				rows={rows}
				required={required}
				disabled={disabled}
				aria-invalid={error ? true : undefined}
				aria-describedby={describedById}
				className={cn(
					controlBase,
					error ? controlInvalid : controlValid,
					'min-h-24 py-2.5',
					size === 'sm' ? 'px-3 text-sm' : 'px-3.5 text-base',
					resizeClasses[resize],
					className,
				)}
				{...props}
			/>
		</Field>
	);
});
