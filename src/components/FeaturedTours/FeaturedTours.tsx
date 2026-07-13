import type { HTMLAttributes, ReactNode } from 'react';
import { Route } from 'lucide-react';
import { cn } from '../../utils/cn';
import { Card } from '../../atoms/Card';
import { Text } from '../../atoms/Text';
import { Carousel } from '../Carousel';

export interface FeaturedTourItem {
	id?: string;
	title: ReactNode;
	preview?: ReactNode;
	image?: string | null;
}

export interface FeaturedToursProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onSelect'> {
	items: FeaturedTourItem[];
	onSelect?: (item: FeaturedTourItem, index: number) => void;
	columns?: 1 | 2 | 3 | 4;
	'aria-label'?: string;
}

export function FeaturedTours({
	items,
	onSelect,
	className,
	'aria-label': ariaLabel,
	columns: _columns,
	...props
}: FeaturedToursProps) {
	if (items.length === 0) return null;

	return (
		<div className={className} {...props}>
			<Carousel aria-label={ariaLabel}>
				{items.map((item, index) => {
					const interactive = Boolean(onSelect);
					const content = (
						<>
							<div className="aspect-[16/10] overflow-hidden bg-[var(--ds-surface-muted)]">
								{item.image ? (
									<img
										src={item.image}
										alt=""
										aria-hidden="true"
										loading="lazy"
										className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
									/>
								) : (
									<div className="grid h-full w-full place-items-center bg-gradient-to-br from-[var(--ds-brand-100)] via-[var(--ds-brand-50)] to-[var(--ds-neutral-50)]">
										<Route className="h-10 w-10 text-[var(--ds-brand-600)]" aria-hidden="true" />
									</div>
								)}
							</div>
							<div className="p-4">
								<Text variant="h4" as="h3" className="leading-snug">
									{item.title}
								</Text>
								{item.preview && (
									<Text variant="body-sm" color="muted" className="mt-1 line-clamp-2">
										{item.preview}
									</Text>
								)}
							</div>
						</>
					);

					const cardWidth = 'w-72 flex-shrink-0 sm:w-80';

					return interactive ? (
						<button
							key={item.id ?? `${index}-${typeof item.title === 'string' ? item.title : index}`}
							type="button"
							onClick={() => onSelect?.(item, index)}
							className={cn(
								cardWidth,
								'group flex flex-col overflow-hidden rounded-[var(--ds-radius-lg)] border border-[var(--ds-border)] bg-[var(--ds-surface)] text-left transition-transform duration-300 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ds-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ds-bg)]',
							)}
						>
							{content}
						</button>
					) : (
						<Card
							key={item.id ?? `${index}-${typeof item.title === 'string' ? item.title : index}`}
							padding="none"
							className={cn(cardWidth, 'group transition-transform duration-300 hover:-translate-y-1')}
						>
							{content}
						</Card>
					);
				})}
			</Carousel>
		</div>
	);
}
