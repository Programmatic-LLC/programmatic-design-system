import { Fragment, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../utils/cn';

export interface MetaItem {
	icon?: ReactNode;
	label: ReactNode;
	key?: string;
}

export interface MetaRowProps extends HTMLAttributes<HTMLDivElement> {
	items: MetaItem[];
	separator?: ReactNode;
	size?: 'sm' | 'md';
}

export function MetaRow({
	items,
	separator,
	size = 'sm',
	className,
	...props
}: MetaRowProps) {
	const sep = separator ?? (
		<span aria-hidden="true" className="select-none text-[var(--ds-text-subtle)]/70">
			·
		</span>
	);

	return (
		<div
			className={cn(
				'flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[var(--ds-text-muted)]',
				size === 'sm' ? 'text-sm' : 'text-base',
				className,
			)}
			{...props}
		>
			{items.map((item, index) => (
				<Fragment key={item.key ?? index}>
					{index > 0 && sep}
					<span className="inline-flex items-center gap-1.5 whitespace-nowrap">
						{item.icon && (
							<span className="text-[var(--ds-text-subtle)]" aria-hidden="true">
								{item.icon}
							</span>
						)}
						<span>{item.label}</span>
					</span>
				</Fragment>
			))}
		</div>
	);
}
