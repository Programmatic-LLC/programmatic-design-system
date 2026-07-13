import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
	Card,
	CardBody,
	CardDescription,
	CardFooter,
	CardHeader,
	CardMedia,
	CardTitle,
} from './Card';

describe('Card', () => {
	it('renders children with the default surface style', () => {
		render(<Card data-testid="card">content</Card>);
		const card = screen.getByTestId('card');
		expect(card).toHaveTextContent('content');
		expect(card).toHaveClass('bg-[var(--ds-surface)]');
		expect(card).toHaveClass('shadow-sm');
		expect(card).toHaveClass('p-4');
	});

	it('applies variant and padding classes', () => {
		render(
			<Card data-testid="card" variant="ghost" padding="none">
				content
			</Card>,
		);
		const card = screen.getByTestId('card');
		expect(card).toHaveClass('bg-transparent');
		expect(card).not.toHaveClass('p-4');
	});

	it('merges custom classes and forwards the ref', () => {
		const ref = createRef<HTMLDivElement>();
		render(
			<Card ref={ref} className="custom-class" data-testid="card">
				x
			</Card>,
		);
		expect(ref.current).toBe(screen.getByTestId('card'));
		expect(ref.current).toHaveClass('custom-class');
	});
});

describe('Card subcomponents', () => {
	it('renders CardHeader with layout classes', () => {
		render(<CardHeader data-testid="header">head</CardHeader>);
		const header = screen.getByTestId('header');
		expect(header).toHaveTextContent('head');
		expect(header).toHaveClass('justify-between');
	});

	it('renders CardTitle as an h3 by default', () => {
		render(<CardTitle>Title</CardTitle>);
		const title = screen.getByRole('heading', { level: 3, name: 'Title' });
		expect(title).toHaveClass('font-semibold');
	});

	it('renders CardTitle with a custom tag', () => {
		render(<CardTitle as="h2">Title</CardTitle>);
		expect(screen.getByRole('heading', { level: 2, name: 'Title' })).toBeInTheDocument();
	});

	it('renders CardDescription as muted paragraph text', () => {
		render(<CardDescription className="extra">Detail</CardDescription>);
		const description = screen.getByText('Detail');
		expect(description.tagName).toBe('P');
		expect(description).toHaveClass('text-[var(--ds-text-muted)]');
		expect(description).toHaveClass('extra');
	});

	it('renders CardBody with pass-through classes', () => {
		render(
			<CardBody data-testid="body" className="body-class">
				body
			</CardBody>,
		);
		const body = screen.getByTestId('body');
		expect(body).toHaveTextContent('body');
		expect(body).toHaveClass('body-class');
	});

	it('renders CardFooter with a top border', () => {
		render(<CardFooter data-testid="footer">actions</CardFooter>);
		expect(screen.getByTestId('footer')).toHaveClass('border-t');
	});

	it('renders CardMedia with a default 16/9 aspect ratio', () => {
		render(<CardMedia data-testid="media">img</CardMedia>);
		const media = screen.getByTestId('media');
		expect(media).toHaveTextContent('img');
		expect(media).toHaveStyle({ aspectRatio: '16/9' });
	});

	it('accepts a custom aspect ratio and merges style', () => {
		render(<CardMedia data-testid="media" aspectRatio="1/1" style={{ opacity: 0.5 }} />);
		expect(screen.getByTestId('media')).toHaveStyle({ aspectRatio: '1/1', opacity: 0.5 });
	});
});
