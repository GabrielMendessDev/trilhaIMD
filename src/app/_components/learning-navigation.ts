// Navigation proceeds immediately; CSS reveals the committed lesson content.
// Async router work must not wait for a browser snapshot's update promise.
import { motionTiming } from "./motion";

const revealed = new WeakMap<Element, string>();
let arrivals: Animation[] = [];

export function revealPageContent(main: Element) {
	const location = `${window.location.pathname}${window.location.search}`;
	if (
		revealed.get(main) === location ||
		window.matchMedia("(prefers-reduced-motion: reduce)").matches
	)
		return;
	revealed.set(main, location);
	for (const animation of arrivals) animation.cancel();
	const stagger = motionTiming(main, "stagger").duration;
	const container =
		main.children.length === 1 ? (main.firstElementChild ?? main) : main;
	const elements = Array.from(container.children).filter(
		(element) => element.getClientRects().length > 0,
	);
	const current = elements.map((element, index) => {
		const animation = element.animate(
			[
				{ opacity: 0.2, transform: "translateY(8px)" },
				{ opacity: 1, transform: "translateY(0)" },
			],
			{
				...motionTiming(element, "enter", "enter"),
				delay: Math.min(index, 3) * stagger,
				fill: "backwards",
			},
		);
		animation.id = "route-arrival";
		return animation;
	});
	arrivals = current;
	return () => {
		for (const animation of current) animation.cancel();
		if (arrivals === current) {
			arrivals = [];
			revealed.delete(main);
		}
	};
}

export function hasNativeNavigation() {
	return false;
}

export function navigateLearning(update: () => void, direction = "forward") {
	for (const animation of arrivals) animation.cancel();
	arrivals = [];
	document.documentElement.dataset.learningDirection = direction;
	update();
}
