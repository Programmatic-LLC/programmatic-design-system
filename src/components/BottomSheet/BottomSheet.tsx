import { useEffect, useId, useRef, type ReactNode } from 'react';
import {
	AnimatePresence,
	motion,
	useDragControls,
	useReducedMotion,
	type PanInfo,
} from 'motion/react';
import { cn } from '../../utils/cn';
import { useFocusTrap } from '../../hooks/useFocusTrap';

export interface BottomSheetProps {
	isOpen: boolean;
	onClose: () => void;
	children: ReactNode;
	withBackdrop?: boolean;
	dragToDismiss?: boolean;
	showHandle?: boolean;
	handleOverlay?: boolean;
	lockBodyScroll?: boolean;
	ariaLabel?: string;
	className?: string;
}

const DISMISS_OFFSET_PX = 96;
const DISMISS_VELOCITY = 600;

export function BottomSheet({
	isOpen,
	onClose,
	children,
	withBackdrop = false,
	dragToDismiss = true,
	showHandle = true,
	handleOverlay = false,
	lockBodyScroll = false,
	ariaLabel,
	className,
}: BottomSheetProps) {
	const reduceMotion = useReducedMotion();
	const labelId = useId();
	const dragControls = useDragControls();
	const panelRef = useRef<HTMLDivElement>(null);
	const canDrag = dragToDismiss && !reduceMotion;

	useFocusTrap(isOpen && withBackdrop, panelRef);

	useEffect(() => {
		if (!isOpen || !lockBodyScroll) return;
		const original = document.body.style.overflow;
		document.body.style.overflow = 'hidden';
		return () => {
			document.body.style.overflow = original;
		};
	}, [isOpen, lockBodyScroll]);

	useEffect(() => {
		if (!isOpen) return;
		const onKey = (e: KeyboardEvent) => {
			if (e.key === 'Escape') onClose();
		};
		window.addEventListener('keydown', onKey);
		return () => window.removeEventListener('keydown', onKey);
	}, [isOpen, onClose]);

	const handleDragEnd = (_: unknown, info: PanInfo) => {
		if (info.offset.y > DISMISS_OFFSET_PX || info.velocity.y > DISMISS_VELOCITY) {
			onClose();
		}
	};

	return (
		<AnimatePresence>
			{isOpen && (
				<>
					{withBackdrop && (
						<motion.div
							key="bottom-sheet-backdrop"
							aria-hidden="true"
							onClick={onClose}
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{ duration: reduceMotion ? 0 : 0.2 }}
							className="fixed inset-0 z-40 bg-black/40"
						/>
					)}
					<motion.div
						key="bottom-sheet-panel"
						ref={panelRef}
						tabIndex={-1}
						role="dialog"
						aria-modal={withBackdrop ? 'true' : undefined}
						aria-labelledby={ariaLabel ? undefined : labelId}
						aria-label={ariaLabel}
						initial={reduceMotion ? { opacity: 0 } : { y: '100%' }}
						animate={reduceMotion ? { opacity: 1 } : { y: 0 }}
						exit={reduceMotion ? { opacity: 0 } : { y: '100%' }}
						transition={
							reduceMotion
								? { duration: 0.15 }
								: { type: 'spring', damping: 32, stiffness: 320, mass: 0.8 }
						}
						drag={canDrag ? 'y' : false}
						dragControls={dragControls}
						dragListener={false}
						dragConstraints={{ top: 0, bottom: 0 }}
						dragElastic={{ top: 0, bottom: 0.5 }}
						dragMomentum={false}
						onDragEnd={handleDragEnd}
						className={cn(
							'fixed inset-x-0 bottom-0 z-50',
							'overflow-hidden rounded-t-[var(--ds-radius-xl)] bg-[var(--ds-surface)]',
							'shadow-[0_-12px_40px_-12px_rgba(15,23,42,0.25)] ring-1 ring-black/5',
							'pb-[env(safe-area-inset-bottom)]',
							'touch-pan-y',
							className,
						)}
					>
						{showHandle &&
							(handleOverlay ? (
								<div
									aria-hidden="true"
									className="pointer-events-none absolute inset-x-0 top-0 z-10 flex justify-center"
								>
									<div
										onPointerDown={canDrag ? (e) => dragControls.start(e) : undefined}
										className={cn(
											'flex justify-center px-8 pb-4 pt-2.5',
											canDrag &&
												'pointer-events-auto cursor-grab touch-none active:cursor-grabbing',
										)}
									>
										<div className="h-1.5 w-10 rounded-full bg-white/85 shadow-[0_1px_3px_rgba(0,0,0,0.25)] backdrop-blur-sm" />
									</div>
								</div>
							) : (
								<div className="flex justify-center" aria-hidden="true">
									<div
										onPointerDown={canDrag ? (e) => dragControls.start(e) : undefined}
										className={cn(
											'flex justify-center px-8 pb-2 pt-2',
											canDrag && 'cursor-grab touch-none active:cursor-grabbing',
										)}
									>
										<div className="h-1.5 w-10 rounded-full bg-[var(--ds-border)]" />
									</div>
								</div>
							))}
						{!ariaLabel && (
							<span id={labelId} className="sr-only">
								Details panel
							</span>
						)}
						{children}
					</motion.div>
				</>
			)}
		</AnimatePresence>
	);
}
