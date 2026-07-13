import { fireEvent, render, screen, within } from '@testing-library/react';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { MediaGallery, type MediaGalleryItem } from './MediaGallery';

vi.mock('motion/react', async () => {
	const { createElement, forwardRef } = await import('react');
	const stripped = new Set([
		'initial',
		'animate',
		'exit',
		'transition',
		'variants',
		'custom',
		'drag',
		'dragControls',
		'dragListener',
		'dragConstraints',
		'dragElastic',
		'dragMomentum',
		'onDragEnd',
		'whileHover',
		'whileTap',
		'layout',
	]);
	const cache = new Map<string, unknown>();
	const motion = new Proxy({} as Record<string, unknown>, {
		get(_target, tag: string) {
			if (!cache.has(tag)) {
				cache.set(
					tag,
					forwardRef(function MotionStub(props: Record<string, unknown>, ref) {
						const clean: Record<string, unknown> = { ref };
						for (const [key, value] of Object.entries(props)) {
							if (!stripped.has(key)) clean[key] = value;
						}
						return createElement(tag, clean);
					}),
				);
			}
			return cache.get(tag);
		},
	});
	return {
		motion,
		AnimatePresence: ({ children }: { children?: React.ReactNode }) => children ?? null,
		useReducedMotion: () => false,
	};
});

vi.mock('../PanoramaViewer', () => ({
	PanoramaViewer: ({ alt }: { alt?: string }) => (
		<div data-testid="panorama-viewer" role="img" aria-label={alt || 'panorama'} />
	),
}));

beforeAll(() => {
	Object.defineProperty(URL, 'createObjectURL', {
		configurable: true,
		writable: true,
		value: vi.fn(() => 'blob:vtt'),
	});
	Object.defineProperty(URL, 'revokeObjectURL', {
		configurable: true,
		writable: true,
		value: vi.fn(),
	});
});

const images: MediaGalleryItem[] = [
	{ src: '/a.jpg', alt: 'First', caption: 'Cap A', attribution: 'By A', transcript: 'Alt text A' },
	{ src: '/b.jpg', alt: 'Second' },
	{ src: '/c.jpg', alt: 'Third' },
];

function getRegion() {
	return screen.getByRole('region', { name: 'Media gallery' });
}

function setNaturalSize(img: HTMLElement, w: number, h: number) {
	Object.defineProperty(img, 'naturalWidth', { configurable: true, value: w });
	Object.defineProperty(img, 'naturalHeight', { configurable: true, value: h });
}

