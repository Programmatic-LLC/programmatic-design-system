import {
	useCallback,
	useEffect,
	useRef,
	useState,
	type HTMLAttributes,
	type KeyboardEvent,
	type ReactNode,
	type SyntheticEvent,
	type TouchEvent,
} from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ChevronLeft, ChevronRight, ImageOff, LayoutGrid, Play, Rotate3d, X } from 'lucide-react';
import { cn } from '../../utils/cn';
import { Disclosure } from '../../atoms/Disclosure';
import { PanoramaViewer } from '../PanoramaViewer';
import { useVttTrackUrl } from '../../hooks/useVttTrackUrl';

export type MediaOrientation = 'portrait' | 'landscape' | 'square' | 'auto';

export interface MediaSource {
	srcSet: string;
	type?: string;
	media?: string;
}

export interface MediaVideo {
	src: string;
	type?: string;
	poster?: string;
}

export type MediaEmbedProvider = 'youtube' | 'vimeo';

export interface MediaEmbed {
	provider: MediaEmbedProvider;
	embedVideoId: string;
}

export interface MediaPanorama {
	src: string;
}

export interface MediaGalleryItem {
	src: string;
	alt: string;
	caption?: ReactNode;
	attribution?: ReactNode;
	transcript?: ReactNode;
	captionsVtt?: string;
	srcSet?: string;
	sizes?: string;
	sources?: MediaSource[];
	thumbnailSrc?: string;
	thumbnailSrcSet?: string;
	orientation?: MediaOrientation;
	fit?: 'cover' | 'contain';
	video?: MediaVideo;
	embed?: MediaEmbed;
	panorama?: MediaPanorama;
}

const YOUTUBE_ID_REGEX = /^[A-Za-z0-9_-]{11}$/;
const VIMEO_ID_REGEX = /^[0-9]{1,12}$/;

function buildEmbedSrc(embed: MediaEmbed | undefined): string | null {
	if (!embed) return null;
	if (embed.provider === 'youtube' && YOUTUBE_ID_REGEX.test(embed.embedVideoId)) {
		return `https://www.youtube.com/embed/${embed.embedVideoId}`;
	}
	if (embed.provider === 'vimeo' && VIMEO_ID_REGEX.test(embed.embedVideoId)) {
		return `https://player.vimeo.com/video/${embed.embedVideoId}`;
	}
	return null;
}

function withFirstFrameFragment(src: string): string {
	if (!src || src.includes('#')) return src;
	return `${src}#t=0.1`;
}

export interface MediaGalleryProps extends HTMLAttributes<HTMLDivElement> {
	items: MediaGalleryItem[];
	aspectRatio?: string;
	defaultIndex?: number;
	onIndexChange?: (index: number) => void;
	showThumbnails?: boolean;
	showCaption?: boolean;
	rounded?: boolean;
	fit?: 'cover' | 'contain';
	letterbox?: boolean;
	layout?: 'carousel' | 'editorial';
	onTileClick?: (index: number) => void;
	disableLightbox?: boolean;
	mediaOverlay?: ReactNode;
}

type NaturalSize = { w: number; h: number };

const slideVariants = {
	enter: (direction: number) => ({ opacity: 0, x: direction * 24 }),
	center: { opacity: 1, x: 0 },
	exit: (direction: number) => ({ opacity: 0, x: direction * -24 }),
};

function deriveOrientation(
	item: MediaGalleryItem,
	natural: NaturalSize | undefined,
): 'portrait' | 'landscape' | 'square' {
	if (item.orientation && item.orientation !== 'auto') return item.orientation;
	if (!natural || natural.w === 0 || natural.h === 0) return 'landscape';
	const ratio = natural.w / natural.h;
	if (ratio > 1.05) return 'landscape';
	if (ratio < 0.95) return 'portrait';
	return 'square';
}

