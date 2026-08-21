'use client';

import { useEffect, useRef, useState, type PointerEvent, type TouchEvent } from 'react';
import type { Viewer } from '@photo-sphere-viewer/core';
import '@photo-sphere-viewer/core/index.css';
import { cn } from '../../utils/cn';

export interface PanoramaViewerProps {
	src: string;
	alt?: string;
	className?: string;
	fallbackSrc?: string;
}

const HINT_TIMEOUT_MS = 6000;

export function PanoramaViewer({ src, alt, className, fallbackSrc }: PanoramaViewerProps) {
	const containerRef = useRef<HTMLDivElement | null>(null);
	const [failed, setFailed] = useState(false);
	const [hintVisible, setHintVisible] = useState(true);

	useEffect(() => {
		let viewer: Viewer | null = null;
		let cancelled = false;

		setFailed(false);
		setHintVisible(true);

		(async () => {
			const { Viewer } = await import('@photo-sphere-viewer/core');

			if (cancelled || !containerRef.current) return;

			viewer = new Viewer({
				container: containerRef.current,
				panorama: src,
				navbar: ['zoom', 'move', 'fullscreen'],
				touchmoveTwoFingers: false,
				mousewheelCtrlKey: true,
				keyboard: 'always',
				defaultZoomLvl: 10,
				loadingTxt: 'Loading 360° photo…',
			});

			viewer.addEventListener('panorama-error', () => setFailed(true));
		})();

		return () => {
			cancelled = true;
			if (viewer) viewer.destroy();
		};
	}, [src]);

	useEffect(() => {
		if (!hintVisible) return;
		const timer = setTimeout(() => setHintVisible(false), HINT_TIMEOUT_MS);
		return () => clearTimeout(timer);
	}, [hintVisible]);

	const handleInteraction = (event: PointerEvent | TouchEvent) => {
		setHintVisible(false);
		event.stopPropagation();
	};

	return (
		<div className={cn('absolute inset-0 h-full w-full bg-black', className)}>
			<div
				ref={containerRef}
				role="img"
				aria-label={alt || '360 degree panorama'}
				className="absolute inset-0 h-full w-full"
				onPointerDown={handleInteraction}
				onTouchStart={handleInteraction}
				onTouchMove={handleInteraction}
				onTouchEnd={handleInteraction}
			/>
			{hintVisible && !failed && (
				<span
					aria-hidden="true"
					className="pointer-events-none absolute inset-x-0 bottom-14 z-10 mx-auto w-fit rounded-full bg-black/65 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm"
				>
					Drag to look around
				</span>
			)}
			{failed && (
				<div className="absolute inset-0 z-20 grid place-items-center bg-[var(--ds-neutral-100)]">
					{fallbackSrc && (
						<img
							src={fallbackSrc}
							alt={alt || ''}
							className="absolute inset-0 h-full w-full object-cover"
						/>
					)}
					<p className="relative rounded-[var(--ds-radius-md)] bg-black/70 px-4 py-2 text-center text-sm font-medium text-white backdrop-blur-sm">
						This 360° photo couldn’t be loaded.
					</p>
				</div>
			)}
		</div>
	);
}
