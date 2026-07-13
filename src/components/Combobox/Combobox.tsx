import {
	useEffect,
	useId,
	useRef,
	useState,
	type InputHTMLAttributes,
	type ReactNode,
	type Ref,
} from 'react';
import { cn } from '../../utils/cn';

export interface ComboboxRenderState {
	active: boolean;
}

export interface ComboboxProps<T> {
	value: string;
	onValueChange: (value: string) => void;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	items: T[];
	onSelect: (item: T) => void;
	getItemKey: (item: T, index: number) => string;
	renderItem: (item: T, state: ComboboxRenderState) => ReactNode;
	ariaLabel?: string;
	placeholder?: string;
	disabled?: boolean;
	className?: string;
	inputClassName?: string;
	listClassName?: string;
	startAdornment?: ReactNode;
	endAdornment?: ReactNode;
	emptyState?: ReactNode;
	inputRef?: Ref<HTMLInputElement>;
	inputProps?: Omit<
		InputHTMLAttributes<HTMLInputElement>,
		'value' | 'onChange' | 'role' | 'placeholder' | 'disabled' | 'aria-label'
	>;
}

export function Combobox<T>({
	value,
	onValueChange,
	open,
	onOpenChange,
	items,
	onSelect,
	getItemKey,
	renderItem,
	ariaLabel,
	placeholder,
	disabled,
	className,
	inputClassName,
	listClassName,
	startAdornment,
	endAdornment,
	emptyState,
	inputRef,
	inputProps,
}: ComboboxProps<T>) {
	const [activeIndex, setActiveIndex] = useState(-1);
	const wrapperRef = useRef<HTMLDivElement>(null);
	const listId = useId();

	const listOpen = open && (items.length > 0 || emptyState != null);
	const optionId = (index: number) => `${listId}-option-${index}`;

	useEffect(() => {
		setActiveIndex(-1);
	}, [items, open]);

	useEffect(() => {
		if (!open) return;
		const onPointerDown = (event: PointerEvent) => {
			const target = event.target as Node | null;
			if (!target) return;
			if (wrapperRef.current?.contains(target)) return;
			onOpenChange(false);
		};
		window.addEventListener('pointerdown', onPointerDown);
		return () => window.removeEventListener('pointerdown', onPointerDown);
	}, [open, onOpenChange]);

	const selectAt = (index: number) => {
		const item = items[index];
		if (!item) return;
		onSelect(item);
		onOpenChange(false);
	};

	const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		inputProps?.onKeyDown?.(event);
		if (event.defaultPrevented) return;

		switch (event.key) {
		case 'ArrowDown':
			event.preventDefault();
			if (!open) {
				onOpenChange(true);
				return;
			}
			if (items.length > 0) {
				setActiveIndex((prev) => (prev < items.length - 1 ? prev + 1 : prev));
			}
			break;
		case 'ArrowUp':
			event.preventDefault();
			if (open && items.length > 0) {
				setActiveIndex((prev) => (prev > 0 ? prev - 1 : -1));
			}
			break;
		case 'Enter':
			if (open && activeIndex >= 0) {
				event.preventDefault();
				selectAt(activeIndex);
			}
			break;
		case 'Escape':
			if (open) {
				event.preventDefault();
				onOpenChange(false);
			}
			break;
		case 'Tab':
			if (open) onOpenChange(false);
			break;
		}
	};

	return (
		<div ref={wrapperRef} className={cn('relative', className)}>
			<div className="relative">
				{startAdornment && (
					<span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">{startAdornment}</span>
				)}
				<input
					{...inputProps}
					ref={inputRef}
					type="text"
					role="combobox"
					value={value}
					placeholder={placeholder}
					disabled={disabled}
					aria-label={ariaLabel}
					aria-expanded={listOpen}
					aria-controls={listOpen ? listId : undefined}
					aria-autocomplete="list"
					aria-activedescendant={open && activeIndex >= 0 ? optionId(activeIndex) : undefined}
					onChange={(event) => onValueChange(event.target.value)}
					onKeyDown={handleKeyDown}
					className={cn(startAdornment && 'pl-10', endAdornment && 'pr-10', inputClassName)}
				/>
				{endAdornment && (
					<span className="absolute right-3 top-1/2 -translate-y-1/2">{endAdornment}</span>
				)}
			</div>
			{listOpen && (
				<div
					role="listbox"
					id={listId}
					aria-label={ariaLabel}
					className={cn(
						'absolute z-50 mt-1 max-h-64 w-full overflow-y-auto rounded-[var(--ds-radius-md)] bg-[var(--ds-surface)] py-1 shadow-[0_12px_32px_-12px_rgba(15,23,42,0.18)] ring-1 ring-[var(--ds-border)]',
						listClassName,
					)}
				>
					{items.length > 0
						? items.map((item, index) => {
							const active = index === activeIndex;
							return (
								<div
									key={getItemKey(item, index)}
									role="option"
									id={optionId(index)}
									aria-selected={active}
									onPointerDown={(event) => event.preventDefault()}
									onPointerEnter={() => setActiveIndex(index)}
									onClick={() => selectAt(index)}
									className={cn(
										'cursor-pointer',
										active && 'bg-[var(--ds-brand-50)]',
									)}
								>
									{renderItem(item, { active })}
								</div>
							);
						})
						: <div className="px-4 py-3 text-center text-sm text-[var(--ds-text-muted)]">{emptyState}</div>}
				</div>
			)}
		</div>
	);
}