function deriveFit(
	item: MediaGalleryItem,
	galleryFit: 'cover' | 'contain',
	orientation: 'portrait' | 'landscape' | 'square',
): 'cover' | 'contain' {
	if (item.fit) return item.fit;
	if (orientation === 'portrait') return 'contain';
	return galleryFit;
}

function VideoPlaceholder({ withBadge = true }: { withBadge?: boolean }) {
	return (
		<div
			aria-hidden="true"
			className="absolute inset-0 grid place-items-center bg-gradient-to-br from-[var(--ds-neutral-200)] via-[var(--ds-neutral-100)] to-[var(--ds-neutral-200)]"
		>
			{withBadge && (
				<div className="flex flex-col items-center gap-2 text-[var(--ds-text-muted)]">
					<div className="grid h-14 w-14 place-items-center rounded-full bg-white/95 shadow-[0_4px_14px_rgba(0,0,0,0.18)] backdrop-blur">
						<Play className="h-6 w-6 translate-x-[1px] fill-current text-[var(--ds-brand-600)]" />
					</div>
					<span className="text-xs font-medium uppercase tracking-[0.12em]">Video</span>
				</div>
			)}
		</div>
	);
}

function MediaFrame({
	item,
	objectFit,
	loading,
	onLoad,
	interactivePanorama = true,
	onExplorePanorama,
}: {
	item: MediaGalleryItem;
	objectFit: 'cover' | 'contain';
	loading?: 'lazy' | 'eager';
	onLoad?: (event: SyntheticEvent<HTMLImageElement>) => void;
	interactivePanorama?: boolean;
	onExplorePanorama?: () => void;
}) {
	const sharedImgClass = 'absolute inset-0 h-full w-full select-none';
	const sharedStyle = { objectFit, objectPosition: 'center' as const };

	const captionsTrackUrl = useVttTrackUrl(item.video ? item.captionsVtt : undefined);

	if (item.panorama) {
		if (interactivePanorama) {
			return (
				<PanoramaViewer
					src={item.panorama.src}
					alt={item.alt}
					fallbackSrc={item.thumbnailSrc ?? item.src}
				/>
			);
		}

		return (
			<>
				<img
					src={item.src}
					srcSet={item.srcSet}
					sizes={item.sizes}
					alt={item.alt}
					loading={loading}
					decoding="async"
					draggable={false}
					onLoad={onLoad}
					className={sharedImgClass}
					style={sharedStyle}
				/>
				<span
					aria-hidden="true"
					className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"
				/>
				<div className="absolute inset-0 z-10 grid place-items-center">
					<button
						type="button"
						onClick={onExplorePanorama}
						className="inline-flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-sm font-medium text-[var(--ds-text)] shadow-[0_2px_10px_rgba(0,0,0,0.22)] backdrop-blur-sm transition-transform duration-200 hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ds-ring)]"
					>
						<Rotate3d className="h-4 w-4" aria-hidden="true" />
						Explore in 360°
					</button>
				</div>
			</>
		);
	}

	const embedSrc = buildEmbedSrc(item.embed);
	if (embedSrc) {
		return (
			<iframe
				src={embedSrc}
				title={item.alt || 'Embedded video'}
				referrerPolicy="strict-origin-when-cross-origin"
				allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
				loading={loading === 'eager' ? 'eager' : 'lazy'}
				allowFullScreen
				className="absolute inset-0 h-full w-full border-0"
			/>
		);
	}

	if (item.video) {
		const poster = item.video.poster;
		const videoSrc = poster ? item.video.src : withFirstFrameFragment(item.video.src);
		return (
			<>
				<VideoPlaceholder withBadge={false} />
				<video
					src={videoSrc}
					poster={poster}
					controls
					playsInline
					preload="metadata"
					className={cn(sharedImgClass, 'bg-transparent')}
					style={sharedStyle}
				>
					{item.video.type && <source src={videoSrc} type={item.video.type} />}
					{captionsTrackUrl && (
						<track
							kind="captions"
							srcLang="en"
							label="Captions"
							default
							src={captionsTrackUrl}
						/>
					)}
				</video>
			</>
		);
	}

	if (item.sources && item.sources.length > 0) {
		return (
			<picture>
				{item.sources.map((source, index) => (
					<source
						key={index}
						srcSet={source.srcSet}
						type={source.type}
						media={source.media}
					/>
				))}
				<img
					src={item.src}
					srcSet={item.srcSet}
					sizes={item.sizes}
					alt={item.alt}
					loading={loading}
					decoding="async"
					draggable={false}
					onLoad={onLoad}
					className={sharedImgClass}
					style={sharedStyle}
				/>
			</picture>
		);
	}

	return (
		<img
			src={item.src}
			srcSet={item.srcSet}
			sizes={item.sizes}
			alt={item.alt}
			loading={loading}
			decoding="async"
			draggable={false}
			onLoad={onLoad}
			className={sharedImgClass}
			style={sharedStyle}
		/>
	);
}

