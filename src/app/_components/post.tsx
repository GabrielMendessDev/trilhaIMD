"use client";

import { useRef, useState } from "react";
import { api } from "~/trpc/react";
import { ActionButton } from "./action-button";
import { useFeedback } from "./feedback";

export function LatestPost() {
	const [latestPost] = api.post.getLatest.useSuspenseQuery();

	const utils = api.useUtils();
	const { notify } = useFeedback();
	const sending = useRef(false);
	const [name, setName] = useState("");
	const createPost = api.post.create.useMutation({
		onSuccess: async () => {
			await utils.post.invalidate();
			setName("");
			notify({ id: "post", kind: "success", message: "Publicação salva." });
		},
		onError: () =>
			notify({
				id: "post",
				kind: "error",
				message: "Não foi possível salvar a publicação. Tente novamente.",
			}),
		onSettled: () => {
			sending.current = false;
		},
	});

	return (
		<div className="w-full max-w-xs">
			{latestPost ? (
				<p className="truncate">Your most recent post: {latestPost.name}</p>
			) : (
				<p>You have no posts yet.</p>
			)}
			<form
				className="flex flex-col gap-2"
				onSubmit={(e) => {
					e.preventDefault();
					if (sending.current) return;
					sending.current = true;
					createPost.mutate({ name });
				}}
			>
				<input
					className="w-full rounded-full bg-white/10 px-4 py-2 text-white"
					onChange={(e) => setName(e.target.value)}
					placeholder="Title"
					type="text"
					value={name}
				/>
				<ActionButton
					busy={createPost.isPending}
					busyLabel="Salvando…"
					className="rounded-full bg-white/10 px-10 py-3 font-semibold transition hover:bg-white/20"
					disabled={createPost.isPending}
					type="submit"
				>
					Salvar
				</ActionButton>
			</form>
		</div>
	);
}
