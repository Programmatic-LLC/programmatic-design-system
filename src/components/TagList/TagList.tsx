import { Badge } from '../../atoms/Badge';

export interface TagListTag {
	name: string;
}

export interface TagListProps {
	tags: TagListTag[];
	brandColor?: string;
	size?: 'sm' | 'md';
}

export function TagList({ tags = [], brandColor = '#158474', size = 'md' }: TagListProps) {
	return (
		<div className="flex flex-wrap gap-2">
			{tags.map((tag) => (
				<Badge key={tag.name} color={brandColor} variant="solid" shape="pill" size={size}>
					{tag.name}
				</Badge>
			))}
		</div>
	);
}
