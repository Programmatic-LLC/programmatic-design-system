import type { ReactNode } from 'react';
import {
	AttractionScene,
	CommunityPartnerScene,
	DiningScene,
	EventScene,
	HistoricalSiteScene,
	LodgingScene,
	ParkScene,
	PublicArtScene,
	RetailScene,
	TrailScene,
} from './scenes';

const ENTITY_SCENES: Record<string, () => ReactNode> = {
	attraction: AttractionScene,
	dining: DiningScene,
	lodging: LodgingScene,
	historical_site: HistoricalSiteScene,
	event: EventScene,
	public_art: PublicArtScene,
	trail: TrailScene,
	park: ParkScene,
	community_partner: CommunityPartnerScene,
	retail: RetailScene,
};

export function getEntityScene(type: string): ReactNode {
	const Scene = ENTITY_SCENES[type];
	return Scene ? <Scene /> : null;
}
