import type { ReactNode } from "react";

type IconName =
	| "learn"
	| "practice"
	| "ranking"
	| "quests"
	| "shop"
	| "profile"
	| "fire"
	| "gem"
	| "heart"
	| "chevron"
	| "lock"
	| "check"
	| "star"
	| "sparkle"
	| "bolt"
	| "shield"
	| "trail"
	| "arrow"
	| "layers"
	| "chart"
	| "trophy"
	| "flag"
	| "book";

const paths: Record<IconName, ReactNode> = {
	layers: (
		<g fill="currentColor" stroke="none">
			<path d="M2 8.5 11 3a2 2 0 0 1 2 0l9 5.5-9 5.1a2 2 0 0 1-2 0Z" />
			<path
				d="m2 11 9 5a2 2 0 0 0 2 0l9-5v2.4l-9 5.1a2 2 0 0 1-2 0l-9-5.1Zm0 4.5 9 5a2 2 0 0 0 2 0l9-5v2.3l-9 5.1a2 2 0 0 1-2 0l-9-5.1Z"
				opacity=".78"
			/>
		</g>
	),
	chart: (
		<g fill="currentColor" stroke="none">
			<rect height="8" opacity=".66" rx="1.6" width="4" x="3" y="13" />
			<rect height="13" opacity=".83" rx="1.6" width="4" x="10" y="8" />
			<rect height="18" rx="1.6" width="4" x="17" y="3" />
		</g>
	),
	trophy: (
		<>
			<path d="M7 6H3v1a5 5 0 0 0 5 5m9-6h4v1a5 5 0 0 1-5 5" opacity=".8" />
			<path
				d="M6 5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v4a6 6 0 0 1-4.8 6v3.1h2.3A2.5 2.5 0 0 1 18 21H6a2.5 2.5 0 0 1 2.5-2.9h2.3V15A6 6 0 0 1 6 9Z"
				fill="currentColor"
				stroke="none"
			/>
			<path
				d="M9 5.5v3a3.8 3.8 0 0 0 1.2 2.8"
				opacity=".55"
				stroke="#fff"
				strokeWidth="1.35"
			/>
		</>
	),
	flag: (
		<>
			<path
				d="M2.8 20.5 8 14l3.2 3.3 4.1-5 5.9 8.2Z"
				fill="currentColor"
				opacity=".68"
				stroke="none"
			/>
			<path d="M10 15V4" />
			<path
				d="M10 4c4-3 6 3 11 0v7c-5 3-7-3-11 0Z"
				fill="currentColor"
				stroke="none"
			/>
		</>
	),
	book: (
		<g fill="currentColor" stroke="none">
			<path d="M3 4h3a8 8 0 0 1 5 2v14a9 9 0 0 0-5-2H3a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Z" />
			<path
				d="M21 4h-3a8 8 0 0 0-5 2v14a9 9 0 0 1 5-2h3a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1Z"
				opacity=".79"
			/>
		</g>
	),
	trail: (
		<>
			<path d="m10 7-5 8m9-8 5 8" />
			<circle cx="12" cy="5.5" r="3.1" />
			<circle cx="4.5" cy="18" r="3.1" />
			<circle cx="19.5" cy="18" r="3.1" />
		</>
	),
	arrow: <path d="M4 12h15m-6-6 6 6-6 6" />,
	learn: (
		<path
			d="M3.4 10 10.6 3.3a2.1 2.1 0 0 1 2.8 0l7.2 6.7a1.4 1.4 0 0 1-.9 2.4h-1v6.1a1.7 1.7 0 0 1-1.7 1.7h-2.8v-5.1a1 1 0 0 0-1-1h-2.4a1 1 0 0 0-1 1v5.1H7a1.7 1.7 0 0 1-1.7-1.7v-6.1h-1a1.4 1.4 0 0 1-.9-2.4Z"
			fill="currentColor"
			stroke="none"
		/>
	),
	practice: (
		<>
			<circle cx="12" cy="12" r="8" />
			<path d="m9 12 2 2 4-5" />
		</>
	),
	ranking: (
		<path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.8-5.4 2.8 1-6.1L3.2 9.4l6.1-.9z" />
	),
	quests: (
		<>
			<path d="M8 3h8v3h3v15H5V6h3z" />
			<path d="m8 13 2.4 2.4L16 10" />
		</>
	),
	shop: (
		<>
			<path d="M4 9h16l-1 12H5z" />
			<path d="M8 9a4 4 0 0 1 8 0" />
		</>
	),
	profile: (
		<g fill="currentColor" stroke="none">
			<circle cx="12" cy="7.3" r="4.2" />
			<path
				d="M3.5 20.2a8.5 8.5 0 0 1 17 0c0 .8-.6 1.3-1.3 1.3H4.8c-.7 0-1.3-.5-1.3-1.3Z"
				opacity=".88"
			/>
		</g>
	),
	fire: (
		<g stroke="none">
			<path
				d="M12 22C7.5 22 4 19.1 4 14.9c0-3 1.7-5.3 3.6-7.2.1 1.6.8 2.6 1.5 3 .2-3.2 1.8-6.4 4-8.7.4 4.6 6.9 7.4 6.9 12.9C20 19.2 16.6 22 12 22Z"
				fill="currentColor"
			/>
			<path
				d="M12.2 20.6c-1.8 0-3.3-1.4-3.3-3.1 0-2 1.7-2.9 2.9-4.9 0 1.4.8 2 1.3 2.4.6-.4.9-.9 1-1.5.9 1 1.6 2.1 1.6 4 0 1.7-1.5 3.1-3.5 3.1Z"
				fill="#fff1b8"
			/>
		</g>
	),
	gem: (
		<g stroke="none">
			<path
				d="M10.7 2.9a1.8 1.8 0 0 1 2.6 0l7.8 7.8a1.8 1.8 0 0 1 0 2.6l-7.8 7.8a1.8 1.8 0 0 1-2.6 0l-7.8-7.8a1.8 1.8 0 0 1 0-2.6Z"
				fill="currentColor"
			/>
			<path d="m12 2.5-5.4 9.3 5.4 9.7-9.5-9.5Z" fill="#fff" opacity=".35" />
			<path d="m12 2.5 9.5 9.5-9.5 9.5 5.4-9.7Z" fill="#381080" opacity=".35" />
		</g>
	),
	heart: (
		<path d="M20.8 8.6c0 5.6-8.8 10.9-8.8 10.9S3.2 14.2 3.2 8.6A4.7 4.7 0 0 1 12 6.2a4.7 4.7 0 0 1 8.8 2.4Z" />
	),
	chevron: <path d="m7 10 5 5 5-5" />,
	lock: (
		<>
			<path d="M8 11V7a4 4 0 0 1 8 0v4" />
			<path
				d="M6.8 9.5h10.4A2.8 2.8 0 0 1 20 12.3v6.9a2.8 2.8 0 0 1-2.8 2.8H6.8A2.8 2.8 0 0 1 4 19.2v-6.9a2.8 2.8 0 0 1 2.8-2.8Zm5.2 4a1.4 1.4 0 0 0-.6 2.7v1.5h1.2v-1.5a1.4 1.4 0 0 0-.6-2.7Z"
				fill="currentColor"
				fillRule="evenodd"
				stroke="none"
			/>
		</>
	),
	check: <path d="m5 12 4.2 4.2L19 6.5" strokeWidth="3" />,
	star: (
		<path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.8-5.4 2.8 1-6.1-4.4-4.3 6.1-.9z" />
	),
	sparkle: (
		<path
			d="M11 2.7a1 1 0 0 1 2 0l1.6 4.6a3.3 3.3 0 0 0 2.1 2.1l4.6 1.6a1 1 0 0 1 0 2l-4.6 1.6a3.3 3.3 0 0 0-2.1 2.1L13 21.3a1 1 0 0 1-2 0l-1.6-4.6a3.3 3.3 0 0 0-2.1-2.1L2.7 13a1 1 0 0 1 0-2l4.6-1.6a3.3 3.3 0 0 0 2.1-2.1Z"
			fill="currentColor"
			stroke="none"
		/>
	),
	bolt: <path d="m13 2-8 12h6l-1 8 8-12h-6z" />,
	shield: <path d="M12 3 5 6v5c0 4.5 3 8 7 10 4-2 7-5.5 7-10V6z" />,
};

export function Icon({
	name,
	className = "",
}: {
	name: IconName;
	className?: string;
}) {
	return (
		<svg
			aria-hidden="true"
			className={className}
			fill="none"
			stroke="currentColor"
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth="2.2"
			viewBox="0 0 24 24"
		>
			{paths[name]}
		</svg>
	);
}
