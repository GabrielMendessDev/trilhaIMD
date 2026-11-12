export type AnswerAssessment = {
	correct: boolean;
	round: 1 | 2;
	selection: string[];
	finished: boolean;
	progress: number;
	eventId: string;
	chosen: { id: string; label?: string; value: string }[];
	solution: { id: string; label?: string; value: string }[];
	explanation?: string;
	hint?: string;
	lives?: number;
	failed?: boolean;
};