describe('MediaGallery carousel', () => {
	it('renders an empty state without items', () => {
		render(<MediaGallery items={[]} />);
		expect(screen.getByText('No images yet')).toBeInTheDocument();
	});

	it('renders a single image without navigation chrome', () => {
		render(<MediaGallery items={[images[0]]} />);
		expect(screen.getByAltText('First')).toBeInTheDocument();
		expect(screen.queryByRole('button', { name: 'Next media' })).not.toBeInTheDocument();
		expect(screen.queryByText('1 / 1')).not.toBeInTheDocument();
	});

	it('navigates with buttons, wraps, and reports index changes', () => {
		const onIndexChange = vi.fn();
		render(<MediaGallery items={images} onIndexChange={onIndexChange} />);
		expect(screen.getByText('1 / 3')).toBeInTheDocument();

		fireEvent.click(screen.getByRole('button', { name: 'Next media' }));
		expect(screen.getByText('2 / 3')).toBeInTheDocument();
		expect(onIndexChange).toHaveBeenCalledWith(1);

		fireEvent.click(screen.getByRole('button', { name: 'Previous media' }));
		expect(screen.getByText('1 / 3')).toBeInTheDocument();

		fireEvent.click(screen.getByRole('button', { name: 'Previous media' }));
		expect(screen.getByText('3 / 3')).toBeInTheDocument();
	});

	it('navigates with arrow keys', () => {
		render(<MediaGallery items={images} />);
		const region = getRegion();
		fireEvent.keyDown(region, { key: 'ArrowRight' });
		expect(screen.getByText('2 / 3')).toBeInTheDocument();
		fireEvent.keyDown(region, { key: 'ArrowLeft' });
		expect(screen.getByText('1 / 3')).toBeInTheDocument();
	});

	it('navigates with touch swipes', () => {
		render(<MediaGallery items={images} />);
		const region = getRegion();

		fireEvent.touchStart(region, { changedTouches: [{ clientX: 200 }] });
		fireEvent.touchEnd(region, { changedTouches: [{ clientX: 100 }] });
		expect(screen.getByText('2 / 3')).toBeInTheDocument();

		fireEvent.touchStart(region, { changedTouches: [{ clientX: 100 }] });
		fireEvent.touchEnd(region, { changedTouches: [{ clientX: 220 }] });
		expect(screen.getByText('1 / 3')).toBeInTheDocument();

		fireEvent.touchStart(region, { changedTouches: [{ clientX: 100 }] });
		fireEvent.touchEnd(region, { changedTouches: [{ clientX: 110 }] });
		expect(screen.getByText('1 / 3')).toBeInTheDocument();

		fireEvent.touchStart(screen.getByRole('button', { name: 'Next media' }), {
			changedTouches: [{ clientX: 200 }],
		});
		fireEvent.touchEnd(region, { changedTouches: [{ clientX: 0 }] });
		expect(screen.getByText('1 / 3')).toBeInTheDocument();
	});

	it('honors defaultIndex and updates when it changes', () => {
		const { rerender } = render(<MediaGallery items={images} defaultIndex={2} />);
		expect(screen.getByText('3 / 3')).toBeInTheDocument();
		rerender(<MediaGallery items={images} defaultIndex={0} />);
		expect(screen.getByText('1 / 3')).toBeInTheDocument();
	});

	it('shows caption, attribution, and transcript for the current item', () => {
		render(<MediaGallery items={images} />);
		expect(screen.getByText('Cap A')).toBeInTheDocument();
		expect(screen.getByText('By A')).toBeInTheDocument();
		expect(screen.getByText('Transcript / text alternative')).toBeInTheDocument();
		expect(screen.getByText('Alt text A')).toBeInTheDocument();
	});

	it('hides the caption block when showCaption is false', () => {
		render(<MediaGallery items={images} showCaption={false} />);
		expect(screen.queryByText('Cap A')).not.toBeInTheDocument();
	});

	it('renders thumbnails that jump to an index', () => {
		render(<MediaGallery items={images} showThumbnails />);
		const thumb = screen.getByRole('button', { name: 'Go to media 3' });
		fireEvent.click(thumb);
		expect(screen.getByText('3 / 3')).toBeInTheDocument();
		expect(thumb).toHaveAttribute('aria-current', 'true');
		fireEvent.click(screen.getByRole('button', { name: 'Go to media 1' }));
		expect(screen.getByText('1 / 3')).toBeInTheDocument();
	});

	it('renders a native video thumbnail when the video has no poster', () => {
		const withVideo: MediaGalleryItem[] = [
			images[0],
			{ src: '/v.jpg', alt: 'Clip', video: { src: '/clip.mp4' } },
		];
		render(<MediaGallery items={withVideo} showThumbnails />);
		const thumb = screen.getByRole('button', { name: 'Go to media 2' });
		expect(thumb.querySelector('video')).not.toBeNull();
	});

	it('renders the media overlay slot', () => {
		render(<MediaGallery items={images} mediaOverlay={<button>Like</button>} />);
		expect(screen.getByRole('button', { name: 'Like' })).toBeInTheDocument();
	});
});

