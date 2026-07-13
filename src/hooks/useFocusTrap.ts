import { useEffect, useRef, type RefObject } from 'react';

const FOCUSABLE_SELECTOR =
	'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), iframe, [tabindex]:not([tabindex="-1"])';

export function useFocusTrap(
	active: boolean,
	containerRef: RefObject<HTMLElement | null>,
	initialFocusRef?: RefObject<HTMLElement | null>,
) {
	const previousFocusRef = useRef<HTMLElement | null>(null);

	useEffect(() => {
		if (!active) return;

		const container = containerRef.current;
		if (!container) return;

		previousFocusRef.current =
			document.activeElement instanceof HTMLElement ? document.activeElement : null;

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key !== 'Tab') return;

			const focusable = Array.from(
				container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
			).filter((element) => element.offsetParent !== null || element === document.activeElement);

			if (focusable.length === 0) {
				event.preventDefault();
				container.focus();
				return;
			}

			const first = focusable[0];
			const last = focusable[focusable.length - 1];
			const current = document.activeElement;

			if (event.shiftKey) {
				if (current === first || current === container) {
					event.preventDefault();
					last.focus();
				}
			} else if (current === last) {
				event.preventDefault();
				first.focus();
			}
		};

		document.addEventListener('keydown', handleKeyDown);
		const initial = initialFocusRef?.current;
		if (initial && container.contains(initial)) {
			initial.focus();
		} else {
			container.focus();
		}

		return () => {
			document.removeEventListener('keydown', handleKeyDown);

			const previous = previousFocusRef.current;
			if (previous && previous.isConnected && typeof previous.focus === 'function') {
				previous.focus();
			}
		};
	}, [active, containerRef, initialFocusRef]);
}
