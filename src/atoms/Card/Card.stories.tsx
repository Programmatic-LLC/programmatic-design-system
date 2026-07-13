import type { Meta, StoryObj } from '@storybook/react';
import { MapPin, Heart } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardBody, CardFooter, CardMedia } from './Card';
import { Button } from '../Button';
import { Badge } from '../Badge';

const meta: Meta<typeof Card> = {
	title: 'Design System/Atoms/Card',
	component: Card,
	parameters: { layout: 'padded' },
	tags: ['autodocs'],
	argTypes: {
		variant: {
			control: 'select',
			options: ['surface', 'subtle', 'elevated', 'outlined', 'ghost'],
		},
		padding: { control: 'select', options: ['none', 'sm', 'md', 'lg'] },
	},
	decorators: [
		(Story) => (
			<div className="max-w-md">
				<Story />
			</div>
		),
	],
};

export default meta;

type Story = StoryObj<typeof Card>;

export const Basic: Story = {
	args: { variant: 'surface', padding: 'md' },
	render: (args) => (
		<Card {...args}>
			<CardHeader>
				<div>
					<CardTitle>Riverside Trailhead</CardTitle>
					<CardDescription>Easy · 1.2 mi loop</CardDescription>
				</div>
				<Badge variant="success">Open</Badge>
			</CardHeader>
			<CardBody>
				<p className="text-sm text-[var(--ds-text-muted)]">
					A gentle wooded path along the river, with three interpretive stops and
					accessible parking at the trailhead.
				</p>
			</CardBody>
			<CardFooter>
				<Button variant="ghost" size="sm" leftIcon={<Heart className="h-4 w-4" />}>
					Save
				</Button>
				<Button size="sm" leftIcon={<MapPin className="h-4 w-4" />}>
					Directions
				</Button>
			</CardFooter>
		</Card>
	),
};

export const Variants: Story = {
	render: () => (
		<div className="grid gap-4 sm:grid-cols-2">
			{(['surface', 'subtle', 'elevated', 'outlined', 'ghost'] as const).map((v) => (
				<Card key={v} variant={v}>
					<CardTitle>{v}</CardTitle>
					<CardDescription>variant={v}</CardDescription>
				</Card>
			))}
		</div>
	),
};

export const WithMedia: Story = {
	render: () => (
		<Card padding="none">
			<CardMedia aspectRatio="16/9">
				<img
					src="https://images.unsplash.com/photo-1465056836041-7f43ac27dcb5?w=800&q=80&auto=format&fit=crop"
					alt="A wooded trail at golden hour"
					className="h-full w-full object-cover"
				/>
			</CardMedia>
			<div className="p-5">
				<CardHeader>
					<div>
						<CardTitle>Sunset Ridge Overlook</CardTitle>
						<CardDescription>Moderate · 2.8 mi out & back</CardDescription>
					</div>
					<Badge variant="brand">Featured</Badge>
				</CardHeader>
				<CardBody>
					<p className="text-sm text-[var(--ds-text-muted)]">
						Best viewed an hour before sunset. Bring water; no shade at the overlook.
					</p>
				</CardBody>
			</div>
		</Card>
	),
};
