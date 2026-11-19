import Image from "next/image";

export function BitoReaction({
	mood,
}: {
	mood: "feliz" | "triste" | "duvida" | "acenando";
}) {
	return (
		<Image
			alt=""
			className="bito-reaction"
			height={110}
			loading="eager"
			src={`/brand/bito-${mood}.svg`}
			unoptimized
			width={100}
		/>
	);
}
