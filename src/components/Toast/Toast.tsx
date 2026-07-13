'use client';

import {
	createContext,
	useCallback,
	useContext,
	useMemo,
	useState,
	type ElementType,
	type ReactNode,
} from 'react';
import { CheckCircle, AlertCircle, Info, X, AlertTriangle } from 'lucide-react';
import { cn } from '../../utils/cn';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
	id: string;
	type: ToastType;
	message: string;
	title?: string;
	duration?: number;
}

interface ToastContextValue {
	showToast: (toast: Omit<Toast, 'id'>) => void;
	hideToast: (id: string) => void;
	success: (message: string, title?: string) => void;
	error: (message: string, title?: string) => void;
	warning: (message: string, title?: string) => void;
	info: (message: string, title?: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function useToast() {
	const context = useContext(ToastContext);
	if (!context) {
		throw new Error('useToast must be used within ToastProvider');
	}
	return context;
}

export function ToastProvider({ children }: { children: ReactNode }) {
	const [toasts, setToasts] = useState<Toast[]>([]);

	const hideToast = useCallback((id: string) => {
		setToasts(prev => prev.filter(t => t.id !== id));
	}, []);

	const showToast = useCallback((toast: Omit<Toast, 'id'>) => {
		const id = `toast-${Date.now()}-${Math.random()}`;
		const persistsByType = toast.type === 'error' || toast.type === 'warning';
		const duration = toast.duration ?? (persistsByType ? 0 : 5000);

		const newToast: Toast = {
			...toast,
			id,
			duration,
		};

		setToasts(prev => [...prev, newToast]);

		if (duration > 0) {
			setTimeout(() => {
				hideToast(id);
			}, duration);
		}
	}, [hideToast]);

	const success = useCallback((message: string, title?: string) => {
		showToast({ type: 'success', message, title });
	}, [showToast]);

	const error = useCallback((message: string, title?: string) => {
		showToast({ type: 'error', message, title });
	}, [showToast]);

	const warning = useCallback((message: string, title?: string) => {
		showToast({ type: 'warning', message, title });
	}, [showToast]);

	const info = useCallback((message: string, title?: string) => {
		showToast({ type: 'info', message, title });
	}, [showToast]);

	const value = useMemo(
		() => ({ showToast, hideToast, success, error, warning, info }),
		[showToast, hideToast, success, error, warning, info],
	);

	return (
		<ToastContext.Provider value={value}>
			{children}
			<ToastContainer toasts={toasts} onDismiss={hideToast} />
		</ToastContext.Provider>
	);
}

interface ToastContainerProps {
	toasts: Toast[];
	onDismiss: (id: string) => void;
}

function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
	const politeToasts = toasts.filter(t => t.type !== 'error');
	const assertiveToasts = toasts.filter(t => t.type === 'error');

	return (
		<>
			<div className="sr-only" role="status" aria-live="polite" aria-atomic="false">
				{politeToasts.map(toast => (
					<div key={toast.id}>{toast.title ? `${toast.title}: ` : ''}{toast.message}</div>
				))}
			</div>
			<div className="sr-only" role="alert" aria-live="assertive" aria-atomic="false">
				{assertiveToasts.map(toast => (
					<div key={toast.id}>{toast.title ? `${toast.title}: ` : ''}{toast.message}</div>
				))}
			</div>
			{toasts.length > 0 && (
				<div className="fixed top-4 right-4 z-[70] space-y-2 max-w-sm w-full px-4 pointer-events-none">
					{toasts.map(toast => (
						<ToastItem
							key={toast.id}
							toast={toast}
							onDismiss={() => onDismiss(toast.id)}
						/>
					))}
				</div>
			)}
		</>
	);
}

interface ToastItemProps {
	toast: Toast;
	onDismiss: () => void;
}

const TOAST_CONFIG: Record<ToastType, { icon: ElementType; surface: string; strong: string }> = {
	success: {
		icon: CheckCircle,
		surface: 'var(--ds-success-surface)',
		strong: 'var(--ds-success-strong)',
	},
	error: {
		icon: AlertCircle,
		surface: 'var(--ds-danger-surface)',
		strong: 'var(--ds-danger-strong)',
	},
	warning: {
		icon: AlertTriangle,
		surface: 'var(--ds-warning-surface)',
		strong: 'var(--ds-warning-strong)',
	},
	info: {
		icon: Info,
		surface: 'var(--ds-info-surface)',
		strong: 'var(--ds-info-strong)',
	},
};

function ToastItem({ toast, onDismiss }: ToastItemProps) {
	const [isExiting, setIsExiting] = useState(false);

	const handleDismiss = () => {
		setIsExiting(true);
		setTimeout(onDismiss, 300);
	};

	const typeConfig = TOAST_CONFIG[toast.type] || TOAST_CONFIG.info;
	const Icon = typeConfig.icon;

	return (
		<div
			style={{
				backgroundColor: typeConfig.surface,
				borderColor: typeConfig.strong,
				color: typeConfig.strong,
			}}
			className={cn(
				'border rounded-[var(--ds-radius-md)] shadow-lg p-4 flex items-start gap-3 pointer-events-auto transition-all duration-300 ease-in-out',
				isExiting ? 'opacity-0 translate-x-full' : 'opacity-100 translate-x-0',
			)}
		>
			<Icon className="w-5 h-5 flex-shrink-0 mt-0.5" aria-hidden="true" />

			<div className="flex-1 min-w-0">
				{toast.title && (
					<h4 className="text-sm font-semibold mb-1">
						{toast.title}
					</h4>
				)}
				<p className="text-sm">
					{toast.message}
				</p>
			</div>

			<button
				onClick={handleDismiss}
				className="flex-shrink-0 transition-opacity hover:opacity-70"
				aria-label="Dismiss notification"
			>
				<X className="w-4 h-4" />
			</button>
		</div>
	);
}
