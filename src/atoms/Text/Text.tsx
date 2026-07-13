import type { ElementType, HTMLAttributes, ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';
import { typeScale, type TextVariant } from '../../tokens/typography';

const variantClasses = Object.fromEntries(
	typeScale.map((t) => [t.variant, t.className]),
) as Record<TextVariant, string>;

const variantTag = Object.fromEntries(
	typeScale.map((t) => [t.variant, t.defaultTag]),
) as Record<TextVariant, ElementType>;

const textVariants = cva('', {
	variants: {
		variant: variantClasses,
		color: {
			default: 'text-[var(--ds-text)]',
			muted: 'text-[var(--ds-text-muted)]',
			subtle: 'text-[var(--ds-text-subtle)]',
			brand: 'text-[var(--ds-brand-700)]',
			inverse: 'text-[var(--ds-text-on-brand)]',
			success: 'text-[var(--ds-success-strong)]',
			warning: 'text-[var(--ds-warning-strong)]',
			danger: 'text-[var(--ds-danger)]',
			info: 'text-[var(--ds-info)]',
		},
		weight: {
			normal: 'font-normal',
			medium: 'font-medium',
			semibold: 'font-semibold',
			bold: 'font-bold',
		},
		align: {
			left: 'text-left',
			center: 'text-center',
			right: 'text-right',
		},
		truncate: {
			true: 'truncate',
		},
	},
	defaultVariants: {
		variant: 'body',
		color: 'default',
	},
});

export interface TextProps
	extends Omit<HTMLAttributes<HTMLElement>, 'color'>,
		VariantProps<typeof textVariants> {
	as?: ElementType;
	children?: ReactNode;
}

export function Text({
	as,
	variant = 'body',
	color,
	weight,
	align,
	truncate,
	className,
	children,
	...props
}: TextProps) {
	const Tag = as ?? variantTag[(variant ?? 'body') as TextVariant] ?? 'p';

	return (
		<Tag
			className={cn(textVariants({ variant, color, weight, align, truncate }), className)}
			{...props}
		>
			{children}
		</Tag>
	);
}
