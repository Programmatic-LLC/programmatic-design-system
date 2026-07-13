import type { ComponentType, ReactNode } from 'react';
import { cn } from '../../utils/cn';

export interface ViewToggleOption<TValue extends string = string> {
	value: TValue;
	label?: ReactNode;
	icon?: ComponentType<{ className?: string }>;
	ariaLabel?: string;
}

export interface ViewToggleProps<TValue extends string = string> {
	value: TValue;
	onChange: (value: TValue) => void;
	options: ViewToggleOption<TValue>[];
	variant?: 'default' | 'overlay' | 'floating';
	iconOnly?: boolean;
	className?: string;
	ariaLabel?: string;
}

export function ViewToggle<TValue extends string = string>({
	value,
	onChange,
	options,
	variant = 'default',
	iconOnly = false,
	className,
	ariaLabel = 'Change view',
}: ViewToggleProps<TValue>) {
	const containerClasses =
		variant === 'overlay'
			? 'inline-flex items-center gap-1 rounded-[var(--ds-radius-md)] bg-[var(--ds-surface)] p-1 shadow-lg ring-1 ring-[var(--ds-border)]/60'
			: variant === 'floating'
				? 'inline-flex items-center gap-1 rounded-full bg-[var(--ds-surface)]/95 p-1.5 shadow-2xl ring-1 ring-black/5 backdrop-blur'
				: 'inline-flex items-center gap-0.5';

	const isFloating = variant === 'floating';

	const tablist = (
		<div role="tablist" aria-label={ariaLabel} className={cn(containerClasses, !isFloating && className)}>
			{options.map((opt) => {
				const isActive = opt.value === value;
				const Icon = opt.icon;
				const hasLabel = !iconOnly && opt.label != null;
				return (
					<button
						key={opt.value}
						type="button"
						role="tab"
						aria-selected={isActive}
						aria-label={opt.ariaLabel}
						onClick={() => onChange(opt.value)}
						className={cn(
							'inline-flex items-center gap-2 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ds-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ds-bg)]',
							isFloating
								? cn(
									'h-10 rounded-full text-sm',
									iconOnly
										? 'w-10 justify-center px-0'
										: 'px-3 sm:px-4',
								)
								: cn(
									'h-9 rounded-[var(--ds-radius-md)] text-sm px-3',
									iconOnly && 'w-9 justify-center px-0',
								),
							isActive
								? 'bg-[var(--ds-brand-600)] font-semibold text-[var(--ds-text-on-brand)]'
								: 'font-medium text-[var(--ds-text-muted)] hover:bg-[var(--ds-surface-muted)] hover:text-[var(--ds-text)]',
						)}
					>
						{Icon && <Icon className={cn(isFloating ? 'h-[18px] w-[18px]' : 'h-4 w-4')} />}
						{hasLabel && (
							<span className={isFloating ? 'hidden sm:inline' : undefined}>{opt.label}</span>
						)}
					</button>
				);
			})}
		</div>
	);

	if (isFloating) {
		return (
			<div
				className={cn(
					'pointer-events-none fixed bottom-6 left-1/2 z-40 -translate-x-1/2',
					'pb-[env(safe-area-inset-bottom)]',
					className,
				)}
			>
				<div className="pointer-events-auto">{tablist}</div>
			</div>
		);
	}

	return tablist;
}
