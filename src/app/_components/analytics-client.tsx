"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import {
	analyticsPreference,
	devices,
	type Screen,
	screens,
	sessionIdleMs,
	viewports,
} from "~/domain/analytics";

const storageKey = "trilbit-usage-session";
const activeWindow = 60_000;
const preferenceEvent = "trilbit-analytics-preference";
type BrowserSession = {
	id: string;
	sequence: number;
	activeMs: number;
	interaction: number;
};
let session: BrowserSession | undefined;
let activeSince = 0;

function enabled() {
	return (
		!(navigator as Navigator & { globalPrivacyControl?: boolean })
			.globalPrivacyControl &&
		!document.cookie
			.split(";")
			.some((part) => part.trim() === `${analyticsPreference}=off`)
	);
}

function transmit(event: object) {
	const body = JSON.stringify(event);
	if (navigator.sendBeacon?.("/api/analytics", body)) return;
	void fetch("/api/analytics", { method: "POST", body, keepalive: true }).catch(
		() => undefined,
	);
}

function loadSession() {
	try {
		const raw = sessionStorage.getItem(storageKey);
		return raw ? (JSON.parse(raw) as BrowserSession) : undefined;
	} catch {
		return undefined;
	}
}

export function changeAnalyticsPreference(allow: boolean) {
	// biome-ignore lint/suspicious/noDocumentCookie: A preferência precisa funcionar também em navegadores sem Cookie Store.
	document.cookie = `${analyticsPreference}=${allow ? "on" : "off"}; Path=/; Max-Age=31536000; SameSite=Lax${location.protocol === "https:" ? "; Secure" : ""}`;
	if (!allow) {
		const current = session ?? loadSession();
		if (current) transmit({ type: "forget", id: current.id });
		try {
			sessionStorage.removeItem(storageKey);
		} catch {}
		session = undefined;
		activeSince = 0;
	}
	window.dispatchEvent(new Event(preferenceEvent));
}

export function activeStudyTime() {
	if (
		!session ||
		!enabled() ||
		Date.now() - session.interaction >= sessionIdleMs
	)
		return undefined;
	const current = activeSince
		? Math.max(
				0,
				Math.min(Date.now(), session.interaction + activeWindow) - activeSince,
			)
		: 0;
	return Math.min(86_400_000, session.activeMs + current);
}

function classifyScreen(path: string): Screen | undefined {
	if (/^\/aprender\/[^/]+\/\d+\/?$/.test(path)) {
		if (document.querySelector("[data-result-panel]:not([hidden] *)"))
			return "/aprender/resultado";
		const phase = document.querySelector<HTMLElement>(
			"[data-step-kind]:not([hidden] *)",
		)?.dataset.stepKind;
		if (phase === "question") return "/aprender/questao";
		if (phase === "review") return "/aprender/revisao";
		if (phase === "explanation") return "/aprender/material";
		return "/aprender/etapa";
	}
	if (/^\/disciplinas\/[^/]+\/?$/.test(path)) return "/disciplinas/trilha";
	return Object.hasOwn(screens, path) ? (path as Screen) : undefined;
}

function deviceCategory() {
	const agent = navigator.userAgent;
	if (
		/iPad|Tablet/i.test(agent) ||
		(/Android/i.test(agent) && !/Mobile/i.test(agent)) ||
		(/Macintosh/i.test(agent) && navigator.maxTouchPoints > 1)
	)
		return devices[1];
	if (/Mobi|iPhone|Android/i.test(agent)) return devices[0];
	return /Windows|Linux|Macintosh|CrOS/i.test(agent) ? devices[2] : devices[3];
}

export function AnalyticsClient() {
	const pathname = usePathname();
	useEffect(() => {
		const initial = classifyScreen(pathname);
		if (!initial) return;
		let lastScreen: Screen | undefined;
		let timer: number | undefined;

		function update(send: boolean, interaction = false) {
			if (!enabled()) return;
			const now = Date.now();
			const screen = classifyScreen(pathname);
			if (!screen) return;
			session ??= loadSession();
			if (!session || now - session.interaction >= sessionIdleMs) {
				if (!interaction || document.hidden || !globalThis.crypto?.randomUUID)
					return;
				session = {
					id: crypto.randomUUID(),
					sequence: 0,
					activeMs: 0,
					interaction: now,
				};
				activeSince = 0;
				lastScreen = undefined;
			}
			const previousActiveMs = session.activeMs;
			session.activeMs = activeStudyTime() ?? session.activeMs;
			if (interaction && !document.hidden) session.interaction = now;
			activeSince = document.hidden ? 0 : now;
			if (
				send &&
				(screen !== lastScreen ||
					interaction ||
					session.activeMs > previousActiveMs)
			) {
				lastScreen = screen;
				session.sequence += 1;
				const viewport =
					viewports[
						[480, 768, 1024, 1440].filter((width) => window.innerWidth >= width)
							.length
					];
				transmit({
					...session,
					interaction: undefined,
					type: "session",
					screen,
					device: deviceCategory(),
					viewport,
				});
			}
			try {
				sessionStorage.setItem(storageKey, JSON.stringify(session));
			} catch {}
		}

		const interact = () => {
			const elapsed = session ? Date.now() - session.interaction : Infinity;
			if (elapsed >= 1000) update(elapsed > activeWindow, true);
		};
		const preferred = () => update(true, true);
		const visibility = () => update(true, !document.hidden);
		const pagehide = () => {
			update(true);
			activeSince = 0;
		};
		const seen = new WeakSet<HTMLDetailsElement>();
		const consult = (event: Event) => {
			const details = event.target;
			if (
				!(details instanceof HTMLDetailsElement) ||
				!details.open ||
				seen.has(details) ||
				!enabled()
			)
				return;
			const label = details.classList.contains("lesson-contextual-reading")
				? "Relembrar o conceito"
				: details.classList.contains("answer-example")
					? "Exemplo resolvido"
					: undefined;
			if (!label) return;
			seen.add(details);
			transmit({ type: "support", label });
		};

		update(true, true);
		const interval = window.setInterval(() => update(!document.hidden), 15_000);
		const observer = pathname.startsWith("/aprender/")
			? new MutationObserver(() => {
					if (
						!document.hidden &&
						classifyScreen(pathname) !== lastScreen &&
						timer === undefined
					) {
						timer = window.setTimeout(() => {
							timer = undefined;
							update(true, true);
						}, 80);
					}
				})
			: undefined;
		observer?.observe(document.body, {
			subtree: true,
			childList: true,
			attributes: true,
			attributeFilter: ["data-step-kind", "data-result-panel", "hidden"],
		});
		window.addEventListener("pointerdown", interact, { passive: true });
		window.addEventListener("keydown", interact);
		window.addEventListener("scroll", interact, { passive: true });
		window.addEventListener("pagehide", pagehide);
		window.addEventListener(preferenceEvent, preferred);
		document.addEventListener("visibilitychange", visibility);
		document.addEventListener("toggle", consult, true);
		return () => {
			observer?.disconnect();
			window.clearTimeout(timer);
			window.clearInterval(interval);
			window.removeEventListener("pointerdown", interact);
			window.removeEventListener("keydown", interact);
			window.removeEventListener("scroll", interact);
			window.removeEventListener("pagehide", pagehide);
			window.removeEventListener(preferenceEvent, preferred);
			document.removeEventListener("visibilitychange", visibility);
			document.removeEventListener("toggle", consult, true);
			if (session) session.activeMs = activeStudyTime() ?? session.activeMs;
			activeSince = 0;
		};
	}, [pathname]);
	return null;
}
