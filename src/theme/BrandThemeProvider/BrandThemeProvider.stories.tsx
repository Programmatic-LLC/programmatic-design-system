import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Heart, Navigation, Palette } from 'lucide-react';
import { BrandThemeProvider } from './BrandThemeProvider';
import { Button } from '../../atoms/Button';
import { Badge } from '../../atoms/Badge';
import { Switch } from '../../atoms/Switch';
import { Checkbox } from '../../atoms/Checkbox';
import { Text } from '../../atoms/Text';
import { Card, CardHeader, CardTitle } from '../../atoms/Card';
import { Modal, ModalSection } from '../../components/Modal';
import { deriveBrandScale } from '../../utils/brandScale';

const meta: Meta<typeof BrandThemeProvider> = {
	title: 'Design System/Theme/BrandThemeProvider',
	component: BrandThemeProvider,
	parameters: { layout: 'padded' },
	tags: ['autodocs'],
	argTypes: {
		color: { control: 'color' },
	},
};

export default meta;

type Story = StoryObj<typeof BrandThemeProvider>;

function ThemedShowcase() {
	return (
		<div className="flex flex-col gap-4">
			<div className="flex flex-wrap items-center gap-3">
				<Button leftIcon={<Navigation className="h-4 w-4" />}>Primary</Button>
				<Button variant="outline">Outline</Button>
				<Button variant="ghost" leftIcon={<Heart className="h-4 w-4" />}>
					Ghost
				</Button>
				<Badge variant="brand">Brand</Badge>
				<Badge variant="solid">Solid</Badge>
				<Badge shape="pill">Pill tag</Badge>
			</div>
			<div className="flex items-center gap-4">
				<Switch label="Notifications" defaultChecked />
				<Checkbox label="Featured" defaultChecked />
			</div>
			<Text color="brand" variant="h4">
				A heading in the brand color
			</Text>
		</div>
	);
}

function ScalePreview({ color }: { color: string }) {
	const scale = deriveBrandScale(color);
	if (!scale) return null;
	return (
		<div className="grid grid-cols-11 gap-1 rounded-[var(--ds-radius-md)] border border-[var(--ds-border)] p-2">
			{(Object.keys(scale) as (keyof typeof scale)[]).map((step) => (
				<div key={step} className="flex flex-col items-center gap-1">
					<div
						className="h-10 w-full rounded-sm border border-[var(--ds-border)]"
						style={{ backgroundColor: scale[step] }}
					/>
					<span className="font-mono text-[10px] text-[var(--ds-text-muted)]">{step}</span>
				</div>
			))}
		</div>
	);
}

export const Default: Story = {
	args: { color: '#158474' },
	render: (args) => (
		<BrandThemeProvider color={args.color}>
			<div className="flex flex-col gap-4">
				<Text variant="overline" color="muted">
					Default DestinationHub brand
				</Text>
				<ThemedShowcase />
				<ScalePreview color={args.color ?? '#158474'} />
			</div>
		</BrandThemeProvider>
	),
};

export const Multiple: Story = {
	parameters: { layout: 'padded' },
	render: () => {
		const orgs = [
			{ name: 'DestinationHub (default)', color: '#158474' },
			{ name: 'Coastal Maps', color: '#0369a1' },
			{ name: 'Wildflower Trails', color: '#9333ea' },
			{ name: 'Sunset Tours', color: '#ea580c' },
			{ name: 'Heritage Society', color: '#b91c1c' },
		];
		return (
			<div className="flex flex-col gap-6">
				{orgs.map((org) => (
					<BrandThemeProvider key={org.color} color={org.color}>
						<Card>
							<CardHeader>
								<CardTitle as="h3">{org.name}</CardTitle>
								<span className="font-mono text-xs text-[var(--ds-text-muted)]">
									{org.color}
								</span>
							</CardHeader>
							<ThemedShowcase />
							<div className="mt-4">
								<ScalePreview color={org.color} />
							</div>
						</Card>
					</BrandThemeProvider>
				))}
			</div>
		);
	},
};

export const PortalSafe: Story = {
	name: 'Portal-safe (Modal inside provider)',
	parameters: { layout: 'centered' },
	render: () => {
		function PortalDemo() {
			const [color, setColor] = useState('#9333ea');
			const [open, setOpen] = useState(false);
			const swatches = ['#158474', '#0369a1', '#9333ea', '#ea580c', '#b91c1c'];
			return (
				<BrandThemeProvider color={color}>
					<div className="flex max-w-md flex-col gap-4">
						<Text variant="body-sm" color="muted">
							The Modal renders into <code>document.body</code> — outside this provider&apos;s
							DOM subtree. The hook re-applies the CSS variables on the portal panel so brand
							tokens still resolve.
						</Text>
						<div className="flex flex-wrap items-center gap-2">
							{swatches.map((c) => (
								<button
									key={c}
									type="button"
									onClick={() => setColor(c)}
									aria-pressed={color === c}
									aria-label={`Use ${c}`}
									className="h-8 w-8 rounded-full ring-2 ring-offset-2 ring-offset-[var(--ds-bg)]"
									style={{
										backgroundColor: c,
										boxShadow: color === c ? `0 0 0 2px ${c}` : undefined,
									}}
								/>
							))}
						</div>
						<Button onClick={() => setOpen(true)}>Open themed modal</Button>
						<Modal
							open={open}
							onClose={() => setOpen(false)}
							title="Filter public art"
							icon={<Palette className="h-5 w-5" />}
							titleAccessory={
								<Badge variant="solid" shape="pill" size="md">
									{color}
								</Badge>
							}
							footer={
								<>
									<Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
										Reset
									</Button>
									<Button onClick={() => setOpen(false)}>Apply</Button>
								</>
							}
						>
							<ModalSection title="Category">
								<div className="text-sm text-[var(--ds-text-muted)]">
									Header accent line, icon badge, and primary CTA all pick up the brand
									color even though we&apos;re inside a portal.
								</div>
							</ModalSection>
						</Modal>
					</div>
				</BrandThemeProvider>
			);
		}
		return <PortalDemo />;
	},
};

export const ContrastingTextOnBrand: Story = {
	name: 'Contrast: text-on-brand auto-picked',
	render: () => {
		const seeds = ['#158474', '#0369a1', '#9333ea', '#ea580c', '#facc15', '#f9a8d4'];
		return (
			<div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
				{seeds.map((color) => (
					<BrandThemeProvider key={color} color={color}>
						<div className="rounded-[var(--ds-radius-md)] bg-[var(--ds-brand-600)] p-4 text-[var(--ds-text-on-brand)]">
							<div className="text-sm font-semibold">Brand surface</div>
							<div className="font-mono text-xs opacity-80">{color}</div>
						</div>
					</BrandThemeProvider>
				))}
			</div>
		);
	},
};