describe('MediaGallery media frames', () => {
	it('renders a video with poster, source type, and captions track', () => {
		const item: MediaGalleryItem = {
			src: '/v.jpg',
			alt: 'Clip',
			captionsVtt: 'WEBVTT\n\n00:00.000 --> 00:02.000\nHi',
			video: { src: '/clip.mp4', poster: '/poster.jpg', type: 'video/mp4' },
		};
		const { container } = render(<MediaGallery items={[item]} />);
		const video = container.querySelector('video');
		expect(video).not.toBeNull();
		expect(video).toHaveAttribute('poster', '/poster.jpg');
		expect(video?.getAttribute('src')).toBe('/clip.mp4');
		expect(container.querySelector('source')).toHaveAttribute('type', 'video/mp4');
		expect(container.querySelector('track')).toHaveAttribute('src', 'blob:vtt');
	});

	it('appends a first-frame fragment when the video has no poster', () => {
		const { container } = render(
			<MediaGallery items={[{ src: '/v.jpg', alt: 'Clip', video: { src: '/clip.mp4' } }]} />,
		);
		expect(container.querySelector('video')?.getAttribute('src')).toBe('/clip.mp4#t=0.1');
	});

	it('keeps an existing fragment on the video src', () => {
		const { container } = render(
			<MediaGallery items={[{ src: '/v.jpg', alt: 'Clip', video: { src: '/clip.mp4#t=3' } }]} />,
		);
		expect(container.querySelector('video')?.getAttribute('src')).toBe('/clip.mp4#t=3');
	});

	it('renders youtube and vimeo embeds', () => {
		const { rerender } = render(
			<MediaGallery
				items={[{ src: '/e.jpg', alt: 'Embed', embed: { provider: 'youtube', embedVideoId: 'dQw4w9WgXcQ' } }]}
			/>,
		);
		expect(screen.getByTitle('Embed')).toHaveAttribute(
			'src',
			'https://www.youtube.com/embed/dQw4w9WgXcQ',
		);
		rerender(
			<MediaGallery
				items={[{ src: '/e.jpg', alt: '', embed: { provider: 'vimeo', embedVideoId: '123456' } }]}
			/>,
		);
		expect(screen.getByTitle('Embedded video')).toHaveAttribute(
			'src',
			'https://player.vimeo.com/video/123456',
		);
	});

	it('falls back to the image for invalid embed ids', () => {
		const { container } = render(
			<MediaGallery
				items={[{ src: '/e.jpg', alt: 'Bad embed', embed: { provider: 'youtube', embedVideoId: 'nope' } }]}
			/>,
		);
		expect(container.querySelector('iframe')).toBeNull();
		expect(screen.getByAltText('Bad embed')).toHaveAttribute('src', '/e.jpg');
	});

	it('renders a panorama viewer', () => {
		render(
			<MediaGallery items={[{ src: '/p.jpg', alt: 'Round', panorama: { src: '/p.jpg' } }]} />,
		);
		expect(screen.getByTestId('panorama-viewer')).toBeInTheDocument();
	});

	it('renders picture sources when provided', () => {
		const { container } = render(
			<MediaGallery
				items={[
					{
						src: '/pic.jpg',
						alt: 'Pic',
						srcSet: '/pic-2x.jpg 2x',
						sizes: '100vw',
						sources: [{ srcSet: '/pic.webp', type: 'image/webp' }],
					},
				]}
			/>,
		);
		expect(container.querySelector('picture')).not.toBeNull();
		expect(container.querySelector('picture source')).toHaveAttribute('type', 'image/webp');
	});
});

describe('MediaGallery orientation and fit', () => {
	it('letterboxes portrait images after load', () => {
		const { container } = render(<MediaGallery items={[images[0]]} />);
		const img = screen.getByAltText('First');
		setNaturalSize(img, 400, 800);
		fireEvent.load(img);
		expect(container.querySelector('.blur-2xl')).not.toBeNull();
		expect(img.style.objectFit).toBe('contain');
		fireEvent.load(img);
		expect(container.querySelector('.blur-2xl')).not.toBeNull();
	});

	it('keeps square images covered', () => {
		const { container } = render(<MediaGallery items={[images[0]]} />);
		const img = screen.getByAltText('First');
		setNaturalSize(img, 500, 500);
		fireEvent.load(img);
		expect(container.querySelector('.blur-2xl')).toBeNull();
		expect(img.style.objectFit).toBe('cover');
	});

	it('respects an explicit portrait orientation', () => {
		const { container } = render(
			<MediaGallery items={[{ src: '/a.jpg', alt: 'Tall', orientation: 'portrait' }]} />,
		);
		expect(container.querySelector('.blur-2xl')).not.toBeNull();
	});

	it('respects an item fit override and the letterbox flag', () => {
		const { container, rerender } = render(
			<MediaGallery items={[{ src: '/a.jpg', alt: 'Tall', orientation: 'portrait', fit: 'cover' }]} />,
		);
		expect(container.querySelector('.blur-2xl')).toBeNull();
		rerender(
			<MediaGallery
				items={[{ src: '/a.jpg', alt: 'Tall', orientation: 'portrait' }]}
				letterbox={false}
			/>,
		);
		expect(container.querySelector('.blur-2xl')).toBeNull();
	});
});

