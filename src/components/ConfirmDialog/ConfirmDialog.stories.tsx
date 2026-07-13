import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../../atoms/Button';
import { ConfirmProvider, useConfirm, type ConfirmVariant } from './ConfirmDialog';

const meta: Meta<typeof ConfirmProvider> = {
	title: 'Design System/Components/ConfirmDialog',
	component: ConfirmProvider,
	parameters: { layout: 'centered' },
	tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof ConfirmProvider>;

function ConfirmDemo() {
	const { confirm } = useConfirm();
	const [lastResult, setLastResult] = useState<string>('');

	const ask = async (variant: ConfirmVariant) => {
		const confirmed = await confirm({
			title: variant === 'danger' ? 'Delete This Item?' : 'Apply Changes?',
			message:
				variant === 'danger'
					? 'This action cannot be undone. The item will be permanently removed.'
					: 'Your changes will be visible to all visitors immediately.',
			confirmText: variant === 'danger' ? 'Delete' : 'Apply',
			variant,
		});
		setLastResult(confirmed ? 'Confirmed' : 'Cancelled');
	};

	return (
		<div className="flex flex-col items-center gap-4">
			<div className="flex flex-wrap gap-3">
				<Button variant="danger" onClick={() => ask('danger')}>Danger confirm</Button>
				<Button variant="secondary" onClick={() => ask('warning')}>Warning confirm</Button>
				<Button variant="outline" onClick={() => ask('info')}>Info confirm</Button>
				<Button onClick={() => ask('default')}>Default confirm</Button>
			</div>
			{lastResult && (
				<p className="text-sm text-[var(--ds-text-muted)]">Last result: {lastResult}</p>
			)}
		</div>
	);
}

export const Playground: Story = {
	render: () => (
		<ConfirmProvider>
			<ConfirmDemo />
		</ConfirmProvider>
	),
};
