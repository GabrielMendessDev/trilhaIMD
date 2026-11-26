import Image from "next/image";
import { rarityNames } from "~/domain/rpg";
import type { RpgState } from "~/server/rpg";
import Link from "./action-link";
import { RpgIcon } from "./rpg-icon";

const number = (n: number) => n.toLocaleString("pt-BR");
export function ShopHeader({ state }: { state: { bits: number } | null }) {
	return (
		<header className="rpg-shop-hero">
			<div>
				<h1>Loja do Bito</h1>
				<p>
					O Bito separou ajudas para os desafios e itens para deixar a trilha
					com a sua cara.
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
	);
}
export function ShopCatalog({
	visible,
	state,
	celebrate,
	busy,
	detail,
}: {
	visible: RpgState["inventory"];
	state: { bits: number } | null;
	celebrate: string;
	busy: string;
	detail: (id: string) => void;
}) {
	return (
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
						{
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
						}
					</div>
				</li>
			))}
		</ul>
	);
}