describe('MediaGallery editorial layout', () => {
	const five: MediaGalleryItem[] = [
		images[0],
		images[1],
		images[2],
		{ src: '/d.jpg', alt: 'Fourth' },
		{ src: '/e.jpg', alt: 'Fifth' },
	];

	it('renders a three-item mosaic', () => {
		render(<MediaGallery items={images} layout="editorial" />);
		expect(screen.getByRole('button', { name: 'View First' })).toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'View Third' })).toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'Show all photos' })).toBeInTheDocument();
	});

	it('renders a four-item mosaic', () => {
		render(<MediaGallery items={five.slice(0, 4)} layout="editorial" />);
		expect(screen.getByRole('button', { name: 'View Fourth' })).toBeInTheDocument();
	});

	it('renders a five-plus mosaic with a more overlay', () => {
		const seven = [...five, { src: '/f.jpg', alt: 'Sixth' }, { src: '/g.jpg', alt: 'Seventh' }];
		render(<MediaGallery items={seven} layout="editorial" />);
		expect(screen.getByText('+2 more')).toBeInTheDocument();
		expect(screen.queryByRole('button', { name: 'View Sixth' })).not.toBeInTheDocument();
	});

	it('does not render a mosaic below three items', () => {
		render(<MediaGallery items={five.slice(0, 2)} layout="editorial" />);
		expect(screen.queryByRole('button', { name: 'View First' })).not.toBeInTheDocument();
	});

	it('delegates tile clicks to onTileClick without opening a lightbox', () => {
		const onTileClick = vi.fn();
		render(<MediaGallery items={images} layout="editorial" onTileClick={onTileClick} />);
		fireEvent.click(screen.getByRole('button', { name: 'View Second' }));
		expect(onTileClick).toHaveBeenCalledWith(1);
		expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
	});

	it('disables tiles when the lightbox is disabled', () => {
		render(<MediaGallery items={images} layout="editorial" disableLightbox />);
		expect(screen.getByRole('button', { name: 'View First' })).toBeDisabled();
		expect(screen.queryByRole('button', { name: 'Show all photos' })).not.toBeInTheDocument();
	});

	it('badges video and panorama tiles', () => {
		const mixed: MediaGalleryItem[] = [
			{ src: '/v.jpg', alt: 'Clip', video: { src: '/clip.mp4', poster: '/poster.jpg' } },
			{ src: '/p.jpg', alt: 'Round', panorama: { src: '/p.jpg' } },
			images[2],
		];
		render(<MediaGallery items={mixed} layout="editorial" />);
		expect(screen.getByRole('button', { name: 'Play Clip' })).toBeInTheDocument();
		const panoTile = screen.getByRole('button', { name: 'Explore 360° photo Round' });
		expect(within(panoTile).getByText('360°')).toBeInTheDocument();
	});

	it('previews native video tiles without a poster', () => {
		const mixed: MediaGalleryItem[] = [
			{ src: '/v.jpg', alt: 'Clip', video: { src: '/clip.mp4' } },
			images[1],
			images[2],
		];
		render(<MediaGallery items={mixed} layout="editorial" />);
		const tile = screen.getByRole('button', { name: 'Play Clip' });
		expect(tile.querySelector('video')).not.toBeNull();
	});

	it('uses the embed thumbnail when available and a placeholder otherwise', () => {
		const mixed: MediaGalleryItem[] = [
			{
				src: '/e.jpg',
				alt: 'With thumb',
				thumbnailSrc: '/thumb.jpg',
				embed: { provider: 'youtube', embedVideoId: 'dQw4w9WgXcQ' },
			},
			{ src: '/e2.jpg', alt: 'No thumb', embed: { provider: 'vimeo', embedVideoId: '42' } },
			images[2],
		];
		render(<MediaGallery items={mixed} layout="editorial" />);
		const withThumb = screen.getByRole('button', { name: 'Play With thumb' });
		expect(within(withThumb).getByAltText('With thumb')).toHaveAttribute('src', '/thumb.jpg');
		const noThumb = screen.getByRole('button', { name: 'Play No thumb' });
		expect(noThumb.querySelector('img')).toBeNull();
	});

	it('falls back to a placeholder when the tile preview fails', () => {
		render(<MediaGallery items={images} layout="editorial" />);
		const tile = screen.getByRole('button', { name: 'View Second' });
		const img = within(tile).getByAltText('Second');
		fireEvent.error(img);
		expect(tile.querySelector('img')).toBeNull();
	});

	it('renders the media overlay on the mosaic', () => {
		render(
			<MediaGallery items={images} layout="editorial" mediaOverlay={<button>Save</button>} />,
		);
		expect(screen.getAllByRole('button', { name: 'Save' }).length).toBeGreaterThanOrEqual(1);
	});
});

