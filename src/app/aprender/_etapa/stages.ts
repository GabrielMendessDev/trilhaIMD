import type { TrailId } from "../trails";
import type { StageModel } from "./model";

export const stagesByTrail: Partial<
	Record<TrailId, Partial<Record<number, StageModel>>>
> = {};
