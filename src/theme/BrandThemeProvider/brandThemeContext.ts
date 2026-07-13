import { createContext, useContext, type CSSProperties } from 'react';

export interface BrandThemeContextValue {
	color?: string;
	vars?: CSSProperties;
}

export const BrandThemeContext = createContext<BrandThemeContextValue>({});

export function useBrandTheme(): BrandThemeContextValue {
	return useContext(BrandThemeContext);
}
