import type { Meta, StoryObj } from '@storybook/react';
import { Palette } from 'lucide-react';
import { CardGrid } from './CardGrid';
import {
	EntityCard,
	EntityCardBody,
	EntityCardDescription,
	EntityCardImage,
	EntityCardTitle,
} from '../EntityCard';

const meta: Meta<typeof CardGrid> = {
	title: 'Design System/Components/CardGrid',
	component: CardGrid,
	parameters: { layout: 'centered' },
	tags: ['autodocs'],
	argTypes: {
		columns: { control: 'inline-radio', options: ['1-2-3', '1-2-4', '2-3'] },
		gap: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
		loading: { control: 'boolean' },
	},
};

export default meta;

type Story = StoryObj<typeof CardGrid>;

const items = Array.from({ length: 6 }, (_, i) => ({
	id: i,
	title: `Artwork ${i + 1}`,
	preview: 'A short description of this piece.',
}));

export const Basic: Story = {
	args: { columns: '1-2-3', gap: 'md' },
	render: (args) => (
		<div className="w-[1000px] max-w-full">
			<CardGrid {...args}>
				{items.map((item) => (
					<EntityCard key={item.id} width="fluid">
						<EntityCardImage src={undefined} alt={item.title} aspect="4/3" fallbackIcon={Palette} />
						<EntityCardBody>
							<EntityCardTitle>{item.title}</EntityCardTitle>
							<EntityCardDescription>{item.preview}</EntityCardDescription>
						</EntityCardBody>
					</EntityCard>
				))}
			</CardGrid>
		</div>
	),
};

export const Loading: Story = {
	args: { columns: '1-2-3', gap: 'md', loading: true, skeletonCount: 6 },
	render: (args) => (
		<div className="w-[1000px] max-w-full">
			<CardGrid {...args} />
		</div>
	),
};