function MosaicTile({
	item,
	index,
	priority,
	onClick,
	className,
	overlay,
}: {
	item: MediaGalleryItem;
	index: number;
	priority?: boolean;
	onClick?: (index: number) => void;
	className?: string;
	overlay?: ReactNode;
}) {
	const [previewFailed, setPreviewFailed] = useState(false);
	const isEmbed = !!item.embed && !!buildEmbedSrc(item.embed);
	const isVideo = !!item.video || isEmbed;
	const isPanorama = !!item.panorama;
	const isNativeVideo = !!item.video && !isEmbed;
	const tileSrc = item.thumbnailSrc ?? item.src;
	const previewSrc = item.video?.poster ?? tileSrc;
	const hasUsablePreview =
		!previewFailed &&
		(isEmbed ? !!item.thumbnailSrc : !isVideo || !!item.video?.poster);
	const showNativeFrame = isNativeVideo && !item.video?.poster && !previewFailed;
	const label = isVideo
		? `Play ${item.alt || `video ${index + 1}`}`
		: isPanorama
			? `Explore 360° photo ${item.alt || index + 1}`
			: `View ${item.alt || `photo ${index + 1}`}`;
	const showPlayBadge = isVideo && !overlay;
	const showPanoramaBadge = isPanorama && !overlay;

	return (
		<button
			type="button"
			onClick={() => onClick?.(index)}
			className={cn(
				'group relative overflow-hidden bg-[var(--ds-neutral-100)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ds-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ds-bg)]',
				className,
			)}
			aria-label={label}
			disabled={!onClick}
		>
			{hasUsablePreview ? (
				<img
					src={previewSrc}
					srcSet={!item.video ? item.thumbnailSrcSet : undefined}
					sizes={!item.video && item.thumbnailSrcSet ? '(min-width: 768px) 50vw, 100vw' : undefined}
					alt={item.alt}
					onError={() => setPreviewFailed(true)}
					className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
					loading={priority ? 'eager' : 'lazy'}
					decoding="async"
				/>
			) : showNativeFrame ? (
				<video
					src={withFirstFrameFragment(item.video!.src)}
					muted
					playsInline
					preload="metadata"
					aria-hidden="true"
					tabIndex={-1}
					onError={() => setPreviewFailed(true)}
					className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
				/>
			) : (
				<VideoPlaceholder withBadge={false} />
			)}
			{showPlayBadge && (
				<>
					<span
						aria-hidden="true"
						className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"
					/>
					<span
						aria-hidden="true"
						className="pointer-events-none absolute inset-0 grid place-items-center"
					>
						<span className="grid h-12 w-12 place-items-center rounded-full bg-white/90 text-[var(--ds-text)] shadow-[0_4px_14px_rgba(0,0,0,0.25)] backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
							<Play className="h-5 w-5 translate-x-[1px] fill-current" />
						</span>
					</span>
				</>
			)}
			{showPanoramaBadge && (
				<span
					aria-hidden="true"
					className="pointer-events-none absolute bottom-2 left-2 inline-flex items-center gap-1 rounded-full bg-black/65 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm"
				>
					<Rotate3d className="h-3.5 w-3.5" />
					360°
				</span>
			)}
			{overlay}
		</button>
	);
}

