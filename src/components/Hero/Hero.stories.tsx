import type { Meta, StoryObj } from '@storybook/react';
import { Share2 } from 'lucide-react';
import { Hero } from './Hero';
import { Button } from '../../atoms/Button';

const meta: Meta<typeof Hero> = {
	title: 'Design System/Components/Hero',
	component: Hero,
	parameters: { layout: 'fullscreen' },
	tags: ['autodocs'],
	argTypes: {
		height: { control: 'radio', options: ['sm', 'md', 'lg', 'tall', 'screen'] },
		overlay: { control: 'radio', options: ['none', 'subtle', 'gradient', 'scrim', 'full'] },
		align: {
			control: 'radio',
			options: ['bottom-start', 'bottom-center', 'center', 'center-start'],
		},
		rounded: { control: 'radio', options: ['none', 'lg', 'xl'] },
	},
};

export default meta;

type Story = StoryObj<typeof Hero>;

const sampleMedia = (
	<img
		src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=2000&q=80"
		alt="Lake at sunset"
	/>
);

export const Basic: Story = {
	args: {
		media: sampleMedia,
		eyebrow: 'Discover',
		title: 'Saranac Lake Heritage Trail',
		subtitle: 'A self-guided walking tour through 12 historic stops along the lakeshore.',
		height: 'tall',
		overlay: 'gradient',
		align: 'bottom-start',
	},
};

export const Centered: Story = {
	args: {
		...Basic.args,
		align: 'bottom-center',
		height: 'lg',
	},
};

export const WithActionsAndChrome: Story = {
	args: {
		...Basic.args,
		actions: (
			<>
				<Button variant="primary" size="lg">Start exploring</Button>
				<Button variant="outline" size="lg" className="border-white/40 bg-white/10 text-white hover:bg-white/20">
					View map
				</Button>
			</>
		),
		topRight: (
			<button
				type="button"
				aria-label="Share"
				className="flex h-11 w-11 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md transition hover:bg-white/35"
			>
				<Share2 className="h-5 w-5" />
			</button>
		),
		scrollTargetId: 'placeholder',
	},
};

export const ShortCard: Story = {
	args: {
		media: sampleMedia,
		height: 'md',
		rounded: 'xl',
		overlay: 'scrim',
		eyebrow: 'Featured',
		title: 'Visit downtown',
		subtitle: 'Shops, dining, and waterfront views — all within a short walk.',
	},
};
