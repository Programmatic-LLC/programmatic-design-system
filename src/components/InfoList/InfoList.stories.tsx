import type { Meta, StoryObj } from '@storybook/react';
import { Calendar, Clock, DollarSign, Globe, Phone, Ticket, Users } from 'lucide-react';
import { InfoList } from './InfoList';
import { Card } from '../../atoms/Card';

const meta: Meta<typeof InfoList> = {
	title: 'Design System/Components/InfoList',
	component: InfoList,
	parameters: { layout: 'padded' },
	tags: ['autodocs'],
	argTypes: {
		variant: { control: 'radio', options: ['rows', 'stacked', 'icon'] },
		divided: { control: 'boolean' },
	},
	decorators: [
		(Story) => (
			<div className="max-w-sm">
				<Story />
			</div>
		),
	],
};

export default meta;

type Story = StoryObj<typeof InfoList>;

export const AtAGlance: Story = {
	args: {
		variant: 'rows',
		items: [
			{ icon: <Clock className="h-4 w-4" />, label: 'Hours', value: '9 AM – 5 PM' },
			{ icon: <Ticket className="h-4 w-4" />, label: 'Admission', value: 'Free' },
			{ icon: <Users className="h-4 w-4" />, label: 'Good for', value: 'All ages' },
			{ icon: <Calendar className="h-4 w-4" />, label: 'Best time', value: 'Spring · Fall' },
		],
	},
};

export const InsideCard: Story = {
	render: () => (
		<Card>
			<h3 className="mb-3 text-lg font-semibold text-[var(--ds-text)]">At a glance</h3>
			<InfoList
				items={[
					{ icon: <Clock className="h-4 w-4" />, label: 'Duration', value: '~45 min' },
					{ icon: <DollarSign className="h-4 w-4" />, label: 'Price', value: '$12 adults' },
					{ icon: <Phone className="h-4 w-4" />, label: 'Phone', value: '(555) 123-4567' },
					{ icon: <Globe className="h-4 w-4" />, label: 'Website', value: 'example.com' },
				]}
			/>
		</Card>
	),
};

export const Stacked: Story = {
	args: {
		variant: 'stacked',
		items: [
			{ icon: <Phone className="h-4 w-4" />, label: 'Phone', value: '(555) 123-4567' },
			{
				icon: <Globe className="h-4 w-4" />,
				label: 'Website',
				value: (
					<a href="#" className="text-[var(--ds-brand-600)] hover:underline">
						example.com
					</a>
				),
			},
		],
	},
};
