import type { Meta, StoryObj } from '@storybook/react';
import {
	Accessibility,
	BabyIcon,
	Calendar,
	Clock,
	Coffee,
	DollarSign,
	Dog,
	Footprints,
	Globe,
	Images,
	Layers,
	Navigation,
	Palette,
	ParkingCircle,
	Phone,
	Ruler,
	Ticket,
	Trees,
	UtensilsCrossed,
	Wifi,
} from 'lucide-react';
import { EntityDetailTemplate } from './EntityDetailTemplate';
import { Button } from '../../atoms/Button';
import { Badge } from '../../atoms/Badge';
import { Card, CardHeader, CardTitle } from '../../atoms/Card';
import { Text } from '../../atoms/Text';
import { Section } from '../../components/Section';
import { MetaRow } from '../../components/MetaRow';
import { InfoList } from '../../components/InfoList';
import { MediaGallery } from '../../components/MediaGallery';
import { MapPreview } from '../../components/MapPreview';
import { AmenityList } from '../../components/AmenityList';
import { AudioGuide } from '../../components/AudioGuide';
import { FeaturedTours } from '../../components/FeaturedTours';

const meta: Meta<typeof EntityDetailTemplate> = {
	title: 'Design System/Templates/EntityDetailTemplate',
	component: EntityDetailTemplate,
	parameters: { layout: 'fullscreen' },
	tags: ['autodocs'],
	decorators: [
		(Story) => (
			<div className="min-h-screen bg-[var(--ds-bg)]">
				<Story />
			</div>
		),
	],
};

export default meta;

type Story = StoryObj<typeof EntityDetailTemplate>;

const publicArtImages = [
	{
		src: 'https://images.unsplash.com/photo-1545987796-200677ee1011?w=1600&q=80&auto=format&fit=crop',
		alt: 'Bronze sculpture on a town square plinth',
		caption: 'The Reading Sentinel at dawn',
		attribution: 'Photo · M. Alvarez',
	},
	{
		src: 'https://images.unsplash.com/photo-1502472584811-0a2f2feb8968?w=1600&q=80&auto=format&fit=crop',
		alt: 'Walk-around video of the sculpture',
		caption: 'Walk-around · 0:38',
		video: {
			src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
			poster:
				'https://images.unsplash.com/photo-1502472584811-0a2f2feb8968?w=1600&q=80&auto=format&fit=crop',
		},
	},
	{
		src: 'https://images.unsplash.com/photo-1465146633011-14f8e0781093?w=1600&q=80&auto=format&fit=crop',
		alt: 'Wide view of plaza',
		caption: 'The plaza setting',
	},
	{
		src: 'https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8?w=1600&q=80&auto=format&fit=crop',
		alt: 'Plaza in morning light',
		caption: 'Plaza in morning light',
	},
	{
		src: 'https://images.unsplash.com/photo-1531913764164-f85c52e6e654?w=1600&q=80&auto=format&fit=crop',
		alt: 'Statue silhouette at sunset',
		caption: 'Sunset against the library',
	},
];

const trailImages = [
	{
		src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1600&q=80&auto=format&fit=crop',
		alt: 'Sun-dappled forest trail',
		caption: 'The Riverwalk · morning light',
	},
	{
		src: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1600&q=80&auto=format&fit=crop',
		alt: 'Trail along a misty river',
		caption: 'Looking upstream from the bridge',
	},
	{
		src: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1600&q=80&auto=format&fit=crop',
		alt: 'Path through old-growth pines',
		caption: 'Old-growth pine grove',
	},
];

const diningImages = [
	{
		src: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1600&q=80&auto=format&fit=crop',
		alt: 'Plated dish at a warmly-lit restaurant',
		caption: 'House-made tagliatelle',
	},
	{
		src: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1600&q=80&auto=format&fit=crop',
		alt: 'Bar with mood lighting',
		caption: 'The bar at golden hour',
	},
	{
		src: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1600&q=80&auto=format&fit=crop',
		alt: 'Dining room',
		caption: 'The dining room',
	},
];

const FeaturedInTours = ({
	items,
}: {
	items: { title: string; preview: string; image: string }[];
}) => (
	<Section title="Featured in tours" headingLevel="h2">
		<FeaturedTours items={items.map((i, idx) => ({ id: String(idx), ...i }))} />
	</Section>
);

