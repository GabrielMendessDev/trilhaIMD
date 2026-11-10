import type { FeedbackKind } from "./feedback";

export function FeedbackIcon({ kind }: { kind: FeedbackKind }) {
	return (
		<svg
			aria-hidden="true"
			className={`feedback-icon ${kind === "loading" ? "feedback-spinner" : ""}`}
			fill="none"
			stroke="currentColor"
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth="2"
			viewBox="0 0 24 24"
		>
			{kind === "success" && <path d="m5 12 4.2 4.2L19 6.5" />}
			{kind === "error" && <path d="m7 7 10 10M17 7 7 17" />}
			{kind === "info" && (
				<>
					<circle cx="12" cy="12" r="9" />
					<path d="M12 11v6m0-10v.1" />
				</>
			)}
			{kind === "warning" && (
				<>
					<path d="m12 3 10 18H2Z" />
					<path d="M12 9v5m0 3v.1" />
				</>
			)}
			{kind === "loading" && (
				<>
					<circle cx="12" cy="12" opacity=".25" r="9" />
					<path d="M12 3a9 9 0 0 1 9 9" />
				</>
			)}
		</svg>
	);
}
