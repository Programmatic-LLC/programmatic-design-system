import type { HTMLAttributes, MouseEvent, ReactNode } from 'react';
import { ChevronRight } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface BreadcrumbItem {
	label: ReactNode;
	href?: string;
	onClick?: (event: MouseEvent<HTMLElement>) => void;
	key?: string;
	current?: boolean;
}

export interface BreadcrumbProps extends HTMLAttributes<HTMLElement> {
	items: BreadcrumbItem[];
	separator?: ReactNode;
	ariaLabel?: string;
}

export function Breadcrumb({
	items,
	separator,
	ariaLabel = 'Breadcrumb',
	className,
	...props
}: BreadcrumbProps) {
	if (items.length === 0) return null;

	const separatorNode = separator ?? (
		<ChevronRight className="h-4 w-4 shrink-0 text-[var(--ds-text-subtle)]" aria-hidden="true" />
	);

	const crumbClass =
		'rounded-[var(--ds-radius-sm)] -mx-1 px-1 py-0.5 text-sm font-medium text-[var(--ds-text-muted)] transition-colors hover:text-[var(--ds-brand-700)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ds-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ds-bg)]';

	return (
		<nav aria-label={ariaLabel} className={cn(className)} {...props}>
			<ol className="flex min-w-0 flex-wrap items-center gap-y-1">
				{items.map((item, i) => {
					const isLast = i === items.length - 1;
					const isCurrent = item.current ?? isLast;
					const key = item.key ?? String(i);

					return (
						<li key={key} className="flex min-w-0 items-center gap-2">
							{isCurrent ? (
								<span
									aria-current="page"
									className="text-sm font-semibold text-[var(--ds-text)]"
								>
									{item.label}
								</span>
							) : item.href ? (
								<a href={item.href} className={crumbClass}>
									{item.label}
								</a>
							) : (
								<button
									type="button"
									onClick={item.onClick}
									className={crumbClass}
								>
									{item.label}
								</button>
							)}
							{!isLast && <span className="shrink-0">{separatorNode}</span>}
						</li>
					);
				})}
			</ol>
		</nav>
	);
}
