import { useMemo, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { MapPin } from 'lucide-react';
import { Combobox } from './Combobox';

const meta: Meta<typeof Combobox> = {
	title: 'Design System/Components/Combobox',
	component: Combobox,
	parameters: { layout: 'centered' },
	tags: ['autodocs'],
	decorators: [
		(Story) => (
			<div className="flex min-h-[20rem] w-80 justify-center pt-4">
				<Story />
			</div>
		),
	],
};

export default meta;

type Story = StoryObj<typeof Combobox>;

const CITIES = [
	'Asheville, NC',
	'Austin, TX',
	'Boulder, CO',
	'Burlington, VT',
	'Charleston, SC',
	'Portland, ME',
	'Portland, OR',
	'Savannah, GA',
];

export const CitySearch: Story = {
	render: () => {
		const [value, setValue] = useState('');
		const [open, setOpen] = useState(false);

		const items = useMemo(
			() => CITIES.filter((city) => city.toLowerCase().includes(value.toLowerCase())),
			[value],
		);

		return (
			<Combobox<string>
				value={value}
				onValueChange={(next) => {
					setValue(next);
					setOpen(true);
				}}
				open={open}
				onOpenChange={setOpen}
				items={value.length > 0 ? items : []}
				onSelect={(city) => setValue(city)}
				getItemKey={(city) => city}
				ariaLabel="Search cities"
				placeholder="Search for a city..."
				startAdornment={<MapPin className="h-4 w-4 text-[var(--ds-text-muted)]" aria-hidden="true" />}
				emptyState={value.length > 0 ? 'No cities found' : null}
				inputClassName="w-full rounded-lg border border-[var(--ds-border)] py-2 pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ds-ring)]"
				renderItem={(city) => (
					<div className="flex items-center gap-2 px-4 py-2 text-sm text-[var(--ds-text)]">
						<MapPin className="h-4 w-4 text-[var(--ds-brand-700)]" aria-hidden="true" />
						{city}
					</div>
				)}
			/>
		);
	},
};
