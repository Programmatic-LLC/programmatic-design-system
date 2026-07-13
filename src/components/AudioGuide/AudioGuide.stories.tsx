import type { Meta, StoryObj } from '@storybook/react';
import { AudioGuide } from './AudioGuide';

const meta: Meta<typeof AudioGuide> = {
	title: 'Design System/Components/AudioGuide',
	component: AudioGuide,
	parameters: { layout: 'centered' },
	tags: ['autodocs'],
	decorators: [
		(Story) => (
			<div className="w-[640px] max-w-full">
				<Story />
			</div>
		),
	],
};

export default meta;

type Story = StoryObj<typeof AudioGuide>;

const sampleTracks = [
	{
		src: 'https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Sevish_-__nbsp_.mp3',
		title: 'The story behind the Sentinel',
		attribution: 'Narrated by the artist',
	},
	{
		src: 'https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Sevish_-__nbsp_.mp3',
		title: 'On bronze, patina, and the long view',
		attribution: 'Foundry walk-through',
	},
	{
		src: 'https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Sevish_-__nbsp_.mp3',
		title: 'The 2017 dedication',
		attribution: 'Archival recording · City of Riverbend',
	},
];

export const Default: Story = {
	args: {
		eyebrow: 'Listen',
		title: 'Audio guides',
		tracks: sampleTracks,
	},
};

export const Untitled: Story = {
	args: {
		tracks: sampleTracks.slice(0, 2),
	},
};

export const SingleTrack: Story = {
	args: {
		eyebrow: 'Listen',
		title: 'Audio guide',
		tracks: [sampleTracks[0]],
	},
};

export const Unnumbered: Story = {
	args: {
		eyebrow: 'Listen',
		title: 'Audio guides',
		tracks: sampleTracks,
		numbered: false,
	},
};

export const WithoutAttribution: Story = {
	args: {
		title: 'Audio guides',
		tracks: sampleTracks.map(({ attribution: _attribution, ...t }) => t),
	},
};
