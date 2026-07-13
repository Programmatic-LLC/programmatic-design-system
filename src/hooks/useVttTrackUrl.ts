import { useEffect, useState } from 'react';

export function normalizeVtt(raw: string): string {
	let text = raw.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim();
	if (!text) return '';
	if (!/^WEBVTT/.test(text)) {
		return `WEBVTT\n\n${text}`;
	}
	const firstBreak = text.indexOf('\n');
	if (firstBreak !== -1 && text[firstBreak + 1] !== '\n') {
		text = `${text.slice(0, firstBreak)}\n${text.slice(firstBreak)}`;
	}
	return text;
}

export function useVttTrackUrl(captionsVtt?: string): string | null {
	const [url, setUrl] = useState<string | null>(null);

	useEffect(() => {
		if (!captionsVtt || typeof URL === 'undefined' || typeof Blob === 'undefined') {
			setUrl(null);
			return;
		}
		const text = normalizeVtt(captionsVtt);
		if (!text) {
			setUrl(null);
			return;
		}
		const objectUrl = URL.createObjectURL(new Blob([text], { type: 'text/vtt' }));
		setUrl(objectUrl);
		return () => URL.revokeObjectURL(objectUrl);
	}, [captionsVtt]);

	return url;
}
