import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../../atoms/Button';
import { ToastProvider, useToast } from './Toast';

const meta: Meta<typeof ToastProvider> = {
	title: 'Design System/Components/Toast',
	component: ToastProvider,
	parameters: { layout: 'centered' },
	tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof ToastProvider>;

function ToastDemo() {
	const toast = useToast();
	return (
		<div className="flex flex-wrap gap-3">
			<Button onClick={() => toast.success('Changes saved successfully.', 'Saved')}>
				Show success
			</Button>
			<Button variant="danger" onClick={() => toast.error('Something went wrong.', 'Error')}>
				Show error
			</Button>
			<Button variant="secondary" onClick={() => toast.warning('This draft has unsaved changes.')}>
				Show warning
			</Button>
			<Button variant="outline" onClick={() => toast.info('A new version is available.')}>
				Show info
			</Button>
		</div>
	);
}

export const Playground: Story = {
	render: () => (
		<ToastProvider>
			<ToastDemo />
		</ToastProvider>
	),
};
