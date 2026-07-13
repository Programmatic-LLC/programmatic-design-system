import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { TagList } from './TagList';

describe('TagList', () => {
	it('renders a badge for each tag', () => {
		render(<TagList tags={[{ name: 'Outdoors' }, { name: 'Family' }, { name: 'Free' }]} />);
		expect(screen.getByText('Outdoors')).toBeInTheDocument();
		expect(screen.getByText('Family')).toBeInTheDocument();
		expect(screen.getByText('Free')).toBeInTheDocument();
	});

	it('renders an empty wrapper when there are no tags', () => {
		const { container } = render(<TagList tags={[]} />);
		expect(container.firstElementChild).toBeEmptyDOMElement();
	});

	it('applies the default brand color as the badge background', () => {
		render(<TagList tags={[{ name: 'Historic' }]} />);
		expect(screen.getByText('Historic')).toHaveStyle({ backgroundColor: '#158474' });
	});

	it('applies a custom brand color', () => {
		render(<TagList tags={[{ name: 'Custom' }]} brandColor="#123456" />);
		expect(screen.getByText('Custom')).toHaveStyle({ backgroundColor: '#123456' });
	});

	it('passes the size prop through to badges', () => {
		const { rerender } = render(<TagList tags={[{ name: 'Size' }]} size="sm" />);
		const smClass = screen.getByText('Size').className;
		rerender(<TagList tags={[{ name: 'Size' }]} size="md" />);
		expect(screen.getByText('Size').className).not.toBe(smClass);
	});
});
