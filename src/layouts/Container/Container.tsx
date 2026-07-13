import type { ElementType, HTMLAttributes, ReactNode } from 'react';
import type { VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';
import { containerVariants } from './variants';

export interface ContainerProps
	extends HTMLAttributes<HTMLElement>,
		VariantProps<typeof containerVariants> {
	as?: ElementType;
	children?: ReactNode;
}

export function Container({ as, size, className, children, ...props }: ContainerProps) {
	const Tag = as ?? 'div';
	return (
		<Tag className={cn(containerVariants({ size }), className)} {...props}>
			{children}
		</Tag>
	);
}
