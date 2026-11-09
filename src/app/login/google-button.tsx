"use client";

import { useFormStatus } from "react-dom";

export function GoogleButton({ disabled }: { disabled: boolean }) {
	const { pending } = useFormStatus();

	return (
		<button
			aria-busy={pending}
			className="flex min-h-12 w-full cursor-pointer items-center justify-center gap-3 rounded-xl border border-[#747775] bg-white px-4 py-2 font-medium text-[#1f1f1f] text-sm hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
			disabled={disabled || pending}
			type="submit"
		>
			<svg aria-hidden="true" className="size-5 shrink-0" viewBox="0 0 48 48">
				<path
					d="M43.61 24.46c0-1.36-.12-2.66-.35-3.93H24v7.43h11a9.4 9.4 0 0 1-4.08 6.17v5.14h6.62c3.87-3.57 6.07-8.83 6.07-14.81Z"
					fill="#4285F4"
				/>
				<path
					d="M24 44c5.5 0 10.12-1.82 13.54-4.73l-6.62-5.14A12.37 12.37 0 0 1 12.5 27.7H5.68V33A20 20 0 0 0 24 44Z"
					fill="#34A853"
				/>
				<path
					d="M12.5 27.7a12 12 0 0 1 0-7.4V15H5.68a20 20 0 0 0 0 18l6.82-5.3Z"
					fill="#FBBC05"
				/>
				<path
					d="M24 11.9c3 0 5.69 1.03 7.81 3.06l5.86-5.86A19.17 19.17 0 0 0 24 4 20 20 0 0 0 5.68 15l6.82 5.3A12 12 0 0 1 24 11.9Z"
					fill="#EA4335"
				/>
			</svg>
			{pending ? "Abrindo o Google…" : "Entrar com o Google"}
		</button>
	);
}
