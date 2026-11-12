"use client";

import { useState } from "react";
import { ActionButton } from "~/app/_components/action-button";
import type { ContentBlock } from "./model";
import styles from "./pedagogy.module.css";

type Diagram = Extract<ContentBlock, { type: "diagram" }>;
type Inclusion = Extract<Diagram["data"], { modelo: "inclusao" }>;

function InclusionDiagram({ data }: { data: Inclusion }) {
	const [active, setActive] = useState(0);
	const selected = data.camadas[active];
	const layers = [...data.camadas].reverse();
	const realDepth = layers.findIndex(({ simbolo }) => simbolo === "ℝ");
	const rationalDepth = layers.findIndex(({ simbolo }) => simbolo === "ℚ");
	const rightEdge = (depth: number) => 346 - depth * 52;
	return (
		<>
			<fieldset className={styles.inclusion}>
				<legend className="sr-only">
					Explore os conjuntos, do menor ao maior
				</legend>
				{data.camadas.map((layer, index) => (
					<ActionButton
						aria-label={layer.nome}
						aria-pressed={index === active}
						className="diagram-choice"
						key={layer.simbolo}
						onClick={() => setActive(index)}
						type="button"
					>
						{layer.simbolo}
					</ActionButton>
				))}
			</fieldset>
			<svg
				aria-label={data.observacao}
				className={styles.nestedSets}
				role="img"
				viewBox="0 0 360 166"
			>
				{layers.map((layer, depth) => {
					const left = 12 + depth * 14;
					const top = 8 + depth * 24;
					return (
						<g
							data-selected={selected?.simbolo === layer.simbolo}
							key={layer.simbolo}
						>
							<rect
								height={150 - depth * 27}
								rx="7"
								width={rightEdge(depth) - left}
								x={left}
								y={top}
							/>
							<text x={left + 17} y={top + 18}>
								{layer.simbolo}
							</text>
						</g>
					);
				})}
				{realDepth >= 0 && rationalDepth === realDepth + 1 && (
					<text
						className={styles.irrationals}
						x={rightEdge(realDepth) - 26}
						y={53 + realDepth * 24}
					>
						ℝ ∖ ℚ
					</text>
				)}
			</svg>
			<div aria-live="polite" className={styles.inclusionDetail}>
				<strong>{selected?.nome}</strong>
				<p>Exemplo · {selected?.exemplo}</p>
				<p>Fora desse conjunto · {selected?.fora}</p>
			</div>
			<p>{data.observacao}</p>
		</>
	);
}

export function LessonDiagram({ data, caption }: Omit<Diagram, "id" | "type">) {
	return (
		<figure className={`${styles.diagram} learning-diagram`}>
			{data.modelo === "inclusao" && <InclusionDiagram data={data} />}
			{data.modelo === "venn" && (
				<svg
					aria-label={`Diagrama de Venn. Apenas A: ${data.esquerda}. Em ambos: ${data.centro}. Apenas B: ${data.direita}.`}
					role="img"
					viewBox="0 0 340 175"
				>
					<circle className={styles.vennA} cx="121" cy="85" r="68" />
					<circle className={styles.vennB} cx="219" cy="85" r="68" />
					<text x="97" y="52">
						A
					</text>
					<text x="243" y="52">
						B
					</text>
					<text x="100" y="92">
						{data.esquerda}
					</text>
					<text x="170" y="92">
						{data.centro}
					</text>
					<text x="240" y="92">
						{data.direita}
					</text>
				</svg>
			)}
			{data.modelo === "reta" && (
				<svg
					aria-label={`Reta numérica da esquerda para a direita: ${data.marcas.join(", ")}`}
					role="img"
					viewBox="0 0 360 82"
				>
					<path d="M12 32h336m-7-7 7 7-7 7M19 25l-7 7 7 7" />
					{data.marcas.map((mark, index) => {
						const x = 40 + (index * 280) / (data.marcas.length - 1);
						return (
							<g key={`${mark}-${x}`}>
								<circle
									className={data.destaque === index ? styles.dot : undefined}
									cx={x}
									cy="32"
									r={data.destaque === index ? 6 : 3}
								/>
								<text x={x} y="63">
									{mark}
								</text>
							</g>
						);
					})}
				</svg>
			)}
			{data.modelo === "quadro" && (
				<dl className={styles.table}>
					{data.linhas.map((row) => (
						<div key={row.simbolo}>
							<dt>
								<span>{row.simbolo}</span> {row.leitura}
							</dt>
							<dd>{row.exemplo}</dd>
						</div>
					))}
				</dl>
			)}
			<figcaption>{caption}</figcaption>
		</figure>
	);
}
