import type { Meta, StoryObj } from '@storybook/react';
import {
	aliasTokens,
	brandScale,
	neutralScale,
	semanticScales,
	type ColorScale,
	type ColorSwatch,
	type SemanticToken,
} from '../tokens/colors';

function Swatch({ swatch }: { swatch: ColorSwatch }) {
	return (
		<div className="flex flex-col gap-1">
			<div
				className="h-16 w-full rounded-[var(--ds-radius-md)] border border-[var(--ds-border)] shadow-sm"
				style={{ backgroundColor: swatch.value }}
			/>
			<div className="flex flex-col">
				<span className="text-sm font-medium text-[var(--ds-text)]">{swatch.name}</span>
				<span className="font-mono text-xs text-[var(--ds-text-muted)]">{swatch.value}</span>
			</div>
		</div>
	);
}

function ScaleBlock({ scale }: { scale: ColorScale }) {
	return (
		<section className="flex flex-col gap-3">
			<header className="flex flex-col gap-0.5">
				<h3 className="text-lg font-semibold text-[var(--ds-text)]">{scale.name}</h3>
				<p className="text-sm text-[var(--ds-text-muted)]">{scale.description}</p>
			</header>
			<div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-6">
				{scale.swatches.map((s) => (
					<Swatch key={s.cssVar} swatch={s} />
				))}
			</div>
		</section>
	);
}

function AliasRow({ token }: { token: SemanticToken }) {
	return (
		<div className="grid grid-cols-[auto_1fr_2fr] items-center gap-4 rounded-[var(--ds-radius-md)] border border-[var(--ds-border)] p-3">
			<div
				className="h-10 w-10 rounded-[var(--ds-radius-sm)] border border-[var(--ds-border)]"
				style={{ backgroundColor: `var(${token.cssVar})` }}
			/>
			<div className="flex flex-col">
				<span className="text-sm font-medium text-[var(--ds-text)]">{token.name}</span>
				<span className="font-mono text-xs text-[var(--ds-text-muted)]">{token.cssVar}</span>
			</div>
			<span className="text-sm text-[var(--ds-text-muted)]">{token.usage}</span>
		</div>
	);
}

const meta = {
	title: 'Design System/Foundations/Colors',
	parameters: { layout: 'padded' },
} satisfies Meta;

export default meta;

type Story = StoryObj;

export const Brand: Story = {
	render: () => <ScaleBlock scale={brandScale} />,
};

export const Neutral: Story = {
	render: () => <ScaleBlock scale={neutralScale} />,
};

export const Semantic: Story = {
	render: () => (
		<div className="flex flex-col gap-8">
			{semanticScales.map((s) => (
				<ScaleBlock key={s.name} scale={s} />
			))}
		</div>
	),
};

export const SemanticAliases: Story = {
	render: () => (
		<div className="flex max-w-2xl flex-col gap-3">
			<header className="flex flex-col gap-0.5">
				<h3 className="text-lg font-semibold text-[var(--ds-text)]">Semantic aliases</h3>
				<p className="text-sm text-[var(--ds-text-muted)]">
					Use these tokens in components rather than raw palette values so dark mode and future
					theming come for free.
				</p>
			</header>
			{aliasTokens.map((t) => (
				<AliasRow key={t.cssVar} token={t} />
			))}
		</div>
	),
};
