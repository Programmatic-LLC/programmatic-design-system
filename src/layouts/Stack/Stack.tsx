import type { ElementType, HTMLAttributes, ReactNode } from 'react';
import type { VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';
import { stackVariants } from './variants';

export interface StackProps
	extends HTMLAttributes<HTMLElement>,
		VariantProps<typeof stackVariants> {
	as?: ElementType;
	children?: ReactNode;
}

export function Stack({
	as,
	direction,
	gap,
	align,
	justify,
	wrap,
	className,
	children,
	...props
}: StackProps) {
	const Tag = as ?? 'div';
	return (
		<Tag
			className={cn(stackVariants({ direction, gap, align, justify, wrap }), className)}
			{...props}
		>
			{children}
		</Tag>
	);
}
