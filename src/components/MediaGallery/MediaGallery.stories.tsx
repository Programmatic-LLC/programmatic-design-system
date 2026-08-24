import type { Meta, StoryObj } from '@storybook/react';
import { MediaGallery } from './MediaGallery';

const landscapeItems = [
	{
		src: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1600&q=80&auto=format&fit=crop',
		alt: 'Wooded trail at golden hour',
		caption: 'The Riverwalk at sunset',
		attribution: 'Photo by community contributor',
	},
	{
		src: 'https://images.unsplash.com/photo-1465056836041-7f43ac27dcb5?w=1600&q=80&auto=format&fit=crop',
		alt: 'Mountain overlook with morning mist',
		caption: 'Sunrise from the overlook',
	},
	{
		src: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1600&q=80&auto=format&fit=crop',
		alt: 'A sun-dappled forest path',
		caption: 'Old-growth pine grove',
	},
	{
		src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1600&q=80&auto=format&fit=crop',
		alt: 'Aerial view of the valley',
		caption: 'Looking down on the valley',
	},
];

const portraitItems = [
	{
		src: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=900&q=80&auto=format&fit=crop',
		alt: 'Stone tower rising above the trees',
		caption: 'The bell tower (tall image)',
		orientation: 'portrait' as const,
	},
	{
		src: 'https://images.unsplash.com/photo-1444723121867-7a241cacace9?w=900&q=80&auto=format&fit=crop',
		alt: 'A narrow alleyway in old town',
		caption: 'Cobbled alley — Old Town',
		orientation: 'portrait' as const,
	},
];

const mixedItems = [
	landscapeItems[0],
	portraitItems[0],
	landscapeItems[2],
	portraitItems[1],
];

const meta: Meta<typeof MediaGallery> = {
	title: 'Design System/Components/MediaGallery',
	component: MediaGallery,
	parameters: { layout: 'padded' },
	tags: ['autodocs'],
	argTypes: {
		aspectRatio: { control: 'text' },
		showThumbnails: { control: 'boolean' },
		showCaption: { control: 'boolean' },
		rounded: { control: 'boolean' },
		fit: { control: 'radio', options: ['cover', 'contain'] },
		letterbox: { control: 'boolean' },
	},
	decorators: [
		(Story) => (
			<div className="max-w-3xl">
				<Story />
			</div>
		),
	],
};

export default meta;

type Story = StoryObj<typeof MediaGallery>;

export const Default: Story = {
	args: { items: landscapeItems, aspectRatio: '16/9' },
};

export const Tall: Story = {
	args: { items: landscapeItems, aspectRatio: '4/3' },
};

export const Wide: Story = {
	args: { items: landscapeItems, aspectRatio: '21/9' },
};

export const WithThumbnails: Story = {
	args: { items: landscapeItems, showThumbnails: true },
};

export const SingleImage: Story = {
	args: { items: [landscapeItems[0]] },
};

export const Empty: Story = {
	args: { items: [] },
};

export const PortraitWithLetterbox: Story = {
	name: 'Portrait images (letterboxed)',
	args: {
		items: portraitItems,
		aspectRatio: '16/9',
		letterbox: true,
	},
};

export const PortraitNoLetterbox: Story = {
	name: 'Portrait images (no backdrop)',
	args: {
		items: portraitItems,
		aspectRatio: '16/9',
		letterbox: false,
	},
};

export const MixedOrientations: Story = {
	name: 'Mixed landscape + portrait',
	args: {
		items: mixedItems,
		aspectRatio: '16/9',
		showThumbnails: true,
	},
};

export const AutoDetectOrientation: Story = {
	name: 'Auto-detect orientation',
	args: {
		items: portraitItems.map(({ orientation: _orientation, ...rest }) => rest),
		aspectRatio: '16/9',
	},
};

export const ResponsiveSrcSet: Story = {
	name: 'Responsive variants (srcSet + sizes)',
	args: {
		items: [
			{
				src: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1600&q=80&auto=format&fit=crop',
				srcSet:
					'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=480&q=80&auto=format&fit=crop 480w, ' +
					'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=960&q=80&auto=format&fit=crop 960w, ' +
					'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1600&q=80&auto=format&fit=crop 1600w',
				sizes: '(min-width: 1024px) 768px, 100vw',
				alt: 'Sunset over the river',
				caption: 'Browser picks the closest width from srcSet.',
			},
		],
	},
};

export const ArtDirectedSources: Story = {
	name: 'Art-directed sources (<picture>)',
	args: {
		items: [
			{
				src: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1600&q=80&auto=format&fit=crop',
				alt: 'Sunset over the river',
				caption: 'Tighter portrait crop on mobile, wide landscape on desktop.',
				sources: [
					{
						media: '(max-width: 639px)',
						srcSet:
							'https://images.unsplash.com/photo-1444723121867-7a241cacace9?w=800&q=80&auto=format&fit=crop',
					},
					{
						media: '(min-width: 640px)',
						srcSet:
							'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1600&q=80&auto=format&fit=crop',
					},
				],
			},
		],
	},
};

