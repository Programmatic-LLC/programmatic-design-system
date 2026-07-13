import { cva } from 'class-variance-authority';

export const badgeVariants = cva(
	'inline-flex items-center gap-1 font-medium whitespace-nowrap select-none',
	{
		variants: {
			variant: {
				brand:
					'bg-[var(--ds-brand-50)] text-[var(--ds-brand-700)] border border-[var(--ds-brand-100)]',
				neutral:
					'bg-[var(--ds-surface-muted)] text-[var(--ds-text)] border border-[var(--ds-border)]',
				solid: 'bg-[var(--ds-brand-600)] text-white border border-transparent',
				outline: 'bg-transparent text-[var(--ds-text)] border border-[var(--ds-border-strong)]',
				success:
					'bg-[var(--ds-success-surface)] text-[var(--ds-success-strong)] border border-transparent',
				warning:
					'bg-[var(--ds-warning-surface)] text-[var(--ds-warning-strong)] border border-transparent',
				danger:
					'bg-[var(--ds-danger-surface)] text-[var(--ds-danger-strong)] border border-transparent',
				info: 'bg-[var(--ds-info-surface)] text-[var(--ds-info-strong)] border border-transparent',
			},
			size: {
				sm: 'text-xs px-2 py-0.5',
				md: 'text-sm px-2.5 py-1',
			},
			shape: {
				rounded: 'rounded-[var(--ds-radius-sm)]',
				pill: 'rounded-full',
			},
		},
		defaultVariants: {
			variant: 'neutral',
			size: 'sm',
			shape: 'rounded',
		},
	},
);
