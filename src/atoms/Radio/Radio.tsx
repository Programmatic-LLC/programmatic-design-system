import {
	createContext,
	useContext,
	useId,
	useState,
	type InputHTMLAttributes,
	type ReactNode,
} from 'react';
import { cn } from '../../utils/cn';
import type { FieldSize } from '../Field';

interface RadioGroupContextValue {
	name: string;
	value?: string;
	onChange: (value: string) => void;
	size: FieldSize;
	disabled?: boolean;
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

const boxSizes: Record<FieldSize, string> = {
	sm: 'h-4 w-4',
	md: 'h-5 w-5',
};

const dotSizes: Record<FieldSize, string> = {
	sm: 'h-1.5 w-1.5',
	md: 'h-2 w-2',
};

export interface RadioProps
	extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type' | 'value'> {
	label?: string;
	value: string;
	size?: FieldSize;
}

export function Radio({
	label,
	value,
	size: sizeProp,
	name: nameProp,
	checked: checkedProp,
	disabled: disabledProp,
	onChange,
	id: idProp,
	className,
	...props
}: RadioProps) {
	const group = useContext(RadioGroupContext);
	const reactId = useId();
	const id = idProp ?? reactId;

	const size = sizeProp ?? group?.size ?? 'md';
	const name = nameProp ?? group?.name;
	const disabled = disabledProp ?? group?.disabled;
	const checked = group ? group.value === value : checkedProp;

	return (
		<label
			className={cn(
				'inline-flex items-center gap-2.5 select-none',
				disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer',
			)}
		>
			<span className={cn('relative inline-flex shrink-0', boxSizes[size])}>
				<input
					type="radio"
					id={id}
					name={name}
					value={value}
					checked={checked}
					disabled={disabled}
					onChange={(event) => {
						group?.onChange(value);
						onChange?.(event);
					}}
					className={cn(
						'peer absolute inset-0 h-full w-full cursor-pointer appearance-none rounded-full border bg-[var(--ds-surface)] transition-colors',
						'border-[var(--ds-border-strong)] checked:border-[var(--ds-brand-600)]',
						'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ds-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ds-bg)]',
						'disabled:cursor-not-allowed',
						className,
					)}
					{...props}
				/>
				<span
					className={cn(
						'pointer-events-none absolute inset-0 m-auto scale-0 rounded-full bg-[var(--ds-brand-600)] transition-transform peer-checked:scale-100',
						dotSizes[size],
					)}
					aria-hidden="true"
				/>
			</span>
			{label && <span className="text-sm leading-snug text-[var(--ds-text)]">{label}</span>}
		</label>
	);
}

export interface RadioOption {
	value: string;
	label: string;
	disabled?: boolean;
}

export interface RadioGroupProps {
	name?: string;
	value?: string;
	defaultValue?: string;
	onValueChange?: (value: string) => void;
	label?: string;
	hint?: string;
	error?: string;
	size?: FieldSize;
	disabled?: boolean;
	orientation?: 'vertical' | 'horizontal';
	options?: RadioOption[];
	className?: string;
	children?: ReactNode;
}

export function RadioGroup({
	name: nameProp,
	value,
	defaultValue,
	onValueChange,
	label,
	hint,
	error,
	size = 'md',
	disabled,
	orientation = 'vertical',
	options,
	className,
	children,
}: RadioGroupProps) {
	const reactId = useId();
	const name = nameProp ?? reactId;
	const isControlled = value !== undefined;
	const [internalValue, setInternalValue] = useState(defaultValue ?? '');
	const current = isControlled ? value : internalValue;
	const message = error ?? hint;

	const handleChange = (next: string) => {
		if (!isControlled) setInternalValue(next);
		onValueChange?.(next);
	};

	return (
		<RadioGroupContext.Provider value={{ name, value: current, onChange: handleChange, size, disabled }}>
			<fieldset className={cn('flex flex-col gap-2', className)}>
				{label && (
					<legend className="mb-0.5 text-sm font-medium text-[var(--ds-text)]">{label}</legend>
				)}
				<div
					className={cn(
						'flex gap-3',
						orientation === 'vertical' ? 'flex-col' : 'flex-row flex-wrap',
					)}
				>
					{options
						? options.map((option) => (
							<Radio
								key={option.value}
								value={option.value}
								label={option.label}
								disabled={option.disabled}
							/>
						))
						: children}
				</div>
				{message && (
					<p className={cn('text-sm', error ? 'text-[var(--ds-danger)]' : 'text-[var(--ds-text-muted)]')}>
						{message}
					</p>
				)}
			</fieldset>
		</RadioGroupContext.Provider>
	);
}
