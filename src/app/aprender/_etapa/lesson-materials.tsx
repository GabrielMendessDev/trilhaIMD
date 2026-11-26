import Link from "~/app/_components/action-link";
import { ContentPanel } from "./content";
import { LessonTransition } from "./lesson-motion";
import { MaterialCompletion } from "./material-completion";
import type { StageContent } from "./model";
import styles from "./pedagogy.module.css";
export type Material = { key: string; title: string; content: StageContent };
export const materialHref = (base: string, key: string) =>
	`${base}?${new URLSearchParams({ material: key })}`;
export function LessonMaterials({
	base,
	items,
	open = false,
	onOpen,
}: {
	base: string;
	items: readonly Pick<Material, "key" | "title">[];
	open?: boolean;
	onOpen?: (key: string) => void;
}) {
	if (!items.length) return null;
	return (
		<details className={styles.materials} open={open || undefined}>
			<summary>
				Materiais de estudo <span>{items.length}</span>
			</summary>
			<ul>
				{items.map(({ key, title }) => (
					<li key={key}>
						<Link
							href={materialHref(base, key)}
							onNavigate={
								onOpen
									? (event) => {
											event.preventDefault();
											onOpen(key);
										}
									: undefined
							}
							prefetch={false}
						>
							{title}
						</Link>
					</li>
				))}
			</ul>
		</details>
	);
}

export function LessonMaterial({
	material,
	base,
	signedIn,
	pointId,
	setInventory,
	returnToLesson,
	materials,
	openMaterial,
}: {
	material: Material;
	base: string;
	signedIn: boolean;
	pointId: number;
	setInventory: (stock: Record<string, number>) => void;
	returnToLesson: () => void;
	materials: Material[];
	openMaterial: (key: string) => void;
}) {
	return (
		<LessonTransition
			key={material.key}
			kind="explanation"
			screenKey={`material-${material.key}`}
		>
			<div className="mt-4 space-y-4">
				<ContentPanel content={material.content} />
				{signedIn && (
					<MaterialCompletion
						entryKey={material.key}
						onInventory={setInventory}
						pointId={pointId}
					/>
				)}
				<button className="ui-button" onClick={returnToLesson} type="button">
					Voltar à lição
				</button>
				<LessonMaterials
					base={base}
					items={materials}
					onOpen={openMaterial}
					open
				/>
			</div>
		</LessonTransition>
	);
}