const tourItems = [
	{
		title: 'Mill Heritage Walk',
		preview: 'A self-guided walk past five sites of the original mill town, with audio at each stop.',
		image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80&auto=format&fit=crop',
	},
	{
		title: 'Riverbend Public Art Loop',
		preview: 'Eight sculptures and murals threaded together by a 45-minute downtown walk.',
		image: 'https://images.unsplash.com/photo-1577083552431-6e5fd75a9160?w=800&q=80&auto=format&fit=crop',
	},
	{
		title: 'Evening Foodie Stroll',
		preview: 'Three stops, three bites, one neighborhood — a curated taste of Cherry St.',
		image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80&auto=format&fit=crop',
	},
];

export const PublicArt: Story = {
	render: () => (
		<EntityDetailTemplate
			hero={
				<MediaGallery
					items={publicArtImages}
					aspectRatio="16/9"
					layout="editorial"
				/>
			}
			eyebrow={
				<span className="inline-flex items-center gap-1.5">
					<Palette className="h-3.5 w-3.5" aria-hidden="true" />
					Public Art
				</span>
			}
			title="The Reading Sentinel"
			address="218 Main St · Riverbend, OR"
			metadata={
				<MetaRow
					items={[
						{ label: 'Mira Castellanos' },
						{ label: '2017' },
						{ label: 'Bronze' },
						{ label: 'Permanent' },
					]}
				/>
			}
			tags={
				<>
					<Badge shape="pill" variant="brand">
						Sculpture
					</Badge>
					<Badge shape="pill">Outdoor</Badge>
					<Badge shape="pill">Family-friendly</Badge>
				</>
			}
			primaryActions={
				<Button leftIcon={<Navigation className="h-4 w-4" />}>Get directions</Button>
			}
			sidebar={
				<Card>
					<CardHeader>
						<CardTitle>At a glance</CardTitle>
					</CardHeader>
					<InfoList
						variant="icon"
						items={[
							{ icon: <Images className="h-4 w-4" />, label: 'Collection', value: 'City Centennial' },
							{ icon: <Ticket className="h-4 w-4" />, label: 'Admission', value: 'Free · open to all' },
							{
								icon: <Globe className="h-4 w-4" />,
								label: 'Artist',
								value: 'castellanos-studio.com',
								href: 'https://example.com',
							},
						]}
					/>
				</Card>
			}
			map={
				<MapPreview
					address="218 Main St · Riverbend, OR"
					coordinates={{ latitude: 44.0521, longitude: -123.0868 }}
					onGetDirections={() => {}}
				/>
			}
			related={
				<FeaturedInTours items={tourItems} />
			}
		>
			<Section title="About">
				<Text>
					Cast in bronze by sculptor Mira Castellanos, <em>The Reading Sentinel</em> watches over
					the corner of Main and Third — a quiet figure mid-page, head tilted just enough to
					suggest that a passage caught her attention. Commissioned by the city for the 2017
					centennial, the piece was sited at the entrance to the original Carnegie library, since
					converted to a community center.
				</Text>
			</Section>

			<AudioGuide
				eyebrow="Listen"
				title="Audio guides"
				tracks={[
					{
						src: 'https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Sevish_-__nbsp_.mp3',
						title: 'The story behind the Sentinel',
						attribution: 'Narrated by the artist',
					},
					{
						src: 'https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Sevish_-__nbsp_.mp3',
						title: 'On bronze, patina, and the long view',
						attribution: 'Foundry walk-through',
					},
					{
						src: 'https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Sevish_-__nbsp_.mp3',
						title: 'The 2017 dedication',
						attribution: 'Archival recording · City of Riverbend',
					},
				]}
			/>

			<Section title="Meet the artist" headingLevel="h2">
				<div className="flex flex-col gap-3">
					<Text>
						Mira Castellanos is a Portland-based sculptor whose figurative bronzes appear in
						public collections across the Pacific Northwest. Her work centers on quiet, interior
						moments — readers, listeners, watchers — rendered at human scale.
					</Text>
					<MetaRow
						items={[
							{ icon: <Globe className="h-4 w-4" />, label: 'castellanos-studio.com' },
							{ label: 'Based in Portland, OR' },
						]}
					/>
				</div>
			</Section>
		</EntityDetailTemplate>
	),
};

