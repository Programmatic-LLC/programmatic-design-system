import type { Meta, StoryObj } from '@storybook/react';
import { TagList } from './TagList';

const meta: Meta<typeof TagList> = {
	title: 'Design System/Components/TagList',
	component: TagList,
	parameters: { layout: 'centered' },
	tags: ['autodocs'],
	argTypes: {
		size: { control: 'radio', options: ['sm', 'md'] },
		brandColor: { control: 'color' },
	},
};

export default meta;

type Story = StoryObj<typeof TagList>;

const TAGS = [
	{ name: 'Family Friendly' },
	{ name: 'Outdoor' },
	{ name: 'Historic' },
	{ name: 'Free Admission' },
];

export const Default: Story = {
	args: { tags: TAGS },
};

export const SmallWithCustomColor: Story = {
	args: { tags: TAGS, size: 'sm', brandColor: '#7c3aed' },
};
