import type { Meta, StoryObj } from '@storybook/react';
import { Navigation, Phone } from 'lucide-react';
import { ActionBar } from './ActionBar';
import { Button } from '../../atoms/Button';

const meta: Meta<typeof ActionBar> = {
	title: 'Design System/Components/ActionBar',
	component: ActionBar,
	parameters: { layout: 'padded' },
	tags: ['autodocs'],
	argTypes: {
		align: { control: 'select', options: ['start', 'center', 'end', 'between'] },
	},
};

export default meta;

type Story = StoryObj<typeof ActionBar>;

export const Inline: Story = {
	args: { align: 'start' },
	render: (args) => (
		<ActionBar {...args}>
			<Button leftIcon={<Navigation className="h-4 w-4" />}>Get directions</Button>
			<Button variant="outline" leftIcon={<Phone className="h-4 w-4" />}>
				Call
			</Button>
		</ActionBar>
	),
};
