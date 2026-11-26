"use client";

import { useRouter } from "next/navigation";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { Walkthrough } from "./controls";
import { warmImages } from "./lesson-assets";
import {
	LessonMaterial,
	LessonMaterials,
	type Material,
	materialHref,
} from "./lesson-materials";
import { LessonCompletion } from "./lesson-outcome";
import { LessonStep, LostLesson, RestoredLessonAnswer } from "./lesson-screens";
import type { LessonCursor, LessonScreen, RestoredAnswer } from "./lesson-view";

const itemHref = (base: string, key: string) =>
	`${base}?${new URLSearchParams({ item: key })}`;
let responderWarmed = false;

export function LessonPlayer({
	base,
	pointId,
	title,
	mapHref,
	completionMapHref,
	upcoming,
	exam,
	usesSessions,
	screens,
	materials,
	initialCursor,
	initialInventory,
	initialMaterial,
	initialReading,
	initialFeedback,
	signedIn,
	playable,
	unavailable,
}: {
	base: string;
	pointId: number;
	title: string;
	mapHref: string;
	completionMapHref: string;
	upcoming?: number;
	exam: boolean;
	usesSessions: boolean;
	screens: LessonScreen[];
	materials: Material[];
	initialCursor?: LessonCursor;
	initialInventory: Record<string, number>;
	initialMaterial?: string;
	initialReading?: string;
	initialFeedback?: RestoredAnswer;
	signedIn: boolean;
	playable: boolean;
	unavailable?: ReactNode;
}) {
	const [cursor, setCursor] = useState(initialCursor);
	const [inventory, setInventory] = useState(initialInventory);
	const [materialKey, setMaterial] = useState(initialMaterial);
	const [readKey, setReadKey] = useState(initialReading);
	const [feedback, setFeedback] = useState(initialFeedback);
	const localMaterial = useRef(false);
	const pendingLessonUrl = useRef<string | null>(null);
	const router = useRouter();
	const endpoint = `${base}/responder`;
	useEffect(() => {
		const handlePop = () => {
			if (location.pathname !== base) return;
			const params = new URLSearchParams(location.search);
			setMaterial(params.get("material") ?? undefined);
			if (!params.has("material") && pendingLessonUrl.current) {
				window.history.replaceState(null, "", pendingLessonUrl.current);
				pendingLessonUrl.current = null;
			}
			if (initialCursor?.kind === "finished" || !playable)
				setReadKey(params.get("item") ?? undefined);
		};
		window.addEventListener("popstate", handlePop);
		return () => window.removeEventListener("popstate", handlePop);
	}, [base, initialCursor?.kind, playable]);
	useEffect(() => {
		if (
			process.env.NODE_ENV === "development" &&
			playable &&
			!responderWarmed
		) {
			responderWarmed = true;
			void fetch(endpoint, { method: "OPTIONS" }).then(
				(response) => {
					if (!response.ok) responderWarmed = false;
				},
				() => {
					responderWarmed = false;
				},
			);
		}
		let cancelImages: (() => void) | undefined;
		const prepare = () => {
			cancelImages = warmImages(screens);
			router.prefetch(mapHref);
		};
		if (typeof window.requestIdleCallback === "function") {
			const idle = window.requestIdleCallback(prepare, { timeout: 1000 });
			return () => {
				window.cancelIdleCallback(idle);
				cancelImages?.();
			};
		}
		const idle = globalThis.setTimeout(prepare, 200);
		return () => {
			globalThis.clearTimeout(idle);
			cancelImages?.();
		};
	}, [endpoint, mapHref, playable, router, screens]);

	function rememberLessonUrl(destination: string) {
		if (new URLSearchParams(location.search).has("material")) {
			pendingLessonUrl.current = destination;
			return false;
		}
		window.history.replaceState(null, "", destination);
		return true;
	}
	function switchScreen(destination: string) {
		if (rememberLessonUrl(destination))
			window.scrollTo({ top: 0, behavior: "instant" });
	}
	function advance(next: LessonCursor, destination: string) {
		setFeedback(undefined);
		setReadKey(undefined);
		setCursor(next);
		switchScreen(destination);
	}
	function openMaterial(key: string) {
		if (materialKey)
			window.history.replaceState(null, "", materialHref(base, key));
		else {
			window.history.pushState(null, "", materialHref(base, key));
			localMaterial.current = true;
		}
		setMaterial(key);
		window.scrollTo({ top: 0, behavior: "instant" });
	}
	function returnToLesson() {
		if (localMaterial.current) {
			localMaterial.current = false;
			window.history.back();
		} else {
			setMaterial(undefined);
			const destination =
				pendingLessonUrl.current ?? (readKey ? itemHref(base, readKey) : base);
			pendingLessonUrl.current = null;
			window.history.replaceState(null, "", destination);
			window.scrollTo({ top: 0, behavior: "instant" });
		}
	}
	function browse(key?: string) {
		setReadKey(key);
		switchScreen(key ? itemHref(base, key) : base);
	}

	const material = materials.find(({ key }) => key === materialKey);
	const screen =
		screens.find(
			({ key }) =>
				key ===
				(feedback?.key ??
					readKey ??
					(cursor?.kind === "step" ? cursor.key : undefined)),
		) ?? screens[0];
	const index = screen ? screens.indexOf(screen) : -1;
	const board = screen?.key.split("-", 1)[0];
	const example = screens.find(
		({ key, model }) =>
			key.split("-", 1)[0] === board &&
			"activity" in model &&
			model.activity.kind === "passo-a-passo",
	)?.model;
	const walkthrough =
		example &&
		"activity" in example &&
		example.activity.kind === "passo-a-passo" ? (
			<Walkthrough steps={example.activity.steps} />
		) : undefined;
	let content: ReactNode;
	if (unavailable) content = unavailable;
	else if (feedback && screen && cursor) {
		content = (
			<RestoredLessonAnswer
				{...{ feedback, screen, cursor, base, walkthrough, advance }}
			/>
		);
	} else if (cursor?.kind === "lost") {
		content = <LostLesson {...{ cursor, advance, mapHref, pointId }} />;
	} else if (cursor?.kind === "finished" && !readKey) {
		content = (
			<LessonCompletion
				exam={exam}
				mapHref={completionMapHref}
				onRead={screen ? () => browse(screen.key) : undefined}
				result={cursor}
				title={title}
				upcoming={upcoming}
			/>
		);
	} else if (screen) {
		const editable = playable && cursor?.kind === "step" ? cursor : undefined;
		content = (
			<LessonStep
				{...{
					screen,
					screens,
					index,
					cursor,
					editable,
					usesSessions,
					mapHref,
					pointId,
					endpoint,
					walkthrough,
					inventory,
					advance,
					rememberLessonUrl,
					setInventory,
					browse,
					signedIn,
				}}
				active={!material}
				onUseItem={(next, stock, destination) => {
					setInventory(stock);
					if (destination) advance(next, destination);
					else setCursor(next);
				}}
			/>
		);
	}
	return (
		<>
			<div hidden={Boolean(material)}>
				{content}
				<LessonMaterials
					base={base}
					items={materials}
					onOpen={openMaterial}
					open={cursor?.kind === "finished"}
				/>
			</div>
			{material && (
				<LessonMaterial
					{...{
						material,
						base,
						signedIn,
						pointId,
						setInventory,
						returnToLesson,
						materials,
						openMaterial,
					}}
				/>
			)}
		</>
	);
}
