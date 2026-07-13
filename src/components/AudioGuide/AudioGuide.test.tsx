import { fireEvent, render, screen } from '@testing-library/react';
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { AudioGuide, type AudioTrack } from './AudioGuide';

const playMock = vi.fn().mockResolvedValue(undefined);
const pauseMock = vi.fn();
const loadMock = vi.fn();

beforeAll(() => {
	Object.defineProperty(HTMLMediaElement.prototype, 'play', { configurable: true, value: playMock });
	Object.defineProperty(HTMLMediaElement.prototype, 'pause', { configurable: true, value: pauseMock });
	Object.defineProperty(HTMLMediaElement.prototype, 'load', { configurable: true, value: loadMock });
});

beforeEach(() => {
	playMock.mockClear();
	pauseMock.mockClear();
	loadMock.mockClear();
});

const tracks: AudioTrack[] = [
	{
		src: '/audio/stop-one.mp3',
		title: 'Stop one',
		attribution: 'Narrated by Sam',
		transcript: 'Welcome to stop one.',
	},
	{ src: '/audio/stop-two.mp3', key: 'two' },
];

function getAudio(container: HTMLElement): HTMLAudioElement {
	const audio = container.querySelector('audio');
	if (!audio) throw new Error('audio element missing');
	return audio;
}

function defineMediaState(audio: HTMLAudioElement, duration = 100) {
	const state = { currentTime: 0 };
	Object.defineProperty(audio, 'currentTime', {
		configurable: true,
		get: () => state.currentTime,
		set: (value: number) => {
			state.currentTime = value;
		},
	});
	Object.defineProperty(audio, 'duration', { configurable: true, writable: true, value: duration });
	return state;
}

function activateFirstTrack(container: HTMLElement) {
	const audio = getAudio(container);
	const state = defineMediaState(audio);
	fireEvent.click(screen.getByRole('button', { name: 'Play Stop one' }));
	fireEvent(audio, new Event('play'));
	fireEvent(audio, new Event('durationchange'));
	return { audio, state };
}

