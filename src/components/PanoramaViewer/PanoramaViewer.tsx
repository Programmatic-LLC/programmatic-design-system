'use client';

import { useEffect, useRef, type PointerEvent, type TouchEvent } from 'react';
import '@photo-sphere-viewer/core/index.css';
import { cn } from '../../utils/cn';

export interface PanoramaViewerProps {
	src: string;
	alt?: string;
	className?: string;
}

export function PanoramaViewer({ src, alt, className }: PanoramaViewerProps) {
	const containerRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		let viewer: { destroy: () => void } | null = null;
		let cancelled = false;

		(async () => {
			const { Viewer } = await import('@photo-sphere-viewer/core');

			if (cancelled || !containerRef.current) return;

			viewer = new Viewer({
				container: containerRef.current,
				panorama: src,
				navbar: ['zoom', 'move', 'fullscreen'],
				touchmoveTwoFingers: false,
				loadingTxt: 'Loading 360° photo…',
			});
		})();

		return () => {
			cancelled = true;
			if (viewer) viewer.destroy();
		};
	}, [src]);

	const stopPropagation = (event: PointerEvent | TouchEvent) => {
		event.stopPropagation();
	};

	return (
		<div
			ref={containerRef}
			role="img"
			aria-label={alt || '360 degree panorama'}
			className={cn('absolute inset-0 h-full w-full bg-black', className)}
			onPointerDown={stopPropagation}
			onTouchStart={stopPropagation}
			onTouchMove={stopPropagation}
			onTouchEnd={stopPropagation}
		/>
	);
}
