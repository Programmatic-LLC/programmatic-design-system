import type { Meta, StoryObj } from '@storybook/react';
import { PanoramaViewer } from './PanoramaViewer';

const meta: Meta<typeof PanoramaViewer> = {
	title: 'Components/PanoramaViewer',
	component: PanoramaViewer,
	tags: ['autodocs'],
	parameters: {
		layout: 'centered',
	},
	render: (args) => (
		<div className="relative h-[420px] w-[720px] max-w-full overflow-hidden rounded-[var(--ds-radius-xl)]">
			<PanoramaViewer {...args} />
		</div>
	),
};

export default meta;

type Story = StoryObj<typeof PanoramaViewer>;

export const Default: Story = {
	args: {
		src: 'https://photo-sphere-viewer-data.netlify.app/assets/sphere.jpg',
		alt: 'Interactive 360 degree panorama',
	},
};

export const FailedToLoad: Story = {
	args: {
		src: 'https://example.invalid/missing-panorama.jpg',
		alt: 'Interactive 360 degree panorama',
		fallbackSrc: 'https://photo-sphere-viewer-data.netlify.app/assets/sphere-small.jpg',
	},
};
