import { describe, expect, it } from 'vitest';
import { cn } from './cn';

describe('cn', () => {
	it('joins multiple class strings', () => {
		expect(cn('foo', 'bar')).toBe('foo bar');
	});

	it('resolves conflicting tailwind classes in favor of the last one', () => {
		expect(cn('p-2', 'p-4')).toBe('p-4');
		expect(cn('text-sm', 'text-lg')).toBe('text-lg');
		expect(cn('bg-red-500', 'bg-blue-500')).toBe('bg-blue-500');
	});

	it('keeps non-conflicting classes intact', () => {
		expect(cn('p-2', 'mx-4', 'text-sm')).toBe('p-2 mx-4 text-sm');
	});

	it('drops falsy values', () => {
		expect(cn('foo', false, undefined, null, '', 'bar')).toBe('foo bar');
	});

	it('supports conditional object syntax', () => {
		expect(cn({ foo: true, bar: false }, 'baz')).toBe('foo baz');
	});

	it('flattens nested arrays', () => {
		expect(cn(['foo', ['bar', { baz: true }]])).toBe('foo bar baz');
	});

	it('returns an empty string for no input', () => {
		expect(cn()).toBe('');
	});
});
