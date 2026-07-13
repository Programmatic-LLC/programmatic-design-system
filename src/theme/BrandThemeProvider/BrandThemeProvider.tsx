import { useMemo, type CSSProperties, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../utils/cn';
import { brandThemeVars } from '../../utils/brandScale';
import { BrandThemeContext, type BrandThemeContextValue } from './brandThemeContext';

export interface BrandThemeProviderProps extends HTMLAttributes<HTMLDivElement> {
	color?: string;
	children?: ReactNode;
}

export function BrandThemeProvider({
	color,
	className,
	style,
	children,
	...props
}: BrandThemeProviderProps) {
	const vars = brandThemeVars(color);
	const mergedStyle = (vars ? { ...vars, ...style } : style) as CSSProperties | undefined;

	const ctxValue = useMemo<BrandThemeContextValue>(
		() => ({ color, vars: vars as CSSProperties | undefined }),
		[color, vars],
	);

	return (
		<BrandThemeContext.Provider value={ctxValue}>
			<div className={cn(className)} style={mergedStyle} {...props}>
				{children}
			</div>
		</BrandThemeContext.Provider>
	);
}