export function MediaGallery({
	items,
	aspectRatio = '16/9',
	defaultIndex = 0,
	onIndexChange,
	showThumbnails = false,
	showCaption = true,
	rounded = true,
	fit = 'cover',
	letterbox = true,
	layout = 'carousel',
	onTileClick,
	disableLightbox = false,
	mediaOverlay,
	className,
	...props
}: MediaGalleryProps) {
	const reduceMotion = useReducedMotion();
	const [index, setIndex] = useState(defaultIndex);
	const [direction, setDirection] = useState(0);
	const [naturalSizes, setNaturalSizes] = useState<Record<number, NaturalSize>>({});
	const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
	const [lightboxDirection, setLightboxDirection] = useState(0);
	const touchStartX = useRef<number | null>(null);
	const lightboxTouchStartX = useRef<number | null>(null);

	const lightboxOpen = lightboxIndex !== null;
	const useBuiltInLightbox = !onTileClick && !disableLightbox;
	const tilesAreInteractive = !!onTileClick || useBuiltInLightbox;
	const panoramaOpensLightbox = tilesAreInteractive;

	const handleTileClick = useCallback(
		(i: number) => {
			if (onTileClick) {
				onTileClick(i);
				return;
			}
			if (disableLightbox) return;
			setLightboxIndex(i);
		},
		[onTileClick, disableLightbox],
	);

	const total = items.length;
	const safeIndex = total === 0 ? 0 : Math.min(Math.max(index, 0), total - 1);

	const go = useCallback(
		(next: number, dir: number) => {
			if (total === 0) return;
			const wrapped = (next + total) % total;
			setDirection(dir);
			setIndex(wrapped);
			onIndexChange?.(wrapped);
		},
		[onIndexChange, total],
	);

	const next = useCallback(() => go(safeIndex + 1, 1), [go, safeIndex]);
	const prev = useCallback(() => go(safeIndex - 1, -1), [go, safeIndex]);

	useEffect(() => {
		setIndex(defaultIndex);
		setDirection(0);
	}, [defaultIndex]);

	const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
		if (event.key === 'ArrowRight') {
			event.preventDefault();
			next();
		} else if (event.key === 'ArrowLeft') {
			event.preventDefault();
			prev();
		}
	};

	const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
		const target = event.target as HTMLElement | null;
		if (target?.closest('button, a')) {
			touchStartX.current = null;
			return;
		}
		touchStartX.current = event.changedTouches[0]?.clientX ?? null;
	};

	const handleTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
		if (touchStartX.current === null) return;
		const dx = (event.changedTouches[0]?.clientX ?? touchStartX.current) - touchStartX.current;
		touchStartX.current = null;
		if (Math.abs(dx) < 40) return;
		if (dx < 0) next();
		else prev();
	};

	const lightboxGo = useCallback(
		(target: number, dir: number) => {
			if (total === 0) return;
			const wrapped = (target + total) % total;
			setLightboxDirection(dir);
			setLightboxIndex(wrapped);
		},
		[total],
	);
	const closeLightbox = useCallback(() => setLightboxIndex(null), []);
	const lightboxNext = useCallback(
		() => lightboxIndex !== null && lightboxGo(lightboxIndex + 1, 1),
		[lightboxGo, lightboxIndex],
	);
	const lightboxPrev = useCallback(
		() => lightboxIndex !== null && lightboxGo(lightboxIndex - 1, -1),
		[lightboxGo, lightboxIndex],
	);

	useEffect(() => {
		if (!lightboxOpen) return;
		const onKey = (event: globalThis.KeyboardEvent) => {
			if (event.key === 'Escape') {
				event.preventDefault();
				closeLightbox();
			} else if (event.key === 'ArrowRight') {
				event.preventDefault();
				lightboxNext();
			} else if (event.key === 'ArrowLeft') {
				event.preventDefault();
				lightboxPrev();
			}
		};
		document.addEventListener('keydown', onKey);
		const prevOverflow = document.body.style.overflow;
		document.body.style.overflow = 'hidden';
		return () => {
			document.removeEventListener('keydown', onKey);
			document.body.style.overflow = prevOverflow;
		};
	}, [lightboxOpen, closeLightbox, lightboxNext, lightboxPrev]);

	const handleLightboxTouchStart = (event: TouchEvent<HTMLDivElement>) => {
		lightboxTouchStartX.current = event.changedTouches[0]?.clientX ?? null;
	};
	const handleLightboxTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
		if (lightboxTouchStartX.current === null) return;
		const dx =
			(event.changedTouches[0]?.clientX ?? lightboxTouchStartX.current) -
			lightboxTouchStartX.current;
		lightboxTouchStartX.current = null;
		if (Math.abs(dx) < 40) return;
		if (dx < 0) lightboxNext();
		else lightboxPrev();
	};

	if (total === 0) {
		return (
			<div
				className={cn(
					'relative w-full overflow-hidden border border-[var(--ds-border)] bg-[var(--ds-surface-muted)]',
					rounded && 'rounded-none sm:rounded-[var(--ds-radius-xl)]',
					className,
				)}
				style={{ aspectRatio }}
				{...props}
			>
				<div className="absolute inset-0 grid place-items-center text-[var(--ds-text-subtle)]">
					<div className="flex flex-col items-center gap-2 text-sm">
						<ImageOff className="h-6 w-6" />
						No images yet
					</div>
				</div>
			</div>
		);
	}

	const current = items[safeIndex];
	const orientation = deriveOrientation(current, naturalSizes[safeIndex]);
	const itemFit = deriveFit(current, fit, orientation);
	const showLetterbox = letterbox && itemFit === 'contain' && !current.video && !current.embed && !current.panorama;

	const editorialVariant: 'five-plus' | 'four' | 'three' | null =
		total >= 5 ? 'five-plus' : total === 4 ? 'four' : total === 3 ? 'three' : null;
	const editorialEligible = layout === 'editorial' && editorialVariant !== null;
	const mosaicVisibleCount =
		editorialVariant === 'five-plus' ? 5 : editorialVariant === 'four' ? 4 : 3;
	const mosaicItems = items.slice(0, mosaicVisibleCount);

	const carouselFrame = (
		<div
			role="region"
			aria-roledescription="carousel"
			aria-label="Media gallery"
			tabIndex={0}
			onKeyDown={handleKeyDown}
			onTouchStart={handleTouchStart}
			onTouchEnd={handleTouchEnd}
			className={cn(
				'group relative w-full touch-pan-y overflow-hidden bg-[var(--ds-neutral-100)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ds-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ds-bg)]',
				rounded && 'rounded-none sm:rounded-[var(--ds-radius-xl)]',
				editorialEligible && 'md:hidden',
			)}
			style={{ aspectRatio }}
		>
			<AnimatePresence initial={false} mode="popLayout" custom={direction}>
				<motion.div
					key={safeIndex}
					custom={direction}
					variants={slideVariants}
					initial={reduceMotion ? false : 'enter'}
					animate={reduceMotion ? false : 'center'}
					exit={reduceMotion ? undefined : 'exit'}
					transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
					className="absolute inset-0"
				>
					{showLetterbox && (
						<div
							aria-hidden="true"
							className="absolute inset-0 scale-110 bg-cover bg-center bg-no-repeat opacity-90 blur-2xl brightness-75 saturate-50"
							style={{ backgroundImage: `url(${current.thumbnailSrc ?? current.src})` }}
						/>
					)}
					<MediaFrame
						item={current}
						objectFit={itemFit}
						loading="eager"
						interactivePanorama={!panoramaOpensLightbox}
						onExplorePanorama={
							panoramaOpensLightbox ? () => handleTileClick(safeIndex) : undefined
						}
						onLoad={(event) => {
							const img = event.currentTarget;
							if (!img.naturalWidth || !img.naturalHeight) return;
							setNaturalSizes((prev) =>
								prev[safeIndex]?.w === img.naturalWidth
									? prev
									: { ...prev, [safeIndex]: { w: img.naturalWidth, h: img.naturalHeight } },
							);
						}}
					/>
				</motion.div>
			</AnimatePresence>

			{total > 1 && (
				<>
					<button
						type="button"
						onClick={prev}
						aria-label="Previous media"
						className="absolute left-2 top-1/2 z-20 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/95 sm:h-9 sm:w-9 text-[var(--ds-text)] shadow-[0_2px_8px_rgba(0,0,0,0.18)] backdrop-blur-sm transition-all duration-200 hover:bg-white hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ds-ring)] sm:left-3 [@media(hover:hover)]:sm:opacity-0 [@media(hover:hover)]:sm:group-hover:opacity-100 [@media(hover:hover)]:sm:group-focus-within:opacity-100"
					>
						<ChevronLeft className="h-5 w-5" />
					</button>
					<button
						type="button"
						onClick={next}
						aria-label="Next media"
						className="absolute right-2 top-1/2 z-20 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/95 sm:h-9 sm:w-9 text-[var(--ds-text)] shadow-[0_2px_8px_rgba(0,0,0,0.18)] backdrop-blur-sm transition-all duration-200 hover:bg-white hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ds-ring)] sm:right-3 [@media(hover:hover)]:sm:opacity-0 [@media(hover:hover)]:sm:group-hover:opacity-100 [@media(hover:hover)]:sm:group-focus-within:opacity-100"
					>
						<ChevronRight className="h-5 w-5" />
					</button>

					<div className="pointer-events-none absolute inset-x-0 bottom-3 z-10 flex justify-center gap-1.5">
						{items.map((_, i) => (
							<motion.span
								key={i}
								aria-current={i === safeIndex ? 'true' : undefined}
								animate={{
									width: i === safeIndex ? 22 : 6,
									opacity: i === safeIndex ? 1 : 0.65,
								}}
								transition={{ duration: 0.25, ease: 'easeOut' }}
								className="h-1.5 rounded-full bg-white shadow-[0_0_4px_rgba(0,0,0,0.25)]"
							/>
						))}
					</div>

					<div className="absolute right-3 top-3 z-10 rounded-full bg-black/55 px-2.5 py-1 text-xs font-medium tabular-nums text-white backdrop-blur-sm">
						{safeIndex + 1} / {total}
					</div>
				</>
			)}
			{mediaOverlay && (
				<div className="pointer-events-none absolute left-3 top-3 z-20">
					<div className="pointer-events-auto">{mediaOverlay}</div>
				</div>
			)}
		</div>
	);

	const mosaicGrid = editorialVariant === 'five-plus' ? (
		<div className="grid h-full w-full grid-cols-4 grid-rows-2 gap-1.5">
			<MosaicTile
				item={mosaicItems[0]}
				index={0}
				priority
				onClick={tilesAreInteractive ? handleTileClick : undefined}
				className="col-span-2 row-span-2"
			/>
			{mosaicItems.slice(1, 5).map((tile, i) => {
				const showMoreOverlay = i === 3 && total > 5 && tilesAreInteractive;
				return (
					<MosaicTile
						key={i}
						item={tile}
						index={i + 1}
						onClick={tilesAreInteractive ? handleTileClick : undefined}
						overlay={
							showMoreOverlay ? (
								<span className="absolute inset-0 grid place-items-center bg-black/30 text-sm font-medium text-white backdrop-blur-[1px] transition-colors group-hover:bg-black/40">
									+{total - 5} more
								</span>
							) : undefined
						}
					/>
				);
			})}
		</div>
	) : editorialVariant === 'four' ? (
		<div className="grid h-full w-full grid-cols-3 grid-rows-3 gap-1.5">
			<MosaicTile
				item={mosaicItems[0]}
				index={0}
				priority
				onClick={tilesAreInteractive ? handleTileClick : undefined}
				className="col-span-2 row-span-3"
			/>
			{mosaicItems.slice(1, 4).map((tile, i) => (
				<MosaicTile
					key={i}
					item={tile}
					index={i + 1}
					onClick={tilesAreInteractive ? handleTileClick : undefined}
				/>
			))}
		</div>
	) : editorialVariant === 'three' ? (
		<div className="grid h-full w-full grid-cols-3 grid-rows-2 gap-1.5">
			<MosaicTile
				item={mosaicItems[0]}
				index={0}
				priority
				onClick={tilesAreInteractive ? handleTileClick : undefined}
				className="col-span-2 row-span-2"
			/>
			{mosaicItems.slice(1, 3).map((tile, i) => (
				<MosaicTile
					key={i}
					item={tile}
					index={i + 1}
					onClick={tilesAreInteractive ? handleTileClick : undefined}
				/>
			))}
		</div>
	) : null;

	const mosaic = editorialEligible && (
		<div
			className={cn(
				'relative hidden w-full overflow-hidden md:block',
				rounded && 'md:rounded-[var(--ds-radius-xl)]',
			)}
			style={{ aspectRatio }}
		>
			{mosaicGrid}
			{tilesAreInteractive && (
				<div className="pointer-events-none absolute right-4 top-4 md:right-6 md:top-6">
					<button
						type="button"
						onClick={() => handleTileClick(0)}
						className="pointer-events-auto inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-medium text-[var(--ds-text)] shadow-[0_2px_8px_rgba(0,0,0,0.12)] backdrop-blur transition-transform hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ds-ring)]"
					>
						<LayoutGrid className="h-3.5 w-3.5" aria-hidden="true" />
						Show all photos
					</button>
				</div>
			)}
			{mediaOverlay && (
				<div className="pointer-events-none absolute left-4 top-4 z-20 md:left-6 md:top-6">
					<div className="pointer-events-auto">{mediaOverlay}</div>
				</div>
			)}
		</div>
	);

	const lightboxItem = lightboxIndex !== null ? items[lightboxIndex] : null;
	const lightbox = lightboxOpen && lightboxItem && (
		<motion.div
			role="dialog"
			aria-modal="true"
			aria-label="Media viewer"
			initial={reduceMotion ? false : { opacity: 0 }}
			animate={reduceMotion ? false : { opacity: 1 }}
			exit={reduceMotion ? undefined : { opacity: 0 }}
			transition={{ duration: 0.2, ease: 'easeOut' }}
			className="fixed inset-0 z-50 flex flex-col bg-black/95 backdrop-blur-sm"
			onTouchStart={handleLightboxTouchStart}
			onTouchEnd={handleLightboxTouchEnd}
		>
			<div className="flex items-center justify-between px-4 py-3 text-white sm:px-6">
				<span className="text-sm font-medium tabular-nums">
					{lightboxIndex + 1} / {total}
				</span>
				<button
					type="button"
					onClick={closeLightbox}
					aria-label="Close media viewer"
					className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
				>
					<X className="h-5 w-5" />
				</button>
			</div>

			<div className="relative flex flex-1 items-center justify-center px-2 py-2 sm:px-6 sm:py-4">
				<AnimatePresence
					initial={false}
					mode="popLayout"
					custom={lightboxDirection}
				>
					<motion.div
						key={lightboxIndex}
						custom={lightboxDirection}
						variants={slideVariants}
						initial={reduceMotion ? false : 'enter'}
						animate={reduceMotion ? false : 'center'}
						exit={reduceMotion ? undefined : 'exit'}
						transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
						className="relative h-full max-h-[80vh] w-full max-w-6xl"
					>
						<MediaFrame item={lightboxItem} objectFit="contain" loading="eager" />
					</motion.div>
				</AnimatePresence>

				{total > 1 && (
					<>
						<button
							type="button"
							onClick={lightboxPrev}
							aria-label="Previous media"
							className="absolute left-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 sm:left-6 sm:h-12 sm:w-12"
						>
							<ChevronLeft className="h-6 w-6" />
						</button>
						<button
							type="button"
							onClick={lightboxNext}
							aria-label="Next media"
							className="absolute right-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 sm:right-6 sm:h-12 sm:w-12"
						>
							<ChevronRight className="h-6 w-6" />
						</button>
					</>
				)}
			</div>

			{(lightboxItem.caption || lightboxItem.attribution || lightboxItem.transcript) && (
				<div className="px-4 pb-6 text-center text-white sm:px-6">
					{lightboxItem.caption && (
						<p className="text-sm">{lightboxItem.caption}</p>
					)}
					{lightboxItem.attribution && (
						<p className="mt-1 text-xs text-white/60">{lightboxItem.attribution}</p>
					)}
					{lightboxItem.transcript && (
						<Disclosure
							label="Transcript / text alternative"
							tone="onDark"
							className="mx-auto mt-3 max-w-2xl text-left"
						>
							{lightboxItem.transcript}
						</Disclosure>
					)}
				</div>
			)}
		</motion.div>
	);

	return (
		<div className={cn('relative flex flex-col gap-3', className)} {...props}>
			{carouselFrame}
			{mosaic}

			{showCaption && (current.caption || current.attribution || current.transcript) && !editorialEligible && (
				<div aria-live="polite" className="flex flex-col gap-0.5 px-4 sm:px-0">
					{current.caption && (
						<p className="text-sm text-[var(--ds-text)]">{current.caption}</p>
					)}
					{current.attribution && (
						<p className="text-xs text-[var(--ds-text-muted)]">{current.attribution}</p>
					)}
					{current.transcript && (
						<Disclosure label="Transcript / text alternative" className="mt-1">
							{current.transcript}
						</Disclosure>
					)}
				</div>
			)}

			{showThumbnails && total > 1 && !editorialEligible && (
				<div className="flex gap-2 overflow-x-auto px-4 pb-1 sm:px-0">
					{items.map((item, i) => {
						const stripPreview = item.video?.poster ?? item.thumbnailSrc;
						const stripNativeFrame = !!item.video && !item.embed && !stripPreview;
						return (
							<button
								key={i}
								type="button"
								onClick={() => go(i, i > safeIndex ? 1 : -1)}
								aria-label={`Go to media ${i + 1}`}
								aria-current={i === safeIndex ? 'true' : undefined}
								className={cn(
									'relative h-16 w-20 shrink-0 overflow-hidden rounded-[var(--ds-radius-sm)] border-2 transition-[border-color,opacity]',
									i === safeIndex
										? 'border-[var(--ds-brand-600)] opacity-100'
										: 'border-transparent opacity-70 hover:opacity-100',
								)}
							>
								{stripNativeFrame ? (
									<video
										src={withFirstFrameFragment(item.video!.src)}
										muted
										playsInline
										preload="metadata"
										aria-hidden="true"
										tabIndex={-1}
										className="h-full w-full object-cover"
									/>
								) : (
									<img
										src={stripPreview ?? item.src}
										alt=""
										aria-hidden="true"
										loading="lazy"
										decoding="async"
										className="h-full w-full object-cover"
									/>
								)}
							</button>
						);
					})}
				</div>
			)}

			<AnimatePresence>{lightbox}</AnimatePresence>
		</div>
	);
}
