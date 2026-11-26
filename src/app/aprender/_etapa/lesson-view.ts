import type { lessonScore } from "~/server/lesson-progress";
import type { AnswerAssessment } from "./answer-model";
import type { StageModel } from "./model";

export type LessonScreen = {
	key: string;
	title: string;
	graded: boolean;
	model: StageModel;
};

export type LessonEffects = {
	hint?: string;
	example?: string;
	removed: string[];
	variant: string;
	model?: StageModel;
};

export type LessonBagView = {
	effects: LessonEffects;
	reasons: Record<string, string | null>;
};

export type LessonCursor =
	| {
			kind: "step";
			key: string;
			round: 1 | 2;
			run: number;
			lives: number;
			progress: number;
			reviewPosition: number;
			reviewTotal: number;
			starting: boolean;
			bag?: LessonBagView;
	  }
	| { kind: "lost"; run: number }
	| {
			kind: "finished";
			eventId: string;
			xp: number;
			bits: number;
			skipped: number;
			score: ReturnType<typeof lessonScore>;
			awards: { id: string; name: string }[];
	  };

export type RestoredAnswer = {
	key: string;
	assessment: AnswerAssessment;
	effects?: LessonEffects;
};
