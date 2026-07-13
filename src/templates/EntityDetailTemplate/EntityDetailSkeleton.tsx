import type { CSSProperties } from 'react';
import { cn } from '../../utils/cn';
import { Skeleton } from '../../atoms/Skeleton';

export interface EntityDetailSkeletonProps {
	className?: string;
	brandStyle?: CSSProperties;
	withSidebar?: boolean;
	withMap?: boolean;
	withRelated?: boolean;
}

export function EntityDetailSkeleton({
	className,
	brandStyle,
	withSidebar = true,
	withMap = true,
	withRelated = false,
}: EntityDetailSkeletonProps) {
	return (
		<div
			className={cn('flex w-full flex-col', className)}
			style={brandStyle}
			aria-busy="true"
			aria-live="polite"
		>
			<div className="w-full sm:mx-auto sm:mt-4 sm:max-w-7xl sm:px-6 lg:mt-6 lg:px-8">
				<Skeleton className="aspect-[16/9] w-full rounded-none sm:rounded-[var(--ds-radius-xl)]" />
			</div>

			<div className="mx-auto w-full max-w-7xl px-4 pb-10 pt-6 sm:px-6 sm:pt-10 lg:px-8 lg:pb-16">
				<div className="flex flex-col gap-y-8 lg:grid lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-x-12 lg:gap-y-10">
					<div className="order-1 flex min-w-0 flex-col gap-6 lg:col-start-1 lg:row-start-1">
						<div className="flex flex-col gap-3">
							<Skeleton className="h-4 w-28 rounded-full" />
							<Skeleton className="h-9 w-3/4 sm:h-10" />
							<Skeleton className="h-9 w-1/2 sm:h-10" />
							<div className="flex items-center gap-2 pt-1">
								<Skeleton className="h-4 w-4 rounded-full" />
								<Skeleton className="h-4 w-1/2" />
							</div>
							<Skeleton className="h-4 w-2/5" />
							<div className="flex flex-wrap gap-2 pt-1">
								<Skeleton className="h-7 w-20 rounded-full" />
								<Skeleton className="h-7 w-16 rounded-full" />
								<Skeleton className="h-7 w-24 rounded-full" />
							</div>
						</div>
						<Skeleton className="h-11 w-44" />
					</div>

					{withSidebar && (
						<aside className="order-2 min-w-0 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:sticky lg:top-24 lg:self-start">
							<div className="rounded-[var(--ds-radius-lg)] border border-[var(--ds-border)] bg-[var(--ds-surface)] p-6">
								<Skeleton className="mb-5 h-5 w-28" />
								<div className="flex flex-col gap-4">
									{Array.from({ length: 5 }).map((_, i) => (
										<div key={i} className="flex items-start gap-3">
											<Skeleton className="mt-0.5 h-4 w-4 rounded-full" />
											<div className="flex min-w-0 flex-1 flex-col gap-1.5">
												<Skeleton className="h-3 w-20" />
												<Skeleton className="h-4 w-32" />
											</div>
										</div>
									))}
								</div>
							</div>
						</aside>
					)}

					<div className="order-3 flex min-w-0 flex-col gap-12 lg:col-start-1 lg:row-start-2">
						<div className="flex flex-col gap-4">
							<Skeleton className="h-7 w-32" />
							<div className="flex flex-col gap-2.5">
								<Skeleton className="h-4 w-full" />
								<Skeleton className="h-4 w-full" />
								<Skeleton className="h-4 w-5/6" />
								<Skeleton className="h-4 w-3/4" />
							</div>
						</div>

						<div className="flex flex-col gap-4">
							<Skeleton className="h-6 w-40" />
							<div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
								{Array.from({ length: 6 }).map((_, i) => (
									<Skeleton key={i} className="h-12 w-full" />
								))}
							</div>
						</div>

						{withMap && (
							<Skeleton className="aspect-[16/10] w-full rounded-[var(--ds-radius-xl)]" />
						)}
					</div>
				</div>

				{withRelated && (
					<div className="mt-14 flex flex-col gap-4 lg:mt-20">
						<Skeleton className="h-6 w-44" />
						<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
							{Array.from({ length: 3 }).map((_, i) => (
								<div
									key={i}
									className="flex flex-col overflow-hidden rounded-[var(--ds-radius-lg)] border border-[var(--ds-border)] bg-[var(--ds-surface)]"
								>
									<Skeleton className="aspect-[16/10] w-full rounded-none" />
									<div className="flex flex-col gap-2 p-4">
										<Skeleton className="h-5 w-3/4" />
										<Skeleton className="h-4 w-full" />
									</div>
								</div>
							))}
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
