import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import type { VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';
import { pickTextOnBrand } from '../../utils/brandScale';
import { badgeVariants } from './variants';

export interface BadgeProps
	extends HTMLAttributes<HTMLSpanElement>,
		VariantProps<typeof badgeVariants> {
	leftIcon?: ReactNode;
	color?: string;
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
	{ variant, size, shape, leftIcon, color, className, style, children, ...props },
	ref,
) {
	const colorStyle = color
		? variant === 'outline'
			? { borderColor: color, color }
			: { backgroundColor: color, color: pickTextOnBrand(color), borderColor: 'transparent' }
		: undefined;

	return (
		<span
			ref={ref}
			className={cn(badgeVariants({ variant, size, shape }), className)}
			style={colorStyle ? { ...colorStyle, ...style } : style}
			{...props}
		>
			{leftIcon}
			{children}
		</span>
	);
});
