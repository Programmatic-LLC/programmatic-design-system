import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PanoramaViewer } from './PanoramaViewer';

const mocks = vi.hoisted(() => {
	const destroy = vi.fn();
	const listeners = new Map<string, (event: unknown) => void>();
	const addEventListener = vi.fn((type: string, handler: (event: unknown) => void) => {
		listeners.set(type, handler);
	});
	const Viewer = vi.fn().mockImplementation(() => ({ destroy, addEventListener }));
	return { destroy, addEventListener, listeners, Viewer };
});

vi.mock('@photo-sphere-viewer/core', () => ({ Viewer: mocks.Viewer }));
vi.mock('@photo-sphere-viewer/core/index.css', () => ({}));

describe('PanoramaViewer', () => {
	beforeEach(() => {
		mocks.Viewer.mockClear();
		mocks.destroy.mockClear();
		mocks.addEventListener.mockClear();
		mocks.listeners.clear();
	});

	it('renders an img role container with a default aria label', () => {
		render(<PanoramaViewer src="/pano.jpg" />);
		expect(screen.getByRole('img', { name: '360 degree panorama' })).toBeInTheDocument();
	});

	it('uses the alt prop for the aria label and merges className', () => {
		render(<PanoramaViewer src="/pano.jpg" alt="Town square" className="extra" />);
		const el = screen.getByRole('img', { name: 'Town square' });
		expect(el.parentElement).toHaveClass('extra');
	});

	it('creates a viewer with the panorama source', async () => {
		render(<PanoramaViewer src="/pano.jpg" />);
		await waitFor(() => expect(mocks.Viewer).toHaveBeenCalledTimes(1));
		const config = mocks.Viewer.mock.calls[0][0];
		expect(config.panorama).toBe('/pano.jpg');
		expect(config.container).toBeInstanceOf(HTMLElement);
		expect(config.navbar).toEqual(['zoom', 'move', 'fullscreen']);
	});

	it('opens at a wide field of view and leaves plain wheel scrolling to the page', async () => {
		render(<PanoramaViewer src="/pano.jpg" />);
		await waitFor(() => expect(mocks.Viewer).toHaveBeenCalledTimes(1));
		const config = mocks.Viewer.mock.calls[0][0];
		expect(config.defaultZoomLvl).toBeLessThan(50);
		expect(config.mousewheelCtrlKey).toBe(true);
		expect(config.keyboard).toBe('always');
	});

	it('shows a drag hint until the viewer is touched', async () => {
		render(<PanoramaViewer src="/pano.jpg" />);
		expect(screen.getByText('Drag to look around')).toBeInTheDocument();
		fireEvent.pointerDown(screen.getByRole('img'));
		await waitFor(() =>
			expect(screen.queryByText('Drag to look around')).not.toBeInTheDocument(),
		);
	});

	it('falls back to the flat photo when the panorama fails to load', async () => {
		render(<PanoramaViewer src="/pano.jpg" alt="Town square" fallbackSrc="/flat.jpg" />);
		await waitFor(() => expect(mocks.listeners.has('panorama-error')).toBe(true));
		act(() => mocks.listeners.get('panorama-error')!({}));
		expect(await screen.findByText(/couldn’t be loaded/)).toBeInTheDocument();
		expect(screen.getByAltText('Town square')).toHaveAttribute('src', '/flat.jpg');
	});

	it('destroys the viewer on unmount', async () => {
		const { unmount } = render(<PanoramaViewer src="/pano.jpg" />);
		await waitFor(() => expect(mocks.Viewer).toHaveBeenCalledTimes(1));
		unmount();
		expect(mocks.destroy).toHaveBeenCalledTimes(1);
	});

	it('skips viewer creation when unmounted before the module loads', async () => {
		const { unmount } = render(<PanoramaViewer src="/pano.jpg" />);
		unmount();
		await waitFor(() => expect(mocks.Viewer).not.toHaveBeenCalled());
		expect(mocks.destroy).not.toHaveBeenCalled();
	});

	it('recreates the viewer when src changes', async () => {
		const { rerender } = render(<PanoramaViewer src="/one.jpg" />);
		await waitFor(() => expect(mocks.Viewer).toHaveBeenCalledTimes(1));
		rerender(<PanoramaViewer src="/two.jpg" />);
		await waitFor(() => expect(mocks.Viewer).toHaveBeenCalledTimes(2));
		expect(mocks.destroy).toHaveBeenCalledTimes(1);
		expect(mocks.Viewer.mock.calls[1][0].panorama).toBe('/two.jpg');
	});

	it('stops propagation of pointer and touch events', () => {
		const outerPointer = vi.fn();
		const outerTouch = vi.fn();
		render(
			<div onPointerDown={outerPointer} onTouchStart={outerTouch} onTouchMove={outerTouch} onTouchEnd={outerTouch}>
				<PanoramaViewer src="/pano.jpg" />
			</div>,
		);
		const el = screen.getByRole('img');
		fireEvent.pointerDown(el);
		fireEvent.touchStart(el);
		fireEvent.touchMove(el);
		fireEvent.touchEnd(el);
		expect(outerPointer).not.toHaveBeenCalled();
		expect(outerTouch).not.toHaveBeenCalled();
	});
});
