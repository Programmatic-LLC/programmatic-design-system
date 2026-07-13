import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { CalendarDays, LayoutGrid, Map } from 'lucide-react';
import { ViewToggle } from './ViewToggle';

const meta: Meta<typeof ViewToggle> = {
	title: 'Design System/Components/ViewToggle',
	component: ViewToggle,
	parameters: { layout: 'centered' },
	tags: ['autodocs'],
	argTypes: {
		variant: { control: 'inline-radio', options: ['default', 'overlay', 'floating'] },
		iconOnly: { control: 'boolean' },
	},
};

export default meta;

type Story = StoryObj<typeof ViewToggle>;

function Demo(args: React.ComponentProps<typeof ViewToggle>) {
	const [value, setValue] = useState<'card' | 'map'>('card');
	return (
		<ViewToggle
			{...args}
			value={value}
			onChange={(v) => setValue(v as 'card' | 'map')}
			options={[
				{ value: 'card', label: 'Gallery', icon: LayoutGrid, ariaLabel: 'Gallery view' },
				{ value: 'map', label: 'Map', icon: Map, ariaLabel: 'Map view' },
			]}
		/>
	);
}

function ThreeOptionDemo(args: React.ComponentProps<typeof ViewToggle>) {
	const [value, setValue] = useState<'grid' | 'calendar' | 'map'>('grid');
	return (
		<ViewToggle
			{...args}
			value={value}
			onChange={(v) => setValue(v as 'grid' | 'calendar' | 'map')}
			options={[
				{ value: 'grid', label: 'Gallery', icon: LayoutGrid, ariaLabel: 'Gallery view' },
				{ value: 'calendar', label: 'Calendar', icon: CalendarDays, ariaLabel: 'Calendar view' },
				{ value: 'map', label: 'Map', icon: Map, ariaLabel: 'Map view' },
			]}
		/>
	);
}

export const Default: Story = {
	args: { variant: 'default' },
	render: (args) => <Demo {...args} />,
};

export const IconOnly: Story = {
	args: { variant: 'default', iconOnly: true },
	render: (args) => <Demo {...args} />,
};

export const Overlay: Story = {
	args: { variant: 'overlay' },
	render: (args) => (
		<div className="rounded-xl bg-slate-200 p-8">
			<Demo {...args} />
		</div>
	),
};

export const Floating: Story = {
	args: { variant: 'floating' },
	parameters: { layout: 'fullscreen' },
	render: (args) => (
		<div className="relative h-[400px] w-full bg-gradient-to-br from-slate-100 to-slate-300">
			<div className="p-8 text-sm text-slate-600">
				Floating toggle is pinned to the bottom-center of the viewport.
			</div>
			<Demo {...args} />
		</div>
	),
};

export const FloatingIconOnly: Story = {
	args: { variant: 'floating', iconOnly: true },
	parameters: { layout: 'fullscreen' },
	render: (args) => (
		<div className="relative h-[400px] w-full bg-gradient-to-br from-slate-100 to-slate-300">
			<Demo {...args} />
		</div>
	),
};

export const FloatingThreeOptions: Story = {
	args: { variant: 'floating' },
	parameters: { layout: 'fullscreen' },
	render: (args) => (
		<div className="relative h-[400px] w-full bg-gradient-to-br from-slate-100 to-slate-300">
			<ThreeOptionDemo {...args} />
		</div>
	),
};
