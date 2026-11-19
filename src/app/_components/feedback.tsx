"use client";

import { usePathname, useSearchParams } from "next/navigation";
import {
	createContext,
	type ReactNode,
	Suspense,
	useCallback,
	useContext,
	useEffect,
	useLayoutEffect,
	useRef,
	useState,
} from "react";
import { FeedbackIcon } from "./feedback-icon";
import { hasNativeNavigation, revealPageContent } from "./learning-navigation";
import { RouteLoading } from "./route-loading";

export type FeedbackKind = "success" | "error" | "info" | "warning" | "loading";
type Notice = {
	id: string;
	kind: FeedbackKind;
	message: string;
	duration?: number;
};
type Navigation = { target: string; from: string };
type FeedbackContext = {
	notices: Notice[];
	navigation: Navigation | null;
	notify: (notice: Notice) => void;
	dismiss: (id: string) => void;
	startNavigation: (target: string) => boolean;
	finishNavigation: () => void;
	observeBalance: (account: string, value: number) => boolean;
};
const Context = createContext<FeedbackContext | null>(null);
export function useFeedback() {
	const feedback = useContext(Context);
	if (!feedback) throw new Error("FeedbackProvider ausente.");
	return feedback;
}

function NavigationObserver() {
	const pathname = usePathname();
	const search = useSearchParams();
	const { finishNavigation, navigation } = useFeedback();
	const location = `${pathname}${search.size ? `?${search}` : ""}`;
	useLayoutEffect(() => {
		if (navigation && location !== navigation.from) {
			const complete = () => {
				const main = document.querySelector<HTMLElement>(
					"#conteudo-principal, main",
				);
				if (!main) return false;
				const native = hasNativeNavigation();
				finishNavigation();
				if (!native) revealPageContent(main);
				main.focus({ preventScroll: true });
				return true;
			};
			if (complete()) return;
			const observer = new MutationObserver(() => {
				if (complete()) observer.disconnect();
			});
			observer.observe(document.body, { childList: true, subtree: true });
			return () => {
				observer.disconnect();
			};
		}
	}, [location, navigation, finishNavigation]);
	return null;
}

export function FeedbackProvider({ children }: { children: ReactNode }) {
	const [notices, setNotices] = useState<Notice[]>([]);
	const [navigation, setNavigation] = useState<Navigation | null>(null);
	const navigating = useRef<Navigation | null>(null);
	const balance = useRef(new Map<string, number>());
	const dismiss = useCallback(
		(id: string) =>
			setNotices((current) => current.filter((item) => item.id !== id)),
		[],
	);
	const notify = useCallback((notice: Notice) => {
		setNotices((current) =>
			[...current.filter((item) => item.id !== notice.id), notice].slice(-3),
		);
	}, []);
	const finishNavigation = useCallback(() => {
		navigating.current = null;
		setNavigation(null);
		setNotices((current) =>
			current.filter((notice) => notice.id !== "navigation"),
		);
	}, []);
	const startNavigation = useCallback((target: string) => {
		const url = new URL(target, window.location.href);
		if (url.origin !== window.location.origin) return true;
		const destination = `${url.pathname}${url.search}`;
		const from = `${window.location.pathname}${window.location.search}`;
		if (destination === from) return true;
		if (navigating.current?.target === destination) return false;
		const next = { target: destination, from };
		navigating.current = next;
		setNavigation(next);
		return true;
	}, []);
	const observeBalance = useCallback((account: string, value: number) => {
		const previous = balance.current.get(account);
		balance.current.set(account, value);
		return previous !== undefined && value > previous;
	}, []);
	useEffect(() => {
		if (!navigation) return;
		const timeout = window.setTimeout(() => {
			finishNavigation();
			notify({
				id: "navigation",
				kind: "warning",
				message:
					"Esta página está demorando para abrir. Você pode tentar o acesso novamente.",
				duration: 0,
			});
		}, 15000);
		return () => window.clearTimeout(timeout);
	}, [navigation, finishNavigation, notify]);
	useEffect(() => {
		const offline = () => {
			finishNavigation();
			notify({
				id: "connection",
				kind: "error",
				message:
					"A conexão caiu. Suas respostas já registradas estão salvas. Tente novamente quando a rede voltar.",
				duration: 0,
			});
		};
		const online = () => {
			dismiss("connection");
			notify({
				id: "connection",
				kind: "success",
				message: "Conexão restabelecida. Você pode continuar.",
			});
		};
		window.addEventListener("offline", offline);
		window.addEventListener("online", online);
		return () => {
			window.removeEventListener("offline", offline);
			window.removeEventListener("online", online);
		};
	}, [dismiss, finishNavigation, notify]);
	return (
		<Context.Provider
			value={{
				notices,
				navigation,
				notify,
				dismiss,
				startNavigation,
				finishNavigation,
				observeBalance,
			}}
		>
			<Suspense fallback={null}>
				<NavigationObserver />
			</Suspense>
			{children}
			{navigation && <RouteLoading target={navigation.target} />}
		</Context.Provider>
	);
}

function Toast({ notice }: { notice: Notice }) {
	const { dismiss } = useFeedback();
	useEffect(() => {
		const duration = notice.duration ?? (notice.kind === "error" ? 0 : 4500);
		if (!duration) return;
		const timeout = window.setTimeout(() => dismiss(notice.id), duration);
		return () => window.clearTimeout(timeout);
	}, [notice, dismiss]);
	return (
		<div className="feedback-toast" data-kind={notice.kind}>
			<FeedbackIcon kind={notice.kind} />
			<p>{notice.message}</p>
			<button
				aria-label="Fechar notificação"
				onClick={() => dismiss(notice.id)}
				type="button"
			>
				<FeedbackIcon kind="error" />
			</button>
		</div>
	);
}

export function FeedbackViewport() {
	const { notices } = useFeedback();
	if (!notices.length) return null;
	return (
		<aside aria-label="Avisos do Trilbit" className="feedback-viewport">
			<div aria-atomic="false" aria-live="polite">
				{notices
					.filter(({ kind }) => kind !== "error")
					.map((notice) => (
						<Toast key={notice.id} notice={notice} />
					))}
			</div>
			<div aria-atomic="false" aria-live="assertive">
				{notices
					.filter(({ kind }) => kind === "error")
					.map((notice) => (
						<Toast key={notice.id} notice={notice} />
					))}
			</div>
		</aside>
	);
}
