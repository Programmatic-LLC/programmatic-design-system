import {
	forwardRef,
	type AnchorHTMLAttributes,
	type ComponentType,
	type HTMLAttributes,
	type ReactNode,
} from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';
import { useDsLinkComponent } from '../../theme/DsLinkProvider';

const cardVariants = cva(
	'group/entity-card relative flex h-full flex-col overflow-hidden rounded-[var(--ds-radius-xl)] bg-[var(--ds-surface)] transition duration-300 ease-out',
	{
		variants: {
			elevation: {
				flat: 'border border-[var(--ds-border)]',
				raised:
					'shadow-[0_1px_2px_rgba(15,23,42,0.06),0_8px_24px_-12px_rgba(15,23,42,0.12)] hover:-translate-y-1 hover:shadow-[0_2px_4px_rgba(15,23,42,0.08),0_20px_40px_-16px_rgba(15,23,42,0.20)]',
			},
			width: {
				snap: 'w-72 flex-shrink-0 sm:w-80',
				snapWide: 'w-80 flex-shrink-0 sm:w-[22rem]',
				fluid: 'w-full',
			},
		},
		defaultVariants: { elevation: 'raised', width: 'snap' },
	},
);

export interface EntityCardProps
	extends HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof cardVariants> {
	to?: string;
	href?: string;
	onClick?: () => void;
	children?: ReactNode;
}

export const EntityCard = forwardRef<HTMLDivElement, EntityCardProps>(function EntityCard(
	{ to, href, onClick, elevation, width, className, children, ...rest },
	ref,
) {
	const LinkComponent = useDsLinkComponent();
	const classes = cn(cardVariants({ elevation, width }), className);
	const inner = (
		<div ref={ref} className={classes} {...rest}>
			{children}
		</div>
	);

	if (to) {
		return (
			<LinkComponent
				href={to}
				className="block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ds-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ds-bg)] rounded-[var(--ds-radius-xl)]"
			>
				{inner}
			</LinkComponent>
		);
	}
	if (href) {
		return (
			<a
				href={href}
				target="_blank"
				rel="noreferrer"
				className="block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ds-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ds-bg)] rounded-[var(--ds-radius-xl)]"
			>
				{inner}
			</a>
		);
	}
	if (onClick) {
		return (
			<button
				type="button"
				onClick={onClick}
				className="block h-full w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ds-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ds-bg)] rounded-[var(--ds-radius-xl)]"
			>
				{inner}
			</button>
		);
	}
	return inner;
});

const imageVariants = cva('relative w-full overflow-hidden bg-[var(--ds-surface-muted)]', {
	variants: {
		aspect: {
			'4/3': 'aspect-[4/3]',
			'1/1': 'aspect-square',
			'3/2': 'aspect-[3/2]',
			'16/9': 'aspect-video',
			'5/4': 'aspect-[5/4]',
		},
	},
	defaultVariants: { aspect: '4/3' },
});

export interface EntityCardImageProps
	extends HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof imageVariants> {
	src?: string | null;
	alt?: string;
	fallbackIcon?: ComponentType<{ className?: string }>;
	fallbackScene?: ReactNode;
	bottomAction?: ReactNode;
	children?: ReactNode;
}

export function EntityCardImage({
	src,
	alt = '',
	aspect,
	fallbackIcon: FallbackIcon,
	fallbackScene,
	bottomAction,
	className,
	children,
	...rest
}: EntityCardImageProps) {
	return (
		<div className={cn(imageVariants({ aspect }), className)} {...rest}>
			{src ? (
				<img
					src={src}
					alt={alt}
					loading="lazy"
					className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover/entity-card:scale-[1.04]"
				/>
			) : fallbackScene ? (
				<div className="relative h-full w-full bg-gray-100">{fallbackScene}</div>
			) : (
				<div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[var(--ds-surface-muted)] to-[var(--ds-border)]">
					{FallbackIcon ? (
						<FallbackIcon className="h-14 w-14 text-[var(--ds-text-subtle)]" />
					) : null}
				</div>
			)}
			{children}
			{bottomAction && (
				<div className="absolute bottom-3 right-3 z-20">{bottomAction}</div>
			)}
		</div>
	);
}

const badgePositions = {
	'top-left': 'left-3 top-3',
	'top-right': 'right-3 top-3',
	'bottom-left': 'left-3 bottom-3',
	'bottom-right': 'right-3 bottom-3',
} as const;

export interface EntityCardBadgeProps extends HTMLAttributes<HTMLSpanElement> {
	position?: keyof typeof badgePositions;
	tone?: 'dark' | 'light' | 'brand';
	leftIcon?: ReactNode;
}

