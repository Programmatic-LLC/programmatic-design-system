import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { cn } from '../../utils/cn';
import { BottomSheet } from '../BottomSheet';

export interface SortMenuOption {
	value: string;
	label: string;
	description?: string;
	disabled?: boolean;
}

export interface SortMenuProps {
	value: string;
	onChange: (value: string) => void;
	options: SortMenuOption[];
	isMobile?: boolean;
	label?: string;
	triggerLabel?: string;
	sheetTitle?: string;
	disabled?: boolean;
	className?: string;
}

export function SortMenu({
	value,
	onChange,
	options,
	isMobile = false,
	label = 'Sort',
	triggerLabel,
	sheetTitle = 'Sort by',
	disabled,
	className
}: SortMenuProps) {
	const [open, setOpen] = useState(false);
	const triggerRef = useRef<HTMLButtonElement>(null);
	const popoverRef = useRef<HTMLDivElement>(null);
	const labelId = useId();
	const reduceMotion = useReducedMotion();

	const current = options.find((o) => o.value === value);
	const buttonLabel = triggerLabel ?? current?.label ?? options[0]?.label ?? '';

	const close = useCallback(() => setOpen(false), []);

	useEffect(() => {
		if (!open || isMobile) return;
		const onPointer = (event: PointerEvent) => {
			const target = event.target as Node | null;
			if (!target) return;
			if (triggerRef.current?.contains(target)) return;
			if (popoverRef.current?.contains(target)) return;
			close();
		};
		const onKey = (event: KeyboardEvent) => {
			if (event.key === 'Escape') close();
		};
		window.addEventListener('pointerdown', onPointer);
		window.addEventListener('keydown', onKey);
		return () => {
			window.removeEventListener('pointerdown', onPointer);
			window.removeEventListener('keydown', onKey);
		};
	}, [open, isMobile, close]);

	const handleSelect = (next: string) => {
		if (next !== value) onChange(next);
		close();
	};

	return (
		<div className={cn('relative', className)}>
			<button
				ref={triggerRef}
				type="button"
				aria-haspopup="listbox"
				aria-expanded={open}
				aria-label={label}
				aria-labelledby={labelId}
				disabled={disabled}
				onClick={() => setOpen((prev) => !prev)}
				className={cn(
					'inline-flex h-10 items-center gap-2 rounded-[var(--ds-radius-md)] border border-[var(--ds-border)] bg-[var(--ds-surface)] px-3 text-sm font-medium text-[var(--ds-text)] transition-colors',
					'hover:border-[var(--ds-brand-700)] hover:text-[var(--ds-brand-700)]',
					'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ds-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ds-surface)]',
					disabled && 'cursor-not-allowed opacity-60 hover:border-[var(--ds-border)] hover:text-[var(--ds-text)]'
				)}
			>
				<span id={labelId} className="sr-only">{label}</span>
				<span aria-hidden="true" className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--ds-text-muted)]">
					Sort
				</span>
				<span className="text-sm font-semibold">{buttonLabel}</span>
				<ChevronDown
					className={cn(
						'h-4 w-4 text-[var(--ds-text-muted)] transition-transform',
						open && 'rotate-180'
					)}
					aria-hidden="true"
				/>
			</button>

			{!isMobile && (
				<AnimatePresence>
					{open && (
						<motion.div
							ref={popoverRef}
							role="listbox"
							aria-label={label}
							initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -4, scale: 0.98 }}
							animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
							exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -4, scale: 0.98 }}
							transition={reduceMotion ? { duration: 0.1 } : { type: 'spring', damping: 28, stiffness: 320 }}
							className="absolute right-0 z-50 mt-2 min-w-[200px] origin-top-right overflow-hidden rounded-[var(--ds-radius-lg)] bg-[var(--ds-surface)] py-1 shadow-[0_12px_32px_-12px_rgba(15,23,42,0.18)] ring-1 ring-[var(--ds-border)]"
						>
							{options.map((option) => (
								<SortOptionRow
									key={option.value}
									option={option}
									selected={option.value === value}
									onSelect={handleSelect}
								/>
							))}
						</motion.div>
					)}
				</AnimatePresence>
			)}

			{isMobile && (
				<BottomSheet isOpen={open} onClose={close} ariaLabel={sheetTitle} withBackdrop lockBodyScroll>
					<div className="px-5 pb-3 pt-2">
						<h2 className="text-base font-semibold text-[var(--ds-text)]">{sheetTitle}</h2>
					</div>
					<ul role="listbox" aria-label={label} className="pb-3">
						{options.map((option) => (
							<li key={option.value}>
								<SortOptionRow
									option={option}
									selected={option.value === value}
									onSelect={handleSelect}
									size="lg"
								/>
							</li>
						))}
					</ul>
				</BottomSheet>
			)}
		</div>
	);
}

interface SortOptionRowProps {
	option: SortMenuOption;
	selected: boolean;
	onSelect: (value: string) => void;
	size?: 'md' | 'lg';
}

function SortOptionRow({ option, selected, onSelect, size = 'md' }: SortOptionRowProps): ReactNode {
	return (
		<button
			type="button"
			role="option"
			aria-selected={selected}
			disabled={option.disabled}
			onClick={() => onSelect(option.value)}
			className={cn(
				'flex w-full items-center justify-between gap-3 text-left transition-colors',
				size === 'lg' ? 'px-5 py-3' : 'px-3 py-2',
				'hover:bg-[var(--ds-brand-50)] focus-visible:outline-none focus-visible:bg-[var(--ds-brand-50)] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--ds-ring)]',
				selected && 'text-[var(--ds-brand-700)]',
				option.disabled && 'cursor-not-allowed opacity-50 hover:bg-transparent'
			)}
		>
			<span className="flex min-w-0 flex-col">
				<span className={cn('font-medium', size === 'lg' ? 'text-base' : 'text-sm')}>{option.label}</span>
				{option.description && (
					<span className="text-xs text-[var(--ds-text-muted)]">{option.description}</span>
				)}
			</span>
			{selected && (
				<Check className="h-4 w-4 shrink-0 text-[var(--ds-brand-700)]" aria-hidden="true" />
			)}
		</button>
	);
}