export const Dining: Story = {
	render: () => (
		<EntityDetailTemplate
			hero={<MediaGallery items={diningImages} aspectRatio="16/9" />}
			eyebrow={
				<span className="inline-flex items-center gap-1.5">
					<UtensilsCrossed className="h-3.5 w-3.5" aria-hidden="true" />
					Dining
				</span>
			}
			title="Tavola"
			address="44 Cherry St · Riverbend, OR"
			metadata={
				<MetaRow
					items={[
						{ label: 'Italian' },
						{ label: 'Dinner' },
						{ label: 'Casual' },
					]}
				/>
			}
			tags={
				<>
					<Badge shape="pill" variant="brand">
						Restaurant
					</Badge>
					<Badge shape="pill">Pasta</Badge>
					<Badge shape="pill">Patio</Badge>
				</>
			}
			primaryActions={
				<>
					<Button leftIcon={<Navigation className="h-4 w-4" />}>Get directions</Button>
					<Button variant="outline" leftIcon={<Phone className="h-4 w-4" />}>
						Call
					</Button>
				</>
			}
			sidebar={
				<Card>
					<CardHeader>
						<CardTitle>At a glance</CardTitle>
					</CardHeader>
					<InfoList
						variant="icon"
						items={[
							{
								icon: <Calendar className="h-4 w-4" />,
								label: 'Status',
								value: 'Open',
							},
							{
								icon: <DollarSign className="h-4 w-4" />,
								label: 'Price range',
								value: '$$ ($25 – $45)',
							},
							{
								icon: <Ticket className="h-4 w-4" />,
								label: 'Reservations',
								value: 'Recommended',
							},
							{
								icon: <Phone className="h-4 w-4" />,
								label: 'Phone',
								value: '(555) 123-4567',
								href: 'tel:5551234567',
							},
							{
								icon: <Globe className="h-4 w-4" />,
								label: 'Website',
								value: 'tavola.example',
								href: 'https://example.com',
							},
						]}
					/>
				</Card>
			}
			map={
				<MapPreview
					address="44 Cherry St · Riverbend, OR"
					coordinates={{ latitude: 44.0521, longitude: -123.0868 }}
					onGetDirections={() => {}}
				/>
			}
			related={<FeaturedInTours items={tourItems.slice(0, 2)} />}
		>
			<Section title="About">
				<Text>
					A neighborhood pasta house tucked into a 1920s storefront on Cherry. The menu changes
					weekly with what the farms have, but the tagliatelle al ragù is always on. Bar seating
					takes walk-ins; a small back patio opens in summer.
				</Text>
			</Section>

			<Section title="Amenities" headingLevel="h2">
				<AmenityList
					columns={4}
					items={[
						{ icon: <UtensilsCrossed className="h-5 w-5" />, label: 'Full bar' },
						{ icon: <Accessibility className="h-5 w-5" />, label: 'Step-free entry' },
						{ icon: <Wifi className="h-5 w-5" />, label: 'Free Wi-Fi' },
						{ icon: <BabyIcon className="h-5 w-5" />, label: 'High chairs' },
						{ icon: <Trees className="h-5 w-5" />, label: 'Patio seating' },
						{ icon: <ParkingCircle className="h-5 w-5" />, label: 'Street parking' },
					]}
				/>
			</Section>
		</EntityDetailTemplate>
	),
};

