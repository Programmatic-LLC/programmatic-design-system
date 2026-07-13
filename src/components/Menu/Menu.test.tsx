import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Menu } from './Menu';

function renderMenu(items?: React.ReactNode) {
	return render(
		<Menu>
			<Menu.Trigger>Options</Menu.Trigger>
			<Menu.Content aria-label="Options menu">
				{items ?? (
					<>
						<Menu.Item onSelect={() => {}}>Edit</Menu.Item>
						<Menu.Item onSelect={() => {}}>Duplicate</Menu.Item>
						<Menu.Item onSelect={() => {}}>Delete</Menu.Item>
					</>
				)}
			</Menu.Content>
		</Menu>,
	);
}

describe('Menu', () => {
	it('renders a closed trigger with menu semantics', () => {
		renderMenu();
		const trigger = screen.getByRole('button', { name: 'Options' });
		expect(trigger).toHaveAttribute('aria-haspopup', 'menu');
		expect(trigger).toHaveAttribute('aria-expanded', 'false');
		expect(screen.queryByRole('menu')).not.toBeInTheDocument();
	});

	it('opens on trigger click and focuses the first item', async () => {
		const user = userEvent.setup();
		renderMenu();
		await user.click(screen.getByRole('button', { name: 'Options' }));
		expect(screen.getByRole('menu', { name: 'Options menu' })).toBeInTheDocument();
		expect(screen.getByRole('menuitem', { name: 'Edit' })).toHaveFocus();
		expect(screen.getByRole('button', { name: 'Options' })).toHaveAttribute('aria-expanded', 'true');
	});

	it('navigates items with arrow, home, and end keys', async () => {
		const user = userEvent.setup();
		renderMenu();
		await user.click(screen.getByRole('button', { name: 'Options' }));
		const menu = screen.getByRole('menu');

		fireEvent.keyDown(menu, { key: 'ArrowDown' });
		expect(screen.getByRole('menuitem', { name: 'Duplicate' })).toHaveFocus();
		fireEvent.keyDown(menu, { key: 'ArrowUp' });
		expect(screen.getByRole('menuitem', { name: 'Edit' })).toHaveFocus();
		fireEvent.keyDown(menu, { key: 'ArrowUp' });
		expect(screen.getByRole('menuitem', { name: 'Delete' })).toHaveFocus();
		fireEvent.keyDown(menu, { key: 'ArrowDown' });
		expect(screen.getByRole('menuitem', { name: 'Edit' })).toHaveFocus();
		fireEvent.keyDown(menu, { key: 'End' });
		expect(screen.getByRole('menuitem', { name: 'Delete' })).toHaveFocus();
		fireEvent.keyDown(menu, { key: 'Home' });
		expect(screen.getByRole('menuitem', { name: 'Edit' })).toHaveFocus();
	});

	it('closes on Escape and returns focus to the trigger', async () => {
		const user = userEvent.setup();
		renderMenu();
		await user.click(screen.getByRole('button', { name: 'Options' }));
		fireEvent.keyDown(screen.getByRole('menu'), { key: 'Escape' });
		expect(screen.queryByRole('menu')).not.toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'Options' })).toHaveFocus();
	});

	it('closes on Tab without restoring trigger focus', async () => {
		const user = userEvent.setup();
		renderMenu();
		await user.click(screen.getByRole('button', { name: 'Options' }));
		fireEvent.keyDown(screen.getByRole('menu'), { key: 'Tab' });
		expect(screen.queryByRole('menu')).not.toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'Options' })).not.toHaveFocus();
	});

	it('closes when pointing down outside', async () => {
		const user = userEvent.setup();
		renderMenu();
		await user.click(screen.getByRole('button', { name: 'Options' }));
		fireEvent.pointerDown(document.body);
		expect(screen.queryByRole('menu')).not.toBeInTheDocument();
	});

	it('stays open when pointing down inside the content', async () => {
		const user = userEvent.setup();
		renderMenu();
		await user.click(screen.getByRole('button', { name: 'Options' }));
		fireEvent.pointerDown(screen.getByRole('menuitem', { name: 'Edit' }));
		expect(screen.getByRole('menu')).toBeInTheDocument();
	});

	it('selects an item, closes, and refocuses the trigger', async () => {
		const user = userEvent.setup();
		const onSelect = vi.fn();
		const onClick = vi.fn();
		renderMenu(
			<Menu.Item onSelect={onSelect} onClick={onClick}>
				Only
			</Menu.Item>,
		);
		await user.click(screen.getByRole('button', { name: 'Options' }));
		await user.click(screen.getByRole('menuitem', { name: 'Only' }));
		expect(onSelect).toHaveBeenCalledTimes(1);
		expect(onClick).toHaveBeenCalledTimes(1);
		expect(screen.queryByRole('menu')).not.toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'Options' })).toHaveFocus();
	});

	it('closes without refocusing when closeOnSelect is false', async () => {
		const user = userEvent.setup();
		renderMenu(
			<Menu.Item onSelect={() => {}} closeOnSelect={false}>
				Quiet
			</Menu.Item>,
		);
		await user.click(screen.getByRole('button', { name: 'Options' }));
		await user.click(screen.getByRole('menuitem', { name: 'Quiet' }));
		expect(screen.queryByRole('menu')).not.toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'Options' })).not.toHaveFocus();
	});

	it('renders radio items with selection state', async () => {
		const user = userEvent.setup();
		renderMenu(
			<>
				<Menu.Item selected onSelect={() => {}}>
					Nearest
				</Menu.Item>
				<Menu.Item selected={false} onSelect={() => {}}>
					Newest
				</Menu.Item>
			</>,
		);
		await user.click(screen.getByRole('button', { name: 'Options' }));
		expect(screen.getByRole('menuitemradio', { name: 'Nearest' })).toHaveAttribute('aria-checked', 'true');
		expect(screen.getByRole('menuitemradio', { name: 'Newest' })).toHaveAttribute('aria-checked', 'false');
	});

	it('skips disabled items for focus and selection', async () => {
		const user = userEvent.setup();
		const onSelect = vi.fn();
		renderMenu(
			<>
				<Menu.Item disabled onSelect={onSelect}>
					Locked
				</Menu.Item>
				<Menu.Item onSelect={() => {}}>Open</Menu.Item>
			</>,
		);
		await user.click(screen.getByRole('button', { name: 'Options' }));
		expect(screen.getByRole('menuitem', { name: 'Open' })).toHaveFocus();
		fireEvent.click(screen.getByRole('menuitem', { name: 'Locked' }));
		expect(onSelect).not.toHaveBeenCalled();
		expect(screen.getByRole('menu')).toBeInTheDocument();
	});

	it('clones a child element with asChild', async () => {
		const user = userEvent.setup();
		const onSelect = vi.fn();
		renderMenu(
			<Menu.Item asChild onSelect={onSelect}>
				<a href="#detail">Open detail</a>
			</Menu.Item>,
		);
		await user.click(screen.getByRole('button', { name: 'Options' }));
		const item = screen.getByRole('menuitem', { name: 'Open detail' });
		expect(item.tagName).toBe('A');
		await user.click(item);
		expect(onSelect).toHaveBeenCalledTimes(1);
		expect(screen.queryByRole('menu')).not.toBeInTheDocument();
	});

	it('prevents activation of a disabled asChild item', async () => {
		const user = userEvent.setup();
		const onSelect = vi.fn();
		renderMenu(
			<Menu.Item asChild disabled onSelect={onSelect}>
				<a href="#detail">Blocked</a>
			</Menu.Item>,
		);
		await user.click(screen.getByRole('button', { name: 'Options' }));
		const item = screen.getByRole('menuitem', { name: 'Blocked' });
		expect(item).toHaveAttribute('aria-disabled', 'true');
		fireEvent.click(item);
		expect(onSelect).not.toHaveBeenCalled();
	});

	it('renders sections with labels and separators', async () => {
		const user = userEvent.setup();
		renderMenu(
			<>
				<Menu.Section label="Sort by">
					<Menu.Item onSelect={() => {}}>Name</Menu.Item>
				</Menu.Section>
				<Menu.Separator />
				<Menu.Section>
					<Menu.Item onSelect={() => {}}>Reset</Menu.Item>
				</Menu.Section>
			</>,
		);
		await user.click(screen.getByRole('button', { name: 'Options' }));
		expect(screen.getByRole('group', { name: 'Sort by' })).toBeInTheDocument();
		expect(screen.getByRole('separator')).toBeInTheDocument();
	});

	it('throws when subcomponents render outside Menu', () => {
		const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
		expect(() => render(<Menu.Item>Stray</Menu.Item>)).toThrow('Menu.Item must be used within <Menu>');
		spy.mockRestore();
	});

	it('supports start alignment for the content', async () => {
		const user = userEvent.setup();
		render(
			<Menu>
				<Menu.Trigger>Options</Menu.Trigger>
				<Menu.Content align="start">
					<Menu.Item>Item</Menu.Item>
				</Menu.Content>
			</Menu>,
		);
		await user.click(screen.getByRole('button', { name: 'Options' }));
		expect(screen.getByRole('menu')).toHaveClass('left-0');
	});
});
