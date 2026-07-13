import {
	cloneElement,
	createContext,
	isValidElement,
	useCallback,
	useContext,
	useEffect,
	useId,
	useRef,
	useState,
	type ButtonHTMLAttributes,
	type MouseEvent,
	type ReactElement,
	type ReactNode,
	type RefObject,
} from 'react';
import { cn } from '../../utils/cn';

interface MenuContextValue {
	open: boolean;
	setOpen: (value: boolean) => void;
	toggle: () => void;
	close: () => void;
	triggerRef: RefObject<HTMLButtonElement | null>;
	contentRef: RefObject<HTMLDivElement | null>;
	triggerId: string;
	contentId: string;
}

const MenuContext = createContext<MenuContextValue | null>(null);

function useMenuContext(component: string): MenuContextValue {
	const context = useContext(MenuContext);
	if (!context) {
		throw new Error(`${component} must be used within <Menu>`);
	}
	return context;
}

function getMenuItems(container: HTMLElement | null): HTMLElement[] {
	if (!container) return [];
	const selector = '[role="menuitem"]:not([aria-disabled="true"]),[role="menuitemradio"]:not([aria-disabled="true"])';
	return Array.from(container.querySelectorAll<HTMLElement>(selector));
}

export interface MenuProps {
	children: ReactNode;
	className?: string;
}

export function Menu({ children, className }: MenuProps) {
	const [open, setOpen] = useState(false);
	const triggerRef = useRef<HTMLButtonElement>(null);
	const contentRef = useRef<HTMLDivElement>(null);
	const triggerId = useId();
	const contentId = useId();

	const close = useCallback(() => {
		setOpen(false);
		triggerRef.current?.focus();
	}, []);

	const toggle = useCallback(() => setOpen((prev) => !prev), []);

	useEffect(() => {
		if (!open) return;
		const onPointerDown = (event: PointerEvent) => {
			const target = event.target as Node | null;
			if (!target) return;
			if (triggerRef.current?.contains(target)) return;
			if (contentRef.current?.contains(target)) return;
			setOpen(false);
		};
		window.addEventListener('pointerdown', onPointerDown);
		return () => window.removeEventListener('pointerdown', onPointerDown);
	}, [open]);

	return (
		<MenuContext.Provider value={{ open, setOpen, toggle, close, triggerRef, contentRef, triggerId, contentId }}>
			<div className={cn('relative', className)}>{children}</div>
		</MenuContext.Provider>
	);
}

export interface MenuTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	children: ReactNode;
}

function MenuTrigger({ children, className, onClick, ...rest }: MenuTriggerProps) {
	const { open, toggle, triggerRef, triggerId, contentId } = useMenuContext('Menu.Trigger');

	return (
		<button
			ref={triggerRef}
			type="button"
			id={triggerId}
			aria-haspopup="menu"
			aria-expanded={open}
			aria-controls={open ? contentId : undefined}
			onClick={(event) => {
				onClick?.(event);
				toggle();
			}}
			className={className}
			{...rest}
		>
			{children}
		</button>
	);
}

export interface MenuContentProps {
	children: ReactNode;
	className?: string;
	align?: 'start' | 'end';
	'aria-label'?: string;
}