export const Trail: Story = {
	render: () => (
		<EntityDetailTemplate
			hero={<MediaGallery items={trailImages} aspectRatio="21/9" />}
			eyebrow={
				<span className="inline-flex items-center gap-1.5">
					<Footprints className="h-3.5 w-3.5" aria-hidden="true" />
					Trail
				</span>
			}
			title="Riverwalk Loop"
			metadata={
				<MetaRow
					items={[
						{ icon: <Footprints className="h-4 w-4" />, label: 'Loop' },
						{ icon: <Ruler className="h-4 w-4" />, label: '1.2 mi' },
					]}
				/>
			}
			tags={
				<>
					<Badge shape="pill" variant="brand">
						Walking
					</Badge>
					<Badge shape="pill">Accessible</Badge>
					<Badge shape="pill">Dogs on leash</Badge>
				</>
			}
			primaryActions={
				<Button leftIcon={<Navigation className="h-4 w-4" />}>Get directions</Button>
			}
			sidebar={
				<Card>
					<CardHeader>
						<CardTitle>At a glance</CardTitle>
					</CardHeader>
					<InfoList
						variant="icon"
						items={[
							{ icon: <Ruler className="h-4 w-4" />, label: 'Length', value: '1.2 mi' },
							{ icon: <Footprints className="h-4 w-4" />, label: 'Type', value: 'Loop' },
							{ icon: <Layers className="h-4 w-4" />, label: 'Surface', value: 'Paved' },
						]}
					/>
				</Card>
			}
			map={
				<MapPreview
					aspectRatio="16/9"
					address="Trailhead at Cherry St"
				/>
			}
		>
			<Section title="About">
				<Text>
					A gentle wooded path along the river, with three interpretive stops describing the
					bend&apos;s 19th-century mill history. The loop returns along the boardwalk, passing
					the original lock site.
				</Text>
			</Section>

			<AudioGuide
				eyebrow="Listen"
				title="Audio guides"
				tracks={[
					{
						src: 'https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Sevish_-__nbsp_.mp3',
						title: 'Stop 1 · The lock keeper’s cabin',
						attribution: 'Riverbend Historical Society',
					},
					{
						src: 'https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Sevish_-__nbsp_.mp3',
						title: 'Stop 2 · Mill-era boardwalk',
						attribution: 'Riverbend Historical Society',
					},
					{
						src: 'https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Sevish_-__nbsp_.mp3',
						title: 'Stop 3 · The cottonwood grove',
						attribution: 'Riverbend Historical Society',
					},
				]}
			/>

			<Section title="Trail highlights" headingLevel="h2">
				<ul className="flex flex-col gap-2 pl-1 text-[var(--ds-text)]">
					{[
						'Three interpretive stops with audio guides',
						'Riverside boardwalk with seating at the bend',
						'Cottonwood grove (peak color late October)',
						"Returns past the historic lock keeper's cabin",
					].map((line) => (
						<li key={line} className="flex items-start gap-2.5">
							<span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--ds-brand-600)]" />
							<span className="leading-relaxed">{line}</span>
						</li>
					))}
				</ul>
			</Section>

			<Section title="On the trail" headingLevel="h2">
				<AmenityList
					columns={3}
					items={[
						{ icon: <ParkingCircle className="h-5 w-5" />, label: 'Free parking' },
						{ icon: <Accessibility className="h-5 w-5" />, label: 'Wheelchair accessible' },
						{ icon: <Dog className="h-5 w-5" />, label: 'Dogs on leash' },
						{ icon: <Trees className="h-5 w-5" />, label: 'Picnic area' },
						{ icon: <Coffee className="h-5 w-5" />, label: 'Café at trailhead' },
						{ icon: <BabyIcon className="h-5 w-5" />, label: 'Family-friendly' },
					]}
				/>
			</Section>
		</EntityDetailTemplate>
	),
};

export const Event: Story = {
	render: () => (
		<EntityDetailTemplate
			hero={
				<MediaGallery
					items={[
						{
							src: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1600&q=80&auto=format&fit=crop',
							alt: 'Outdoor summer concert crowd at golden hour',
						},
						{
							src: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=1600&q=80&auto=format&fit=crop',
							alt: 'Band performing on stage',
						},
					]}
					aspectRatio="16/9"
				/>
			}
			eyebrow={
				<span className="inline-flex items-center gap-1.5">
					<Calendar className="h-3.5 w-3.5" aria-hidden="true" />
					Event
				</span>
			}
			title="Riverside Summer Series"
			address="Riverwalk Amphitheater · Riverbend, OR"
			metadata={
				<MetaRow
					items={[
						{ icon: <Calendar className="h-4 w-4" />, label: 'Saturday, July 19' },
						{ icon: <Clock className="h-4 w-4" />, label: '6 – 9 PM' },
						{ icon: <DollarSign className="h-4 w-4" />, label: 'Free' },
					]}
				/>
			}
			tags={
				<>
					<Badge shape="pill" variant="brand">
						Live music
					</Badge>
					<Badge shape="pill">Outdoor</Badge>
					<Badge shape="pill">All ages</Badge>
				</>
			}
			primaryActions={
				<>
					<Button leftIcon={<Ticket className="h-4 w-4" />}>Register</Button>
					<Button variant="outline" leftIcon={<Navigation className="h-4 w-4" />}>
						Get directions
					</Button>
				</>
			}
			sidebar={
				<Card>
					<CardHeader>
						<CardTitle>At a glance</CardTitle>
					</CardHeader>
					<InfoList
						variant="icon"
						items={[
							{
								icon: <Calendar className="h-4 w-4" />,
								label: 'Date',
								value: 'Saturday, July 19',
							},
							{ icon: <Clock className="h-4 w-4" />, label: 'Time', value: '6 – 9 PM' },
							{ icon: <DollarSign className="h-4 w-4" />, label: 'Price', value: 'Free' },
							{ icon: <Ticket className="h-4 w-4" />, label: 'Registration', value: 'Required' },
						]}
					/>
				</Card>
			}
			map={
				<MapPreview
					address="Riverwalk Amphitheater"
					coordinates={{ latitude: 44.0521, longitude: -123.0868 }}
					onGetDirections={() => {}}
				/>
			}
		>
			<Section title="About">
				<Text>
					Three Saturday evenings of free outdoor music at the Riverwalk Amphitheater. Bring a
					blanket, food trucks on-site, and the sunset rolls in around 8:30. Headliners and
					support announced two weeks before each show.
				</Text>
			</Section>
		</EntityDetailTemplate>
	),
};

