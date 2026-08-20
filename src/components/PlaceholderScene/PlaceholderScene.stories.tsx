import type { Meta, StoryObj } from '@storybook/react';
import type { ReactNode } from 'react';
import {
	AttractionScene,
	CommunityPartnerScene,
	DiningScene,
	EventScene,
	GameScene,
	HistoricalSiteScene,
	LodgingScene,
	OrganizationScene,
	ParkScene,
	PublicArtScene,
	RetailScene,
	TopicPageScene,
	TourScene,
	TrailScene,
} from './scenes';

const meta: Meta = {
	title: 'Design System/Components/PlaceholderScene',
	parameters: { layout: 'centered' },
	tags: ['autodocs'],
};

export default meta;

const SCENES: Array<{ name: string; scene: ReactNode }> = [
	{ name: 'Attraction', scene: <AttractionScene /> },
	{ name: 'Dining', scene: <DiningScene /> },
	{ name: 'Lodging', scene: <LodgingScene /> },
	{ name: 'Historical Site', scene: <HistoricalSiteScene /> },
	{ name: 'Topic Page', scene: <TopicPageScene /> },
	{ name: 'Game', scene: <GameScene /> },
	{ name: 'Tour', scene: <TourScene /> },
	{ name: 'Trail', scene: <TrailScene /> },
	{ name: 'Park', scene: <ParkScene /> },
	{ name: 'Community Partner', scene: <CommunityPartnerScene /> },
	{ name: 'Event', scene: <EventScene /> },
	{ name: 'Public Art', scene: <PublicArtScene /> },
	{ name: 'Organization', scene: <OrganizationScene /> },
	{ name: 'Retail', scene: <RetailScene /> },
];

export const AllScenes: StoryObj = {
	render: () => (
		<div className="grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-3">
			{SCENES.map(({ name, scene }) => (
				<figure key={name} className="flex flex-col gap-2">
					<div className="relative aspect-[240/148] overflow-hidden rounded-[var(--ds-radius-md)] border border-[var(--ds-border)]">
						{scene}
					</div>
					<figcaption className="text-xs text-[var(--ds-text-muted)]">{name}</figcaption>
				</figure>
			))}
		</div>
	),
};
