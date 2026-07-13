import { forwardRef, type HTMLAttributes, type InputHTMLAttributes, type ReactNode } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface FilterToolbarProps extends HTMLAttributes<HTMLDivElement> {
	children?: ReactNode;
	notice?: ReactNode;
	bare?: boolean;
}

export function FilterToolbar({
	children,
	notice,
	bare = false,
	className,
	...rest
}: FilterToolbarProps) {
	return (
		<div
			className={cn(
				!bare &&
					'rounded-[var(--ds-radius-xl)] bg-[var(--ds-surface)] p-2 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_12px_32px_-16px_rgba(15,23,42,0.18)] ring-1 ring-[var(--ds-border)]/60 sm:p-2.5',
				className,
			)}
			{...rest}
		>
			<div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-2">
				{children}
			</div>
			{notice && <div className="mt-2 px-1">{notice}</div>}
		</div>
	);
}

export function FilterToolbarPrimary({
	className,
	children,
	...rest
}: HTMLAttributes<HTMLDivElement>) {
	return (
		<div className={cn('min-w-0 flex-1', className)} {...rest}>
			{children}
		</div>
	);
}

export function FilterToolbarActions({
	className,
	children,
	...rest
}: HTMLAttributes<HTMLDivElement>) {
	return (
		<div
			className={cn(
				'flex shrink-0 flex-wrap items-center gap-2 md:border-l md:border-[var(--ds-border)] md:pl-2',
				className,
			)}
			{...rest}
		>
			{children}
		</div>
	);
}

export interface FilterSearchInputProps
	extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'onChange'> {
	value?: string;
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
	onClear?: () => void;
	icon?: ReactNode;
}

export const FilterSearchInput = forwardRef<HTMLInputElement, FilterSearchInputProps>(
	function FilterSearchInput(
		{ icon, className, placeholder = 'Search…', value, onChange, onClear, ...rest },
		ref,
	) {
		const hasValue = typeof value === 'string' && value.length > 0;
		const handleClear = () => {
			if (onClear) {
				onClear();
				return;
			}
			if (onChange) {
				const event = {
					target: { value: '' },
					currentTarget: { value: '' },
				} as React.ChangeEvent<HTMLInputElement>;
				onChange(event);
			}
		};

		return (
			<div className="group/search relative">
				<span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-[var(--ds-text-subtle)] transition-colors group-focus-within/search:text-[var(--ds-brand-600)]">
					{icon ?? <Search className="h-5 w-5" />}
				</span>
				<input
					ref={ref}
					type="text"
					placeholder={placeholder}
					aria-label={placeholder || 'Search'}
					value={value}
					onChange={onChange}
					className={cn(
						'h-12 w-full rounded-[var(--ds-radius-md)] border border-transparent bg-[var(--ds-surface-muted)] pl-12 pr-10 text-[0.9375rem] text-[var(--ds-text)] placeholder:text-[var(--ds-text-subtle)] transition-[background-color,border-color,box-shadow] duration-200 focus:border-[var(--ds-brand-600)] focus:bg-[var(--ds-surface)] focus:outline-none focus:ring-4 focus:ring-[var(--ds-brand-600)]/15',
						className,
					)}
					{...rest}
				/>
				{hasValue && (
					<button
						type="button"
						onClick={handleClear}
						aria-label="Clear search"
						className="absolute inset-y-0 right-2 my-auto inline-flex h-7 w-7 items-center justify-center rounded-full text-[var(--ds-text-subtle)] transition-colors hover:bg-[var(--ds-border)] hover:text-[var(--ds-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ds-ring)]"
					>
						<X className="h-4 w-4" />
					</button>
				)}
			</div>
		);
	},
);

export interface FilterButtonProps extends HTMLAttributes<HTMLButtonElement> {
	activeCount?: number;
	label?: ReactNode;
	icon?: ReactNode;
	compact?: boolean;
	brandColor?: string;
	onClick?: () => void;
}

export function FilterButton({
	activeCount = 0,
	label = 'Filters',
	icon,
	compact = false,
	brandColor,
	className,
	style,
	onClick,
	...rest
}: FilterButtonProps) {
	const isActive = activeCount > 0;
	const baseLabel = typeof label === 'string' ? label : 'Filters';
	const useBrand = isActive && !!brandColor;
	return (
		<button
			type="button"
			onClick={onClick}
			aria-label={isActive ? `${baseLabel}, ${activeCount} active` : baseLabel}
			className={cn(
				'relative inline-flex h-11 items-center gap-2 rounded-[var(--ds-radius-md)] px-3.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ds-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ds-surface)]',
				isActive
					? 'text-[var(--ds-text-on-brand)]'
					: 'bg-transparent text-[var(--ds-text)] hover:bg-[var(--ds-surface-muted)]',
				isActive && !brandColor && 'bg-[var(--ds-brand-600)] hover:bg-[var(--ds-brand-700)]',
				compact && 'w-11 justify-center px-0',
				className,
			)}
			style={useBrand ? { backgroundColor: brandColor, ...style } : style}
			{...rest}
		>
			{icon ?? <SlidersHorizontal className="h-4 w-4" />}
			{!compact && label}
			{isActive &&
				(compact ? (
					<span
						aria-hidden="true"
						className="absolute -right-1.5 -top-1.5 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-[var(--ds-brand-700)] px-1.5 text-[0.6875rem] font-bold leading-none text-[var(--ds-text-on-brand)] shadow-sm ring-2 ring-white"
						style={useBrand ? { backgroundColor: brandColor } : undefined}
					>
						{activeCount}
					</span>
				) : (
					<span
						aria-hidden="true"
						className="ml-0.5 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-[var(--ds-surface)]/25 px-1.5 text-xs font-bold text-[var(--ds-text-on-brand)]"
					>
						{activeCount}
					</span>
				))}
		</button>
	);
}

export interface ActiveFilterChipProps extends HTMLAttributes<HTMLButtonElement> {
	label: ReactNode;
	onRemove: () => void;
}

export function ActiveFilterChip({ label, onRemove, className, ...rest }: ActiveFilterChipProps) {
	return (
		<button
			type="button"
			onClick={onRemove}
			className={cn(
				'group/chip inline-flex items-center gap-1.5 rounded-full border border-[var(--ds-border)] bg-[var(--ds-surface)] py-1 pl-3 pr-1.5 text-sm font-medium text-[var(--ds-text)] transition-colors hover:border-[var(--ds-brand-600)] hover:text-[var(--ds-brand-700)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ds-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ds-bg)]',
				className,
			)}
			aria-label={`Remove ${typeof label === 'string' ? label : ''} filter`}
			{...rest}
		>
			<span>{label}</span>
			<span
				aria-hidden="true"
				className="grid h-5 w-5 place-items-center rounded-full bg-[var(--ds-surface-muted)] text-[var(--ds-text-muted)] transition-colors group-hover/chip:bg-[var(--ds-brand-600)] group-hover/chip:text-[var(--ds-text-on-brand)]"
			>
				<X className="h-3 w-3" strokeWidth={2.5} />
			</span>
		</button>
	);
}
