import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { BottomSheet } from './BottomSheet';

const meta: Meta<typeof BottomSheet> = {
	title: 'Design System/Components/BottomSheet',
	component: BottomSheet,
	parameters: { layout: 'fullscreen' },
	tags: ['autodocs'],
	argTypes: {
		withBackdrop: { control: 'boolean' },
		dragToDismiss: { control: 'boolean' },
		showHandle: { control: 'boolean' },
		handleOverlay: { control: 'boolean' },
		lockBodyScroll: { control: 'boolean' },
	},
};

export default meta;

type Story = StoryObj<typeof BottomSheet>;

function Demo(args: React.ComponentProps<typeof BottomSheet>) {
	const [isOpen, setIsOpen] = useState(true);
	return (
		<div className="relative h-[600px] w-full overflow-hidden bg-gradient-to-br from-slate-200 to-slate-400">
			<div className="p-6">
				<button
					type="button"
					onClick={() => setIsOpen(true)}
					className="rounded-full bg-[var(--ds-brand-600)] px-4 py-2 text-sm font-semibold text-[var(--ds-text-on-brand)] shadow-md"
				>
					Open sheet
				</button>
			</div>
			<BottomSheet {...args} isOpen={isOpen} onClose={() => setIsOpen(false)}>
				<div className="px-5 pb-6 pt-3">
					<h2 className="text-lg font-semibold text-[var(--ds-text)]">
						Bottom sheet
					</h2>
					<p className="mt-1 text-sm text-[var(--ds-text-muted)]">
						Drag the handle down to dismiss, or tap the backdrop if enabled.
					</p>
				</div>
			</BottomSheet>
		</div>
	);
}

export const Default: Story = {
	args: {},
	render: (args) => <Demo {...args} />,
};

export const WithBackdrop: Story = {
	args: { withBackdrop: true },
	render: (args) => <Demo {...args} />,
};

export const NoHandle: Story = {
	args: { showHandle: false },
	render: (args) => <Demo {...args} />,
};

export const NoDrag: Story = {
	args: { dragToDismiss: false },
	render: (args) => <Demo {...args} />,
};

export const HandleOverlay: Story = {
	args: { handleOverlay: true },
	parameters: { layout: 'fullscreen' },
	render: (args) => {
		const [isOpen, setIsOpen] = useState(true);
		return (
			<div className="relative h-[600px] w-full overflow-hidden bg-gradient-to-br from-slate-200 to-slate-400">
				<div className="p-6">
					<button
						type="button"
						onClick={() => setIsOpen(true)}
						className="rounded-full bg-[var(--ds-brand-600)] px-4 py-2 text-sm font-semibold text-[var(--ds-text-on-brand)] shadow-md"
					>
						Open sheet
					</button>
				</div>
				<BottomSheet {...args} isOpen={isOpen} onClose={() => setIsOpen(false)}>
					<div
						className="aspect-video w-full bg-cover bg-center"
						style={{
							backgroundImage:
								'linear-gradient(135deg, #1e3a8a 0%, #0f766e 100%)',
						}}
					/>
					<div className="px-5 pb-5 pt-4">
						<h2 className="text-lg font-semibold text-[var(--ds-text)]">
							Edge-to-edge hero
						</h2>
						<p className="mt-1 text-sm text-[var(--ds-text-muted)]">
							The drag handle floats over the image with a soft white pill so
							it stays visible against any background.
						</p>
					</div>
				</BottomSheet>
			</div>
		);
	},
};
