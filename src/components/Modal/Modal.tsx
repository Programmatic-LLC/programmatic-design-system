import { useEffect, useRef, type CSSProperties, type HTMLAttributes, type ReactNode, type RefObject } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { X } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';
import { Text } from '../../atoms/Text';
import { useBrandTheme } from '../../theme/BrandThemeProvider';
import { useFocusTrap } from '../../hooks/useFocusTrap';

const panelVariants = cva(
	'pointer-events-auto relative isolate flex w-full flex-col overflow-hidden rounded-[var(--ds-radius-xl)] bg-[var(--ds-surface)] shadow-[0_30px_80px_-20px_rgba(15,23,42,0.45),0_0_0_1px_rgba(15,23,42,0.04)] ring-1 ring-black/[0.02] focus:outline-none',
	{
		variants: {
			size: {
				sm: 'max-w-md',
				md: 'max-w-2xl',
				lg: 'max-w-3xl',
				xl: 'max-w-5xl',
				'2xl': 'max-w-6xl',
				full: 'max-w-full',
			},
			height: {
				auto: 'max-h-[90dvh]',
				tall: 'h-[90dvh] max-h-[90dvh]',
			},
		},
		defaultVariants: { size: 'md', height: 'auto' },
	},
);

export interface ModalProps extends VariantProps<typeof panelVariants> {
	open: boolean;
	onClose: () => void;
	title?: ReactNode;
	titleAccessory?: ReactNode;
	icon?: ReactNode;
	footer?: ReactNode;
	headerContent?: ReactNode;
	children?: ReactNode;
	hideCloseButton?: boolean;
	dismissOnBackdrop?: boolean;
	dismissOnEsc?: boolean;
	onCloseDisabled?: boolean;
	asSheet?: boolean;
	tone?: 'brand' | 'neutral';
	className?: string;
	contentClassName?: string;
	contentRef?: RefObject<HTMLDivElement | null>;
	initialFocusRef?: RefObject<HTMLElement | null>;
	ariaLabel?: string;
}

