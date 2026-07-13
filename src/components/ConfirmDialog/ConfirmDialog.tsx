'use client';

import {
	createContext,
	useCallback,
	useContext,
	useMemo,
	useRef,
	useState,
	type ReactNode,
} from 'react';
import { AlertCircle, AlertTriangle, Info, HelpCircle } from 'lucide-react';
import { cn } from '../../utils/cn';
import { Button } from '../../atoms/Button';
import { Modal } from '../Modal';

export type ConfirmVariant = 'danger' | 'warning' | 'info' | 'default';

export interface ConfirmOptions {
	title: string;
	message: string;
	confirmText?: string;
	variant?: ConfirmVariant;
}

interface ConfirmContextValue {
	confirm: (options: ConfirmOptions) => Promise<boolean>;
}

const ConfirmContext = createContext<ConfirmContextValue | undefined>(undefined);

export function useConfirm() {
	const context = useContext(ConfirmContext);
	if (!context) {
		throw new Error('useConfirm must be used within ConfirmProvider');
	}
	return context;
}

interface ConfirmState extends ConfirmOptions {
	isOpen: boolean;
	resolve: (value: boolean) => void;
}

export function ConfirmProvider({ children }: { children: ReactNode }) {
	const [state, setState] = useState<ConfirmState>({
		isOpen: false,
		title: '',
		message: '',
		confirmText: 'Confirm',
		variant: 'default',
		resolve: () => {},
	});

	const confirm = useCallback((options: ConfirmOptions): Promise<boolean> => {
		return new Promise((resolve) => {
			setState({
				isOpen: true,
				title: options.title,
				message: options.message,
				confirmText: options.confirmText || 'Confirm',
				variant: options.variant || 'default',
				resolve,
			});
		});
	}, []);

	const handleConfirm = useCallback(() => {
		setState(prev => {
			prev.resolve(true);
			return { ...prev, isOpen: false };
		});
	}, []);

	const handleCancel = useCallback(() => {
		setState(prev => {
			prev.resolve(false);
			return { ...prev, isOpen: false };
		});
	}, []);

	const value = useMemo(() => ({ confirm }), [confirm]);

	return (
		<ConfirmContext.Provider value={value}>
			{children}
			<ConfirmDialog
				{...state}
				onConfirm={handleConfirm}
				onCancel={handleCancel}
			/>
		</ConfirmContext.Provider>
	);
}

const CONFIRM_CONFIG: Record<
	ConfirmVariant,
	{ icon: typeof HelpCircle; iconClasses: string; confirmVariant: 'primary' | 'danger' }
> = {
	danger: {
		icon: AlertCircle,
		iconClasses: 'bg-[var(--ds-danger-surface)] text-[var(--ds-danger-strong)]',
		confirmVariant: 'danger',
	},
	warning: {
		icon: AlertTriangle,
		iconClasses: 'bg-[var(--ds-warning-surface)] text-[var(--ds-warning-strong)]',
		confirmVariant: 'primary',
	},
	info: {
		icon: Info,
		iconClasses: 'bg-[var(--ds-info-surface)] text-[var(--ds-info-strong)]',
		confirmVariant: 'primary',
	},
	default: {
		icon: HelpCircle,
		iconClasses: 'bg-[var(--ds-surface-muted)] text-[var(--ds-text-muted)]',
		confirmVariant: 'primary',
	},
};

interface ConfirmDialogProps extends ConfirmOptions {
	isOpen: boolean;
	onConfirm: () => void;
	onCancel: () => void;
}

function ConfirmDialog({
	isOpen,
	title,
	message,
	confirmText = 'Confirm',
	variant = 'default',
	onConfirm,
	onCancel,
}: ConfirmDialogProps) {
	const confirmRef = useRef<HTMLButtonElement>(null);
	const variantConfig = CONFIRM_CONFIG[variant ?? 'default'];
	const Icon = variantConfig.icon;

	return (
		<Modal
			open={isOpen}
			onClose={onCancel}
			size="sm"
			hideCloseButton
			tone="neutral"
			ariaLabel={title}
			initialFocusRef={confirmRef}
		>
			<div
				className={cn(
					'w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4',
					variantConfig.iconClasses,
				)}
			>
				<Icon className="w-6 h-6" aria-hidden="true" />
			</div>
			<div className="text-center mb-6">
				<h3 className="text-lg font-semibold text-[var(--ds-text)] mb-2">
					{title}
				</h3>
				<p className="text-sm text-[var(--ds-text-muted)]">
					{message}
				</p>
			</div>
			<div className="flex gap-3">
				<Button variant="secondary" fullWidth onClick={onCancel}>
					Cancel
				</Button>
				<Button
					ref={confirmRef}
					variant={variantConfig.confirmVariant}
					fullWidth
					onClick={onConfirm}
				>
					{confirmText}
				</Button>
			</div>
		</Modal>
	);
}
