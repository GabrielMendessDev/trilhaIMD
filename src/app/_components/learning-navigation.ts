// Navigation proceeds immediately; CSS reveals the committed lesson content.
// Async router work must not wait for a browser snapshot's update promise.
import { motionTiming } from "./motion";

let exit: Animation | undefined;
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

export function commitLearningNavigation() {
	exit?.cancel();
	exit = undefined;
}

export function navigateLearning(
	update: () => void,
	direction = "forward",
	snapshots = true,
) {
	for (const animation of arrivals) animation.cancel();
	arrivals = [];
	commitLearningNavigation();
	document.documentElement.dataset.learningDirection = direction;
	if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
		update();
		return;
	}
	{
		const step = document.querySelector(
			".lesson-transition, .completion-effects, #conteudo-principal, main",
		);
		exit = step?.animate(
			[
				{ opacity: 1, transform: "translateX(0)" },
				{
					opacity: snapshots ? 0 : 0.65,
					transform: `translateX(${direction === "back" ? "" : "-"}16px)`,
				},
			],
			{ ...motionTiming(step, "micro", "exit"), fill: "forwards" },
		);
		update();
	}
}
