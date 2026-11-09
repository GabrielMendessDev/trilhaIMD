import type { ReactNode } from "react";
import styles from "./trail.module.css";
import type { TrailId } from "./trails";

const drawings: Record<TrailId, ReactNode> = {
	elementar: (
		<>
			<path d="M18 64h184m-8-7 8 7-8 7M32 57v14m38-14v14m38-14v14m38-14v14m38-14v14" />
			<path d="M70 48v-8h76v8m-6-12 6 4-6 4" />
			<circle cx="70" cy="64" fill="currentColor" r="4" />
			<circle cx="146" cy="64" fill="currentColor" r="4" />
			<text x="108" y="28">
				+2
			</text>
			<text x="32" y="91">
				−2
			</text>
			<text x="70" y="91">
				−1
			</text>
			<text x="108" y="91">
				0
			</text>
			<text x="146" y="91">
				1
			</text>
			<text x="184" y="91">
				2
			</text>
		</>
	),
	combinatoria: (
		<>
			<path d="m110 23-48 33m48-33 48 33M62 56 36 91m26-35 25 35m71-35-25 35m25-35 26 35" />
			<circle cx="110" cy="23" fill="currentColor" r="6" />
			<circle cx="62" cy="56" fill="currentColor" r="5" />
			<circle cx="158" cy="56" fill="currentColor" r="5" />
			<text x="36" y="108">
				AA
			</text>
			<text x="87" y="108">
				AB
			</text>
			<text x="133" y="108">
				BA
			</text>
			<text x="184" y="108">
				BB
			</text>
		</>
	),
	calculo: (
		<>
			<path d="M25 94h175m-6-5 6 5-6 5M44 105V17m-5 6 5-6 5 6" opacity=".5" />
			<path d="M48 88c51 0 81-20 116-68" strokeWidth="3" />
			<path d="m67 99 107-64.4" strokeDasharray="5 5" />
			<circle cx="112" cy="72" fill="currentColor" r="4" />
			<text x="179" y="26">
				f(x)
			</text>
			<text x="207" y="101">
				x
			</text>
			<text x="33" y="23">
				y
			</text>
		</>
	),
	fmc: (
		<>
			<path d="M48 40h40m-40 40h40m57-20h33M88 28h25a32 32 0 0 1 0 64H88Z" />
			<circle cx="48" cy="40" r="4" />
			<circle cx="48" cy="80" r="4" />
			<circle cx="178" cy="60" r="4" />
			<text x="31" y="45">
				1
			</text>
			<text x="31" y="85">
				1
			</text>
			<text x="195" y="65">
				1
			</text>
			<text x="110" y="65">
				E
			</text>
		</>
	),
	vga: (
		<>
			<path d="M25 98h175m-6-5 6 5-6 5M44 109V15m-5 6 5-6 5 6" opacity=".5" />
			<path d="m44 98 64-41m-10 1 10-1-5 9m5-9 65-23m-10-3 10 3-6 8" />
			<path d="m44 98 129-64m-10 0h10l-6 8" strokeDasharray="4 4" />
			<text x="72" y="70">
				u
			</text>
			<text x="132" y="39">
				v
			</text>
			<text x="141" y="72">
				u + v
			</text>
		</>
	),
};

export function TrailDiagram({ id }: { id: TrailId }) {
	return (
		<svg
			aria-hidden="true"
			className={styles.diagram}
			fill="none"
			stroke="currentColor"
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth="2"
			viewBox="0 0 220 120"
		>
			{drawings[id]}
		</svg>
	);
}
