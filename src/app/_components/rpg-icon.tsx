import { type CSSProperties, useId } from "react";

const paths: Record<string, string> = {
	heart: "M16 28 4 16C-2 8 9 1 16 9c7-8 18-1 12 7Z",
	"life-drop":
		"M16 3c-3 5-10 12-10 17a10 10 0 0 0 20 0C26 15 19 8 16 3Zm-4 18h8m-4-4v8",
	"life-potion":
		"M12 2h8v9l7 12a5 5 0 0 1-4 7H9a5 5 0 0 1-4-7l7-12Zm-1 16h10m-5 2v7m-4-3h8",
	"life-elixir":
		"M10 3h12m-10 0v8L5 22a5 5 0 0 0 4 8h14a5 5 0 0 0 4-8l-7-11V3M8 19h16m-8 2v7m-4-3h8",
	bits: "m16 2 10 10-10 18L6 12Zm-10 10h20M16 2l-4 10 4 18 4-18Z",
	bag: "M10 9V6a6 6 0 0 1 12 0v3M7 9h18l2 20H5Zm3 9h12v7H10Zm3-9v4m6-4v4",
	"streak-shield":
		"M16 2 28 7v8c0 7-12 15-12 15S4 22 4 15V7Zm0 6c-1 5-6 6-6 11a6 6 0 0 0 12 0c0-3-2-4-3-5 0 3-2 4-3 4-2-2 1-6 0-10Z",
	"question-pass":
		"M3 8h26v6a3 3 0 0 0 0 6v6H3v-6a3 3 0 0 0 0-6Zm9 3 7 6-7 6m10-12v12",
	"hint-scroll":
		"M8 25V5h17v20H8a3 3 0 0 0 0 6h17M8 5a3 3 0 0 0-6 0v5h6m5 0h7m-7 5h5m-5 5h7",
	"answer-lens": "M22 14a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-2 7 9 9M9 14h8m-4-4v8",
	"example-scroll":
		"M16 7c-4-4-9-4-13-2v22c4-2 9-2 13 2 4-4 9-4 13-2V5c-4-2-9-2-13 2Zm0 0v22M7 11h5m-5 5h5m8-5h5m-5 5h5",
	"challenge-swap": "M5 10h21l-6-6m6 6-6 6M27 23H6l6-6m-6 6 6 6",
	"tactical-delay": "M16 3a13 13 0 1 0 13 13A13 13 0 0 0 16 3Zm-4 7v12m8-12v12",
	"arcane-frame":
		"M8 3h16l5 5v16l-5 5H8l-5-5V8Zm2 5h12l2 2v12l-2 2H10l-2-2V10Zm6 3v10m-5-5h10",
	"stellar-path":
		"M3 28h7V18h12V7h7M7 25l3 3-3 3M19 15l3 3-3 3M23 3l2 4 4 1-4 2-2 4-2-4-4-2 4-1Z",
	"bito-companion":
		"M8 10V5m16 5V5M5 10h22v16H5Zm5 5v5m12-5v5m-9 4h6M2 14v8m28-8v8M13 29h6",
	ofensiva:
		"M17 2c1 7-9 10-9 18a8 8 0 0 0 16 0c0-5-3-7-4-9 0 5-3 7-5 7-3-4 3-8 2-16Z",
	sequencia: "M18 2 6 18h9l-1 12 12-18h-9Z",
	acertos:
		"M16 3a13 13 0 1 0 0 26 13 13 0 0 0 0-26Zm0 6a7 7 0 1 0 0 14 7 7 0 0 0 0-14Zm-3 7 3 3 9-12",
	licoes: "M8 3h16v25H8Zm4 6h8m-8 5h8m-8 5h5M4 7v24h17",
	perfeicao: "m16 2 4 8 9 2-7 7 2 10-8-5-8 5 2-10-7-7 9-2Z",
	revisao: "M6 12a12 12 0 1 1-1 10M6 3v9h9m-4 6 4 4 8-9",
	exploracao: "M16 2 29 9v14l-13 7-13-7V9Zm0 0v28M3 9l13 7 13-7M10 5l13 7v7",
};
export function RpgIcon({
	name,
	className,
	style,
}: {
	name: string;
	className?: string;
	style?: CSSProperties;
}) {
	return (
		<svg
			aria-hidden="true"
			className={className}
			fill="none"
			stroke="currentColor"
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth="1.65"
			style={style}
			viewBox="0 0 32 32"
		>
			<path d={paths[name] ?? paths.bits} />
		</svg>
	);
}
export function RpgMedal({
	category,
	goal,
	symbol,
}: {
	category: string;
	goal: number;
	symbol: string;
}) {
	const metal = useId();
	const tier = Number(symbol.split("-").at(-1)) || 0;
	return (
		<span className="rpg-medal" data-tier={tier}>
			<svg aria-hidden="true" viewBox="0 0 100 108">
				<defs>
					<linearGradient id={metal} x1="0" x2="1" y1="0" y2="1">
						<stop offset="0" stopColor="currentColor" stopOpacity=".5" />
						<stop offset=".5" stopColor="var(--surface)" />
						<stop offset="1" stopColor="currentColor" stopOpacity=".2" />
					</linearGradient>
				</defs>
				<path
					className="rpg-ribbon"
					d="m26 59-8 42 21-10 11 13 11-13 21 10-8-42Z"
				/>
				<path
					className="rpg-medal-body"
					d="m50 4 15 7 17 2 5 17 9 14-6 17-2 17-18 6-20 10-20-10-18-6-2-17-6-17 9-14 5-17 17-2Z"
					style={{ fill: `url(#${metal})` }}
				/>
				<circle
					cx="50"
					cy="47"
					fill="none"
					r="29"
					stroke="currentColor"
					strokeWidth="1"
				/>
				{Array.from({ length: tier + 1 }, (_, i) => (
					<circle
						cx={36 + (i * 28) / Math.max(1, tier)}
						cy="82"
						fill="currentColor"
						// biome-ignore lint/suspicious/noArrayIndexKey: Fixed decorative positions have no state or ordering changes.
						key={`${symbol}-${i}`}
						r="2"
					/>
				))}
			</svg>
			<RpgIcon name={category} />
			<small>{goal}</small>
		</span>
	);
}
