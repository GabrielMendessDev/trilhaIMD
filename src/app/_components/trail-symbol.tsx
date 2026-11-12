import type { TrailId } from "~/app/aprender/trails";
export function TrailSymbol({
	id,
	className,
}: {
	id: TrailId;
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
			viewBox="0 0 48 48"
		>
			{id === "elementar" ? (
				<>
					<circle
						cx="19"
						cy="24"
						fill="currentColor"
						fillOpacity=".12"
						r="13"
					/>
					<circle cx="30" cy="24" r="13" />
					<path d="M24 13c8 6 8 16 0 22" strokeWidth="4" />
				</>
			) : id === "combinatoria" ? (
				<>
					<path d="M24 8v10M9 32V21h30v11M24 21v11" />
					{[9, 24, 39].map((x) => (
						<circle
							cx={x}
							cy="37"
							fill="currentColor"
							fillOpacity=".2"
							key={x}
							r="5"
						/>
					))}
					<circle cx="24" cy="7" r="4" />
				</>
			) : id === "calculo" ? (
				<>
					<path d="M8 5v35h35M11 35C21 35 20 10 39 9M18 39l17-28" />
					<circle cx="27" cy="23" fill="currentColor" r="3" />
				</>
			) : id === "fmc" ? (
				<>
					<path d="M5 15h10m-10 18h10m0-23h9a14 14 0 0 1 0 28h-9Zm23 14h6" />
					<circle cx="6" cy="15" r="3" />
					<circle cx="6" cy="33" r="3" />
				</>
			) : (
				<>
					<path d="M8 40V5m0 35h35M8 40l27-25m-12 0h12v12M8 40l12-9m3-21v9" />
					<circle cx="35" cy="15" fill="currentColor" r="3" />
				</>
			)}
		</svg>
	);
}
