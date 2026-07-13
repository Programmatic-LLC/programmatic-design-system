import type { Meta, StoryObj } from '@storybook/react';
import { MapPin } from 'lucide-react';
import { Text } from '../../atoms/Text';
import { Timeline, TimelineItem } from './Timeline';

const meta: Meta<typeof Timeline> = {
	title: 'Design System/Components/Timeline',
	component: Timeline,
	parameters: { layout: 'padded' },
	tags: ['autodocs'],
	argTypes: {
		gap: { control: 'radio', options: ['sm', 'md', 'lg'] },
	},
};

export default meta;

type Story = StoryObj<typeof Timeline>;

const STOPS = [
	{ title: 'Museum of History', detail: 'Start your walk in the heart of downtown.' },
	{ title: 'Riverside Mural', detail: 'A short stroll along the waterfront.' },
	{ title: 'Old Mill Bridge', detail: 'Cross the historic footbridge.' },
];

export const NumberedStops: Story = {
	render: (args) => (
		<Timeline {...args} className="max-w-md">
			{STOPS.map((stop, index) => (
				<TimelineItem key={stop.title} marker={index + 1}>
					<div className="flex flex-col gap-1 p-2">
						<Text variant="h4" as="h3">{stop.title}</Text>
						<Text variant="body-sm" color="muted">{stop.detail}</Text>
					</div>
				</TimelineItem>
			))}
		</Timeline>
	),
};

export const States: Story = {
	render: () => (
		<Timeline className="max-w-md">
			<TimelineItem marker={1} state="completed">
				<div className="p-2"><Text variant="body-sm">Completed stop</Text></div>
			</TimelineItem>
			<TimelineItem marker={2} state="active" highlighted>
				<div className="p-2"><Text variant="body-sm">Active, highlighted stop</Text></div>
			</TimelineItem>
			<TimelineItem marker={<MapPin className="h-4 w-4" />} state="muted">
				<div className="p-2"><Text variant="body-sm">Muted stop with icon marker</Text></div>
			</TimelineItem>
		</Timeline>
	),
};

export const Selectable: Story = {
	render: () => (
		<Timeline className="max-w-md" animate={false}>
			{STOPS.map((stop, index) => (
				<TimelineItem
					key={stop.title}
					marker={index + 1}
					onSelect={() => {}}
					selectLabel={`View ${stop.title}`}
				>
					<div className="flex flex-col gap-1 p-2">
						<Text variant="h4" as="h3">{stop.title}</Text>
						<Text variant="body-sm" color="muted">{stop.detail}</Text>
					</div>
				</TimelineItem>
			))}
		</Timeline>
	),
};
