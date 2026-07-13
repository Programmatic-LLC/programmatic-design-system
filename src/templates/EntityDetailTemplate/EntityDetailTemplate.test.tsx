import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { EntityDetailTemplate } from './EntityDetailTemplate';
import { EntityDetailSkeleton } from './EntityDetailSkeleton';

const reduced = vi.hoisted(() => ({ value: false }));

vi.mock('motion/react', async (importOriginal) => {
	const actual = await importOriginal<typeof import('motion/react')>();
	return { ...actual, useReducedMotion: () => reduced.value };
});

function renderFullFixture(overrides: Parameters<typeof EntityDetailTemplate>[0] = {}) {
	return render(
		<EntityDetailTemplate
			hero={<img alt="Hero shot" src="/hero.jpg" />}
			eyebrow="Attraction"
			title="Clock Tower"
			metadata={<span>Open daily</span>}
			address="1 Main St"
			tags={<span>Historic</span>}
			primaryActions={<button type="button">Get directions</button>}
			sidebar={<div>Hours and contact</div>}
			map={<div data-testid="map">Map view</div>}
			related={<div data-testid="related">Related places</div>}
			{...overrides}
		>
			<p data-testid="body">Long description</p>
		</EntityDetailTemplate>,
	);
}

describe('EntityDetailTemplate', () => {
	beforeEach(() => {
		reduced.value = false;
	});

	it('renders all slots of a full fixture', () => {
		renderFullFixture();
		expect(screen.getByAltText('Hero shot')).toBeInTheDocument();
		expect(screen.getByText('Attraction')).toBeInTheDocument();
		expect(screen.getByRole('heading', { level: 1, name: 'Clock Tower' })).toBeInTheDocument();
		expect(screen.getByText('Open daily')).toBeInTheDocument();
		expect(screen.getByText('1 Main St')).toBeInTheDocument();
		expect(screen.getByText('Historic')).toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'Get directions' })).toBeInTheDocument();
		expect(screen.getByText('Hours and contact')).toBeInTheDocument();
		expect(screen.getByTestId('map')).toBeInTheDocument();
		expect(screen.getByTestId('related')).toBeInTheDocument();
	});

	it('places children above the map in the same content column', () => {
		renderFullFixture();
		const body = screen.getByTestId('body');
		const map = screen.getByTestId('map');
		const column = body.closest('.order-3');
		expect(column).not.toBeNull();
		expect(column).toContainElement(map);
		expect(body.compareDocumentPosition(map) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
	});

	it('places related content below the main grid', () => {
		renderFullFixture();
		const related = screen.getByTestId('related');
		const map = screen.getByTestId('map');
		expect(related.closest('.order-3')).toBeNull();
		expect(map.compareDocumentPosition(related) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
	});

	it('renders the sidebar as an aside', () => {
		renderFullFixture();
		expect(screen.getByRole('complementary')).toHaveTextContent('Hours and contact');
	});

	it('renders a main landmark with focus target when mainId is set', () => {
		renderFullFixture({ mainId: 'main-content' });
		const main = screen.getByRole('main');
		expect(main).toHaveAttribute('id', 'main-content');
		expect(main).toHaveAttribute('tabindex', '-1');
	});

	it('renders a plain div without mainId', () => {
		renderFullFixture();
		expect(screen.queryByRole('main')).not.toBeInTheDocument();
	});

	it('shows the like button beside the title only when there is no hero', () => {
		renderFullFixture({ hero: undefined, likeButton: <button type="button">Like</button> });
		expect(screen.getByRole('button', { name: 'Like' })).toBeInTheDocument();
	});

	it('omits the like button when a hero is present', () => {
		renderFullFixture({ likeButton: <button type="button">Like</button> });
		expect(screen.queryByRole('button', { name: 'Like' })).not.toBeInTheDocument();
	});

	it('applies brand theme variables from brandColor', () => {
		const { container } = renderFullFixture({ brandColor: '#158474' });
		const root = container.firstElementChild as HTMLElement;
		expect(root.style.getPropertyValue('--ds-brand-600')).toBe('#158474');
	});

	it('omits header content when no header slots are provided', () => {
		render(
			<EntityDetailTemplate map={<div data-testid="map">Map only</div>}>
				<p>Just body</p>
			</EntityDetailTemplate>,
		);
		expect(document.querySelector('header')).toBeNull();
		expect(screen.getByText('Just body')).toBeInTheDocument();
	});

	it('omits the content column when there are no children and no map', () => {
		const { container } = render(<EntityDetailTemplate title="Bare" />);
		expect(container.querySelector('.order-3')).toBeNull();
	});

	it('renders the skeleton when loading', () => {
		const { container } = renderFullFixture({ loading: true, className: 'page-shell' });
		expect(container.querySelector('[aria-busy="true"]')).toHaveClass('page-shell');
		expect(screen.queryByRole('heading', { level: 1 })).not.toBeInTheDocument();
	});

	it('renders statically when reduced motion is preferred', () => {
		reduced.value = true;
		renderFullFixture();
		expect(screen.getByRole('heading', { level: 1, name: 'Clock Tower' })).toBeInTheDocument();
		expect(screen.getByTestId('map')).toBeInTheDocument();
	});
});

describe('EntityDetailSkeleton', () => {
	it('renders a polite busy region with sidebar and map placeholders by default', () => {
		const { container } = render(<EntityDetailSkeleton />);
		const root = container.firstElementChild;
		expect(root).toHaveAttribute('aria-busy', 'true');
		expect(root).toHaveAttribute('aria-live', 'polite');
		expect(container.querySelector('aside')).not.toBeNull();
	});

	it('omits optional regions when disabled', () => {
		const { container } = render(
			<EntityDetailSkeleton withSidebar={false} withMap={false} withRelated={false} />,
		);
		expect(container.querySelector('aside')).toBeNull();
	});

	it('renders related placeholders when enabled', () => {
		const { container } = render(<EntityDetailSkeleton withRelated />);
		expect(container.querySelector('.mt-14')).not.toBeNull();
	});

	it('applies brandStyle and className', () => {
		const { container } = render(
			<EntityDetailSkeleton className="loading-shell" brandStyle={{ color: 'rgb(1, 2, 3)' }} />,
		);
		const root = container.firstElementChild as HTMLElement;
		expect(root).toHaveClass('loading-shell');
		expect(root.style.color).toBe('rgb(1, 2, 3)');
	});
});
