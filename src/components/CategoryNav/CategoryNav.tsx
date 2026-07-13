import { useCallback, useEffect, useRef, useState, type ComponentType, type ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

export interface CategoryNavItem {
	key: string;
	label: string;
	icon?: ComponentType<{ className?: string }>;
	targetId?: string;
	count?: number;
	onClick?: () => void;
}

const wrapperVariants = cva('w-full', {
	variants: {
		sticky: {
			true: 'sticky top-0 z-30 backdrop-blur supports-[backdrop-filter]:bg-[var(--ds-bg)]/85 bg-[var(--ds-bg)]',
			false: '',
		},
		bordered: {
			true: 'border-b border-[var(--ds-border)]',
			false: '',
		},
	},
	defaultVariants: { sticky: false, bordered: true },
});

export interface CategoryNavProps extends VariantProps<typeof wrapperVariants> {
	items: CategoryNavItem[];
	className?: string;
	activeKey?: string;
	'aria-label'?: string;
	endSlot?: ReactNode;
}

export function CategoryNav({
	items,
	className,
	activeKey,
	sticky,
	bordered,
	endSlot,
	'aria-label': ariaLabel = 'Sections',
}: CategoryNavProps) {
	const [spyKey, setSpyKey] = useState<string | undefined>(items[0]?.key);
	const trackRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		const targets = items
			.map((i) => (i.targetId ? { key: i.key, el: document.getElementById(i.targetId) } : null))
			.filter((x): x is { key: string; el: HTMLElement } => Boolean(x?.el));
		if (targets.length === 0) return;

		const observer = new IntersectionObserver(
			(entries) => {
				const visible = entries
					.filter((e) => e.isIntersecting)
					.sort((a, b) => b.intersectionRatio - a.intersectionRatio);
				if (visible[0]) {
					const match = targets.find((t) => t.el === visible[0].target);
					if (match) setSpyKey(match.key);
				}
			},
			{ rootMargin: '-30% 0px -55% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] },
		);
		targets.forEach((t) => observer.observe(t.el));
		return () => observer.disconnect();
	}, [items]);

	const handleClick = useCallback((item: CategoryNavItem) => {
		item.onClick?.();
		if (item.targetId) {
			const el = document.getElementById(item.targetId);
			if (el) {
				const top = el.getBoundingClientRect().top + window.scrollY - 96;
				window.scrollTo({ top, behavior: 'smooth' });
			}
		}
	}, []);

	const current = activeKey ?? spyKey;

	return (
		<div className={cn(wrapperVariants({ sticky, bordered }), className)}>
			<div className="mx-auto flex w-full max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
				<nav
					ref={trackRef}
					aria-label={ariaLabel}
					className="no-scrollbar flex-1 overflow-x-auto"
				>
					<ul className="flex items-stretch gap-1 py-3">
						{items.map((item) => {
							const Icon = item.icon;
							const active = item.key === current;
							return (
								<li key={item.key} className="shrink-0">
									<button
										type="button"
										onClick={() => handleClick(item)}
										aria-current={active ? 'true' : undefined}
										className={cn(
											'group flex flex-col items-center gap-1 rounded-[var(--ds-radius-md)] px-3 py-2 text-xs font-medium transition',
											'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ds-ring)] focus-visible:ring-offset-1',
											active
												? 'text-[var(--ds-brand-700)]'
												: 'text-[var(--ds-text-muted)] hover:text-[var(--ds-text)]',
										)}
									>
										<span className="flex items-center gap-1.5">
											{Icon && (
												<Icon
													className={cn(
														'h-4 w-4 transition',
														active && 'text-[var(--ds-brand-600)]',
													)}
												/>
											)}
											<span className="whitespace-nowrap">{item.label}</span>
											{typeof item.count === 'number' && (
												<span
													className={cn(
														'rounded-full px-1.5 text-[0.625rem] font-semibold leading-4',
														active
															? 'bg-[var(--ds-brand-100)] text-[var(--ds-brand-700)]'
															: 'bg-[var(--ds-surface-muted)] text-[var(--ds-text-muted)]',
													)}
												>
													{item.count}
												</span>
											)}
										</span>
										<span
											aria-hidden="true"
											className={cn(
												'h-0.5 w-full rounded-full transition',
												active ? 'bg-[var(--ds-brand-600)]' : 'bg-transparent',
											)}
										/>
									</button>
								</li>
							);
						})}
					</ul>
				</nav>
				{endSlot && <div className="shrink-0">{endSlot}</div>}
			</div>
		</div>
	);
}
