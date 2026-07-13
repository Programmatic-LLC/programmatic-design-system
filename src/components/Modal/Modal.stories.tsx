import { useState, type ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Palette, SlidersHorizontal } from 'lucide-react';
import { Modal, ModalSection } from './Modal';
import { Badge } from '../../atoms/Badge';
import { Button } from '../../atoms/Button';
import { BrandThemeProvider } from '../../theme/BrandThemeProvider';

const meta: Meta<typeof Modal> = {
	title: 'Design System/Components/Modal',
	component: Modal,
	parameters: { layout: 'centered' },
	tags: ['autodocs'],
	argTypes: {
		size: { control: 'inline-radio', options: ['sm', 'md', 'lg', 'xl'] },
		height: { control: 'inline-radio', options: ['auto', 'tall'] },
	},
};

export default meta;

type Story = StoryObj<typeof Modal>;

const CATEGORIES = ['Sculpture', 'Mural', 'Mosaic', 'Installation', 'Monument', 'Memorial'];

function CategoryChips({
	selected,
	onToggle,
}: {
	selected: string[];
	onToggle: (cat: string) => void;
}) {
	return (
		<div className="flex flex-wrap gap-2">
			{CATEGORIES.map((cat) => {
				const checked = selected.includes(cat);
				return (
					<button
						key={cat}
						type="button"
						onClick={() => onToggle(cat)}
						aria-pressed={checked}
						className={[
							'inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-medium transition-colors',
							checked
								? 'border-[var(--ds-brand-600)] bg-[var(--ds-brand-600)] text-[var(--ds-text-on-brand)] hover:bg-[var(--ds-brand-700)]'
								: 'border-[var(--ds-border-strong)] bg-[var(--ds-surface)] text-[var(--ds-text)] hover:bg-[var(--ds-surface-muted)]',
						].join(' ')}
					>
						{cat}
					</button>
				);
			})}
		</div>
	);
}

function FilterDemo({
	wrapper,
	...props
}: Partial<React.ComponentProps<typeof Modal>> & { wrapper?: (children: ReactNode) => ReactNode }) {
	const [open, setOpen] = useState(true);
	const [selected, setSelected] = useState<string[]>(['Sculpture', 'Mural']);
	const toggle = (cat: string) =>
		setSelected((prev) =>
			prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat],
		);

	const content = (
		<>
			<Button onClick={() => setOpen(true)}>Open modal</Button>
			<Modal
				{...props}
				open={open}
				onClose={() => setOpen(false)}
				title={props.title ?? 'Filter public art'}
				titleAccessory={
					selected.length > 0 ? (
						<Badge variant="solid" shape="pill" size="md">
							{selected.length} active
						</Badge>
					) : undefined
				}
				icon={props.icon ?? <Palette className="h-5 w-5" />}
				footer={
					<>
						<Button variant="ghost" size="sm" onClick={() => setSelected([])}>
							Reset
						</Button>
						<div className="flex gap-2">
							<Button variant="outline" onClick={() => setOpen(false)}>
								Cancel
							</Button>
							<Button size="lg" onClick={() => setOpen(false)}>
								{selected.length > 0 ? `Show results (${selected.length})` : 'Apply'}
							</Button>
						</div>
					</>
				}
			>
				<ModalSection title="Category">
					<CategoryChips selected={selected} onToggle={toggle} />
				</ModalSection>
			</Modal>
		</>
	);

	return <div>{wrapper ? wrapper(content) : content}</div>;
}

export const Basic: Story = {
	name: 'Basic — filter modal',
	render: (args) => <FilterDemo {...args} />,
};

export const Branded: Story = {
	name: 'Brand color via context (portal-safe)',
	render: (args) => (
		<FilterDemo
			{...args}
			wrapper={(children) => (
				<BrandThemeProvider color="#d4501a">{children}</BrandThemeProvider>
			)}
		/>
	),
};

export const NoTitleAccessory: Story = {
	name: 'Without title accessory',
	render: (args) => {
		function NoAccessoryDemo() {
			const [open, setOpen] = useState(true);
			return (
				<div>
					<Button onClick={() => setOpen(true)}>Open</Button>
					<Modal
						{...args}
						open={open}
						onClose={() => setOpen(false)}
						title="Confirm deletion"
						icon={<SlidersHorizontal className="h-5 w-5" />}
						footer={
							<>
								<span />
								<div className="flex gap-2">
									<Button variant="outline" onClick={() => setOpen(false)}>
										Cancel
									</Button>
									<Button variant="danger" onClick={() => setOpen(false)}>
										Delete
									</Button>
								</div>
							</>
						}
					>
						<p className="text-[var(--ds-text-muted)]">
							This action cannot be undone. The artwork and all of its associated photos
							will be removed permanently.
						</p>
					</Modal>
				</div>
			);
		}
		return <NoAccessoryDemo />;
	},
};

export const Minimal: Story = {
	name: 'No icon, no footer',
	render: (args) => {
		function MinDemo() {
			const [open, setOpen] = useState(true);
			return (
				<div>
					<Button onClick={() => setOpen(true)}>Open</Button>
					<Modal
						{...args}
						open={open}
						onClose={() => setOpen(false)}
						title="About this page"
					>
						<p className="text-[var(--ds-text-muted)]">
							A simple content-only modal — no icon, no footer.
						</p>
					</Modal>
				</div>
			);
		}
		return <MinDemo />;
	},
};

export const Tall: Story = {
	name: 'Tall height',
	args: { height: 'tall', size: 'lg' },
	render: (args) => <FilterDemo {...args} />,
};
