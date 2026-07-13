import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { SearchBar } from './SearchBar';

const meta: Meta<typeof SearchBar> = {
	title: 'Design System/Components/SearchBar',
	component: SearchBar,
	parameters: { layout: 'centered' },
	tags: ['autodocs'],
	argTypes: {
		variant: { control: 'radio', options: ['default', 'map', 'hero'] },
	},
};

export default meta;

type Story = StoryObj<typeof SearchBar>;

function SearchBarDemo({ variant }: { variant: 'default' | 'map' | 'hero' }) {
	const [value, setValue] = useState('');
	return (
		<div
			className={
				variant === 'hero'
					? 'w-96 rounded-2xl bg-[var(--ds-brand-700)] p-8'
					: 'w-96 p-4'
			}
		>
			<SearchBar
				value={value}
				onChange={(e) => setValue(e.target.value)}
				placeholder="Search attractions..."
				variant={variant}
			/>
		</div>
	);
}

export const Default: Story = {
	render: () => <SearchBarDemo variant="default" />,
};

export const Map: Story = {
	render: () => <SearchBarDemo variant="map" />,
};

export const Hero: Story = {
	render: () => <SearchBarDemo variant="hero" />,
};
