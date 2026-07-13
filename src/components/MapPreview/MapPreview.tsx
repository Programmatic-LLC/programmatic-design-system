import type { HTMLAttributes, ReactNode } from 'react';
import { MapPin, Navigation } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { cn } from '../../utils/cn';
import { Button } from '../../atoms/Button';

export interface MapPreviewProps extends HTMLAttributes<HTMLDivElement> {
	address?: ReactNode;
	coordinates?: { latitude: number; longitude: number };
	aspectRatio?: string;
	onGetDirections?: () => void;
	primaryActionLabel?: string;
	rounded?: boolean;
	children?: ReactNode;
}

function formatCoord(n: number) {
	return n.toFixed(4);
}

export function MapPreview({
	address,
	coordinates,
	aspectRatio = '16/9',
	onGetDirections,
	primaryActionLabel = 'Get directions',
	rounded = true,
	className,
	children,
	style,
	...props
}: MapPreviewProps) {
	const reduceMotion = useReducedMotion();
	const pulseAnim = reduceMotion
		? {}
		: {
			animate: { scale: [1, 1.6, 1], opacity: [0.55, 0, 0.55] },
			transition: { duration: 2.4, repeat: Infinity, ease: 'easeOut' as const },
		};

	return (
		<div
			className={cn(
				'relative w-full overflow-hidden border border-[var(--ds-border)] bg-[var(--ds-surface-muted)]',
				rounded && 'rounded-[var(--ds-radius-xl)]',
				className,
			)}
			style={{ aspectRatio, ...style }}
			{...props}
		>
			{children ?? (
				<div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-[var(--ds-brand-100)] via-[var(--ds-brand-50)] to-[var(--ds-neutral-50)]">
					<div className="relative">
						<motion.span
							{...pulseAnim}
							aria-hidden="true"
							className="absolute inset-0 m-auto h-10 w-10 rounded-full bg-[var(--ds-brand-500)]/35"
						/>
						<MapPin className="relative h-10 w-10 text-[var(--ds-brand-600)] drop-shadow-sm" />
					</div>
				</div>
			)}

			{(address || coordinates) && (
				<div className="pointer-events-none absolute inset-x-3 top-3 flex sm:inset-x-4 sm:top-4">
					<div className="pointer-events-auto flex max-w-full items-center gap-2 rounded-full bg-white/85 px-3 py-2 shadow-[0_2px_10px_rgba(15,23,42,0.08)] ring-1 ring-black/[0.04] backdrop-blur-md">
						<MapPin
							className="h-4 w-4 shrink-0 text-[var(--ds-brand-600)]"
							aria-hidden="true"
						/>
						<div className="flex min-w-0 flex-col leading-tight">
							{address && (
								<span className="text-sm font-medium text-[var(--ds-text)]">
									{address}
								</span>
							)}
							{coordinates && (
								<span className="font-mono text-[0.6875rem] text-[var(--ds-text-muted)]">
									{formatCoord(coordinates.latitude)}, {formatCoord(coordinates.longitude)}
								</span>
							)}
						</div>
					</div>
				</div>
			)}

			{onGetDirections && (
				<div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4">
					<Button
						onClick={onGetDirections}
						leftIcon={<Navigation className="h-4 w-4" />}
						size="sm"
						className="shadow-[0_4px_12px_rgba(15,23,42,0.18)]"
					>
						{primaryActionLabel}
					</Button>
				</div>
			)}
		</div>
	);
}
