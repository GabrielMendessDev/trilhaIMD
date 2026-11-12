import { RpgIcon } from "~/app/_components/rpg-icon";
import { MAX_LIVES } from "~/domain/lesson-lives.mjs";

export function LessonLives({
	lives,
	review = false,
}: {
	lives: number;
	review?: boolean;
}) {
	return (
		<div
			aria-live="polite"
			className="lesson-lives"
			data-lives={lives}
			role="status"
		>
			<span aria-hidden="true" className="lesson-hearts">
				{[1, 2, 3, 4, 5].map((slot) => (
					<RpgIcon
						className={slot <= lives ? "life-full" : "life-empty"}
						key={slot}
						name="heart"
					/>
				))}
			</span>
			<span>
				<strong>
					Vidas: {lives} de {MAX_LIVES}
				</strong>
				<small>
					{review
						? "Na revisão, erros não tiram vidas."
						: "Cada erro nesta rodada tira 1 vida."}
				</small>
			</span>
		</div>
	);
}
