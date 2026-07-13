import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import type { VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn';
import { buttonVariants } from './variants';

export interface ButtonProps
	extends ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {
	isLoading?: boolean;
	leftIcon?: ReactNode;
	rightIcon?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
	{
		variant,
		size,
		fullWidth,
		isLoading = false,
		leftIcon,
		rightIcon,
		disabled,
		className,
		children,
		...props
	},
	ref,
) {
	return (
		<button
			ref={ref}
			className={cn(buttonVariants({ variant, size, fullWidth }), className)}
			disabled={disabled || isLoading}
			aria-busy={isLoading || undefined}
			{...props}
		>
			{isLoading ? (
				<Loader2 className="h-[1.1em] w-[1.1em] animate-spin" aria-hidden="true" />
			) : (
				leftIcon
			)}
			{children}
			{!isLoading && rightIcon}
		</button>
	);
});
