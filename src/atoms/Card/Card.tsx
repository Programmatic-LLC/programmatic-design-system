import { forwardRef, type ElementType, type HTMLAttributes, type ReactNode } from 'react';
import type { VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';
import { cardVariants } from './variants';

export interface CardProps
	extends HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof cardVariants> {}

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
	{ variant, padding, className, children, ...props },
	ref,
) {
	return (
		<div
			ref={ref}
			className={cn(cardVariants({ variant, padding }), className)}
			{...props}
		>
			{children}
		</div>
	);
});

export function CardHeader({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
	return (
		<div
			className={cn('mb-4 flex items-start justify-between gap-3', className)}
			{...props}
		>
			{children}
		</div>
	);
}

export interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
	as?: ElementType;
}

export function CardTitle({ as: Tag = 'h3', className, children, ...props }: CardTitleProps) {
	return (
		<Tag
			className={cn('text-lg font-semibold leading-snug text-[var(--ds-text)]', className)}
			{...props}
		>
			{children}
		</Tag>
	);
}

export function CardDescription({
	className,
	children,
	...props
}: HTMLAttributes<HTMLParagraphElement>) {
	return (
		<p className={cn('text-sm text-[var(--ds-text-muted)]', className)} {...props}>
			{children}
		</p>
	);
}

export function CardBody({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
	return (
		<div className={cn(className)} {...props}>
			{children}
		</div>
	);
}

export function CardFooter({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
	return (
		<div
			className={cn(
				'mt-4 flex items-center justify-end gap-2 border-t border-[var(--ds-border)] pt-4',
				className,
			)}
			{...props}
		>
			{children}
		</div>
	);
}

export interface CardMediaProps extends HTMLAttributes<HTMLDivElement> {
	aspectRatio?: string;
	children?: ReactNode;
}

export function CardMedia({
	aspectRatio = '16/9',
	className,
	children,
	style,
	...props
}: CardMediaProps) {
	return (
		<div
			className={cn('relative w-full overflow-hidden bg-[var(--ds-surface-muted)]', className)}
			style={{ aspectRatio, ...style }}
			{...props}
		>
			{children}
		</div>
	);
}
