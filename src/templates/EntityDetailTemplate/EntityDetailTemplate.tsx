import type { CSSProperties, ReactNode } from 'react';
import { MapPin } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { cn } from '../../utils/cn';
import { brandThemeVars } from '../../utils/brandScale';
import { Text } from '../../atoms/Text';
import { ActionBar } from '../../components/ActionBar';
import { EntityDetailSkeleton } from './EntityDetailSkeleton';

export interface EntityDetailTemplateProps {
	hero?: ReactNode;
	eyebrow?: ReactNode;
	title?: ReactNode;
	metadata?: ReactNode;
	address?: ReactNode;
	tags?: ReactNode;
	likeButton?: ReactNode;
	primaryActions?: ReactNode;
	sidebar?: ReactNode;
	map?: ReactNode;
	related?: ReactNode;
	children?: ReactNode;
	className?: string;
	brandColor?: string;
	loading?: boolean;
	mainId?: string;
}

export function EntityDetailTemplate({
	hero,
	eyebrow,
	title,
	metadata,
	address,
	tags,
	likeButton,
	primaryActions,
	sidebar,
	map,
	related,
	children,
	className,
	brandColor,
	loading = false,
	mainId,
}: EntityDetailTemplateProps) {
	const reduceMotion = useReducedMotion();
	const brandStyle = brandThemeVars(brandColor) as CSSProperties | undefined;

	if (loading) {
		return (
			<EntityDetailSkeleton className={className} brandStyle={brandStyle} />
		);
	}

	const heroAnim = reduceMotion
		? { initial: false, animate: false }
		: {
			initial: { opacity: 0, scale: 1.015 },
			animate: { opacity: 1, scale: 1 },
			transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
		};

	const headerStagger = reduceMotion
		? { initial: false, animate: false }
		: {
			initial: 'hidden' as const,
			animate: 'show' as const,
			variants: {
				hidden: {},
				show: { transition: { staggerChildren: 0.06, delayChildren: 0.12 } },
			},
		};
	const headerItem = reduceMotion
		? {}
		: {
			variants: {
				hidden: { opacity: 0, y: 10 },
				show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' as const } },
			},
		};

	const revealOnScroll = reduceMotion
		? {}
		: {
			initial: { opacity: 0, y: 24 },
			whileInView: { opacity: 1, y: 0 },
			viewport: { once: true, margin: '-80px' },
			transition: { duration: 0.5, ease: 'easeOut' as const },
		};

	const RootTag = mainId ? 'main' : 'div';

	return (
		<RootTag
			id={mainId}
			tabIndex={mainId ? -1 : undefined}
			className={cn('flex w-full flex-col', className)}
			style={brandStyle}
		>
			{hero && (
				<motion.div
					{...heroAnim}
					className="w-full sm:mx-auto sm:mt-4 sm:max-w-7xl sm:px-6 lg:mt-6 lg:px-8"
				>
					<div className="relative">
						{hero}
					</div>
				</motion.div>
			)}

			<div className="mx-auto w-full max-w-7xl px-4 pb-10 pt-6 sm:px-6 sm:pt-10 lg:px-8 lg:pb-16">
				<div className="flex flex-col gap-y-8 lg:grid lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-x-12 lg:gap-y-10">
					{(eyebrow || title || metadata || address || tags || primaryActions) && (
						<div className="order-1 flex min-w-0 flex-col gap-6 lg:col-start-1 lg:row-start-1">
							{(eyebrow || title || metadata || address || tags) && (
								<motion.header {...headerStagger} className="flex flex-col gap-3">
									{eyebrow && (
										<motion.div {...headerItem}>
											<Text
												variant="overline"
												color="brand"
												className="tracking-[0.18em]"
											>
												{eyebrow}
											</Text>
										</motion.div>
									)}
									{title && (
										<motion.div
											{...headerItem}
											className={cn(likeButton && !hero && 'flex items-start justify-between gap-3')}
										>
											<Text
												variant="h1"
												className="text-balance leading-[1.05] tracking-tight"
											>
												{title}
											</Text>
											{likeButton && !hero && (
												<div className="shrink-0 pt-1">{likeButton}</div>
											)}
										</motion.div>
									)}
									{address && (
										<motion.div
											{...headerItem}
											className="flex items-center gap-1.5 text-[var(--ds-text-muted)]"
										>
											<MapPin className="h-4 w-4 shrink-0" aria-hidden="true" />
											<span className="text-sm">{address}</span>
										</motion.div>
									)}
									{metadata && (
										<motion.div {...headerItem}>{metadata}</motion.div>
									)}
									{tags && (
										<motion.div {...headerItem} className="flex flex-wrap gap-2 pt-1">
											{tags}
										</motion.div>
									)}
								</motion.header>
							)}

							{primaryActions && (
								<ActionBar align="start">{primaryActions}</ActionBar>
							)}
						</div>
					)}

					{sidebar && (
						<aside className="order-2 min-w-0 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:sticky lg:top-24 lg:self-start">
							{sidebar}
						</aside>
					)}
					{(children || map) && (
						<div className="order-3 flex min-w-0 flex-col gap-12 lg:col-start-1 lg:row-start-2">
							{children}
							{map && (
								<motion.div {...revealOnScroll}>
									{map}
								</motion.div>
							)}
						</div>
					)}
				</div>

				{related && (
					<div className="mt-14 lg:mt-20">
						{related}
					</div>
				)}
			</div>
		</RootTag>
	);
}
