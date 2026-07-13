import { createContext, type ComponentType, type ReactNode } from 'react';

export interface DsLinkComponentProps {
	href: string;
	className?: string;
	children?: ReactNode;
}

export type DsLinkComponent = ComponentType<DsLinkComponentProps>;

function DefaultLink({ href, className, children }: DsLinkComponentProps) {
	return (
		<a href={href} className={className}>
			{children}
		</a>
	);
}

export const dsLinkContext = createContext<DsLinkComponent>(DefaultLink);
