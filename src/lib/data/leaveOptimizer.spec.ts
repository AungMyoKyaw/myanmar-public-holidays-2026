// src/lib/data/leaveOptimizer.spec.ts

import { describe, it, expect } from 'vitest';
import { getAllLeaveSuggestions } from './leaveOptimizer';

describe('Leave Optimizer', () => {
	it('should return leave suggestions', () => {
		const suggestions = getAllLeaveSuggestions();
		expect(suggestions).toBeInstanceOf(Array);
		expect(suggestions.length).toBeGreaterThan(0);
	});

	it('should include natural bridges (free suggestions)', () => {
		const suggestions = getAllLeaveSuggestions();
		const freeSuggestions = suggestions.filter((s) => s.efficiency === Infinity);
		expect(freeSuggestions.length).toBeGreaterThan(0);
	});

	it('should include Thingyan extension with correct metrics', () => {
		const suggestions = getAllLeaveSuggestions();
		const thingyanSuggestion = suggestions.find((s) => s.id === 'thingyan-extension');

		expect(thingyanSuggestion).toBeDefined();
		expect(thingyanSuggestion?.leaveRequired).toBe(5);
		expect(thingyanSuggestion?.totalDaysOff).toBe(16);
		expect(thingyanSuggestion?.efficiency).toBe(3.2);
	});

	it('should filter by max leave days', () => {
		const filtered = getAllLeaveSuggestions({ maxLeaveDays: 3 });
		expect(filtered.every((s) => s.leaveRequired <= 3)).toBe(true);
	});

	it('should filter by min efficiency', () => {
		const filtered = getAllLeaveSuggestions({ minEfficiency: 3 });
		const validSuggestions = filtered.filter((s) => s.efficiency >= 3 || s.efficiency === Infinity);
		expect(validSuggestions.length).toBe(filtered.length);
	});

	it('should sort by efficiency by default', () => {
		const suggestions = getAllLeaveSuggestions();
		// Check that Infinity efficiency suggestions come first
		const firstSuggestion = suggestions[0];
		expect(
			firstSuggestion.efficiency === Infinity ||
				suggestions.every((s) => s.efficiency <= firstSuggestion.efficiency)
		).toBe(true);
	});

	it('should exclude ambitious suggestions when requested', () => {
		const all = getAllLeaveSuggestions();
		const filtered = getAllLeaveSuggestions({ excludeAmbitious: true });

		const ambitiousInAll = all.filter((s) => s.difficulty === 'ambitious');
		const ambitiousInFiltered = filtered.filter((s) => s.difficulty === 'ambitious');

		expect(ambitiousInAll.length).toBeGreaterThan(0); // Should have ambitious suggestions normally
		expect(ambitiousInFiltered.length).toBe(0); // Should exclude them when requested
	});

	it('should mark best value suggestion', () => {
		const suggestions = getAllLeaveSuggestions();
		const bestValue = suggestions.find((s) => s.isBestValue);
		expect(bestValue).toBeDefined();
		expect(bestValue?.id).toBe('thingyan-extension'); // Thingyan should be marked as best value
	});
});
