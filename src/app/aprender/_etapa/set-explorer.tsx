"use client";
import { useState } from "react";
export function SetExplorer() {
	const [mode, setMode] = useState<"element" | "subset">("element"),
		[tag, setTag] = useState("web");
	const belongs = tag !== "jogos";
	return (
		<figure className="concept-explorer learning-diagram">
			<div className="concept-explorer-controls">
				<button
					aria-pressed={mode === "element"}
					onClick={() => setMode("element")}
					type="button"
				>
					Um elemento
				</button>
				<button
					aria-pressed={mode === "subset"}
					onClick={() => setMode("subset")}
					type="button"
				>
					Um subconjunto
				</button>
			</div>
			<svg
				aria-label={
					mode === "element"
						? "Conjunto A contém web, dados e redes. Jogos fica fora de A."
						: "B contém web e dados. B está contido em A, que também contém redes."
				}
				role="img"
				viewBox="0 0 420 200"
			>
				<rect
					className="set-boundary"
					height="167"
					rx="54"
					width="292"
					x="18"
					y="15"
				/>
				<text className="set-label" x="43" y="48">
					A
				</text>
				{mode === "subset" && (
					<>
						<rect
							className="set-inner"
							height="103"
							rx="28"
							width="150"
							x="65"
							y="55"
						/>
						<text className="set-label" x="79" y="80">
							B
						</text>
					</>
				)}
				{[
					{ name: "web", x: 122, y: 99 },
					{ name: "dados", x: 144, y: 137 },
					{ name: "redes", x: 256, y: 100 },
					{ name: "jogos", x: 362, y: 100 },
				]
					.filter((item) => mode === "element" || item.name !== "jogos")
					.map((item) => (
						<g
							data-active={mode === "element" && item.name === tag}
							key={item.name}
						>
							<rect
								height="30"
								rx="10"
								width="70"
								x={item.x - 35}
								y={item.y - 17}
							/>
							<text textAnchor="middle" x={item.x} y={item.y + 3}>
								{item.name}
							</text>
						</g>
					))}
			</svg>
			{mode === "element" && (
				<fieldset
					aria-label="Escolha um elemento para explorar"
					className="concept-tag-picker"
				>
					{["web", "dados", "redes", "jogos"].map((value) => (
						<button
							aria-pressed={value === tag}
							key={value}
							onClick={() => setTag(value)}
							type="button"
						>
							{value}
						</button>
					))}
				</fieldset>
			)}
			<figcaption aria-live="polite">
				<strong>
					{mode === "element" ? `${tag} ${belongs ? "∈" : "∉"} A` : "B ⊆ A"}
				</strong>
				<p>
					{mode === "element"
						? `Lemos: “${tag} ${belongs ? "pertence" : "não pertence"} a A”. Escolha outro elemento e compare.`
						: "Todos os elementos de B também estão em A. Por isso, B é um subconjunto de A."}
				</p>
				<small>
					∈ relaciona um elemento a um conjunto. ⊆ compara dois conjuntos.
				</small>
			</figcaption>
		</figure>
	);
}
