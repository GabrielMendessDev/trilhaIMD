"use client";
import { useRouter } from "next/navigation";
import { type CSSProperties, useEffect, useRef, useState } from "react";
import { achievements, items } from "~/domain/rpg";
import type { RpgInventoryState, RpgSummary } from "~/server/rpg";
import Link from "./action-link";
import { BitoReaction } from "./bito-reaction";
import { InventoryGrid } from "./inventory-grid";
import { LevelBar } from "./level-progress";
import { AchievementCatalog, AchievementCollection } from "./rpg-achievements";
import { publishRpg, rpgRequest } from "./rpg-client";
import { RpgConfirmation } from "./rpg-confirmation";
import { RpgFilters, useRpgFilters } from "./rpg-filters";
import { RpgHistory } from "./rpg-history";
import { RpgIcon } from "./rpg-icon";
import { ShopCatalog, ShopHeader } from "./rpg-shop";

const emptyInventory = items.map((item) => ({
	...item,
	quantity: 0,
	equipped: false,
}));
const emptyAwards = achievements.map((award) => ({
	...award,
	current: 0,
	unlockedAt: null,
}));
export function RpgHub({
	initial,
	mode,
}: {
	initial:
		| (RpgSummary & Partial<Pick<RpgInventoryState, "protections">>)
		| null;
	mode: "shop" | "inventory" | "achievements";
}) {
	const [state, setState] = useState(initial),
		[busy, setBusy] = useState(""),
		[error, setError] = useState(""),
		[notice, setNotice] = useState<{
			message: string;
			purchased: boolean;
		} | null>(null),
		[celebrate, setCelebrate] = useState(""),
		[selected, setSelected] = useState<string | null>(null);
	const filters = useRpgFilters(mode);
	const { category, rarity, status } = filters;
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
	const inventory = state?.inventory ?? emptyInventory;
	const awards = state?.achievements ?? emptyAwards;
	const item = inventory.find((item) => item.id === selected),
		activeShield = state?.protected;
	const lastProtection = state?.protections?.find((p) => p.state === "used");
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
			const result = await rpgRequest<{ state: RpgInventoryState }>({
				action,
				compact: true,
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
			if (action === "equip") router.refresh();
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
				<ShopHeader state={state} />
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
						<Link
							className="rpg-level"
							href={`/niveis?nivel=${state.level.level}`}
						>
							Nível {state.level.level}
							<small>{state.xp.toLocaleString("pt-BR")} XP</small>
							<LevelBar level={state.level} />
						</Link>
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
			{mode === "achievements" && <AchievementCollection awards={awards} />}
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
						{lastProtection && (
							<small>
								Última proteção:{" "}
								{lastProtection.protectedDay?.split("-").reverse().join("/")}.
								Um escudo foi consumido.
							</small>
						)}
					</div>
				</section>
			)}
			<RpgFilters
				count={mode === "achievements" ? awardList.length : visible.length}
				filters={filters}
				mode={mode}
			/>
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
				<AchievementCatalog awardList={awardList} />
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
				<ShopCatalog
					busy={busy}
					celebrate={celebrate}
					detail={detail}
					state={state}
					visible={visible}
				/>
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
				<RpgHistory account={state.account} key={state.account} />
			)}
			<RpgConfirmation
				busy={busy}
				dialog={dialog}
				error={error}
				item={item}
				mode={mode}
				onClose={() => {
					dialog.current?.close();
					setSelected(null);
				}}
				perform={perform}
				setSelected={setSelected}
				state={state}
			/>
		</div>
	);
}
