import {
	useCallback,
	useEffect,
	useRef,
	useState,
	type HTMLAttributes,
	type ReactNode,
} from 'react';
import { Headphones, Pause, Play, Volume2, VolumeX } from 'lucide-react';
import { cn } from '../../utils/cn';
import { Card } from '../../atoms/Card';
import { Disclosure } from '../../atoms/Disclosure';
import { Text } from '../../atoms/Text';

export interface AudioTrack {
	src: string;
	title?: ReactNode;
	attribution?: ReactNode;
	transcript?: ReactNode;
	key?: string;
}

export interface AudioGuideProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
	tracks: AudioTrack[];
	eyebrow?: ReactNode;
	title?: ReactNode;
	numbered?: boolean;
}

function formatTime(seconds: number): string {
	if (!isFinite(seconds) || isNaN(seconds)) return '0:00';
	const m = Math.floor(seconds / 60);
	const s = Math.floor(seconds % 60);
	return `${m}:${s.toString().padStart(2, '0')}`;
}

export function AudioGuide({
	tracks,
	eyebrow,
	title,
	numbered = true,
	className,
	...props
}: AudioGuideProps) {
	const audioRef = useRef<HTMLAudioElement | null>(null);
	const progressRef = useRef<HTMLDivElement | null>(null);
	const [activeIndex, setActiveIndex] = useState<number | null>(null);
	const [isPlaying, setIsPlaying] = useState(false);
	const [currentTime, setCurrentTime] = useState(0);
	const [duration, setDuration] = useState(0);
	const [isMuted, setIsMuted] = useState(false);
	const [isDragging, setIsDragging] = useState(false);

	useEffect(() => {
		const audio = audioRef.current;
		if (!audio) return;

		const onTimeUpdate = () => {
			if (!isDragging) setCurrentTime(audio.currentTime);
		};
		const onLoaded = () => setDuration(audio.duration);
		const onPlay = () => setIsPlaying(true);
		const onPause = () => setIsPlaying(false);
		const onEnded = () => {
			setIsPlaying(false);
			setCurrentTime(0);
		};

		audio.addEventListener('timeupdate', onTimeUpdate);
		audio.addEventListener('loadedmetadata', onLoaded);
		audio.addEventListener('durationchange', onLoaded);
		audio.addEventListener('play', onPlay);
		audio.addEventListener('pause', onPause);
		audio.addEventListener('ended', onEnded);

		return () => {
			audio.removeEventListener('timeupdate', onTimeUpdate);
			audio.removeEventListener('loadedmetadata', onLoaded);
			audio.removeEventListener('durationchange', onLoaded);
			audio.removeEventListener('play', onPlay);
			audio.removeEventListener('pause', onPause);
			audio.removeEventListener('ended', onEnded);
		};
	}, [isDragging]);

	const playTrack = useCallback(
		(index: number) => {
			const audio = audioRef.current;
			if (!audio) return;
			const track = tracks[index];
			if (!track) return;

			if (activeIndex === index) {
				if (isPlaying) {
					audio.pause();
				} else {
					audio.play().catch(() => {});
				}
				return;
			}

			audio.pause();
			audio.src = track.src;
			audio.load();
			audio.play().catch(() => {});
			setActiveIndex(index);
			setCurrentTime(0);
			setDuration(0);
		},
		[activeIndex, isPlaying, tracks],
	);

	const seekTo = useCallback(
		(clientX: number) => {
			const bar = progressRef.current;
			const audio = audioRef.current;
			if (!bar || !audio || activeIndex === null) return;
			const rect = bar.getBoundingClientRect();
			const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
			const next = ratio * (duration || 0);
			audio.currentTime = next;
			setCurrentTime(next);
		},
		[activeIndex, duration],
	);

	const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
		if (activeIndex === null) return;
		setIsDragging(true);
		seekTo(e.clientX);
		const onMove = (ev: MouseEvent) => seekTo(ev.clientX);
		const onUp = () => {
			setIsDragging(false);
			window.removeEventListener('mousemove', onMove);
			window.removeEventListener('mouseup', onUp);
		};
		window.addEventListener('mousemove', onMove);
		window.addEventListener('mouseup', onUp);
	};

	const seekToTime = useCallback(
		(time: number) => {
			const audio = audioRef.current;
			if (!audio || activeIndex === null || !duration) return;
			const next = Math.max(0, Math.min(duration, time));
			audio.currentTime = next;
			setCurrentTime(next);
		},
		[activeIndex, duration],
	);

	const handleProgressKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
		if (activeIndex === null || !duration) return;
		switch (e.key) {
		case 'ArrowLeft':
			e.preventDefault();
			seekToTime(currentTime - 5);
			break;
		case 'ArrowRight':
			e.preventDefault();
			seekToTime(currentTime + 5);
			break;
		case 'Home':
			e.preventDefault();
			seekToTime(0);
			break;
		case 'End':
			e.preventDefault();
			seekToTime(duration);
			break;
		}
	};

	const toggleMute = () => {
		const audio = audioRef.current;
		if (!audio || activeIndex === null) return;
		audio.muted = !isMuted;
		setIsMuted(!isMuted);
	};

	if (tracks.length === 0) return null;

	const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

	return (
		<div className={cn('flex flex-col gap-4', className)} {...props}>
			<audio ref={audioRef} preload="metadata" />

			{(eyebrow || title) && (
				<div className="flex flex-col gap-1">
					{eyebrow && (
						<Text
							variant="overline"
							color="brand"
							className="inline-flex items-center gap-1.5 tracking-[0.18em]"
						>
							<Headphones className="h-3.5 w-3.5" aria-hidden="true" />
							{eyebrow}
						</Text>
					)}
					{title && (
						<Text variant="h3" as="h2" className="leading-tight tracking-tight">
							{title}
						</Text>
					)}
				</div>
			)}

			<Card padding="none">
				<ul className="divide-y divide-[var(--ds-border)]">
					{tracks.map((track, index) => {
						const isActive = activeIndex === index;
						const trackProgress = isActive ? progress : 0;
						const labelTitle = track.title ?? `Audio clip ${index + 1}`;

						return (
							<li
								key={track.key ?? `${track.src}-${index}`}
								className={cn(
									'flex flex-col gap-3 p-4 transition-colors',
									isActive
										? 'bg-[var(--ds-surface-subtle)]'
										: 'hover:bg-[var(--ds-surface-subtle)]',
								)}
							>
								<div className="flex items-center gap-4">
									<button
										type="button"
										onClick={() => playTrack(index)}
										aria-label={isActive && isPlaying ? `Pause ${labelTitle}` : `Play ${labelTitle}`}
										className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[var(--ds-brand-600)] text-white shadow-sm transition-transform hover:scale-[1.04] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ds-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ds-bg)]"
									>
										{isActive && isPlaying ? (
											<Pause className="h-4 w-4 fill-current" />
										) : (
											<Play className="h-4 w-4 translate-x-[1px] fill-current" />
										)}
									</button>

									<div className="flex min-w-0 flex-1 flex-col gap-1.5">
										<div className="flex items-baseline justify-between gap-3">
											<Text variant="body-sm" weight="medium" className="min-w-0">
												{numbered ? `${index + 1}. ` : ''}
												{labelTitle}
											</Text>
											<span className="shrink-0 text-xs tabular-nums text-[var(--ds-text-muted)]">
												{isActive
													? `${formatTime(currentTime)}${duration > 0 ? ` / ${formatTime(duration)}` : ''}`
													: '--:--'}
											</span>
										</div>

										{track.attribution && (
											<Text variant="caption" color="muted">
												{track.attribution}
											</Text>
										)}

										<div className="flex items-center gap-2">
											<div
												ref={isActive ? progressRef : undefined}
												role="slider"
												tabIndex={isActive ? 0 : undefined}
												aria-label="Seek"
												aria-valuenow={isActive ? Math.round(currentTime) : 0}
												aria-valuemin={0}
												aria-valuemax={isActive && isFinite(duration) ? Math.round(duration) : 0}
												aria-valuetext={`${formatTime(isActive ? currentTime : 0)} of ${formatTime(isActive ? duration : 0)}`}
												onMouseDown={isActive ? handleMouseDown : undefined}
												onKeyDown={isActive ? handleProgressKeyDown : undefined}
												className={cn(
													'relative h-1 w-full overflow-hidden rounded-full bg-[var(--ds-surface-muted)]',
													isActive && 'cursor-pointer',
												)}
											>
												<div
													className="h-full rounded-full bg-[var(--ds-brand-600)] transition-[width] duration-75"
													style={{ width: `${trackProgress}%` }}
												/>
											</div>
											{isActive && (
												<button
													type="button"
													onClick={toggleMute}
													aria-label={isMuted ? 'Unmute' : 'Mute'}
													className="shrink-0 rounded p-1 text-[var(--ds-brand-600)] transition-colors hover:bg-[var(--ds-surface-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ds-ring)]"
												>
													{isMuted ? (
														<VolumeX className="h-3.5 w-3.5" />
													) : (
														<Volume2 className="h-3.5 w-3.5" />
													)}
												</button>
											)}
										</div>
									</div>
								</div>
								{track.transcript && (
									<Disclosure label="Transcript">{track.transcript}</Disclosure>
								)}
							</li>
						);
					})}
				</ul>
			</Card>
		</div>
	);
}
