import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Building2, ChevronDown, LogOut, Settings, Shield, User } from 'lucide-react';
import { Menu } from './Menu';

const meta: Meta<typeof Menu> = {
	title: 'Design System/Components/Menu',
	component: Menu,
	parameters: { layout: 'centered' },
	tags: ['autodocs'],
	decorators: [
		(Story) => (
			<div className="flex min-h-[18rem] w-80 justify-center pt-4">
				<Story />
			</div>
		),
	],
};

export default meta;

type Story = StoryObj<typeof Menu>;

export const ActionMenu: Story = {
	render: () => (
		<Menu>
			<Menu.Trigger className="inline-flex items-center gap-2 rounded-lg border border-[var(--ds-border)] bg-[var(--ds-surface)] px-3 py-2 text-sm font-medium text-[var(--ds-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ds-ring)]">
				<User className="h-4 w-4" aria-hidden="true" />
				<span>Account</span>
				<ChevronDown className="h-4 w-4" aria-hidden="true" />
			</Menu.Trigger>
			<Menu.Content aria-label="Account menu">
				<Menu.Item onSelect={() => {}}>
					<Settings className="h-4 w-4" aria-hidden="true" />
					Account settings
				</Menu.Item>
				<Menu.Item onSelect={() => {}}>
					<LogOut className="h-4 w-4" aria-hidden="true" />
					Log out
				</Menu.Item>
			</Menu.Content>
		</Menu>
	),
};

export const WithSectionsAndSelection: Story = {
	render: () => {
		const [current, setCurrent] = useState('riverside');
		const orgs = [
			{ id: 'riverside', name: 'Riverside Main Street' },
			{ id: 'harbor', name: 'Harbor District' },
			{ id: 'old-town', name: 'Old Town Alliance' },
		];

		return (
			<Menu>
				<Menu.Trigger className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-[var(--ds-text-muted)] hover:text-[var(--ds-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ds-ring)]">
					<Building2 className="h-4 w-4" aria-hidden="true" />
					<span>
						Managing: <span className="font-semibold text-[var(--ds-text)]">{orgs.find((o) => o.id === current)?.name}</span>
					</span>
					<ChevronDown className="h-4 w-4" aria-hidden="true" />
				</Menu.Trigger>
				<Menu.Content aria-label="Switch organization" className="w-64">
					<Menu.Section label="Platform admin">
						<Menu.Item selected={current === 'platform'} onSelect={() => setCurrent('platform')}>
							<Shield className="h-4 w-4" aria-hidden="true" />
							All organizations
						</Menu.Item>
					</Menu.Section>
					<Menu.Separator />
					<Menu.Section label="Your organizations">
						{orgs.map((org) => (
							<Menu.Item key={org.id} selected={current === org.id} onSelect={() => setCurrent(org.id)}>
								<Building2 className="h-4 w-4" aria-hidden="true" />
								{org.name}
							</Menu.Item>
						))}
					</Menu.Section>
				</Menu.Content>
			</Menu>
		);
	},
};
