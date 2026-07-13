import type { HTMLAttributes, ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';
import { Skeleton } from '../../atoms/Skeleton';

const gridVariants = cva('grid', {
	variants: {
		columns: {
			'1-2-3': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
			'1-2-4': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
			'2-3': 'grid-cols-2 lg:grid-cols-3',
		},
		gap: {
			sm: 'gap-4',
			md: 'gap-5 sm:gap-6',
			lg: 'gap-6 sm:gap-8',
		},
	},
	defaultVariants: { columns: '1-2-3', gap: 'md' },
});

export interface CardGridProps
	extends Omit<HTMLAttributes<HTMLDivElement>, 'children'>,
		VariantProps<typeof gridVariants> {
	children?: ReactNode;
	loading?: boolean;
	skeletonCount?: number;
	skeletonAspect?: '4/3' | '1/1' | '3/2' | '16/9';
}

const aspectClasses: Record<NonNullable<CardGridProps['skeletonAspect']>, string> = {
	'4/3': 'aspect-[4/3]',
	'1/1': 'aspect-square',
	'3/2': 'aspect-[3/2]',
	'16/9': 'aspect-video',
};

export function CardGrid({
	columns,
	gap,
	className,
	children,
	loading = false,
	skeletonCount = 6,
	skeletonAspect = '4/3',
	...rest
}: CardGridProps) {
	if (loading) {
		return (
			<div
				role="status"
				aria-label="Loading"
				className={cn(gridVariants({ columns, gap }), className)}
				{...rest}
			>
				{Array.from({ length: skeletonCount }).map((_, i) => (
					<CardGridSkeletonItem key={i} aspect={skeletonAspect} />
				))}
			</div>
		);
	}

	return (
		<div className={cn(gridVariants({ columns, gap }), className)} {...rest}>
			{children}
		</div>
	);
}

interface CardGridSkeletonItemProps {
	aspect: NonNullable<CardGridProps['skeletonAspect']>;
}

function CardGridSkeletonItem({ aspect }: CardGridSkeletonItemProps) {
	return (
		<div className="flex h-full flex-col overflow-hidden rounded-[var(--ds-radius-xl)] border border-[var(--ds-border)] bg-[var(--ds-surface)] shadow-[0_1px_2px_rgba(15,23,42,0.06)]">
			<Skeleton className={cn('w-full rounded-none', aspectClasses[aspect])} />
			<div className="flex flex-1 flex-col gap-3 p-5">
				<Skeleton className="h-5 w-3/4" />
				<div className="flex flex-col gap-1.5">
					<Skeleton className="h-3.5 w-full" />
					<Skeleton className="h-3.5 w-5/6" />
				</div>
				<div className="flex gap-1.5 pt-1">
					<Skeleton className="h-5 w-14 rounded-full" />
					<Skeleton className="h-5 w-20 rounded-full" />
				</div>
			</div>
		</div>
	);
}
