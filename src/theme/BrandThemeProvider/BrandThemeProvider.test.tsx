import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrandThemeProvider } from './BrandThemeProvider';
import { useBrandTheme } from './brandThemeContext';

function Probe() {
	const { color, vars } = useBrandTheme();
	return (
		<span data-testid="probe" data-color={color ?? 'none'} data-vars={vars ? 'yes' : 'no'} />
	);
}

describe('BrandThemeProvider', () => {
	it('renders its children', () => {
		render(
			<BrandThemeProvider>
				<p>content</p>
			</BrandThemeProvider>,
		);
		expect(screen.getByText('content')).toBeInTheDocument();
	});

	it('applies brand css variables when given a color', () => {
		const { container } = render(<BrandThemeProvider color="#158474">x</BrandThemeProvider>);
		const wrapper = container.firstElementChild as HTMLElement;
		expect(wrapper.style.getPropertyValue('--ds-brand-600')).toBe('#158474');
		expect(wrapper.style.getPropertyValue('--ds-ring')).not.toBe('');
		expect(wrapper.style.getPropertyValue('--ds-text-on-brand')).toBe('#ffffff');
	});

	it('merges caller styles over the generated variables', () => {
		const { container } = render(
			<BrandThemeProvider color="#158474" style={{ marginTop: '4px' }} className="extra">
				x
			</BrandThemeProvider>,
		);
		const wrapper = container.firstElementChild as HTMLElement;
		expect(wrapper).toHaveClass('extra');
		expect(wrapper).toHaveStyle({ marginTop: '4px' });
		expect(wrapper.style.getPropertyValue('--ds-brand-50')).not.toBe('');
	});

	it('sets no variables without a color', () => {
		const { container } = render(<BrandThemeProvider style={{ padding: '2px' }}>x</BrandThemeProvider>);
		const wrapper = container.firstElementChild as HTMLElement;
		expect(wrapper.style.getPropertyValue('--ds-brand-600')).toBe('');
		expect(wrapper).toHaveStyle({ padding: '2px' });
	});

	it('exposes the color and vars through context', () => {
		render(
			<BrandThemeProvider color="#158474">
				<Probe />
			</BrandThemeProvider>,
		);
		const probe = screen.getByTestId('probe');
		expect(probe).toHaveAttribute('data-color', '#158474');
		expect(probe).toHaveAttribute('data-vars', 'yes');
	});

	it('provides an empty default context outside a provider', () => {
		render(<Probe />);
		const probe = screen.getByTestId('probe');
		expect(probe).toHaveAttribute('data-color', 'none');
		expect(probe).toHaveAttribute('data-vars', 'no');
	});
});
