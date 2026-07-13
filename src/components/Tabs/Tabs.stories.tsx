import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { MapPin, Image, FileText, Users } from 'lucide-react';
import { Tabs, type TabItem } from './Tabs';

const meta: Meta<typeof Tabs> = {
	title: 'Design System/Components/Tabs',
	component: Tabs,
	parameters: { layout: 'centered' },
	tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof Tabs>;

const DEMO_TABS: TabItem[] = [
	{ id: 'details', label: 'Details', icon: FileText },
	{ id: 'location', label: 'Location', icon: MapPin },
	{ id: 'media', label: 'Media', icon: Image, count: 4 },
	{ id: 'partners', label: 'Partners', icon: Users, count: 0 },
];

function TabsDemo({ tabs }: { tabs: TabItem[] }) {
	const [activeTab, setActiveTab] = useState(tabs[0].id);
	return (
		<div className="w-[560px]">
			<Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
			<div className="rounded-b-lg border border-t-0 border-[var(--ds-border)] bg-[var(--ds-surface)] p-6 text-sm text-[var(--ds-text-muted)]">
				Content for the {tabs.find((t) => t.id === activeTab)?.label} tab.
			</div>
		</div>
	);
}

export const Default: Story = {
	render: () => <TabsDemo tabs={DEMO_TABS} />,
};

export const WithHiddenTab: Story = {
	render: () => (
		<TabsDemo
			tabs={[...DEMO_TABS.slice(0, 3), { id: 'hidden', label: 'Hidden', icon: Users, visible: false }]}
		/>
	),
};
