import Image from "next/image";
import { createElement, useId } from "react";
import { Icon } from "~/app/_components/icon";
import { LessonDiagram } from "./lesson-diagram";
import type { ContentBlock, StageContent } from "./model";
import pedagogy from "./pedagogy.module.css";
import styles from "./stage.module.css";

function Formula({ label, terms }: Extract<ContentBlock, { type: "formula" }>) {
	const operators = /([=≈≤≥±+−·⇔⇒])/u;
	const tokens = (text: string) =>
		text
			.split(operators)
			.map((part) => part.trim())
			.filter(Boolean)
			.map((part) => {
				if (operators.test(part)) return createElement("mo", null, part);
				if (/^\d+(?:[.,]\d+)?$/u.test(part))
					return createElement("mn", null, part);
				return createElement("mtext", null, part);
			});
	const group = (text: string) => createElement("mrow", null, ...tokens(text));
	return createElement(
		"math",
		{ "aria-label": label, className: pedagogy.formula, display: "block" },
		createElement(
			"mrow",
			null,
			...terms.flatMap((term) => {
				switch (term.forma) {
					case "texto":
						return tokens(term.valor);
					case "fracao":
						return createElement(
							"mfrac",
							null,
							group(term.numerador),
							group(term.denominador),
						);
					case "raiz":
						return createElement("msqrt", null, group(term.radicando));
					case "potencia":
						return createElement(
							"msup",
							null,
							group(term.base),
							group(term.expoente),
						);
					default:
						return null;
				}
			}),
		),
	);
}

export function ContentBlocks({ blocks }: { blocks: readonly ContentBlock[] }) {
	return (
		<div className={styles.blocks}>
			{blocks.map((block) => {
				switch (block.type) {
					case "heading":
						return <h3 key={block.id}>{block.text}</h3>;
					case "text":
						return <p key={block.id}>{block.text}</p>;
					case "code":
						return (
							<figure className={styles.code} key={block.id}>
								{block.language && <figcaption>{block.language}</figcaption>}
								<pre>
									<code>{block.text}</code>
								</pre>
							</figure>
						);
					case "image":
						return (
							<figure key={block.id}>
								<Image
									alt={block.alt}
									height={block.height}
									src={block.src}
									unoptimized
									width={block.width}
								/>
								{block.caption && <figcaption>{block.caption}</figcaption>}
							</figure>
						);
					case "diagram":
						return (
							<LessonDiagram
								caption={block.caption}
								data={block.data}
								key={block.id}
							/>
						);
					case "formula":
						return <Formula {...block} key={block.id} />;
					case "resource":
						return (
							<div className={pedagogy.resource} key={block.id}>
								<Icon name="book" />
								<div>
									<a href={block.url}>{block.title}</a>
									<p>Material externo · {block.source}</p>
								</div>
							</div>
						);
					default:
						return null;
				}
			})}
		</div>
	);
}

export function ContentPanel({ content }: { content: StageContent }) {
	const empty = content.blocks.length === 0 && !content.summary;
	const id = useId();
	const category =
		content.category === "diagrama"
			? "Exploração visual"
			: content.category === "material"
				? "Material de estudo"
				: "Explicação";

	return (
		<section aria-labelledby={id} className={styles.panel}>
			<h2 id={id}>
				{content.title ?? (content.category ? category : "Conteúdo")}
			</h2>
			{empty ? (
				<>
					<p className={styles.panelHint}>
						Organize os blocos na ordem de leitura da etapa.
					</p>
					<div className={styles.contentPreview}>
						<div>
							<strong>Título de seção</strong>
							<p>Espaço para o texto e a explicação.</p>
						</div>
						<div className={styles.mediaSlot}>
							<svg
								aria-hidden="true"
								fill="none"
								height="26"
								stroke="currentColor"
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="1.75"
								viewBox="0 0 24 24"
								width="26"
							>
								<rect height="16" rx="2" width="18" x="3" y="4" />
								<path d="m3 16 5-5 4 4 3-3 6 6" />
								<circle cx="15" cy="8" r="1" />
							</svg>
							Imagem com legenda opcional
						</div>
					</div>
				</>
			) : (
				<ContentBlocks blocks={content.blocks} />
			)}
			{(empty || content.summary) && (
				<section className={styles.summary}>
					<h3>Resumo</h3>
					<p>{content.summary ?? "Espaço para reunir os pontos principais."}</p>
				</section>
			)}
		</section>
	);
}
