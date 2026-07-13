import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../../utils/cn';

export interface InfoListItem {
	icon?: ReactNode;
	label: ReactNode;
	value: ReactNode;
	key?: string;
	href?: string;
	external?: boolean;
}

export interface InfoListProps extends HTMLAttributes<HTMLDListElement> {
	items: InfoListItem[];
	variant?: 'rows' | 'stacked' | 'icon';
	divided?: boolean;
}

export function InfoList({
	items,
	variant = 'rows',
	divided,
	className,
	...props
}: InfoListProps) {
	const useDividers = divided ?? variant === 'rows';

	if (variant === 'icon') {
		return (
			<dl
				className={cn('flex flex-col gap-3', className)}
				{...props}
			>
				{items.map((item, index) => {
					const content = (
						<>
							{item.icon && (
								<span className="mt-0.5 shrink-0 text-[var(--ds-brand-600)]" aria-hidden="true">
									{item.icon}
								</span>
							)}
							<div className="flex min-w-0 flex-col leading-snug">
								<dt className="text-[0.6875rem] font-medium uppercase tracking-[0.08em] text-[var(--ds-text-muted)]">
									{item.label}
								</dt>
								<dd className="text-sm text-[var(--ds-text)]">{item.value}</dd>
							</div>
						</>
					);

					return item.href ? (
						<a
							key={item.key ?? index}
							href={item.href}
							target={item.external ? '_blank' : undefined}
							rel={item.external ? 'noopener noreferrer' : undefined}
							className="group flex items-start gap-3 rounded-[var(--ds-radius-sm)] -mx-1 px-1 py-0.5 transition-colors hover:bg-[var(--ds-surface-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ds-ring)]"
						>
							{content}
						</a>
					) : (
						<div key={item.key ?? index} className="flex items-start gap-3">
							{content}
						</div>
					);
				})}
			</dl>
		);
	}

	return (
		<dl
			className={cn(
				'flex flex-col',
				useDividers && 'divide-y divide-[var(--ds-border)]',
				variant === 'stacked' && 'gap-4',
				className,
			)}
			{...props}
		>
			{items.map((item, index) => (
				<div
					key={item.key ?? index}
					className={cn(
						variant === 'rows'
							? 'flex items-start justify-between gap-4 py-3 first:pt-0 last:pb-0'
							: 'flex flex-col gap-1',
					)}
				>
					<dt
						className={cn(
							'inline-flex items-center gap-2 text-sm text-[var(--ds-text-muted)]',
							variant === 'stacked' && 'font-medium',
						)}
					>
						{item.icon && (
							<span className="text-[var(--ds-text-subtle)]">{item.icon}</span>
						)}
						<span>{item.label}</span>
					</dt>
					<dd
						className={cn(
							'text-sm text-[var(--ds-text)]',
							variant === 'rows' ? 'text-right' : '',
						)}
					>
						{item.value}
					</dd>
				</div>
			))}
		</dl>
	);
}
