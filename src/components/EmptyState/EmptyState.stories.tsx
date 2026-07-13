import type { Meta, StoryObj } from '@storybook/react';
import { Inbox, ImageOff, Palette, Search, TriangleAlert } from 'lucide-react';
import { EmptyState } from './EmptyState';
import { Button } from '../../atoms/Button';

const meta: Meta<typeof EmptyState> = {
	title: 'Design System/Components/EmptyState',
	component: EmptyState,
	parameters: { layout: 'fullscreen' },
	tags: ['autodocs'],
	argTypes: {
		tone: { control: 'radio', options: ['default', 'error'] },
		headingLevel: { control: 'radio', options: ['h1', 'h2', 'h3'] },
	},
};

export default meta;

type Story = StoryObj<typeof EmptyState>;

export const NotFound: Story = {
	args: {
		icon: Palette,
		title: 'Public Art Not Found',
		description: "The public art you're looking for doesn't exist or may have moved.",
		action: <Button size="lg">Back to Public Art</Button>,
	},
};

export const NoResults: Story = {
	args: {
		icon: Search,
		title: 'No results for "downtown"',
		description: 'Try a broader keyword or clear your filters to see everything in this area.',
		action: <Button variant="outline">Clear filters</Button>,
	},
};

export const NoData: Story = {
	args: {
		icon: Inbox,
		title: 'Nothing here yet',
		description: 'When you start adding tours, they’ll show up here.',
		action: <Button>Create your first tour</Button>,
	},
};

export const Error: Story = {
	args: {
		tone: 'error',
		icon: TriangleAlert,
		title: 'Something went wrong',
		description: 'We couldn’t load that page. Check your connection and try again.',
		action: <Button variant="outline">Try again</Button>,
	},
};

export const NoAction: Story = {
	args: {
		icon: ImageOff,
		title: 'No images uploaded yet',
		description: 'Images you upload to this entity will appear here.',
	},
};

export const ThemedOrange: Story = {
	name: 'Themed (orange brand)',
	render: (args) => (
		<div style={{ ['--ds-brand-600' as string]: '#ea580c', ['--ds-brand-100' as string]: '#ffedd5', ['--ds-brand-700' as string]: '#c2410c', ['--ds-brand-50' as string]: '#fff7ed' }}>
			<EmptyState {...args} />
		</div>
	),
	args: {
		icon: Palette,
		title: 'Public Art Not Found',
		description: "The public art you're looking for doesn't exist.",
		action: <Button size="lg">Back to Public Art</Button>,
	},
};