export function Modal({
	open,
	onClose,
	title,
	titleAccessory,
	icon,
	footer,
	headerContent,
	size,
	height,
	hideCloseButton = false,
	dismissOnBackdrop = true,
	dismissOnEsc = true,
	onCloseDisabled = false,
	asSheet = false,
	tone = 'brand',
	className,
	contentClassName,
	contentRef,
	initialFocusRef,
	ariaLabel,
	children,
}: ModalProps) {
	const panelRef = useRef<HTMLDivElement>(null);
	const reduceMotion = useReducedMotion();
	const { vars: brandVars } = useBrandTheme();

	useEffect(() => {
		if (!open || !dismissOnEsc || onCloseDisabled) return;
		const handler = (e: KeyboardEvent) => {
			if (e.key === 'Escape') onClose();
		};
		window.addEventListener('keydown', handler);
		return () => window.removeEventListener('keydown', handler);
	}, [open, dismissOnEsc, onCloseDisabled, onClose]);

	useFocusTrap(open, panelRef, initialFocusRef);

	useEffect(() => {
		if (!open) return;
		const prev = document.body.style.overflow;
		document.body.style.overflow = 'hidden';
		return () => {
			document.body.style.overflow = prev;
		};
	}, [open]);

	if (typeof document === 'undefined') return null;

	const overlayAnim = reduceMotion
		? { initial: false, animate: { opacity: 1 }, exit: { opacity: 0 } }
		: {
			initial: { opacity: 0 },
			animate: { opacity: 1 },
			exit: { opacity: 0 },
			transition: { duration: 0.2, ease: 'easeOut' as const },
		};

	const panelAnim = reduceMotion
		? { initial: false, animate: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0 } }
		: {
			initial: { opacity: 0, y: 16, scale: 0.97 },
			animate: { opacity: 1, y: 0, scale: 1 },
			exit: { opacity: 0, y: 10, scale: 0.97 },
			transition: { duration: 0.26, ease: [0.22, 1, 0.36, 1] as const },
		};

	const sheetAnim = reduceMotion
		? { initial: false, animate: { opacity: 1, y: 0 }, exit: { opacity: 0 } }
		: {
			initial: { y: '100%' },
			animate: { y: 0 },
			exit: { y: '100%' },
			transition: { type: 'spring' as const, damping: 32, stiffness: 320, mass: 0.8 },
		};

	const sheetPanelClasses =
		'pointer-events-auto relative isolate flex w-full max-h-[90dvh] flex-col overflow-hidden rounded-t-[var(--ds-radius-xl)] bg-[var(--ds-surface)] shadow-[0_-12px_40px_-12px_rgba(15,23,42,0.25)] ring-1 ring-black/5 pb-[env(safe-area-inset-bottom)] focus:outline-none';

	const portalStyle: CSSProperties = brandVars ?? {};

	return createPortal(
		<AnimatePresence>
			{open && (
				<motion.div
					{...overlayAnim}
					className={cn(
						'fixed inset-0 z-[60] flex h-[100dvh] justify-center',
						asSheet ? 'items-end' : 'items-center p-4',
					)}
					aria-modal="true"
					role="dialog"
					aria-label={typeof title === 'string' ? title : ariaLabel}
					style={portalStyle}
				>
					<div
						className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
						onClick={dismissOnBackdrop && !onCloseDisabled ? onClose : undefined}
						aria-hidden="true"
					/>
					<motion.div
						{...(asSheet ? sheetAnim : panelAnim)}
						ref={panelRef}
						tabIndex={-1}
						className={cn(
							asSheet ? sheetPanelClasses : panelVariants({ size, height }),
							className,
						)}
					>
						{(title || !hideCloseButton) && (
							<header className="relative shrink-0 border-b border-[var(--ds-border)] bg-[var(--ds-surface)] px-6 py-5">
								{tone === 'brand' && (
									<span
										aria-hidden="true"
										className="absolute inset-x-0 top-0 h-0.5 bg-[var(--ds-brand-600)]"
									/>
								)}
								<div className="flex items-start justify-between gap-4">
									<div className="flex min-w-0 items-center gap-3">
										{icon && (
											<span
												className={cn(
													'grid h-10 w-10 shrink-0 place-items-center rounded-[var(--ds-radius-md)]',
													tone === 'neutral'
														? 'bg-gray-100 text-gray-700'
														: 'bg-[var(--ds-brand-50)] text-[var(--ds-brand-700)]',
												)}
											>
												{icon}
											</span>
										)}
										<div className="min-w-0">
											{title && (
												<div className="flex flex-wrap items-center gap-2">
													<Text
														variant="h3"
														as="h2"
														className="leading-tight tracking-tight text-[var(--ds-text)]"
													>
														{title}
													</Text>
													{titleAccessory}
												</div>
											)}
										</div>
									</div>
									{!hideCloseButton && (
										<button
											type="button"
											onClick={onClose}
											disabled={onCloseDisabled}
											aria-label="Close"
											className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[var(--ds-text-muted)] transition-colors hover:bg-[var(--ds-surface-muted)] hover:text-[var(--ds-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ds-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ds-surface)] disabled:cursor-not-allowed disabled:opacity-50"
										>
											<X className="h-5 w-5" />
										</button>
									)}
								</div>
							</header>
						)}
						{headerContent}
						<div
							ref={contentRef}
							className={cn('flex-1 overflow-y-auto px-6 py-6', contentClassName)}
						>
							{children}
						</div>
						{footer && (
							<footer className="flex shrink-0 items-center justify-between gap-3 border-t border-[var(--ds-border)] bg-[var(--ds-surface)] px-6 py-4">
								{footer}
							</footer>
						)}
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>,
		document.body,
	);
}

export interface ModalSectionProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
	title?: ReactNode;
	description?: ReactNode;
}

export function ModalSection({
	title,
	description,
	className,
	children,
	...rest
}: ModalSectionProps) {
	return (
		<section className={cn('flex flex-col gap-3', className)} {...rest}>
			{(title || description) && (
				<div className="flex flex-col gap-1">
					{title && (
						<Text
							variant="overline"
							className="tracking-[0.18em] text-[var(--ds-text-muted)]"
						>
							{title}
						</Text>
					)}
					{description && (
						<Text variant="body-sm" color="muted">
							{description}
						</Text>
					)}
				</div>
			)}
			{children}
		</section>
	);
}
