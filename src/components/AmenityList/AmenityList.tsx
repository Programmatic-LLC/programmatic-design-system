import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../../utils/cn';

export interface AmenityItem {
	icon?: ReactNode;
	label: string;
	description?: string;
	key?: string;
}

export interface AmenityListProps extends HTMLAttributes<HTMLElement> {
	items: AmenityItem[];
	variant?: 'tiles' | 'chips' | 'list';
	columns?: 2 | 3 | 4;
}

const columnClasses: Record<NonNullable<AmenityListProps['columns']>, string> = {
	2: 'grid-cols-2',
	3: 'grid-cols-2 md:grid-cols-3',
	4: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
};

export function AmenityList({
	items,
	variant = 'tiles',
	columns = 3,
	className,
	...props
}: AmenityListProps) {
	if (items.length === 0) return null;

	if (variant === 'chips') {
		return (
			<div className={cn('flex flex-wrap gap-2', className)} {...props}>
				{items.map((item, index) => (
					<span
						key={item.key ?? index}
						className="inline-flex items-center gap-1.5 rounded-full border border-[var(--ds-border)] bg-[var(--ds-surface)] px-3 py-1.5 text-sm text-[var(--ds-text)]"
					>
						{item.icon && (
							<span className="text-[var(--ds-brand-600)]" aria-hidden="true">
								{item.icon}
							</span>
						)}
						<span>{item.label}</span>
					</span>
				))}
			</div>
		);
	}

	if (variant === 'list') {
		return (
			<ul className={cn('flex flex-col gap-3', className)} {...props}>
				{items.map((item, index) => (
					<li
						key={item.key ?? index}
						className="flex items-center gap-3 text-sm text-[var(--ds-text)]"
					>
						{item.icon && (
							<span className="text-[var(--ds-brand-600)]" aria-hidden="true">
								{item.icon}
							</span>
						)}
						<span>{item.label}</span>
						{item.description && (
							<span className="text-[var(--ds-text-muted)]">· {item.description}</span>
						)}
					</li>
				))}
			</ul>
		);
	}

	return (
		<ul
			className={cn('grid gap-x-6 gap-y-4', columnClasses[columns], className)}
			{...props}
		>
			{items.map((item, index) => (
				<li
					key={item.key ?? index}
					className="flex items-center gap-3 border-b border-[var(--ds-border)] pb-3 last:border-b-0 sm:border-b-0 sm:pb-0"
				>
					{item.icon && (
						<span className="shrink-0 text-[var(--ds-brand-600)]" aria-hidden="true">
							{item.icon}
						</span>
					)}
					<div className="flex min-w-0 flex-col leading-tight">
						<span className="text-sm font-medium text-[var(--ds-text)]">
							{item.label}
						</span>
						{item.description && (
							<span className="text-xs text-[var(--ds-text-muted)]">
								{item.description}
							</span>
						)}
					</div>
				</li>
			))}
		</ul>
	);
}