export const Video: Story = {
	args: {
		aspectRatio: '16/9',
		items: [
			{
				src: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1600&q=80&auto=format&fit=crop',
				alt: 'Video poster — landscape at sunset',
				caption: 'A short flyover (video item).',
				video: {
					src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
					type: 'video/mp4',
				},
			},
			landscapeItems[1],
		],
	},
};

export const VideoThumbnails: Story = {
	name: 'Video thumbnails (no poster)',
	args: {
		layout: 'editorial',
		aspectRatio: '16/9',
		items: [
			landscapeItems[0],
			{
				src: '',
				alt: 'YouTube embed with derived thumbnail',
				thumbnailSrc: 'https://img.youtube.com/vi/aqz-KE-bpKQ/hqdefault.jpg',
				embed: { provider: 'youtube', embedVideoId: 'aqz-KE-bpKQ' },
			},
			{
				src: '',
				alt: 'Native video without poster — first-frame preview',
				video: {
					src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
					type: 'video/mp4',
				},
			},
			landscapeItems[1],
		],
	},
};

export const PerItemFitOverride: Story = {
	name: 'Per-item fit override',
	args: {
		aspectRatio: '16/9',
		items: [
			{ ...landscapeItems[0], caption: 'fit: cover (default for landscape)' },
			{ ...landscapeItems[1], fit: 'contain', caption: 'fit: contain — letterboxed' },
			{ ...landscapeItems[2], caption: 'fit: cover again' },
		],
	},
};

const editorialFivePlus = [
	{
		src: 'https://images.unsplash.com/photo-1545987796-200677ee1011?w=1600&q=80&auto=format&fit=crop',
		alt: 'Bronze sculpture on a plaza',
		caption: 'Hero — sculpture at dawn',
	},
	{
		src: 'https://images.unsplash.com/photo-1465146633011-14f8e0781093?w=1200&q=80&auto=format&fit=crop',
		alt: 'Plaza setting',
		caption: 'Plaza',
	},
	{
		src: 'https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8?w=1200&q=80&auto=format&fit=crop',
		alt: 'Morning light',
		caption: 'Morning light',
	},
	{
		src: 'https://images.unsplash.com/photo-1531913764164-f85c52e6e654?w=1200&q=80&auto=format&fit=crop',
		alt: 'Sunset silhouette',
		caption: 'Sunset',
	},
	{
		src: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&q=80&auto=format&fit=crop',
		alt: 'Riverside trail',
		caption: 'Riverside',
	},
	{
		src: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1200&q=80&auto=format&fit=crop',
		alt: 'Forest path',
		caption: 'Forest',
	},
];

export const EditorialFivePlus: Story = {
	name: 'Editorial — 5+ items (Airbnb mosaic)',
	args: {
		items: editorialFivePlus,
		aspectRatio: '16/9',
		layout: 'editorial',
	},
};

export const EditorialFour: Story = {
	name: 'Editorial — 4 items',
	args: {
		items: editorialFivePlus.slice(0, 4),
		aspectRatio: '16/9',
		layout: 'editorial',
	},
};

export const EditorialThree: Story = {
	name: 'Editorial — 3 items',
	args: {
		items: editorialFivePlus.slice(0, 3),
		aspectRatio: '16/9',
		layout: 'editorial',
	},
};

export const EditorialFallsBackToCarousel: Story = {
	name: 'Editorial — fewer than 3 items (carousel fallback)',
	args: {
		items: editorialFivePlus.slice(0, 2),
		aspectRatio: '16/9',
		layout: 'editorial',
	},
};

const fullSourceItems = [
	{
		src: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=480&h=270&q=80&auto=format&fit=crop',
		fullSrc: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1600&q=85&auto=format',
		alt: 'Stone tower rising above the trees',
		caption: 'Tile is a tight 16:9 crop — open it to see the whole photo',
	},
	{
		src: 'https://images.unsplash.com/photo-1444723121867-7a241cacace9?w=480&h=270&q=80&auto=format&fit=crop',
		fullSrc: 'https://images.unsplash.com/photo-1444723121867-7a241cacace9?w=1600&q=85&auto=format',
		alt: 'A narrow alleyway in old town',
		caption: 'Cobbled alley — Old Town',
	},
	{
		src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=480&h=270&q=80&auto=format&fit=crop',
		alt: 'Aerial view of the valley',
		caption: 'No full source — the lightbox shows the standard image',
	},
];

export const RetainedOriginalInLightbox: Story = {
	name: 'Full source — original shown in the lightbox',
	args: {
		items: fullSourceItems,
		aspectRatio: '16/9',
		layout: 'editorial',
	},
};
