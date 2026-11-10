"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";
import { useFeedback } from "./feedback";
import { consumeFeedbackEvent } from "./feedback-events";
import { Icon } from "./icon";

export function XpBalance({
	value,
	account,
	className,
	children,
}: {
	value: number;
	account: string;
	className?: string;
	children: ReactNode;
}) {
	const { observeBalance } = useFeedback();
	const [pulse, setPulse] = useState(false);
	useEffect(() => {
		if (observeBalance(account, value)) setPulse(true);
		const timeout = window.setTimeout(() => setPulse(false), 650);
		return () => window.clearTimeout(timeout);
	}, [value, account, observeBalance]);
	return (
		<span
			className={`${className ?? ""} reward-balance`}
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
	const { notify } = useFeedback();
	useEffect(() => {
		const counters =
			root.current?.querySelectorAll<HTMLElement>("[data-reward-count]") ?? [];
		let frame = 0;
		const scheduled = window.setTimeout(() => {
			if (!consumeFeedbackEvent(() => window.localStorage, eventId)) return;
			root.current?.setAttribute("data-celebrate", "true");
			const outcome =
				reward > 0
					? `Etapa concluída! +${reward} XP registrados.`
					: "Etapa concluída! Seu progresso foi registrado.";
			const next = unlocked ? ` A etapa ${unlocked} está disponível.` : "";
			const medals = awards.length
				? ` Conquista desbloqueada. ${awards.map(({ name }) => name).join(" e ")}.`
				: "";
			notify({
				id: "completion",
				kind: "success",
				message: `${outcome}${next}${medals}`,
				duration: awards.length ? 7500 : 4500,
			});
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
	}, [eventId, reward, unlocked, awards, notify]);
	return (
		<div className="completion-effects" ref={root}>
			{children}
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
	const { notify } = useFeedback();
	useEffect(() => {
		if (!consumeFeedbackEvent(() => window.localStorage, `${eventId}:map`))
			return;
		const node = document.getElementById(`etapa-${stage}`);
		node?.setAttribute("data-unlocked", "true");
		notify({
			id: "unlock",
			kind: "success",
			message: `Nova lição desbloqueada! Etapa ${stage} disponível.`,
		});
	}, [eventId, stage, notify]);
	return null;
}
