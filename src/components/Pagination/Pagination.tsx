import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface PaginationProps {
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
	siblingCount?: number;
	className?: string;
	ariaLabel?: string;
}

const DOTS = 'dots' as const;

function range(start: number, end: number): number[] {
	return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

function buildPages(
	currentPage: number,
	totalPages: number,
	siblingCount: number,
): Array<number | typeof DOTS> {
	const totalPageButtons = siblingCount * 2 + 5;
	if (totalPageButtons >= totalPages) return range(1, totalPages);

	const leftSibling = Math.max(currentPage - siblingCount, 1);
	const rightSibling = Math.min(currentPage + siblingCount, totalPages);
	const showLeftDots = leftSibling > 2;
	const showRightDots = rightSibling < totalPages - 1;

	if (!showLeftDots && showRightDots) {
		const leftCount = 3 + 2 * siblingCount;
		return [...range(1, leftCount), DOTS, totalPages];
	}
	if (showLeftDots && !showRightDots) {
		const rightCount = 3 + 2 * siblingCount;
		return [1, DOTS, ...range(totalPages - rightCount + 1, totalPages)];
	}
	return [1, DOTS, ...range(leftSibling, rightSibling), DOTS, totalPages];
}

const itemBase =
	'inline-flex h-9 items-center justify-center rounded-[var(--ds-radius-md)] text-sm transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ds-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ds-bg)]';

const arrowClass = cn(
	itemBase,
	'w-9 text-[var(--ds-text-muted)] hover:bg-[var(--ds-surface-muted)] hover:text-[var(--ds-text)] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-[var(--ds-text-muted)]',
);

export function Pagination({
	currentPage,
	totalPages,
	onPageChange,
	siblingCount = 1,
	className,
	ariaLabel = 'Pagination',
}: PaginationProps) {
	if (totalPages <= 1) return null;

	const pages = buildPages(currentPage, totalPages, siblingCount);

	return (
		<nav
			aria-label={ariaLabel}
			className={cn('inline-flex items-center gap-0.5', className)}
		>
			<button
				type="button"
				onClick={() => onPageChange(Math.max(1, currentPage - 1))}
				disabled={currentPage === 1}
				aria-label="Previous page"
				className={arrowClass}
			>
				<ChevronLeft className="h-4 w-4" />
			</button>

			<ul className="flex items-center gap-0.5">
				{pages.map((p, i) =>
					p === DOTS ? (
						<li key={`dots-${i}`} aria-hidden="true">
							<span className="inline-flex h-9 w-7 items-center justify-center text-sm text-[var(--ds-text-subtle)]">
								…
							</span>
						</li>
					) : (
						<li key={p}>
							<button
								type="button"
								onClick={() => onPageChange(p)}
								aria-current={p === currentPage ? 'page' : undefined}
								className={cn(
									itemBase,
									'min-w-[2.25rem] px-2.5',
									p === currentPage
										? 'bg-[var(--ds-brand-600)] font-semibold text-[var(--ds-text-on-brand)]'
										: 'font-medium text-[var(--ds-text-muted)] hover:bg-[var(--ds-surface-muted)] hover:text-[var(--ds-text)]',
								)}
							>
								{p}
							</button>
						</li>
					),
				)}
			</ul>

			<button
				type="button"
				onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
				disabled={currentPage === totalPages}
				aria-label="Next page"
				className={arrowClass}
			>
				<ChevronRight className="h-4 w-4" />
			</button>
		</nav>
	);
}
