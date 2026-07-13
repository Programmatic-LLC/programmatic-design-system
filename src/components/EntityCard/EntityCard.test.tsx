import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { MapPin } from 'lucide-react';
import { DsLinkProvider, type DsLinkComponentProps } from '../../theme/DsLinkProvider';
import {
	EntityCard,
	EntityCardBadge,
	EntityCardBody,
	EntityCardDescription,
	EntityCardEyebrow,
	EntityCardImage,
	EntityCardMeta,
	EntityCardMetaItem,
	EntityCardProgressRing,
	EntityCardTags,
	EntityCardTitle,
} from './EntityCard';

function CustomLink({ href, className, children }: DsLinkComponentProps) {
	return (
		<a data-testid="custom-link" href={href} className={className}>
			{children}
		</a>
	);
}

describe('EntityCard', () => {
	it('renders a plain card when no navigation props are given', () => {
		render(<EntityCard data-testid="card">Content</EntityCard>);
		const card = screen.getByTestId('card');
		expect(card.tagName).toBe('DIV');
		expect(screen.queryByRole('link')).not.toBeInTheDocument();
		expect(screen.queryByRole('button')).not.toBeInTheDocument();
	});

	it('renders to as the default context link', () => {
		render(<EntityCard to="/trails/river-walk">River Walk</EntityCard>);
		const link = screen.getByRole('link');
		expect(link).toHaveAttribute('href', '/trails/river-walk');
		expect(link).not.toHaveAttribute('target');
	});

	it('uses a custom link component from the provider for to', () => {
		render(
			<DsLinkProvider component={CustomLink}>
				<EntityCard to="/tours/1">Tour</EntityCard>
			</DsLinkProvider>,
		);
		expect(screen.getByTestId('custom-link')).toHaveAttribute('href', '/tours/1');
	});

	it('renders href as an external anchor', () => {
		render(<EntityCard href="https://example.com">External</EntityCard>);
		const link = screen.getByRole('link');
		expect(link).toHaveAttribute('href', 'https://example.com');
		expect(link).toHaveAttribute('target', '_blank');
		expect(link).toHaveAttribute('rel', 'noreferrer');
	});

	it('renders onClick as a button and fires it', async () => {
		const user = userEvent.setup();
		const onClick = vi.fn();
		render(<EntityCard onClick={onClick}>Clickable</EntityCard>);
		await user.click(screen.getByRole('button'));
		expect(onClick).toHaveBeenCalledTimes(1);
	});

	it('applies elevation and width variants', () => {
		render(
			<EntityCard data-testid="card" elevation="flat" width="fluid">
				C
			</EntityCard>,
		);
		const card = screen.getByTestId('card');
		expect(card).toHaveClass('border', 'w-full');
	});
});

describe('EntityCardImage', () => {
	it('renders the image when src is set', () => {
		render(<EntityCardImage src="/photo.jpg" alt="Mural" />);
		expect(screen.getByAltText('Mural')).toHaveAttribute('src', '/photo.jpg');
	});

	it('renders the fallback scene when no src', () => {
		render(<EntityCardImage fallbackScene={<span data-testid="scene" />} />);
		expect(screen.getByTestId('scene')).toBeInTheDocument();
	});

	it('renders the fallback icon when no src or scene', () => {
		const { container } = render(<EntityCardImage fallbackIcon={MapPin} />);
		expect(container.querySelector('.lucide-map-pin')).not.toBeNull();
	});

	it('renders an empty gradient without any fallback', () => {
		const { container } = render(<EntityCardImage data-testid="img" />);
		expect(container.querySelector('.bg-gradient-to-br')).not.toBeNull();
		expect(container.querySelector('svg')).toBeNull();
	});

	it('renders overlays, bottom action, and aspect variant', () => {
		render(
			<EntityCardImage
				data-testid="img"
				src="/photo.jpg"
				aspect="16/9"
				bottomAction={<button>Like</button>}
			>
				<span data-testid="overlay" />
			</EntityCardImage>,
		);
		expect(screen.getByTestId('img')).toHaveClass('aspect-video');
		expect(screen.getByRole('button', { name: 'Like' })).toBeInTheDocument();
		expect(screen.getByTestId('overlay')).toBeInTheDocument();
	});
});

describe('EntityCardBadge', () => {
	it('renders default dark tone at top-left', () => {
		render(<EntityCardBadge data-testid="badge">Featured</EntityCardBadge>);
		const badge = screen.getByTestId('badge');
		expect(badge).toHaveClass('left-3', 'top-3', 'bg-black/65');
	});

	it('supports tones, positions, and a left icon', () => {
		const { rerender } = render(
			<EntityCardBadge data-testid="badge" tone="light" position="bottom-right" leftIcon={<svg data-testid="icon" />}>
				New
			</EntityCardBadge>,
		);
		const badge = screen.getByTestId('badge');
		expect(badge).toHaveClass('right-3', 'bottom-3', 'bg-white/95');
		expect(screen.getByTestId('icon')).toBeInTheDocument();
		rerender(
			<EntityCardBadge data-testid="badge" tone="brand">
				New
			</EntityCardBadge>,
		);
		expect(screen.getByTestId('badge')).toHaveClass('bg-[var(--ds-brand-600)]');
	});
});

describe('EntityCardProgressRing', () => {
	it('renders with a default aria label and clamped percent', () => {
		render(<EntityCardProgressRing percent={120} />);
		expect(screen.getByRole('img', { name: '100% complete' })).toBeInTheDocument();
	});

	it('clamps negative percent and accepts a custom label and size', () => {
		render(<EntityCardProgressRing percent={-10} size={64} ariaLabel="Tour progress" />);
		const ring = screen.getByRole('img', { name: 'Tour progress' });
		expect(ring).toHaveStyle({ width: '64px', height: '64px' });
	});
});

describe('EntityCard content primitives', () => {
	it('renders body, eyebrow, title, description, tags, and meta', () => {
		render(
			<EntityCardBody data-testid="body">
				<EntityCardEyebrow>Trail</EntityCardEyebrow>
				<EntityCardTitle>River Walk</EntityCardTitle>
				<EntityCardDescription>A scenic loop.</EntityCardDescription>
				<EntityCardTags>
					<span>Easy</span>
				</EntityCardTags>
				<EntityCardMeta>
					<EntityCardMetaItem icon={MapPin}>2.4 mi</EntityCardMetaItem>
					<EntityCardMetaItem>No icon</EntityCardMetaItem>
				</EntityCardMeta>
			</EntityCardBody>,
		);
		expect(screen.getByText('Trail')).toBeInTheDocument();
		expect(screen.getByRole('heading', { level: 3, name: 'River Walk' })).toBeInTheDocument();
		expect(screen.getByText('A scenic loop.')).toBeInTheDocument();
		expect(screen.getByText('Easy')).toBeInTheDocument();
		expect(screen.getByText('2.4 mi')).toBeInTheDocument();
		expect(screen.getByText('No icon')).toBeInTheDocument();
	});
});
