import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { MapPreview } from './MapPreview';

const motionState = vi.hoisted(() => ({ reduced: false }));

vi.mock('motion/react', async (importOriginal) => {
	const actual = await importOriginal<typeof import('motion/react')>();
	return {
		...actual,
		useReducedMotion: () => motionState.reduced,
	};
});

afterEach(() => {
	motionState.reduced = false;
});

describe('MapPreview', () => {
	it('renders the placeholder scene and default aspect ratio', () => {
		render(<MapPreview data-testid="map" />);
		const map = screen.getByTestId('map');
		expect(map).toHaveClass('rounded-[var(--ds-radius-xl)]');
		expect(map).toHaveStyle({ aspectRatio: '16/9' });
		expect(map.querySelector('.lucide-map-pin')).not.toBeNull();
	});

	it('renders children instead of the placeholder', () => {
		render(
			<MapPreview data-testid="map">
				<div data-testid="real-map" />
			</MapPreview>,
		);
		expect(screen.getByTestId('real-map')).toBeInTheDocument();
		expect(screen.getByTestId('map').querySelector('.bg-gradient-to-br')).toBeNull();
	});

	it('shows the address chip', () => {
		render(<MapPreview address="123 Main St" />);
		expect(screen.getByText('123 Main St')).toBeInTheDocument();
	});

	it('formats coordinates to four decimals', () => {
		render(<MapPreview coordinates={{ latitude: 29.76043289, longitude: -95.3698 }} />);
		expect(screen.getByText('29.7604, -95.3698')).toBeInTheDocument();
	});

	it('renders the directions button and fires the callback', async () => {
		const user = userEvent.setup();
		const onGetDirections = vi.fn();
		render(<MapPreview onGetDirections={onGetDirections} />);
		await user.click(screen.getByRole('button', { name: /Get directions/ }));
		expect(onGetDirections).toHaveBeenCalledTimes(1);
	});

	it('supports a custom action label and square corners', () => {
		render(
			<MapPreview
				data-testid="map"
				rounded={false}
				aspectRatio="4/3"
				onGetDirections={() => {}}
				primaryActionLabel="Navigate"
			/>,
		);
		expect(screen.getByRole('button', { name: /Navigate/ })).toBeInTheDocument();
		const map = screen.getByTestId('map');
		expect(map).not.toHaveClass('rounded-[var(--ds-radius-xl)]');
		expect(map).toHaveStyle({ aspectRatio: '4/3' });
	});

	it('renders statically under reduced motion', () => {
		motionState.reduced = true;
		render(<MapPreview data-testid="map" address="Quiet St" />);
		expect(screen.getByText('Quiet St')).toBeInTheDocument();
	});
});
