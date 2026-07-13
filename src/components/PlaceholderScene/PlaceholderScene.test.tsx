import { isValidElement } from 'react';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { getEntityScene } from './getEntityScene';
import {
	AttractionScene,
	CommunityPartnerScene,
	DiningScene,
	EventScene,
	GameScene,
	HistoricalSiteScene,
	LodgingScene,
	OrganizationScene,
	PublicArtScene,
	RetailScene,
	TopicPageScene,
	TourScene,
	TrailScene,
} from './scenes';

const mappedTypes = [
	'attraction',
	'dining',
	'lodging',
	'historical_site',
	'event',
	'public_art',
	'trail',
	'community_partner',
	'retail',
];

describe('getEntityScene', () => {
	it.each(mappedTypes)('returns a renderable scene for %s', (type) => {
		const scene = getEntityScene(type);
		expect(isValidElement(scene)).toBe(true);
		const { container } = render(<>{scene}</>);
		expect(container.querySelector('svg')).toBeInTheDocument();
	});

	it('returns null for unknown entity types', () => {
		expect(getEntityScene('unknown_type')).toBeNull();
		expect(getEntityScene('')).toBeNull();
	});
});

describe('scenes', () => {
	const allScenes = [
		['AttractionScene', AttractionScene],
		['DiningScene', DiningScene],
		['LodgingScene', LodgingScene],
		['HistoricalSiteScene', HistoricalSiteScene],
		['TopicPageScene', TopicPageScene],
		['GameScene', GameScene],
		['TourScene', TourScene],
		['TrailScene', TrailScene],
		['CommunityPartnerScene', CommunityPartnerScene],
		['EventScene', EventScene],
		['PublicArtScene', PublicArtScene],
		['OrganizationScene', OrganizationScene],
		['RetailScene', RetailScene],
	] as const;

	it.each(allScenes)('%s renders an svg with the shared viewBox', (_name, Scene) => {
		const { container } = render(<Scene />);
		const svg = container.querySelector('svg');
		expect(svg).toBeInTheDocument();
		expect(svg).toHaveAttribute('viewBox', '0 0 240 148');
	});
});
