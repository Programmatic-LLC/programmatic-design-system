import type { Meta, StoryObj } from '@storybook/react';
import { Clock, Footprints, MapPin, Ruler, Sparkles } from 'lucide-react';
import {
	EntityCard,
	EntityCardBadge,
	EntityCardBody,
	EntityCardDescription,
	EntityCardEyebrow,
	EntityCardImage,
	EntityCardMeta,
	EntityCardMetaItem,
	EntityCardTags,
	EntityCardTitle,
} from './EntityCard';
import { Badge } from '../../atoms/Badge';

const meta: Meta<typeof EntityCard> = {
	title: 'Design System/Components/EntityCard',
	component: EntityCard,
	parameters: { layout: 'centered' },
	tags: ['autodocs'],
	decorators: [
		(Story) => (
			<div className="w-[22rem]">
				<Story />
			</div>
		),
	],
	argTypes: {
		elevation: { control: 'radio', options: ['flat', 'raised'] },
		width: { control: 'radio', options: ['snap', 'snapWide', 'fluid'] },
	},
};

export default meta;

type Story = StoryObj<typeof EntityCard>;

export const Basic: Story = {
	args: {
		to: '#',
		width: 'fluid',
		children: (
			<>
				<EntityCardImage
					src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80"
					alt="Tour"
				>
					<EntityCardBadge position="top-left" leftIcon={<Footprints className="h-3.5 w-3.5" />}>
						Walking Tour
					</EntityCardBadge>
				</EntityCardImage>
				<EntityCardBody>
					<EntityCardEyebrow>Self-guided</EntityCardEyebrow>
					<EntityCardTitle>Riverwalk Heritage Tour</EntityCardTitle>
					<EntityCardDescription>
						A leisurely loop covering 12 historic stops along the lakeshore, with audio guides at every stop.
					</EntityCardDescription>
					<EntityCardTags>
						<Badge variant="neutral" shape="pill">History</Badge>
						<Badge variant="neutral" shape="pill">Outdoors</Badge>
					</EntityCardTags>
					<EntityCardMeta>
						<EntityCardMetaItem icon={MapPin}>12 stops</EntityCardMetaItem>
						<EntityCardMetaItem icon={Ruler}>2.3 mi</EntityCardMetaItem>
						<EntityCardMetaItem icon={Clock}>1h 30m</EntityCardMetaItem>
					</EntityCardMeta>
				</EntityCardBody>
			</>
		),
	},
};

export const NoImage: Story = {
	args: {
		to: '#',
		width: 'fluid',
		children: (
			<>
				<EntityCardImage fallbackIcon={Sparkles} />
				<EntityCardBody>
					<EntityCardTitle>Coming Soon</EntityCardTitle>
					<EntityCardDescription>Details on this attraction will be added shortly.</EntityCardDescription>
				</EntityCardBody>
			</>
		),
	},
};
