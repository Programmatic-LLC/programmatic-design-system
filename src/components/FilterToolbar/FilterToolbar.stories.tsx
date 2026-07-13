import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { LayoutGrid, Map } from 'lucide-react';
import {
	ActiveFilterChip,
	FilterButton,
	FilterSearchInput,
	FilterToolbar,
	FilterToolbarActions,
	FilterToolbarPrimary,
} from './FilterToolbar';
import { Select } from '../../atoms/Select';
import { ViewToggle } from '../ViewToggle';

const meta: Meta<typeof FilterToolbar> = {
	title: 'Design System/Components/FilterToolbar',
	component: FilterToolbar,
	parameters: { layout: 'padded' },
	tags: ['autodocs'],
	argTypes: {
		bare: { control: 'boolean' },
	},
};

export default meta;

type Story = StoryObj<typeof FilterToolbar>;

const CATEGORIES = ['Sculpture', 'Mural', 'Mosaic', 'Installation', 'Monument', 'Memorial'];

function Demo({
	withActiveFilters = false,
	withNotice = false,
	...args
}: React.ComponentProps<typeof FilterToolbar> & {
	withActiveFilters?: boolean;
	withNotice?: boolean;
}) {
	const [search, setSearch] = useState('');
	const [sort, setSort] = useState('a-z');
	const [view, setView] = useState<'card' | 'map'>('card');
	const [active, setActive] = useState<string[]>(
		withActiveFilters ? ['Sculpture', 'Mural'] : [],
	);

	const remove = (cat: string) => setActive((prev) => prev.filter((c) => c !== cat));

	return (
		<div className="mx-auto w-full max-w-5xl">
			<FilterToolbar
				{...args}
				notice={
					withNotice && (
						<div className="rounded-[var(--ds-radius-md)] border border-[var(--ds-warning-surface)] bg-[var(--ds-warning-surface)] p-3 text-sm text-[var(--ds-warning-strong)]">
							Location access is required for &ldquo;Nearby&rdquo; sorting.
						</div>
					)
				}
			>
				<FilterToolbarPrimary>
					<FilterSearchInput
						placeholder="Search public art…"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
					/>
				</FilterToolbarPrimary>
				<FilterToolbarActions>
					{view === 'card' && (
						<Select
							value={sort}
							onChange={(e) => setSort(e.target.value)}
							options={[
								{ value: 'a-z', label: 'A-Z' },
								{ value: 'nearby', label: 'Nearby' },
							]}
						/>
					)}
					<FilterButton
						activeCount={active.length}
						onClick={() => setActive((p) => (p.length ? [] : [...CATEGORIES.slice(0, 3)]))}
					/>
					<ViewToggle
						value={view}
						onChange={(v) => setView(v as 'card' | 'map')}
						options={[
							{ value: 'card', label: 'Gallery', icon: LayoutGrid, ariaLabel: 'Gallery view' },
							{ value: 'map', label: 'Map', icon: Map, ariaLabel: 'Map view' },
						]}
					/>
				</FilterToolbarActions>
			</FilterToolbar>

			{active.length > 0 && (
				<div className="mt-4 flex flex-wrap items-center gap-2">
					{active.map((cat) => (
						<ActiveFilterChip key={cat} label={cat} onRemove={() => remove(cat)} />
					))}
					<button
						type="button"
						onClick={() => setActive([])}
						className="ml-1 text-sm font-semibold text-[var(--ds-text-muted)] underline-offset-4 transition-colors hover:text-[var(--ds-brand-700)] hover:underline"
					>
						Clear all
					</button>
				</div>
			)}
		</div>
	);
}

export const Basic: Story = {
	name: 'Basic toolbar',
	render: (args) => <Demo {...args} />,
};

export const WithActiveFilters: Story = {
	name: 'With active filters',
	render: (args) => <Demo {...args} withActiveFilters />,
};

export const WithNotice: Story = {
	name: 'With inline notice',
	render: (args) => <Demo {...args} withNotice />,
};

export const SearchOnly: Story = {
	name: 'Search input — typing + clear',
	render: () => {
		function SearchDemo() {
			const [value, setValue] = useState('mural');
			return (
				<div className="mx-auto w-full max-w-md">
					<FilterSearchInput
						placeholder="Search public art…"
						value={value}
						onChange={(e) => setValue(e.target.value)}
					/>
				</div>
			);
		}
		return <SearchDemo />;
	},
};

export const FilterButtons: Story = {
	name: 'FilterButton states',
	render: () => (
		<div className="flex flex-wrap items-center gap-3">
			<FilterButton activeCount={0} />
			<FilterButton activeCount={3} />
			<FilterButton activeCount={2} compact />
		</div>
	),
};

export const ActiveChips: Story = {
	name: 'ActiveFilterChip',
	render: () => {
		function ChipDemo() {
			const [chips, setChips] = useState(['Sculpture', 'Mural', 'Mosaic', 'Installation']);
			return (
				<div className="flex flex-wrap gap-2">
					{chips.map((c) => (
						<ActiveFilterChip
							key={c}
							label={c}
							onRemove={() => setChips((prev) => prev.filter((p) => p !== c))}
						/>
					))}
				</div>
			);
		}
		return <ChipDemo />;
	},
};