function MenuContent({ children, className, align = 'end', 'aria-label': ariaLabel }: MenuContentProps) {
	const { open, contentRef, contentId, triggerId, close, setOpen } = useMenuContext('Menu.Content');

	useEffect(() => {
		if (!open) return;
		const items = getMenuItems(contentRef.current);
		items[0]?.focus();
	}, [open, contentRef]);

	if (!open) return null;

	const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
		const items = getMenuItems(contentRef.current);
		if (items.length === 0) return;
		const currentIndex = items.indexOf(document.activeElement as HTMLElement);

		switch (event.key) {
		case 'ArrowDown':
			event.preventDefault();
			items[(currentIndex + 1) % items.length]?.focus();
			break;
		case 'ArrowUp':
			event.preventDefault();
			items[(currentIndex - 1 + items.length) % items.length]?.focus();
			break;
		case 'Home':
			event.preventDefault();
			items[0]?.focus();
			break;
		case 'End':
			event.preventDefault();
			items[items.length - 1]?.focus();
			break;
		case 'Escape':
			event.preventDefault();
			close();
			break;
		case 'Tab':
			setOpen(false);
			break;
		}
	};

	return (
		<div
			ref={contentRef}
			id={contentId}
			role="menu"
			aria-label={ariaLabel}
			aria-labelledby={ariaLabel ? undefined : triggerId}
			onKeyDown={handleKeyDown}
			className={cn(
				'absolute z-50 mt-2 min-w-[12rem] overflow-hidden rounded-[var(--ds-radius-lg)] bg-[var(--ds-surface)] py-1 shadow-[0_12px_32px_-12px_rgba(15,23,42,0.18)] ring-1 ring-[var(--ds-border)]',
				align === 'end' ? 'right-0' : 'left-0',
				className,
			)}
		>
			{children}
		</div>
	);
}

export interface MenuItemProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onSelect'> {
	children: ReactNode;
	onSelect?: () => void;
	selected?: boolean;
	closeOnSelect?: boolean;
	asChild?: boolean;
}

function MenuItem({
	children,
	className,
	onSelect,
	selected,
	closeOnSelect = true,
	disabled,
	onClick,
	asChild,
	...rest
}: MenuItemProps) {
	const { close, setOpen } = useMenuContext('Menu.Item');
	const isRadio = selected !== undefined;
	const role = isRadio ? 'menuitemradio' : 'menuitem';

	const itemClassName = cn(
		'flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-[var(--ds-text)] transition-colors',
		'hover:bg-[var(--ds-brand-50)] focus:bg-[var(--ds-brand-50)] focus:outline-none',
		selected && 'text-[var(--ds-brand-700)]',
		disabled && 'cursor-not-allowed opacity-50 hover:bg-transparent',
		className,
	);

	const activate = () => {
		onSelect?.();
		if (closeOnSelect) {
			close();
		} else {
			setOpen(false);
		}
	};

	if (asChild && isValidElement(children)) {
		const child = children as ReactElement<{ className?: string; onClick?: (event: MouseEvent<HTMLElement>) => void }>;
		return cloneElement(child, {
			role,
			tabIndex: -1,
			'aria-checked': isRadio ? selected : undefined,
			'aria-disabled': disabled || undefined,
			className: cn(itemClassName, child.props.className),
			onClick: (event: MouseEvent<HTMLElement>) => {
				if (disabled) {
					event.preventDefault();
					return;
				}
				child.props.onClick?.(event);
				activate();
			},
		} as Record<string, unknown>);
	}

	return (
		<button
			type="button"
			role={role}
			tabIndex={-1}
			aria-checked={isRadio ? selected : undefined}
			aria-disabled={disabled || undefined}
			disabled={disabled}
			onClick={(event) => {
				if (disabled) return;
				onClick?.(event);
				activate();
			}}
			className={itemClassName}
			{...rest}
		>
			{children}
		</button>
	);
}

export interface MenuSectionProps {
	children: ReactNode;
	label?: string;
	className?: string;
}

function MenuSection({ children, label, className }: MenuSectionProps) {
	const labelId = useId();

	return (
		<div role="group" aria-labelledby={label ? labelId : undefined} className={className}>
			{label && (
				<div
					id={labelId}
					className="bg-[var(--ds-surface-muted)] px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[var(--ds-text-muted)]"
				>
					{label}
				</div>
			)}
			{children}
		</div>
	);
}

function MenuSeparator({ className }: { className?: string }) {
	return <div role="separator" className={cn('my-1 h-px bg-[var(--ds-border)]', className)} />;
}

Menu.Trigger = MenuTrigger;
Menu.Content = MenuContent;
Menu.Item = MenuItem;
Menu.Section = MenuSection;
Menu.Separator = MenuSeparator;
