import { readTabValue, writeTabValue } from "~/app/_components/tab-storage";
import type { LessonScreen } from "./lesson-view";

const storageKey = "trilbit:warmed-lesson-assets:v1";
const freshnessMs = 15 * 60_000;
const pending = new Set<string>();
let recent: Map<string, number> | undefined;

function recentlyLoaded() {
	if (recent) return recent;
	const saved = readTabValue(storageKey);
	recent = new Map();
	if (Array.isArray(saved)) {
		for (const entry of saved.slice(-128)) {
			if (
				Array.isArray(entry) &&
				typeof entry[0] === "string" &&
				typeof entry[1] === "number" &&
				Date.now() - entry[1] < freshnessMs
			)
				recent.set(entry[0], entry[1]);
		}
	}
	return recent;
}
export function warmImages(screens: LessonScreen[]) {
	const assets = new Set<string>();
	for (const { model } of screens) {
		const blocks = [
			...("content" in model ? model.content.blocks : []),
			...("activity" in model && model.activity.kind === "passo-a-passo"
				? model.activity.steps.flatMap((step) => step.blocks)
				: []),
		];
		for (const block of blocks) {
			if (block.type === "image" && /^\/(?!\/)/.test(block.src))
				assets.add(block.src);
		}
	}
	for (const mood of ["acenando", "feliz", "duvida", "triste"])
		assets.add(`/brand/bito-${mood}.svg`);
	assets.add("/brand/bito.webp");
	const loaded = recentlyLoaded();
	const now = Date.now();
	const queue = [...assets]
		.filter(
			(url) => !pending.has(url) && now - (loaded.get(url) ?? 0) >= freshnessMs,
		)
		.values();
	let cancelled = false;
	function next() {
		let { value } = queue.next();
		while (
			value !== undefined &&
			(pending.has(value) ||
				Date.now() - (loaded.get(value) ?? 0) < freshnessMs)
		)
			({ value } = queue.next());
		if (cancelled || value === undefined) return;
		const url = value;
		pending.add(url);
		const image = new window.Image();
		image.fetchPriority = "low";
		image.onload = () => {
			pending.delete(url);
			loaded.delete(url);
			loaded.set(url, Date.now());
			if (loaded.size > 128) {
				const oldest = loaded.keys().next();
				if (!oldest.done) loaded.delete(oldest.value);
			}
			writeTabValue(storageKey, [...loaded]);
			next();
		};
		image.onerror = () => {
			pending.delete(url);
			next();
		};
		image.src = url;
	}
	for (let slot = 0; slot < 3; slot++) next();
	return () => {
		cancelled = true;
	};
}