describe('MediaGallery lightbox', () => {
	it('opens from a tile, navigates, and closes', () => {
		render(<MediaGallery items={images} layout="editorial" />);
		fireEvent.click(screen.getByRole('button', { name: 'View Second' }));
		const dialog = screen.getByRole('dialog', { name: 'Media viewer' });
		expect(within(dialog).getByText('2 / 3')).toBeInTheDocument();
		expect(document.body.style.overflow).toBe('hidden');

		fireEvent.click(within(dialog).getByRole('button', { name: 'Next media' }));
		expect(within(dialog).getByText('3 / 3')).toBeInTheDocument();

		fireEvent.click(within(dialog).getByRole('button', { name: 'Previous media' }));
		expect(within(dialog).getByText('2 / 3')).toBeInTheDocument();

		fireEvent.click(within(dialog).getByRole('button', { name: 'Close media viewer' }));
		expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
		expect(document.body.style.overflow).toBe('');
	});

	it('supports keyboard navigation and Escape', () => {
		render(<MediaGallery items={images} layout="editorial" />);
		fireEvent.click(screen.getByRole('button', { name: 'View First' }));
		const dialog = screen.getByRole('dialog', { name: 'Media viewer' });

		fireEvent.keyDown(document, { key: 'ArrowRight' });
		expect(within(dialog).getByText('2 / 3')).toBeInTheDocument();
		fireEvent.keyDown(document, { key: 'ArrowLeft' });
		expect(within(dialog).getByText('1 / 3')).toBeInTheDocument();
		fireEvent.keyDown(document, { key: 'Escape' });
		expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
	});

	it('supports touch swipes and shows item details', () => {
		render(<MediaGallery items={images} layout="editorial" />);
		fireEvent.click(screen.getByRole('button', { name: 'View First' }));
		const dialog = screen.getByRole('dialog', { name: 'Media viewer' });
		expect(within(dialog).getByText('Cap A')).toBeInTheDocument();
		expect(within(dialog).getByText('By A')).toBeInTheDocument();
		expect(within(dialog).getByText('Transcript / text alternative')).toBeInTheDocument();

		fireEvent.touchStart(dialog, { changedTouches: [{ clientX: 300 }] });
		fireEvent.touchEnd(dialog, { changedTouches: [{ clientX: 100 }] });
		expect(within(dialog).getByText('2 / 3')).toBeInTheDocument();

		fireEvent.touchStart(dialog, { changedTouches: [{ clientX: 100 }] });
		fireEvent.touchEnd(dialog, { changedTouches: [{ clientX: 300 }] });
		expect(within(dialog).getByText('1 / 3')).toBeInTheDocument();

		fireEvent.touchStart(dialog, { changedTouches: [{ clientX: 100 }] });
		fireEvent.touchEnd(dialog, { changedTouches: [{ clientX: 110 }] });
		expect(within(dialog).getByText('1 / 3')).toBeInTheDocument();
	});

	it('opens at the first item from the show-all button', () => {
		render(<MediaGallery items={images} layout="editorial" />);
		fireEvent.click(screen.getByRole('button', { name: 'Show all photos' }));
		const dialog = screen.getByRole('dialog', { name: 'Media viewer' });
		expect(within(dialog).getByText('1 / 3')).toBeInTheDocument();
	});
});
