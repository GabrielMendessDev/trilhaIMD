import type { ReactNode } from "react";
import styles from "./route-loading.module.css";

function RainIcon({ children }: { children: ReactNode }) {
	return (
		<svg
			aria-hidden="true"
			fill="none"
			stroke="currentColor"
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth="3"
			viewBox="0 0 40 40"
		>
			{children}
		</svg>
	);
}

const symbols = {
	quadratic: <code>f(x)=x²</code>,
	power: <code>2⁵=32</code>,
	ohm: <code>V=R×I</code>,
	binary: <code>1010₂</code>,
	sine: <code>y=sin(x)</code>,
	root: <code>√81=9</code>,
	graph: (
		<RainIcon>
			<path d="M6 6v27h28M10 13c3 10 6 14 10 14s8-4 13-16" />
			<circle cx="10" cy="13" fill="var(--solar)" r="3" stroke="none" />
			<circle cx="20" cy="27" fill="var(--orbit)" r="3" stroke="none" />
			<circle cx="33" cy="11" fill="var(--mint)" r="3" stroke="none" />
		</RainIcon>
	),
	chip: (
		<RainIcon>
			<rect height="20" rx="6" width="20" x="10" y="10" />
			<path d="M15 5v5m10-5v5m-10 20v5m10-5v5M5 15h5m20 0h5M5 25h5m20 0h5" />
			<rect
				fill="var(--orbit)"
				height="10"
				rx="3"
				stroke="none"
				width="10"
				x="15"
				y="15"
			/>
			<circle cx="20" cy="20" fill="var(--mint)" r="2.5" stroke="none" />
		</RainIcon>
	),
	circuit: (
		<RainIcon>
			<path d="M6 11h8c5 0 6 9 11 9h8M6 29h8c5 0 6-9 11-9" />
			<circle cx="6" cy="11" fill="var(--solar)" r="4" stroke="none" />
			<circle cx="33" cy="20" fill="var(--mint)" r="4" stroke="none" />
			<circle cx="6" cy="29" fill="var(--orbit)" r="4" stroke="none" />
		</RainIcon>
	),
	terminal: (
		<RainIcon>
			<rect height="25" rx="6" width="32" x="4" y="7" />
			<path d="m11 14 6 5-6 5m11 0h6" />
			<circle cx="28" cy="24" fill="var(--mint)" r="2.5" stroke="none" />
			<circle cx="11" cy="14" fill="var(--solar)" r="2.5" stroke="none" />
		</RainIcon>
	),
	resistor: (
		<RainIcon>
			<path d="M6 20h6m16 0h6" />
			<rect
				fill="var(--orbit)"
				height="12"
				rx="5"
				stroke="none"
				width="18"
				x="11"
				y="14"
			/>
			<path d="M17 16v8m6-8v8" stroke="var(--solar)" strokeWidth="2" />
			<circle cx="6" cy="20" fill="var(--mint)" r="3.5" stroke="none" />
			<circle cx="34" cy="20" fill="var(--solar)" r="3.5" stroke="none" />
		</RainIcon>
	),
};

const lanes = [
	["quadratic", "chip", "power"],
	["terminal", "ohm", "circuit"],
	["graph", "binary", "resistor"],
	["root", "circuit", "sine"],
	["chip", "sine", "quadratic"],
	["power", "terminal", "ohm"],
	["binary", "graph", "root"],
	["resistor", "quadratic", "chip"],
] as const;

export function RouteLoadingRain() {
	return (
		<div aria-hidden="true" className={styles.rain}>
			{lanes.map((lane) => (
				<div className={styles.rainLane} key={lane[0]}>
					<div className={styles.rainTrack}>
						{["first", "repeat"].map((sequence) => (
							<div className={styles.rainSequence} key={sequence}>
								{lane.map((symbol) => (
									<span className={styles.rainSymbol} key={symbol}>
										{symbols[symbol]}
									</span>
								))}
							</div>
						))}
					</div>
				</div>
			))}
		</div>
	);
}