export const Minimal: Story = {
	render: () => (
		<EntityDetailTemplate
			eyebrow="Attraction"
			title="A minimal example"
			address="Somewhere"
			primaryActions={
				<Button leftIcon={<Navigation className="h-4 w-4" />}>Get directions</Button>
			}
		>
			<Section title="About">
				<Text>
					The template gracefully handles missing slots — no hero, sidebar, map, or related row
					required. This is the slimmest valid entity page.
				</Text>
			</Section>
		</EntityDetailTemplate>
	),
};

export const Loading: Story = {
	name: 'Loading (skeleton)',
	render: () => (
		<EntityDetailTemplate
			loading
			hero={<div />}
			sidebar={<div />}
			map={<div />}
			related={<div />}
		/>
	),
};

export const LoadingThemed: Story = {
	name: 'Loading — themed brand',
	render: () => (
		<EntityDetailTemplate
			loading
			brandColor="#ea580c"
			hero={<div />}
			sidebar={<div />}
			map={<div />}
			related={<div />}
		/>
	),
};

export const OrgBrandedBlue: Story = {
	name: 'Themed: Coastal Maps (blue)',
	render: () => (
		<EntityDetailTemplate
			brandColor="#0369a1"
			hero={<MediaGallery items={trailImages} aspectRatio="16/9" />}
			eyebrow={
				<span className="inline-flex items-center gap-1.5">
					<Footprints className="h-3.5 w-3.5" aria-hidden="true" />
					Trail · Coastal Maps
				</span>
			}
			title="Lighthouse Loop"
			address="North Jetty · Yachats, OR"
			metadata={
				<MetaRow
					items={[
						{ icon: <Ruler className="h-4 w-4" />, label: '2.4 mi' },
						{ label: 'Loop' },
					]}
				/>
			}
			tags={
				<>
					<Badge shape="pill" variant="brand">
						Coastal
					</Badge>
					<Badge shape="pill">Accessible parts</Badge>
				</>
			}
			primaryActions={
				<Button leftIcon={<Navigation className="h-4 w-4" />}>Get directions</Button>
			}
			sidebar={
				<Card>
					<CardHeader>
						<CardTitle>At a glance</CardTitle>
					</CardHeader>
					<InfoList
						variant="icon"
						items={[
							{ icon: <Ruler className="h-4 w-4" />, label: 'Length', value: '2.4 mi loop' },
							{ icon: <Layers className="h-4 w-4" />, label: 'Surface', value: 'Mixed' },
						]}
					/>
				</Card>
			}
			map={
				<MapPreview
					address="North Jetty · Yachats, OR"
					coordinates={{ latitude: 44.3107, longitude: -124.1043 }}
					onGetDirections={() => {}}
				/>
			}
		>
			<Section title="About">
				<Text>
					Brand color flows through every interactive element — buttons, the focus
					ring, badges, and the brand-colored eyebrow — without touching individual
					components. Set <code>brandColor</code> on the template (or wrap any subtree
					in <code>BrandThemeProvider</code>).
				</Text>
			</Section>
		</EntityDetailTemplate>
	),
};

export const OrgBrandedOrange: Story = {
	name: 'Themed: Sunset Tours (orange)',
	render: () => (
		<EntityDetailTemplate
			brandColor="#ea580c"
			hero={<MediaGallery items={publicArtImages} aspectRatio="16/9" />}
			eyebrow={
				<span className="inline-flex items-center gap-1.5">
					<Palette className="h-3.5 w-3.5" aria-hidden="true" />
					Public Art · Sunset Tours
				</span>
			}
			title="The Glassblower"
			address="Pier 4 · Astoria, OR"
			tags={
				<>
					<Badge shape="pill" variant="brand">
						Sculpture
					</Badge>
				</>
			}
			primaryActions={
				<Button leftIcon={<Navigation className="h-4 w-4" />}>Get directions</Button>
			}
			sidebar={
				<Card>
					<CardHeader>
						<CardTitle>At a glance</CardTitle>
					</CardHeader>
					<InfoList
						variant="icon"
						items={[
							{ icon: <Ticket className="h-4 w-4" />, label: 'Admission', value: 'Free' },
							{ icon: <Clock className="h-4 w-4" />, label: 'Hours', value: '24 / 7' },
						]}
					/>
				</Card>
			}
		>
			<Section title="About">
				<Text>
					Same template, different organization, different brand color — the design
					system derives the full scale and contrasting on-brand text color from a
					single seed hex.
				</Text>
			</Section>
		</EntityDetailTemplate>
	),
};
