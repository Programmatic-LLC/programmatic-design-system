import { useCallback, type CSSProperties, type ReactNode } from 'react';
import { ChevronsDown } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';
import { Text } from '../../atoms/Text';

const heroSizes = cva('relative w-full overflow-hidden', {
	variants: {
		height: {
			sm: 'min-h-[18rem] sm:min-h-[22rem]',
			md: 'min-h-[22rem] sm:min-h-[28rem]',
			lg: 'h-[60vh] min-h-[24rem] sm:h-[70vh] sm:min-h-[30rem]',
			tall: 'h-[68vh] min-h-[26rem] sm:h-[80vh] sm:min-h-[32rem] lg:h-[85vh]',
			screen: 'h-[90vh] min-h-[28rem] sm:h-screen sm:min-h-[34rem]',
		},
		rounded: {
			none: '',
			lg: 'sm:rounded-[var(--ds-radius-xl)]',
			xl: 'sm:rounded-[2rem]',
		},
	},
	defaultVariants: {
		height: 'tall',
		rounded: 'none',
	},
});

const overlayStyles = cva('pointer-events-none absolute inset-0', {
	variants: {
		overlay: {
			none: 'hidden',
			subtle: 'bg-black/20',
			gradient: 'bg-gradient-to-t from-black/75 via-black/40 to-black/10',
			scrim: 'bg-gradient-to-t from-black/85 via-black/55 to-transparent',
			full: 'bg-black/55',
		},
	},
	defaultVariants: { overlay: 'gradient' },
});

const alignStyles = {
	'bottom-start': 'items-end justify-start text-left',
	'bottom-center': 'items-end justify-center text-center',
	'center': 'items-center justify-center text-center',
	'center-start': 'items-center justify-start text-left',
} as const;

export type HeroAlign = keyof typeof alignStyles;

export interface HeroProps
	extends Omit<VariantProps<typeof heroSizes>, never>,
		VariantProps<typeof overlayStyles> {
	media?: ReactNode;
	align?: HeroAlign;
	eyebrow?: ReactNode;
	title?: ReactNode;
	subtitle?: ReactNode;
	actions?: ReactNode;
	topRight?: ReactNode;
	topLeft?: ReactNode;
	scrollTargetId?: string;
	scrollTargetLabel?: string;
	children?: ReactNode;
	className?: string;
	style?: CSSProperties;
	animate?: boolean;
}

export function Hero({
	media,
	height,
	rounded,
	overlay,
	align = 'bottom-start',
	eyebrow,
	title,
	subtitle,
	actions,
	topRight,
	topLeft,
	scrollTargetId,
	scrollTargetLabel = 'Scroll to content',
	children,
	className,
	style,
	animate = true,
}: HeroProps) {
	const reduceMotion = useReducedMotion();
	const shouldAnimate = animate && !reduceMotion;

	const handleScroll = useCallback(() => {
		if (!scrollTargetId) return;
		document.getElementById(scrollTargetId)?.scrollIntoView({ behavior: 'smooth' });
	}, [scrollTargetId]);

	const mediaAnim = shouldAnimate
		? {
			initial: { opacity: 0, scale: 1.04 },
			animate: { opacity: 1, scale: 1 },
			transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] as const },
		}
		: { initial: false, animate: false };

	const contentAnim = shouldAnimate
		? {
			initial: { opacity: 0, y: 18 },
			animate: { opacity: 1, y: 0 },
			transition: { duration: 0.65, delay: 0.15, ease: 'easeOut' as const },
		}
		: { initial: false, animate: false };

	return (
		<section
			className={cn(heroSizes({ height, rounded }), className)}
			style={style}
		>
			{media && (
				<motion.div
					{...mediaAnim}
					className="absolute inset-0 overflow-hidden [&_img]:absolute [&_img]:inset-0 [&_img]:h-full [&_img]:w-full [&_img]:object-cover [&_picture]:absolute [&_picture]:inset-0 [&_picture]:block [&_picture]:h-full [&_picture]:w-full [&>div]:absolute [&>div]:inset-0 [&>div]:h-full [&>div]:w-full"
				>
					{media}
				</motion.div>
			)}
			<div className={cn(overlayStyles({ overlay }))} aria-hidden="true" />

			{topLeft && (
				<div className="absolute left-4 top-4 z-10 sm:left-6 sm:top-6">{topLeft}</div>
			)}
			{topRight && (
				<div className="absolute right-4 top-4 z-10 sm:right-6 sm:top-6">{topRight}</div>
			)}

			<div className={cn('relative z-[1] flex h-full w-full p-6 pb-16 sm:p-10 sm:pb-20', alignStyles[align])}>
				<motion.div
					{...contentAnim}
					className="mx-auto w-full max-w-7xl"
				>
					<div
						className={cn(
							'flex flex-col gap-4',
							align === 'bottom-center' || align === 'center' ? 'items-center' : 'items-start',
							align === 'bottom-center' || align === 'center' ? 'mx-auto max-w-3xl' : 'max-w-3xl',
						)}
					>
						{children ?? (
							<>
								{eyebrow && (
									<Text
										variant="overline"
										className="tracking-[0.22em] text-white/85 drop-shadow"
									>
										{eyebrow}
									</Text>
								)}
								{title && (
									<Text
										variant="display"
										className="text-balance leading-[1.02] tracking-tight text-white drop-shadow-lg [text-wrap:balance]"
									>
										{title}
									</Text>
								)}
								{subtitle && (
									<Text
										variant="body-lg"
										className="max-w-2xl text-white/90 drop-shadow line-clamp-3"
									>
										{subtitle}
									</Text>
								)}
								{actions && (
									<div className="mt-3 flex flex-wrap items-center gap-3">{actions}</div>
								)}
							</>
						)}
					</div>
				</motion.div>
			</div>

			{scrollTargetId && (
				<button
					type="button"
					onClick={handleScroll}
					aria-label={scrollTargetLabel}
					className="absolute bottom-5 left-1/2 z-10 flex h-11 w-11 -translate-x-1/2 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md transition hover:bg-white/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
				>
					<ChevronsDown className="h-5 w-5" />
				</button>
			)}
		</section>
	);
}
