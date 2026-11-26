import { rarityNames } from "~/domain/rpg";
import type { RpgState } from "~/server/rpg";
import { RpgMedal } from "./rpg-icon";

const number = (n: number) => n.toLocaleString("pt-BR");
const date = (value: string) => new Date(value).toLocaleDateString("pt-BR");
export function AchievementCatalog({
	awardList,
}: {
	awardList: RpgState["achievements"];
}) {
	return (
		<ul className="rpg-achievements">
			{awardList.map((a) => (
				<li
					data-earned={Boolean(a.unlockedAt)}
					data-rarity={a.rarity}
					key={a.id}
				>
					<RpgMedal category={a.category} goal={a.goal} symbol={a.symbol} />
					<div>
						<span className="rpg-rarity">{rarityNames[a.rarity]}</span>
						<h2>{a.name}</h2>
						<p>{a.description}</p>
						<div className="rpg-progress">
							<progress
								aria-label={`Progresso de ${a.name}`}
								max={a.goal}
								value={a.current}
							/>
							<span>
								{a.current}/{a.goal}
							</span>
						</div>
						<span className="rpg-reward">
							+{number(a.xp)} XP · +{number(a.bits)} Bits
						</span>
						<small>
							{a.unlockedAt
								? `Conquistada em ${date(a.unlockedAt)}`
								: "Ainda bloqueada"}
						</small>
					</div>
				</li>
			))}
		</ul>
	);
}
export function AchievementCollection({
	awards,
}: {
	awards: RpgState["achievements"];
}) {
	const unlocked = awards.filter((a) => a.unlockedAt);
	const nextAward = awards
		.filter((a) => !a.unlockedAt)
		.sort((a, b) => b.current / b.goal - a.current / a.goal)[0];
	return (
		<>
			{" "}
			{
				<dl className="rpg-collection-summary">
					<div>
						<dt>Coleção</dt>
						<dd>
							{unlocked.length}
							<span> / {awards.length}</span>
						</dd>
					</div>
					<div>
						<dt>Desbloqueado</dt>
						<dd>{Math.round((unlocked.length / awards.length) * 100)}%</dd>
					</div>
					<div>
						<dt>XP em conquistas</dt>
						<dd>{number(unlocked.reduce((sum, a) => sum + a.xp, 0))}</dd>
					</div>
					<div>
						<dt>Bits em conquistas</dt>
						<dd>{number(unlocked.reduce((sum, a) => sum + a.bits, 0))}</dd>
					</div>
				</dl>
			}
			{nextAward && (
				<p className="rpg-next-award">
					Sua próxima meta: <strong>{nextAward.name}</strong> ·{" "}
					{nextAward.current}/{nextAward.goal}. {nextAward.description}
				</p>
			)}
		</>
	);
}
