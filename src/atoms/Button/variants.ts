import { cva } from 'class-variance-authority';

export const buttonVariants = cva(
	'inline-flex items-center justify-center gap-2 rounded-[var(--ds-radius-md)] font-medium whitespace-nowrap select-none cursor-pointer transition-[background-color,border-color,box-shadow,transform] duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ds-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ds-bg)] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50',
	{
		variants: {
			variant: {
				primary:
					'bg-[var(--ds-brand-600)] text-[var(--ds-text-on-brand)] shadow-sm hover:bg-[var(--ds-brand-700)] active:bg-[var(--ds-brand-800)]',
				secondary:
					'bg-[var(--ds-surface-muted)] text-[var(--ds-text)] hover:bg-[var(--ds-border)]',
				outline:
					'border border-[var(--ds-border-strong)] bg-transparent text-[var(--ds-text)] hover:bg-[var(--ds-surface-muted)]',
				ghost: 'bg-transparent text-[var(--ds-text)] hover:bg-[var(--ds-surface-muted)]',
				danger:
					'bg-[var(--ds-danger)] text-white shadow-sm hover:bg-[var(--ds-danger-strong)] active:bg-[var(--ds-danger-strong)]',
				link: 'bg-transparent text-[var(--ds-brand-600)] underline-offset-4 hover:underline active:scale-100',
			},
			size: {
				sm: 'h-9 px-3 text-sm gap-1.5',
				md: 'h-11 px-4 text-base',
				lg: 'h-12 px-6 text-base',
				icon: 'h-11 w-11 p-0',
			},
			fullWidth: {
				true: 'w-full',
			},
		},
		compoundVariants: [
			{ variant: 'link', size: ['sm', 'md', 'lg'], class: 'h-auto px-0' },
		],
		defaultVariants: {
			variant: 'primary',
			size: 'md',
		},
	},
);
