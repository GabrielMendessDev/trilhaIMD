import Image from "next/image";
import { ActionButton } from "~/app/_components/action-button";
import Link from "~/app/_components/action-link";
import {
	DashboardLayout,
	Icon,
	PageHeading,
} from "~/app/_components/dashboard";
import { LevelBar, levelRewardNames } from "~/app/_components/level-progress";
import { RpgIcon } from "~/app/_components/rpg-icon";
import { ThemeToggle } from "~/app/_components/theme-toggle";
import { auth, signOut } from "~/server/auth";
import { getLearningProgress } from "~/server/learning";
export default async function PerfilPage() {
	const user = (await auth())?.user;
	const progress = user ? await getLearningProgress(user.id) : null;
	const equipped = progress?.rpg.inventory.filter((i) => i.equipped) ?? [];
	const level = progress?.rpg.level;
	return (
		<DashboardLayout active="/perfil">
			<div className="ui-page profile-page">
				<PageHeading
					description="A jornada tem a sua cara. Veja seus marcos e organize seus recursos."
					title="Seu perfil de explorador"
				/>
				<section className="explorer-profile">
					<span
						className="explorer-avatar"
						data-arcane={
							equipped.some((i) => i.id === "arcane-frame") || undefined
						}
					>
						{user?.image?.startsWith("https://") ? (
							<Image
								alt=""
								height={88}
								src={user.image}
								unoptimized
								width={88}
							/>
						) : (
							<Icon className="size-10" name="profile" />
						)}
					</span>
					<div>
						<h2>{user?.name ?? "Sua próxima aventura espera"}</h2>
						<p>
							{user?.email ??
								(user
									? "Sua conta Trilbit"
									: "Entre para guardar seu progresso, seus itens e suas conquistas.")}
						</p>
						{level && (
							<span>
								Nível {level.level} · {progress?.xp.toLocaleString("pt-BR")} XP
							</span>
						)}
					</div>
					{!user && (
						<Link className="ui-button" href="/login">
							Entrar com Google
						</Link>
					)}
				</section>
				{progress && level && (
					<>
						<div className="profile-level">
							<LevelBar level={level} />
							{level.next === null ? (
								<dl className="profile-xp-facts">
									<div>
										<dt>XP total</dt>
										<dd>{progress.xp.toLocaleString("pt-BR")}</dd>
									</div>
									<div>
										<dt>XP para atingir o nível máximo</dt>
										<dd>{level.start.toLocaleString("pt-BR")}</dd>
									</div>
								</dl>
							) : (
								<>
									<dl className="profile-xp-facts">
										<div>
											<dt>XP total</dt>
											<dd>{progress.xp.toLocaleString("pt-BR")}</dd>
										</div>
										<div>
											<dt>XP neste nível</dt>
											<dd>
												{level.earned.toLocaleString("pt-BR")} /{" "}
												{(level.next - level.start).toLocaleString("pt-BR")}
											</dd>
										</div>
										<div>
											<dt>XP para atingir o nível {level.level + 1}</dt>
											<dd>
												{level.next.toLocaleString("pt-BR")} (
												{level.remaining.toLocaleString("pt-BR")} restantes)
											</dd>
										</div>
									</dl>
									<p>
										Próxima recompensa · {levelRewardNames(level.level + 1)}
									</p>
								</>
							)}
							<Link className="ui-link" href={`/niveis?nivel=${level.level}`}>
								Ver tabela de níveis e recompensas
							</Link>
						</div>
						<dl className="profile-stats">
							<div>
								<dt>Bits</dt>
								<dd>
									<RpgIcon name="bits" />
									{progress.rpg.bits}
								</dd>
							</div>
							<div>
								<dt>Ofensiva</dt>
								<dd>
									<Icon className="size-5" name="fire" />
									{progress.streak} {progress.streak === 1 ? "dia" : "dias"}
								</dd>
							</div>
							<div>
								<dt>Lições</dt>
								<dd>{progress.done.length}</dd>
							</div>
							<div>
								<dt>Conquistas</dt>
								<dd>
									{progress.rpg.achievements.filter((a) => a.unlockedAt).length}
									/41
								</dd>
							</div>
						</dl>
					</>
				)}
				<div className="profile-columns">
					<section className="profile-equipment">
						<h2>Equipamentos da jornada</h2>
						{equipped.length ? (
							<ul>
								{equipped.map((i) => (
									<li data-rarity={i.rarity} key={i.id}>
										<RpgIcon name={i.id} />
										<div>
											<strong>{i.name}</strong>
											<small>Equipado</small>
										</div>
									</li>
								))}
							</ul>
						) : (
							<p>Os cosméticos que você equipar na Mochila aparecem aqui.</p>
						)}
						<Link className="ui-link" href="/mochila">
							Organizar Mochila <Icon className="size-4" name="arrow" />
						</Link>
					</section>
					<section className="profile-preferences">
						<h2>Seu jeito de estudar</h2>
						<p>Escolha o tema mais confortável para este dispositivo.</p>
						<ThemeToggle withLabel />
						<p className="motion-preference">
							O movimento acompanha a preferência de acessibilidade do seu
							dispositivo.
						</p>
					</section>
				</div>
				<nav aria-label="Recursos do perfil" className="profile-destinations">
					<Link href="/progresso">
						<Icon className="size-5" name="chart" />
						Minha evolução
						<Icon className="size-4" name="arrow" />
					</Link>
					<Link href="/conquistas">
						<Icon className="size-5" name="trophy" />
						Minhas conquistas
						<Icon className="size-4" name="arrow" />
					</Link>
					<Link href="/loja">
						<Icon className="size-5" name="shop" />
						Loja do Bito
						<Icon className="size-4" name="arrow" />
					</Link>
					<Link href="/missoes">
						<Icon className="size-5" name="quests" />
						Missões de hoje
						<Icon className="size-4" name="arrow" />
					</Link>
					<Link href="/privacidade">
						<Icon className="size-5" name="book" />
						Privacidade e métricas
						<Icon className="size-4" name="arrow" />
					</Link>
				</nav>
				{user && (
					<form
						action={async () => {
							"use server";
							await signOut({ redirectTo: "/login" });
						}}
						className="profile-signout"
					>
						<ActionButton
							busyLabel="Saindo…"
							className="ui-button"
							data-variant="secondary"
							type="submit"
						>
							Sair da conta
						</ActionButton>
					</form>
				)}
			</div>
		</DashboardLayout>
	);
}
