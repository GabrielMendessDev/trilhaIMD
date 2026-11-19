"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { type CSSProperties, useEffect, useRef, useState } from "react";
import { achievements, categoryNames, items, rarityNames } from "~/domain/rpg";
import type { RpgState } from "~/server/rpg";
import Link from "./action-link";
import { BitoReaction } from "./bito-reaction";
import { InventoryGrid } from "./inventory-grid";
import { publishRpg, rpgRequest } from "./rpg-client";
import { RpgIcon, RpgMedal } from "./rpg-icon";

const sections = {
	todos: "Todos",
	auxilio: "Auxílio",
	consumiveis: "Consumíveis",
	ofensiva: "Ofensiva",
	cosmeticos: "Cosméticos",
	especiais: "Especiais",
};
const number = (n: number) => n.toLocaleString("pt-BR");
const date = (value: string) => new Date(value).toLocaleDateString("pt-BR");
export function RpgHub({
	initial,
	mode,
}: {
	initial: RpgState | null;
	mode: "shop" | "inventory" | "achievements";
}) {
	const [state, setState] = useState(initial),
		[category, setCategory] = useState("todos"),
		[rarity, setRarity] = useState("todos"),
		[status, setStatus] = useState("todos"),
		[busy, setBusy] = useState(""),
		[error, setError] = useState(""),
		[notice, setNotice] = useState<{
			message: string;
			purchased: boolean;
		} | null>(null),
		[celebrate, setCelebrate] = useState(""),
		[selected, setSelected] = useState<string | null>(null);
	const dialog = useRef<HTMLDialogElement>(null),
		confirmation = useRef<HTMLDivElement>(null),
		operation = useRef<{ key: string; id: string } | null>(null),
		inFlight = useRef(false);
	const router = useRouter();
	const [flight, setFlight] = useState<{
		id: string;
		x: number;
		y: number;
		dx: number;
		dy: number;
	} | null>(null);
	useEffect(() => {
		if (!flight) return;
		const timer = setTimeout(() => setFlight(null), 850);
		return () => clearTimeout(timer);
	}, [flight]);
	useEffect(() => {
		if (notice?.purchased)
			confirmation.current?.scrollIntoView({
				block: "nearest",
				behavior: "instant",
			});
	}, [notice]);
	const inventory =
		state?.inventory ??
		items.map((item) => ({ ...item, quantity: 0, equipped: false }));
	const awards =
		state?.achievements ??
		achievements.map((a) => ({ ...a, current: 0, unlockedAt: null }));
	const unlocked = awards.filter((a) => a.unlockedAt),
		item = inventory.find((item) => item.id === selected),
		activeShield = state?.protections.some((p) => p.state === "armed");
	const nextAward = awards
		.filter((a) => !a.unlockedAt)
		.sort((a, b) => b.current / b.goal - a.current / a.goal)[0];
	async function perform(
		action: "buy" | "equip" | "arm",
		id: string,
		equipped?: boolean,
	) {
		if (inFlight.current) return;
		inFlight.current = true;
		const key = `${action}:${id}:${equipped}`;
		if (operation.current?.key !== key)
			operation.current = { key, id: crypto.randomUUID() };
		setBusy(id);
		setError("");
		setNotice(null);
		try {
			const result = await rpgRequest<{ state: RpgState }>({
				action,
				itemId: id,
				requestId: operation.current.id,
				equipped,
			});
			setState(result.state);
			publishRpg(result.state);
			operation.current = null;
			const name = items.find((i) => i.id === id)?.name ?? "Item";
			setNotice({
				purchased: action === "buy",
				message:
					action === "buy"
						? `${name} chegou à sua Mochila.`
						: action === "arm"
							? "Escudo ativado para proteger o próximo dia perdido."
							: `${name} ${equipped ? "equipado" : "guardado"}.`,
			});
			setCelebrate(id);
			if (action === "buy") {
				const start = dialog.current
					?.querySelector(".rpg-dialog-art")
					?.getBoundingClientRect();
				const end = document
					.querySelector(".rpg-bag-link")
					?.getBoundingClientRect();
				if (start && end)
					setFlight({
						id,
						x: start.x,
						y: start.y,
						dx: end.x - start.x,
						dy: end.y - start.y,
					});
			}
			dialog.current?.close();
			setSelected(null);
			router.refresh();
		} catch (e) {
			setError(
				e instanceof Error
					? e.message
					: "Não foi possível confirmar. Tente novamente.",
			);
		} finally {
			inFlight.current = false;
			setBusy("");
		}
	}
	const detail = (id: string) => {
		setSelected(id);
		setError("");
		dialog.current?.showModal();
	};
	const catalog =
		mode === "inventory" ? inventory.filter((i) => i.quantity > 0) : inventory;
	const visible = catalog.filter(
		(i) =>
			(category === "todos" || i.category === category) &&
			(rarity === "todos" || i.rarity === rarity),
	);
	const awardList = awards.filter(
		(a) =>
			(category === "todos" || a.category === category) &&
			(rarity === "todos" || a.rarity === rarity) &&
			(status === "todos" ||
				(status === "earned" ? a.unlockedAt : !a.unlockedAt)),
	);
	return (
		<div className="rpg-hub" data-hub-mode={mode}>
			{flight && (
				<RpgIcon
					className="rpg-item-flight"
					name={flight.id}
					style={
						{
							left: flight.x,
							top: flight.y,
							"--flight-x": `${flight.dx}px`,
							"--flight-y": `${flight.dy}px`,
						} as CSSProperties
					}
				/>
			)}
			<nav aria-label="Recursos da jornada" className="rpg-subnav">
				<Link aria-current={mode === "shop" ? "page" : undefined} href="/loja">
					Loja do Bito
				</Link>
				<Link
					aria-current={mode === "inventory" ? "page" : undefined}
					href="/mochila"
				>
					Mochila <RpgIcon name="bag" />
				</Link>
				<Link
					aria-current={mode === "achievements" ? "page" : undefined}
					href="/conquistas"
				>
					Conquistas
				</Link>
			</nav>
			{mode === "shop" ? (
				<header className="rpg-shop-hero">
					<div>
						<h1>Loja do Bito</h1>
						<p>
							O Bito separou ajudas para os desafios e itens para deixar a
							trilha com a sua cara.
						</p>
						<div className="rpg-purse">
							<RpgIcon name="bits" />
							{state ? (
								<>
									<strong>{number(state.bits)}</strong> Bits disponíveis
								</>
							) : (
								<Link href="/login">Entre para ver seus Bits</Link>
							)}
						</div>
						<small>Ganhos estudando. Sem dinheiro real.</small>
						<a className="rpg-featured-item" href="#rpg-catalog">
							<RpgIcon name="hint-scroll" />
							<span>
								Pergaminho da Dica
								<strong>35 Bits · Uma orientação na hora certa</strong>
							</span>
						</a>
					</div>
					<Image
						alt="Bito, o companheiro da loja"
						height={600}
						priority
						src="/brand/bito.webp"
						unoptimized
						width={900}
					/>
				</header>
			) : (
				<header className="rpg-title">
					<div>
						<h1>{mode === "inventory" ? "Sua Mochila" : "Conquistas"}</h1>
						<p>
							{mode === "inventory"
								? "Seus recursos, prontos para a próxima etapa. Auxílios também ficam disponíveis dentro das questões."
								: "Consistência, descoberta e aquela questão que finalmente fez sentido."}
						</p>
					</div>
					{state && (
						<span className="rpg-level">
							Nível {state.level.level}
							<small>{number(state.xp)} XP</small>
						</span>
					)}
				</header>
			)}
			{!state && (
				<p className="rpg-info">
					<Link className="ui-link" href="/login">
						Entre na sua conta
					</Link>{" "}
					para{" "}
					{mode === "shop"
						? "comprar com seus Bits"
						: mode === "inventory"
							? "consultar seus itens"
							: "salvar as conquistas da sua jornada"}
					.
				</p>
			)}
			{mode === "achievements" && (
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
			)}
			{mode === "achievements" && nextAward && (
				<p className="rpg-next-award">
					Sua próxima meta: <strong>{nextAward.name}</strong> ·{" "}
					{nextAward.current}/{nextAward.goal}. {nextAward.description}
				</p>
			)}
			{mode === "shop" && (
				<Link className="ui-link rpg-history-link" href="/mochila#rpg-history">
					Consultar histórico de compras e Bits
				</Link>
			)}
			{mode === "inventory" && state && (
				<section
					className="rpg-protection"
					data-protected={activeShield || undefined}
				>
					<RpgIcon name="streak-shield" />
					<div>
						<h2>
							{activeShield
								? "Sua ofensiva está protegida"
								: "Proteção da ofensiva"}
						</h2>
						<p>
							{activeShield
								? "O escudo cobre um dia perdido. O dia protegido não conta como estudo."
								: "Ative um escudo quando tiver uma ofensiva em andamento. Não cobre dois dias seguidos."}
						</p>
						{state.protections.some((p) => p.state === "used") && (
							<small>
								Última proteção:{" "}
								{state.protections
									.find((p) => p.state === "used")
									?.protectedDay?.split("-")
									.reverse()
									.join("/")}
								. Um escudo foi consumido.
							</small>
						)}
					</div>
				</section>
			)}
			<fieldset aria-label="Filtros do catálogo" className="rpg-filters">
				<label>
					Categoria
					<select
						onChange={(e) => setCategory(e.target.value)}
						value={category}
					>
						{Object.entries(
							mode === "achievements"
								? { todos: "Todas", ...categoryNames }
								: sections,
						).map(([key, label]) => (
							<option key={key} value={key}>
								{label}
							</option>
						))}
					</select>
				</label>
				<label>
					Raridade
					<select onChange={(e) => setRarity(e.target.value)} value={rarity}>
						<option value="todos">Todas</option>
						{Object.entries(rarityNames).map(([key, label]) => (
							<option key={key} value={key}>
								{label}
							</option>
						))}
					</select>
				</label>
				{mode === "achievements" && (
					<label>
						Estado
						<select onChange={(e) => setStatus(e.target.value)} value={status}>
							<option value="todos">Todas</option>
							<option value="earned">Desbloqueadas</option>
							<option value="locked">Bloqueadas</option>
						</select>
					</label>
				)}
				<span>
					{mode === "achievements" ? awardList.length : visible.length}{" "}
					{mode === "achievements" ? "conquistas" : "itens"}
				</span>
			</fieldset>
			{notice && (
				<div
					className="rpg-confirmation"
					key={notice.message}
					ref={confirmation}
					role="status"
				>
					{notice.purchased ? (
						<BitoReaction mood="feliz" />
					) : (
						<RpgIcon name={celebrate} />
					)}
					<span>{notice.message}</span>
					<Link className="ui-link" href="/mochila">
						Ver Mochila
					</Link>
				</div>
			)}
			{error && !selected && (
				<p className="study-error" role="alert">
					{error}
				</p>
			)}
			{mode === "achievements" ? (
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
			) : mode === "inventory" ? (
				<InventoryGrid
					busy={busy}
					items={visible}
					onArm={detail}
					onEquip={(id, equipped) => void perform("equip", id, equipped)}
					shieldActive={Boolean(activeShield)}
					streak={state?.stats.studyStreak ?? 0}
				/>
			) : (
				<ul className="rpg-items" id="rpg-catalog">
					{visible.map((i) => (
						<li
							className="rpg-item"
							data-purchased={celebrate === i.id || undefined}
							data-rarity={i.rarity}
							key={i.id}
						>
							<div className="rpg-item-art">
								<RpgIcon name={i.id} />
								<span>{rarityNames[i.rarity]}</span>
							</div>
							<div className="rpg-item-copy">
								<h2>{i.name}</h2>
								<p>{i.description}</p>
								<div className="rpg-item-meta">
									<span>
										{i.kind === "permanent" ? "Permanente" : "Consumível"}
									</span>
									<span>Na Mochila: {i.quantity}</span>
								</div>
								{mode === "shop" ? (
									<button
										className="rpg-buy ui-button"
										disabled={
											Boolean(busy) ||
											!state ||
											state.bits < i.price ||
											i.quantity >= i.max
										}
										onClick={() => detail(i.id)}
										type="button"
									>
										<RpgIcon name="bits" />
										{number(i.price)} Bits{" "}
										<span>
											{i.quantity >= i.max
												? i.kind === "permanent"
													? "Adquirido"
													: "Limite atingido"
												: state && state.bits < i.price
													? "Saldo insuficiente"
													: "Comprar"}
										</span>
									</button>
								) : i.kind === "permanent" ? (
									<button
										className="ui-button"
										disabled={Boolean(busy)}
										onClick={() => void perform("equip", i.id, !i.equipped)}
										type="button"
									>
										{busy === i.id
											? "Salvando…"
											: i.equipped
												? "Desequipar"
												: "Equipar"}
									</button>
								) : i.id === "streak-shield" ? (
									<button
										className="ui-button"
										disabled={
											Boolean(busy) || activeShield || !state?.stats.studyStreak
										}
										onClick={() => detail(i.id)}
										type="button"
									>
										{activeShield ? "Escudo ativo" : "Ativar escudo"}
									</button>
								) : (
									<Link
										className="ui-button"
										data-variant="secondary"
										href="/aprender"
									>
										Usar numa lição
									</Link>
								)}
							</div>
						</li>
					))}
				</ul>
			)}
			{(mode === "achievements" ? awardList.length : visible.length) === 0 && (
				<div className="rpg-empty">
					<RpgIcon name={mode === "inventory" ? "bag" : "exploracao"} />
					<h2>
						{mode === "inventory" && catalog.length === 0
							? "Sua Mochila está pronta para começar."
							: "Nada por aqui com esses filtros."}
					</h2>
					<p>
						{mode === "inventory" && catalog.length === 0
							? "Estude para ganhar Bits. Na loja, você escolhe os recursos que fazem sentido para você."
							: "Experimente outra categoria ou raridade."}
					</p>
					<Link
						className="ui-link"
						href={mode === "inventory" ? "/loja" : "/aprender"}
					>
						{mode === "inventory"
							? "Visitar a Loja do Bito"
							: "Continuar estudando"}
					</Link>
				</div>
			)}
			{mode !== "achievements" && (
				<p className="rpg-footnote">
					Você pode concluir todas as lições sem comprar itens. Auxílios
					interrompem a sequência de acertos e retiram a elegibilidade de lição
					perfeita.
				</p>
			)}
			{state && mode === "inventory" && (
				<section className="rpg-history" id="rpg-history">
					<h2>Histórico da Mochila</h2>
					<p>Compras, recompensas e usos confirmados na sua conta.</p>
					<details>
						<summary>
							Movimentações de Bits ({state.history.length} mais recentes)
						</summary>
						<ol>
							{state.history.map((row) => (
								<li key={row.id}>
									<div>
										<strong>
											{row.kind === "purchase"
												? items.find((i) => i.id === row.subject)?.name
												: row.kind === "achievement"
													? achievements.find((a) => a.id === row.subject)?.name
													: row.kind === "daily"
														? "Bônus diário"
														: "Conclusão de lição"}
										</strong>
										<small>{date(row.createdAt)}</small>
									</div>
									<span>
										{row.bits > 0 ? "+" : ""}
										{row.bits} Bits{row.xp > 0 ? ` · +${row.xp} XP` : ""}
										<small>Saldo após: {row.balanceAfter}</small>
									</span>
								</li>
							))}
						</ol>
						{!state.history.length && <p>Nenhuma movimentação registrada.</p>}
					</details>
					<details>
						<summary>
							Uso de itens ({state.usages.length} mais recentes)
						</summary>
						<ol>
							{state.usages.map((row) => (
								<li key={row.id}>
									<div>
										<strong>
											{items.find((i) => i.id === row.itemId)?.name}
										</strong>
										<small>
											{row.action === "equip"
												? "Equipado"
												: row.action === "unequip"
													? "Guardado"
													: row.action === "arm"
														? "Proteção ativada"
														: row.action === "protect"
															? "Dia protegido"
															: "Usado na lição"}
											{row.entryKey ? ` · questão ${row.entryKey}` : ""}
										</small>
									</div>
									<span>{date(row.createdAt)}</span>
								</li>
							))}
						</ol>
						{!state.usages.length && <p>Nenhum item usado ainda.</p>}
					</details>
				</section>
			)}
			<dialog
				aria-labelledby="rpg-confirm-title"
				className="rpg-dialog"
				onCancel={(e) => {
					if (busy) e.preventDefault();
					else setSelected(null);
				}}
				ref={dialog}
			>
				{item && (
					<>
						<RpgIcon className="rpg-dialog-art" name={item.id} />
						<p className="item-effect-description">{item.description}</p>
						<h2 id="rpg-confirm-title">
							{mode === "shop"
								? `Comprar ${item.name}?`
								: "Ativar Escudo da Ofensiva?"}
						</h2>
						<p>
							{mode === "shop"
								? `${item.price} Bits serão descontados. O item ficará salvo na sua Mochila.`
								: "Uma unidade será consumida. O próximo dia perdido será protegido, sem contar como dia de estudo."}
						</p>
						{mode === "shop" && (
							<p>
								Saldo após a compra:{" "}
								<strong>{(state?.bits ?? 0) - item.price} Bits</strong>
							</p>
						)}
						{error && (
							<p className="study-error" role="alert">
								{error}
							</p>
						)}
						<div className="rpg-dialog-actions">
							<button
								className="ui-button"
								disabled={Boolean(busy)}
								onClick={() =>
									void perform(mode === "shop" ? "buy" : "arm", item.id)
								}
								type="button"
							>
								{busy
									? "Confirmando…"
									: mode === "shop"
										? "Confirmar compra"
										: "Ativar proteção"}
							</button>
							<button
								className="ui-button"
								data-variant="secondary"
								disabled={Boolean(busy)}
								onClick={() => {
									dialog.current?.close();
									setSelected(null);
								}}
								type="button"
							>
								Cancelar
							</button>
						</div>
					</>
				)}
			</dialog>
		</div>
	);
}