export function EntityCardBadge({
	position = 'top-left',
	tone = 'dark',
	leftIcon,
	className,
	children,
	...rest
}: EntityCardBadgeProps) {
	const toneClasses =
		tone === 'dark'
			? 'bg-black/65 text-white backdrop-blur-sm'
			: tone === 'light'
				? 'bg-white/95 text-[var(--ds-text)] backdrop-blur-sm shadow-sm'
				: 'bg-[var(--ds-brand-600)] text-[var(--ds-text-on-brand)] shadow';
	return (
		<span
			className={cn(
				'absolute z-10 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold',
				badgePositions[position],
				toneClasses,
				className,
			)}
			{...rest}
		>
			{leftIcon}
			{children}
		</span>
	);
}

export interface EntityCardProgressRingProps extends HTMLAttributes<HTMLDivElement> {
	percent: number;
	position?: keyof typeof badgePositions;
	size?: number;
	ariaLabel?: string;
}

export function EntityCardProgressRing({
	percent,
	position = 'top-right',
	size = 48,
	ariaLabel,
	className,
	...rest
}: EntityCardProgressRingProps) {
	const clamped = Math.max(0, Math.min(100, Math.round(percent)));
	const VB = 100;
	const stroke = 14;
	const radius = (VB - stroke) / 2;
	const circumference = 2 * Math.PI * radius;
	const dashOffset = circumference * (1 - clamped / 100);

	return (
		<div
			className={cn(
				'absolute z-10 flex items-center justify-center rounded-full',
				badgePositions[position],
				className,
			)}
			style={{ width: size, height: size }}
			role="img"
			aria-label={ariaLabel ?? `${clamped}% complete`}
			{...rest}
		>
			<svg
				viewBox={`0 0 ${VB} ${VB}`}
				className="absolute inset-0 -rotate-90"
				aria-hidden="true"
			>
				<circle
					cx={VB / 2}
					cy={VB / 2}
					r={radius}
					fill="none"
					stroke="rgba(255,255,255,0.45)"
					strokeWidth={stroke}
				/>
				<circle
					cx={VB / 2}
					cy={VB / 2}
					r={radius}
					fill="none"
					stroke="var(--ds-brand-700)"
					strokeWidth={stroke}
					strokeLinecap="round"
					strokeDasharray={circumference}
					strokeDashoffset={dashOffset}
					style={{ transition: 'stroke-dashoffset 400ms ease-out' }}
				/>
			</svg>
		</div>
	);
}

export function EntityCardBody({
	className,
	children,
	...rest
}: HTMLAttributes<HTMLDivElement>) {
	return (
		<div className={cn('flex flex-1 flex-col gap-2 p-5', className)} {...rest}>
			{children}
		</div>
	);
}

export function EntityCardEyebrow({
	className,
	children,
	...rest
}: HTMLAttributes<HTMLSpanElement>) {
	return (
		<span
			className={cn(
				'text-xs font-semibold uppercase tracking-[0.14em] text-[var(--ds-brand-700)]',
				className,
			)}
			{...rest}
		>
			{children}
		</span>
	);
}

export function EntityCardTitle({
	className,
	children,
	...rest
}: HTMLAttributes<HTMLHeadingElement>) {
	return (
		<h3
			className={cn(
				'line-clamp-2 text-lg font-semibold leading-snug text-[var(--ds-text)]',
				className,
			)}
			{...rest}
		>
			{children}
		</h3>
	);
}

export function EntityCardDescription({
	className,
	children,
	...rest
}: HTMLAttributes<HTMLParagraphElement>) {
	return (
		<p
			className={cn(
				'line-clamp-2 text-sm leading-normal text-[var(--ds-text-muted)]',
				className,
			)}
			{...rest}
		>
			{children}
		</p>
	);
}

export function EntityCardTags({
	className,
	children,
	...rest
}: HTMLAttributes<HTMLDivElement>) {
	return (
		<div className={cn('flex flex-wrap gap-1.5 pt-1', className)} {...rest}>
			{children}
		</div>
	);
}

export interface EntityCardMetaProps extends HTMLAttributes<HTMLDivElement> {
	children?: ReactNode;
}

export function EntityCardMeta({ className, children, ...rest }: EntityCardMetaProps) {
	return (
		<div
			className={cn(
				'mt-auto flex flex-wrap items-center gap-x-4 gap-y-1.5 pt-3 text-sm text-[var(--ds-text-muted)]',
				className,
			)}
			{...rest}
		>
			{children}
		</div>
	);
}

export interface EntityCardMetaItemProps
	extends Omit<AnchorHTMLAttributes<HTMLSpanElement>, 'children'> {
	icon?: ComponentType<{ className?: string }>;
	children?: ReactNode;
}

export function EntityCardMetaItem({
	icon: Icon,
	className,
	children,
	...rest
}: EntityCardMetaItemProps) {
	return (
		<span className={cn('inline-flex items-center gap-1.5', className)} {...rest}>
			{Icon && <Icon className="h-4 w-4 shrink-0" />}
			<span>{children}</span>
		</span>
	);
}
