export const MAX_LIVES = 5;
export const lifeItems = { "life-drop": 1, "life-potion": 3, "life-elixir": 5 };
export const livesOf = (state) => state.lives ?? MAX_LIVES;
export function remainingLives(current, correct, round) {
	return Math.max(
		0,
		Math.min(MAX_LIVES, current - (!correct && round === 1 ? 1 : 0)),
	);
}
export function restoredLives(current, amount) {
	return Math.min(MAX_LIVES, current + Math.max(0, amount));
}
