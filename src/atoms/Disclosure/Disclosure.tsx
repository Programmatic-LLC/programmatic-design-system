import { type ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface DisclosureProps {
	label: string;
	children: ReactNode;
	defaultOpen?: boolean;
	tone?: 'default' | 'onDark';
	className?: string;
}

export function Disclosure({
	label,
	children,
	defaultOpen = false,
	tone = 'default',
	className,
}: DisclosureProps) {
	const onDark = tone === 'onDark';

	return (
		<details
			open={defaultOpen}
			className={cn(
				'group overflow-hidden rounded-[var(--ds-radius-md)] border',
				onDark ? 'border-white/20 bg-white/10' : 'border-[var(--ds-border)] bg-[var(--ds-bg)]',
				className,
			)}
		>
			<summary
				className={cn(
					'flex cursor-pointer list-none items-center justify-between gap-2 rounded-[var(--ds-radius-md)] px-3 py-2 text-sm font-medium group-open:rounded-b-none focus-visible:outline-2 focus-visible:-outline-offset-2',
					onDark
						? 'text-white focus-visible:outline-white/70'
						: 'text-[var(--ds-brand-600)] focus-visible:outline-[var(--ds-ring)]',
				)}
			>
				<span>{label}</span>
				<ChevronDown
					aria-hidden="true"
					className="h-4 w-4 shrink-0 transition-transform duration-200 group-open:rotate-180"
				/>
			</summary>
			<div
				className={cn(
					'max-h-72 overflow-y-auto whitespace-pre-wrap px-3 pb-3 text-sm leading-relaxed',
					onDark ? 'text-white/90' : 'text-[var(--ds-text)]',
				)}
			>
				{children}
			</div>
		</details>
	);
}
