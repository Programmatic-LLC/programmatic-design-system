import type { ChangeEvent } from 'react';
import { Search } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface SearchBarProps {
	onChange: (e: ChangeEvent<HTMLInputElement>) => void;
	placeholder?: string;
	value: string;
	brandColor?: string;
	variant?: 'map' | 'default' | 'hero';
}

export function SearchBar({
	onChange,
	placeholder = 'Search...',
	value,
	brandColor,
	variant = 'default',
}: SearchBarProps) {
	return (
		<div className={cn('relative flex-1', variant === 'map' && 'shadow-lg')}>
			<Search
				className={cn(
					'absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5',
					variant === 'hero' ? 'text-white z-10' : 'text-gray-500',
				)}
			/>
			<input
				type="text"
				placeholder={placeholder}
				aria-label={placeholder || 'Search'}
				value={value}
				onChange={onChange}
				style={{ outlineColor: brandColor ?? 'var(--ds-brand-600)' }}
				className={cn(
					'w-full pl-10 pr-4 py-2 border border-gray-500 rounded-lg focus:outline-2 focus:border-transparent',
					variant === 'map' && 'border-none bg-white py-3',
					variant === 'hero' &&
						'rounded-xl bg-white/20 backdrop-blur-sm text-white text-lg placeholder-white/70 border-none pl-12 pr-4 py-4 focus:outline-3',
				)}
			/>
		</div>
	);
}
