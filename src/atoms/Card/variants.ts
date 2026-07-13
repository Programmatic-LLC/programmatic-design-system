import { cva } from 'class-variance-authority';

export const cardVariants = cva('rounded-[var(--ds-radius-lg)] overflow-hidden', {
	variants: {
		variant: {
			surface: 'bg-[var(--ds-surface)] border border-[var(--ds-border)] shadow-sm',
			subtle: 'bg-[var(--ds-surface-subtle)] border border-[var(--ds-border)]',
			elevated: 'bg-[var(--ds-surface)] shadow-md',
			outlined: 'bg-[var(--ds-surface)] border border-[var(--ds-border-strong)]',
			ghost: 'bg-transparent',
		},
		padding: {
			none: '',
			sm: 'p-3',
			md: 'p-4 sm:p-5',
			lg: 'p-6 sm:p-8',
		},
	},
	defaultVariants: {
		variant: 'surface',
		padding: 'md',
	},
});
