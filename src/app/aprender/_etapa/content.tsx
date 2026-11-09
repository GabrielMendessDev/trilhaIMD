import Image from "next/image";
import type { ContentBlock, StageContent } from "./model";
import styles from "./stage.module.css";

export function ContentBlocks({ blocks }: { blocks: readonly ContentBlock[] }) {
	return (
		<div className={styles.blocks}>
			{blocks.map((block) => {
				switch (block.type) {
					case "heading":
						return <h3 key={block.id}>{block.text}</h3>;
					case "text":
						return <p key={block.id}>{block.text}</p>;
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
					default:
						return null;
				}
			})}
		</div>
	);
}

export function ContentPanel({ content }: { content: StageContent }) {
	const empty = content.blocks.length === 0 && !content.summary;

	return (
		<section aria-labelledby="stage-content" className={styles.panel}>
			<h2 id="stage-content">Conteúdo</h2>
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
