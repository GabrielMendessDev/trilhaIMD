"use client";

import { usePathname } from "next/navigation";
import { useFeedback } from "./_components/feedback";
import { RouteLoading } from "./_components/route-loading";

export default function Loading() {
	const pathname = usePathname();
	const { navigation } = useFeedback();
	return <RouteLoading fallback target={navigation?.target ?? pathname} />;
}
