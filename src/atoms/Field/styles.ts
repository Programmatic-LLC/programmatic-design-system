export type FieldSize = 'sm' | 'md';

export const controlBase =
	'w-full rounded-[var(--ds-radius-md)] border bg-[var(--ds-surface)] text-[var(--ds-text)] placeholder:text-[var(--ds-text-subtle)] outline-none transition-[border-color,box-shadow] duration-150 focus-visible:ring-2 focus-visible:ring-[var(--ds-ring)] focus-visible:border-[var(--ds-brand-500)] disabled:cursor-not-allowed disabled:opacity-60 disabled:bg-[var(--ds-surface-muted)]';

export const controlValid = 'border-[var(--ds-border-strong)]';

export const controlInvalid =
	'border-[var(--ds-danger)] focus-visible:ring-[var(--ds-danger)] focus-visible:border-[var(--ds-danger)]';

export const controlSizes: Record<FieldSize, string> = {
	sm: 'h-9 px-3 text-sm',
	md: 'h-11 px-3.5 text-base',
};
