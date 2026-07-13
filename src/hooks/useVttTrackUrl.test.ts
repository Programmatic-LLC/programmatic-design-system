import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { normalizeVtt, useVttTrackUrl } from './useVttTrackUrl';

describe('normalizeVtt', () => {
	it('returns an empty string for blank input', () => {
		expect(normalizeVtt('')).toBe('');
		expect(normalizeVtt('   \n  ')).toBe('');
	});

	it('prepends the WEBVTT header when missing', () => {
		expect(normalizeVtt('00:00.000 --> 00:01.000\nHello')).toBe(
			'WEBVTT\n\n00:00.000 --> 00:01.000\nHello',
		);
	});

	it('strips a leading BOM', () => {
		expect(normalizeVtt('﻿WEBVTT\n\ncue')).toBe('WEBVTT\n\ncue');
	});

	it('normalizes CRLF and CR line endings', () => {
		expect(normalizeVtt('WEBVTT\r\n\r\ncue one\r\ncue two')).toBe('WEBVTT\n\ncue one\ncue two');
		expect(normalizeVtt('WEBVTT\r\rcue')).toBe('WEBVTT\n\ncue');
	});

	it('inserts a blank line after the header when missing', () => {
		expect(normalizeVtt('WEBVTT\ncue')).toBe('WEBVTT\n\ncue');
	});

	it('keeps a well-formed document unchanged', () => {
		const doc = 'WEBVTT\n\n00:00.000 --> 00:01.000\nHello';
		expect(normalizeVtt(doc)).toBe(doc);
	});

	it('handles a header-only document', () => {
		expect(normalizeVtt('WEBVTT')).toBe('WEBVTT');
	});
});

describe('useVttTrackUrl', () => {
	const createObjectURL = vi.fn();
	const revokeObjectURL = vi.fn();
	const originalCreate = URL.createObjectURL;
	const originalRevoke = URL.revokeObjectURL;

	beforeAll(() => {
		URL.createObjectURL = createObjectURL;
		URL.revokeObjectURL = revokeObjectURL;
	});

	afterAll(() => {
		URL.createObjectURL = originalCreate;
		URL.revokeObjectURL = originalRevoke;
	});

	beforeEach(() => {
		let counter = 0;
		createObjectURL.mockReset().mockImplementation(() => {
			counter += 1;
			return `blob:vtt-${counter}`;
		});
		revokeObjectURL.mockReset();
	});

	it('returns null when no captions are provided', () => {
		const { result } = renderHook(({ vtt }: { vtt?: string }) => useVttTrackUrl(vtt), {
			initialProps: { vtt: undefined },
		});
		expect(result.current).toBeNull();
		expect(createObjectURL).not.toHaveBeenCalled();
	});

	it('returns null when the captions normalize to nothing', () => {
		const { result } = renderHook(() => useVttTrackUrl('   '));
		expect(result.current).toBeNull();
		expect(createObjectURL).not.toHaveBeenCalled();
	});

	it('creates an object url from a vtt blob', () => {
		const { result } = renderHook(() => useVttTrackUrl('WEBVTT\n\ncue'));
		expect(result.current).toBe('blob:vtt-1');
		expect(createObjectURL).toHaveBeenCalledTimes(1);
		const blob = createObjectURL.mock.calls[0][0] as Blob;
		expect(blob).toBeInstanceOf(Blob);
		expect(blob.type).toBe('text/vtt');
	});

	it('revokes the previous url when captions change', () => {
		const { result, rerender } = renderHook(({ vtt }: { vtt?: string }) => useVttTrackUrl(vtt), {
			initialProps: { vtt: 'first cue' } as { vtt?: string },
		});
		expect(result.current).toBe('blob:vtt-1');
		rerender({ vtt: 'second cue' });
		expect(revokeObjectURL).toHaveBeenCalledWith('blob:vtt-1');
		expect(result.current).toBe('blob:vtt-2');
	});

	it('clears the url when captions are removed', () => {
		const { result, rerender } = renderHook(({ vtt }: { vtt?: string }) => useVttTrackUrl(vtt), {
			initialProps: { vtt: 'first cue' } as { vtt?: string },
		});
		expect(result.current).toBe('blob:vtt-1');
		rerender({ vtt: undefined });
		expect(revokeObjectURL).toHaveBeenCalledWith('blob:vtt-1');
		expect(result.current).toBeNull();
	});

	it('revokes the url on unmount', () => {
		const { unmount } = renderHook(() => useVttTrackUrl('cue'));
		unmount();
		expect(revokeObjectURL).toHaveBeenCalledWith('blob:vtt-1');
	});
});
