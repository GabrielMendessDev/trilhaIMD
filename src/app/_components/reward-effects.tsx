"use client";

import {
	type ReactNode,
	useEffect,
	useLayoutEffect,
	useRef,
	useState,
} from "react";
import { useFeedback } from "./feedback";
import { consumeFeedbackEvent } from "./feedback-events";
import { Icon } from "./icon";

export function XpBalance({
	value,
	account,
	className,
	children,
	metric = "xp",
}: {
	value: number;
	account: string;
	className?: string;
	children: ReactNode;
	metric?: "xp" | "streak";
}) {
	const { observeBalance } = useFeedback();
	const [pulse, setPulse] = useState(false);
	useEffect(() => {
		if (observeBalance(`${account}:${metric}`, value)) setPulse(true);
		const timeout = window.setTimeout(() => setPulse(false), 650);
		return () => window.clearTimeout(timeout);
	}, [value, account, metric, observeBalance]);
	return (
		<span
			className={`${className ?? ""} ${metric === "streak" ? "streak-balance" : "reward-balance"}`}
			data-reward={pulse || undefined}
		>
			{children}
		</span>
	);
}

export function RewardValue({ value }: { value: number }) {
	return (
		<>
			<span className="sr-only">{value} XP</span>
			<span aria-hidden="true" data-reward-count={value}>
				+{value}
			</span>
		</>
	);
}

export function CompletionEffects({
	eventId,
	reward,
	unlocked,
	awards,
	children,
}: {
	eventId: string;
	reward: number;
	unlocked?: number;
	awards: readonly { id: string; name: string }[];
	children: ReactNode;
}) {
	const root = useRef<HTMLDivElement>(null);
	const { finishNavigation } = useFeedback();
	useLayoutEffect(() => {
		finishNavigation();
		const heading = root.current?.querySelector<HTMLElement>("h2");
		if (heading) {
			heading.tabIndex = -1;
			heading.focus({ preventScroll: true });
		}
		const counters =
			root.current?.querySelectorAll<HTMLElement>("[data-reward-count]") ?? [];
		let frame = 0;
		const scheduled = window.setTimeout(() => {
			if (!consumeFeedbackEvent(() => window.localStorage, eventId)) return;
			root.current?.setAttribute("data-celebrate", "true");
			if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
			const start = performance.now();
			const animate = (time: number) => {
				const progress = Math.min(1, (time - start) / 600);
				for (const counter of counters)
					counter.textContent = `+${Math.round(Number(counter.dataset.rewardCount) * (1 - (1 - progress) ** 3))}`;
				if (progress < 1) frame = requestAnimationFrame(animate);
			};
			frame = requestAnimationFrame(animate);
		}, 0);
		return () => {
			window.clearTimeout(scheduled);
			cancelAnimationFrame(frame);
			for (const counter of counters)
				counter.textContent = `+${counter.dataset.rewardCount}`;
		};
	}, [eventId, finishNavigation]);
	return (
		<div
			className="completion-effects"
			data-confirmed-reward={reward}
			ref={root}
		>
			{children}
			{unlocked && (
				<p className="completion-next">
					Etapa {unlocked} disponível na trilha.
				</p>
			)}
			{awards.length > 0 && (
				<section aria-label="Conquistas desta etapa" className="earned-awards">
					<h3>Conquistas desbloqueadas</h3>
					<ul>
						{awards.map((award) => (
							<li key={award.id}>
								<Icon name="trophy" />
								{award.name}
							</li>
						))}
					</ul>
				</section>
			)}
		</div>
	);
}

export function UnlockEffect({
	eventId,
	stage,
}: {
	eventId: string;
	stage: number;
}) {
	useEffect(() => {
		if (!consumeFeedbackEvent(() => window.localStorage, `${eventId}:map`))
			return;
		const node = document.getElementById(`etapa-${stage}`);
		if (node?.querySelector("button")?.getAttribute("data-state") !== "current")
			return;
		node?.setAttribute("data-unlocked", "true");
		document
			.getElementById(`etapa-${stage - 1}`)
			?.setAttribute("data-just-completed", "true");
		document
			.querySelector(`[data-trail-segment="${stage - 1}"]`)
			?.setAttribute("data-energize", "true");
	}, [eventId, stage]);
	return null;
}
