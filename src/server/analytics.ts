import "server-only";

import type { NextRequest } from "next/server";
import { z } from "zod";
import {
	analyticsPreference,
	devices,
	fatigueBands,
	recallBands,
	screens,
	sessionIdleMs,
	viewports,
} from "~/domain/analytics";
import { dayAt, dayIndex, studyDay } from "~/domain/rpg";
import { db } from "./db";

export const analyticsEnabled = () => process.env.ANALYTICS_ENABLED !== "false";

export function acceptsAnalytics(request: NextRequest) {
	return (
		analyticsEnabled() &&
		request.cookies.get(analyticsPreference)?.value !== "off" &&
		request.headers.get("sec-gpc") !== "1"
	);
}

export const analyticsEvent = z.discriminatedUnion("type", [
	z.object({
		type: z.literal("session"),
		id: z.string().uuid(),
		sequence: z.number().int().min(1).max(1_000_000),
		activeMs: z.number().int().min(0).max(86_400_000),
		screen: z.enum(Object.keys(screens) as [keyof typeof screens]),
		device: z.enum(devices),
		viewport: z.enum(viewports),
	}),
	z.object({ type: z.literal("forget"), id: z.string().uuid() }),
	z.object({
		type: z.literal("support"),
		label: z.enum(["Relembrar o conceito", "Exemplo resolvido"]),
	}),
]);

async function addDaily(kind: string, label: string, total = 0) {
	await db.$executeRaw`
		INSERT INTO "AnalyticsDaily" (day, kind, label, count, total)
		VALUES (${studyDay(new Date())}, ${kind}, ${label}, 1, ${total})
		ON CONFLICT (day, kind, label) DO UPDATE
		SET count = "AnalyticsDaily".count + 1, total = "AnalyticsDaily".total + EXCLUDED.total
	`;
}

let nextCleanup = 0;

export async function pruneAnalytics(now = new Date()) {
	if (now.valueOf() < nextCleanup) return;
	nextCleanup = now.valueOf() + 60 * 60_000;
	try {
		await Promise.all([
			db.$executeRaw`DELETE FROM "AnalyticsSession" WHERE "startedAt" < ${new Date(now.valueOf() - 32 * 86_400_000)}`,
			db.$executeRaw`DELETE FROM "AnalyticsDaily" WHERE day < ${dayAt(dayIndex(studyDay(now)) - 89)}`,
		]);
	} catch (error) {
		nextCleanup = 0;
		throw error;
	}
}

export async function recordAnalyticsEvent(
	event: z.infer<typeof analyticsEvent>,
) {
	if (event.type === "support") {
		await addDaily("support", event.label);
		return;
	}
	if (event.type === "forget") {
		await db.$executeRaw`DELETE FROM "AnalyticsSession" WHERE id = ${event.id}::uuid`;
		return;
	}

	await db.$transaction(async (tx) => {
		// A sessão só avança com uma amostra nova, inclusive se um beacon chegar atrasado.
		await tx.$queryRaw`SELECT 1 FROM pg_advisory_xact_lock(hashtext(${event.id}))`;
		const [prior] = await tx.$queryRaw<
			{ sequence: number; screen: string; activeMs: number; lastSeen: Date }[]
		>`SELECT sequence, screen, "activeMs", "lastSeen" FROM "AnalyticsSession" WHERE id = ${event.id}::uuid`;
		const now = new Date();
		if (
			prior &&
			(prior.sequence >= event.sequence ||
				now.valueOf() - prior.lastSeen.valueOf() >= sessionIdleMs)
		)
			return;
		const activeMs = prior
			? Math.max(
					prior.activeMs,
					Math.min(
						event.activeMs,
						prior.activeMs + now.valueOf() - prior.lastSeen.valueOf() + 1000,
					),
				)
			: 0;
		await tx.$executeRaw`
			INSERT INTO "AnalyticsSession" (id, "lastSeen", sequence, "activeMs", screen, device, viewport)
			VALUES (${event.id}::uuid, ${now}, ${event.sequence}, ${activeMs}, ${event.screen}, ${event.device}, ${event.viewport})
			ON CONFLICT (id) DO UPDATE SET "lastSeen" = EXCLUDED."lastSeen", sequence = EXCLUDED.sequence,
				"activeMs" = EXCLUDED."activeMs", screen = EXCLUDED.screen
		`;
		if (prior?.screen === event.screen) return;
		await tx.$executeRaw`
			INSERT INTO "AnalyticsDaily" (day, kind, label, count)
			VALUES (${studyDay(now)}, 'screen', ${event.screen}, 1)
			ON CONFLICT (day, kind, label) DO UPDATE SET count = "AnalyticsDaily".count + 1
		`;
	});
}

export type AnalyticsAnswer = {
	pointId: number;
	entryKey: string;
	run: number;
	round: 1 | 2;
	correct: boolean;
	replaced: boolean;
	assisted: boolean;
};

export async function recordAnswerMetrics(
	answer: AnalyticsAnswer,
	userId: string,
	responseMs: number | undefined,
	activeMs: number | undefined,
) {
	if (responseMs === undefined && activeMs === undefined) return;
	const tasks: Promise<void>[] = [];
	if (responseMs !== undefined && !answer.replaced) {
		tasks.push(addDaily("response", answer.entryKey, responseMs));
	}
	if (answer.round === 1 && !answer.assisted && activeMs !== undefined) {
		const index = [5, 15, 30].filter(
			(minutes) => activeMs >= minutes * 60_000,
		).length;
		const band = fatigueBands[index];
		if (band) tasks.push(addDaily("fatigue", band, Number(answer.correct)));
	}
	if (answer.round === 1 && answer.run === 2 && !answer.assisted) {
		tasks.push(recordRecall(userId, answer));
	}
	await Promise.all(tasks);
}

async function recordRecall(userId: string, answer: AnalyticsAnswer) {
	const [prior] = await db.$queryRaw<{ createdAt: Date }[]>`
		SELECT "createdAt" FROM "RpgEvent"
		WHERE "userId" = ${userId}
			AND key = ${`answer:${answer.pointId}:${answer.entryKey}:1`}
			AND payload->>'correct' = 'true' AND payload->>'assisted' = 'false'
	`;
	if (!prior) return;
	const elapsedDays = Math.floor(
		(Date.now() - prior.createdAt.valueOf()) / 86_400_000,
	);
	if (elapsedDays < 1) return;
	const band =
		recallBands[[3, 7, 14, 30].filter((days) => elapsedDays >= days).length];
	if (band) await addDaily("recall", band, Number(answer.correct));
}
