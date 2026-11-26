import type { Ref } from "react";
import type { RpgState } from "~/server/rpg";
import { RpgIcon } from "./rpg-icon";
export function RpgConfirmation({
	dialog,
	busy,
	item,
	mode,
	state,
	error,
	setSelected,
	perform,
	onClose,
}: {
	dialog: Ref<HTMLDialogElement>;
	busy: string;
	item: RpgState["inventory"][number] | undefined;
	mode: string;
	state: { bits: number } | null;
	error: string;
	setSelected: (id: string | null) => void;
	perform: (action: "buy" | "arm", id: string) => Promise<void>;
	onClose: () => void;
}) {
	return (
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
								onClose();
							}}
							type="button"
						>
							Cancelar
						</button>
					</div>
				</>
			)}
		</dialog>
	);
}
