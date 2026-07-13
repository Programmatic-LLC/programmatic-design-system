import type { Meta, StoryObj } from '@storybook/react';
import { Clock, MapPin, Star, Ticket } from 'lucide-react';
import { MetaRow } from './MetaRow';

const meta: Meta<typeof MetaRow> = {
	title: 'Design System/Components/MetaRow',
	component: MetaRow,
	parameters: { layout: 'padded' },
	tags: ['autodocs'],
	argTypes: {
		size: { control: 'radio', options: ['sm', 'md'] },
	},
};

export default meta;

type Story = StoryObj<typeof MetaRow>;

export const Default: Story = {
	args: {
		items: [
			{ icon: <Star className="h-4 w-4" />, label: '4.8 · 124 reviews' },
			{ icon: <Clock className="h-4 w-4" />, label: 'Open until 9 PM' },
			{ icon: <MapPin className="h-4 w-4" />, label: '0.4 mi away' },
			{ icon: <Ticket className="h-4 w-4" />, label: 'Free admission' },
		],
	},
};

export const TextOnly: Story = {
	args: {
		items: [{ label: 'Italian' }, { label: 'Dinner' }, { label: 'Casual' }, { label: '$$' }],
	},
};

export const PipeSeparator: Story = {
	args: {
		separator: '|',
		items: [{ label: 'Sculpture' }, { label: 'Outdoor' }, { label: 'Bronze' }],
	},
};
