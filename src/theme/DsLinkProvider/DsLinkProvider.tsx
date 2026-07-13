'use client';

import { useContext, type ReactNode } from 'react';
import { dsLinkContext, type DsLinkComponent } from './dsLinkContext';

export interface DsLinkProviderProps {
	component: DsLinkComponent;
	children?: ReactNode;
}

export function DsLinkProvider({ component, children }: DsLinkProviderProps) {
	return <dsLinkContext.Provider value={component}>{children}</dsLinkContext.Provider>;
}

export function useDsLinkComponent(): DsLinkComponent {
	return useContext(dsLinkContext);
}
