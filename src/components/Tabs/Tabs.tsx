import { useRef, type ElementType, type KeyboardEvent } from 'react';
import { cn } from '../../utils/cn';

export interface TabItem {
	id: string;
	label: string;
	icon: ElementType;
	count?: number;
	visible?: boolean;
}

export interface TabsProps {
	tabs: TabItem[];
	activeTab: string;
	onChange: (tabId: string) => void;
	className?: string;
}

export function Tabs({ tabs, activeTab, onChange, className }: TabsProps) {
	const visibleTabs = tabs.filter((tab) => tab.visible !== false);
	const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

	const focusTab = (tabId: string) => {
		onChange(tabId);
		tabRefs.current[tabId]?.focus();
	};

	const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
		let nextIndex: number | null = null;

		switch (event.key) {
		case 'ArrowRight':
			nextIndex = (index + 1) % visibleTabs.length;
			break;
		case 'ArrowLeft':
			nextIndex = (index - 1 + visibleTabs.length) % visibleTabs.length;
			break;
		case 'Home':
			nextIndex = 0;
			break;
		case 'End':
			nextIndex = visibleTabs.length - 1;
			break;
		default:
			return;
		}

		event.preventDefault();
		focusTab(visibleTabs[nextIndex].id);
	};

	return (
		<div
			className={cn(
				'border-b border-[var(--ds-border)] px-4 sm:px-6 pt-4 flex-shrink-0 bg-[var(--ds-surface-muted)] overflow-x-auto',
				className,
			)}
		>
			<div role="tablist" className="flex gap-1 min-w-max">
				{visibleTabs.map((tab, index) => {
					const Icon = tab.icon;
					const isActive = activeTab === tab.id;

					return (
						<button
							key={tab.id}
							ref={(el) => { tabRefs.current[tab.id] = el; }}
							role="tab"
							id={`tab-${tab.id}`}
							aria-selected={isActive}
							tabIndex={isActive ? 0 : -1}
							onClick={() => onChange(tab.id)}
							onKeyDown={(event) => handleKeyDown(event, index)}
							className={cn(
								'flex flex-shrink-0 whitespace-nowrap items-center gap-2 px-4 py-2 rounded-t-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ds-ring)]',
								isActive
									? 'bg-[var(--ds-surface)] text-[var(--ds-brand-700)] border-t-2 border-l border-r border-[var(--ds-brand-600)]'
									: 'bg-[var(--ds-surface-muted)] text-[var(--ds-text-muted)] hover:bg-[var(--ds-border)]',
							)}
						>
							<Icon className="w-4 h-4" aria-hidden="true" />
							<span className="text-sm font-medium">{tab.label}</span>
							{tab.count !== undefined && (
								<span
									className={cn(
										'ml-1 px-2 py-0.5 rounded-full text-xs font-semibold',
										isActive
											? 'bg-[var(--ds-brand-50)] text-[var(--ds-brand-700)]'
											: 'bg-[var(--ds-border)] text-[var(--ds-text)]',
									)}
								>
									{tab.count}
								</span>
							)}
						</button>
					);
				})}
			</div>
		</div>
	);
}
