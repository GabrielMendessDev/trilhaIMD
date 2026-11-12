import { RpgIcon } from "~/app/_components/rpg-icon";
export function QuestionHelp({
	hint,
	example,
}: {
	hint?: string;
	example?: string;
}) {
	return (
		<>
			{hint && (
				<aside className="rpg-question-help">
					<RpgIcon name="hint-scroll" />
					<div>
						<h3>Dica do Bito</h3>
						<p>{hint}</p>
					</div>
				</aside>
			)}
			{example && (
				<aside className="rpg-question-help">
					<RpgIcon name="example-scroll" />
					<div>
						<h3>Outro exemplo, mesma ideia</h3>
						<p>{example}</p>
					</div>
				</aside>
			)}
		</>
	);
}
