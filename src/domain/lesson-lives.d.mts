export const MAX_LIVES: 5;
export const lifeItems: Readonly<Record<string, number>>;
export function livesOf(state: { lives?: number }): number;
export function remainingLives(
	current: number,
	correct: boolean,
	round: 1 | 2,
): number;
export function restoredLives(current: number, amount: number): number;
