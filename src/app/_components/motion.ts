export function motionTiming(
	element: Element,
	duration: string,
	easing = "settle",
) {
	const tokens = getComputedStyle(element);
	const rawDuration = tokens.getPropertyValue(`--motion-${duration}`).trim();
	// CSS compilers may serialize 340ms as .34s; WAAPI always takes milliseconds.
	const milliseconds =
		Number.parseFloat(rawDuration) * (rawDuration.endsWith("ms") ? 1 : 1000);
	return {
		duration: milliseconds,
		easing: tokens.getPropertyValue(`--ease-${easing}`).trim(),
	};
}