describe('AudioGuide', () => {
	it('renders nothing for empty tracks', () => {
		const { container } = render(<AudioGuide tracks={[]} />);
		expect(container).toBeEmptyDOMElement();
	});

	it('renders eyebrow, title, numbering, and fallback clip names', () => {
		render(<AudioGuide tracks={tracks} eyebrow="Audio guide" title="Listen along" />);
		expect(screen.getByText('Audio guide')).toBeInTheDocument();
		expect(screen.getByRole('heading', { level: 2, name: 'Listen along' })).toBeInTheDocument();
		expect(screen.getByText('1. Stop one')).toBeInTheDocument();
		expect(screen.getByText('2. Audio clip 2')).toBeInTheDocument();
		expect(screen.getByText('Narrated by Sam')).toBeInTheDocument();
		expect(screen.getByText('Transcript')).toBeInTheDocument();
		expect(screen.getAllByText('--:--')).toHaveLength(2);
	});

	it('can hide numbering', () => {
		render(<AudioGuide tracks={tracks} numbered={false} />);
		expect(screen.getByText('Stop one')).toBeInTheDocument();
		expect(screen.queryByText('1. Stop one')).not.toBeInTheDocument();
	});

	it('plays a track and toggles pause and resume', () => {
		const { container } = render(<AudioGuide tracks={tracks} />);
		const audio = getAudio(container);
		defineMediaState(audio);

		fireEvent.click(screen.getByRole('button', { name: 'Play Stop one' }));
		expect(audio.src).toContain('/audio/stop-one.mp3');
		expect(loadMock).toHaveBeenCalledTimes(1);
		expect(playMock).toHaveBeenCalledTimes(1);

		fireEvent(audio, new Event('play'));
		const pauseButton = screen.getByRole('button', { name: 'Pause Stop one' });
		fireEvent.click(pauseButton);
		expect(pauseMock).toHaveBeenCalled();

		fireEvent(audio, new Event('pause'));
		fireEvent.click(screen.getByRole('button', { name: 'Play Stop one' }));
		expect(playMock).toHaveBeenCalledTimes(2);
	});

	it('shows elapsed and total time from media events', () => {
		const { container } = render(<AudioGuide tracks={tracks} />);
		const { audio, state } = activateFirstTrack(container);
		expect(screen.getByText('0:00 / 1:40')).toBeInTheDocument();

		state.currentTime = 65;
		fireEvent(audio, new Event('timeupdate'));
		expect(screen.getByText('1:05 / 1:40')).toBeInTheDocument();
	});

	it('handles a non-finite duration', () => {
		const { container } = render(<AudioGuide tracks={tracks} />);
		const audio = getAudio(container);
		defineMediaState(audio, NaN);
		fireEvent.click(screen.getByRole('button', { name: 'Play Stop one' }));
		fireEvent(audio, new Event('play'));
		fireEvent(audio, new Event('durationchange'));
		const slider = screen.getAllByRole('slider')[0];
		expect(slider).toHaveAttribute('aria-valuemax', '0');
		expect(screen.getByText('0:00')).toBeInTheDocument();
	});

	it('seeks with the keyboard on the active slider', () => {
		const { container } = render(<AudioGuide tracks={tracks} />);
		const { audio } = activateFirstTrack(container);
		const slider = screen.getAllByRole('slider', { name: 'Seek' })[0];
		expect(slider).toHaveAttribute('tabindex', '0');

		fireEvent.keyDown(slider, { key: 'ArrowRight' });
		expect(slider).toHaveAttribute('aria-valuenow', '5');
		expect(audio.currentTime).toBe(5);

		fireEvent.keyDown(slider, { key: 'ArrowLeft' });
		expect(slider).toHaveAttribute('aria-valuenow', '0');

		fireEvent.keyDown(slider, { key: 'End' });
		expect(slider).toHaveAttribute('aria-valuenow', '100');

		fireEvent.keyDown(slider, { key: 'Home' });
		expect(slider).toHaveAttribute('aria-valuenow', '0');

		fireEvent.keyDown(slider, { key: 'a' });
		expect(slider).toHaveAttribute('aria-valuenow', '0');
	});

	it('seeks with the mouse and supports dragging', () => {
		const { container } = render(<AudioGuide tracks={tracks} />);
		activateFirstTrack(container);
		const slider = screen.getAllByRole('slider', { name: 'Seek' })[0];
		vi.spyOn(slider, 'getBoundingClientRect').mockReturnValue({
			left: 0,
			width: 200,
			top: 0,
			right: 200,
			bottom: 4,
			height: 4,
			x: 0,
			y: 0,
			toJSON: () => ({}),
		} as DOMRect);

		fireEvent.mouseDown(slider, { clientX: 100 });
		expect(slider).toHaveAttribute('aria-valuenow', '50');

		fireEvent.mouseMove(window, { clientX: 150 });
		expect(slider).toHaveAttribute('aria-valuenow', '75');

		fireEvent.mouseMove(window, { clientX: 500 });
		expect(slider).toHaveAttribute('aria-valuenow', '100');

		fireEvent.mouseUp(window);
		fireEvent.mouseMove(window, { clientX: 20 });
		expect(slider).toHaveAttribute('aria-valuenow', '100');
	});

	it('toggles mute on the active track', () => {
		const { container } = render(<AudioGuide tracks={tracks} />);
		const { audio } = activateFirstTrack(container);
		fireEvent.click(screen.getByRole('button', { name: 'Mute' }));
		expect(audio.muted).toBe(true);
		fireEvent.click(screen.getByRole('button', { name: 'Unmute' }));
		expect(audio.muted).toBe(false);
	});

	it('resets when the track ends', () => {
		const { container } = render(<AudioGuide tracks={tracks} />);
		const { audio, state } = activateFirstTrack(container);
		state.currentTime = 42;
		fireEvent(audio, new Event('timeupdate'));
		fireEvent(audio, new Event('ended'));
		expect(screen.getByRole('button', { name: 'Play Stop one' })).toBeInTheDocument();
		expect(screen.getByText('0:00 / 1:40')).toBeInTheDocument();
	});

	it('switches to another track', () => {
		const { container } = render(<AudioGuide tracks={tracks} />);
		const { audio } = activateFirstTrack(container);
		fireEvent.click(screen.getByRole('button', { name: 'Play Audio clip 2' }));
		expect(pauseMock).toHaveBeenCalled();
		expect(audio.src).toContain('/audio/stop-two.mp3');
		expect(screen.getAllByText('--:--')).toHaveLength(1);
	});
});
