import Link from "next/link";
import { DashboardLayout, PageHeading } from "~/app/_components/dashboard";
import { levelRewardNames } from "~/app/_components/level-progress";
import { maxLevel, xpForLevel } from "~/domain/rpg";
import { auth } from "~/server/auth";
import { getRpgSummary } from "~/server/rpg";
import styles from "./styles.module.css";

export const metadata = { title: "Níveis e recompensas" };

const pageSize = 50;
const format = new Intl.NumberFormat("pt-BR");

export default async function LevelsPage({
	searchParams,
}: {
	searchParams: Promise<{ nivel?: string }>;
}) {
	const [params, session] = await Promise.all([searchParams, auth()]);
	const personal = session?.user
		? await getRpgSummary(session.user.id).catch(() => null)
		: null;
	const current = personal?.level.level;
	const selected = /^\d{1,4}$/.test(params.nivel ?? "")
		? Number(params.nivel)
		: (current ?? 1);
	const target = Math.max(1, Math.min(maxLevel, selected));
	const first = Math.floor((target - 1) / pageSize) * pageSize + 1;
	const last = Math.min(first + pageSize - 1, maxLevel);
	const rows = Array.from(
		{ length: last - first + 1 },
		(_, index) => first + index,
	);
	return (
		<DashboardLayout active="/progresso">
			<div className={`ui-page ${styles.page}`}>
				<PageHeading
					description="Cada nível libera itens na Mochila. Se o estoque de um item estiver cheio, o excedente vira Bits por metade do preço da loja, arredondada para baixo."
					title="Níveis e recompensas"
				/>
				<form action="/niveis" className={styles.jump}>
					<label htmlFor="target-level">Ir para o nível</label>
					<input
						defaultValue={target}
						id="target-level"
						max={maxLevel}
						min={1}
						name="nivel"
						required
						type="number"
					/>
					<button className="ui-button" type="submit">
						Buscar
					</button>
					{current !== undefined && (
						<Link
							className="ui-link"
							href={`/niveis?nivel=${current}#nivel-${current}`}
						>
							Meu nível
						</Link>
					)}
				</form>
				<div className={styles.table}>
					<table>
						<caption>
							Níveis {first} a {last} de {format.format(maxLevel)}
						</caption>
						<thead>
							<tr>
								<th scope="col">Nível</th>
								<th scope="col">XP total necessário</th>
								<th scope="col">Recompensas</th>
							</tr>
						</thead>
						<tbody>
							{rows.map((level) => (
								<tr
									data-current={current === level || undefined}
									id={`nivel-${level}`}
									key={level}
								>
									<th scope="row">
										{format.format(level)}
										{current === level && <small>Seu nível</small>}
									</th>
									<td>{format.format(xpForLevel(level))}</td>
									<td>{levelRewardNames(level)}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
				<nav
					aria-label="Páginas da tabela de níveis"
					className={styles.pagination}
				>
					{first > 1 && (
						<Link
							className="ui-link"
							href={`/niveis?nivel=${first - pageSize}`}
						>
							Níveis anteriores
						</Link>
					)}
					{last < maxLevel && (
						<Link className="ui-link" href={`/niveis?nivel=${last + 1}`}>
							Próximos níveis
						</Link>
					)}
				</nav>
			</div>
		</DashboardLayout>
	);
}
