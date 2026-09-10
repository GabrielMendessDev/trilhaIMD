import Link from "next/link";
import type { ReactNode } from "react";

type IconName =
	| "learn"
	| "practice"
	| "ranking"
	| "quests"
	| "shop"
	| "profile"
	| "fire"
	| "gem"
	| "heart"
	| "chevron"
	| "lock"
	| "check"
	| "star"
	| "bolt"
	| "shield";

const paths: Record<IconName, ReactNode> = {
	learn: (
		<>
			<path d="m3 10 9-7 9 7v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
			<path d="M9 21v-6h6v6" />
		</>
	),
	practice: (
		<>
			<circle cx="12" cy="12" r="8" />
			<path d="m9 12 2 2 4-5" />
		</>
	),
	ranking: (
		<path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.8-5.4 2.8 1-6.1L3.2 9.4l6.1-.9z" />
	),
	quests: (
		<>
			<path d="M8 3h8v3h3v15H5V6h3z" />
			<path d="m8 13 2.4 2.4L16 10" />
		</>
	),
	shop: (
		<>
			<path d="M4 9h16l-1 12H5z" />
			<path d="M8 9a4 4 0 0 1 8 0" />
		</>
	),
	profile: (
		<>
			<circle cx="12" cy="8" r="4" />
			<path d="M4 21c.8-4 3.4-6 8-6s7.2 2 8 6" />
		</>
	),
	fire: (
		<path d="M12 22c4 0 7-2.7 7-6.6 0-3.1-2-5-4.2-7.2.2 2.2-1 3.4-2.1 4.2C12.4 8.5 10 6.2 8 3c-1.3 2.3-3 4.8-3 8.2C5 17.6 8 22 12 22Z" />
	),
	gem: <path d="m12 3 8 7-8 11L4 10z" />,
	heart: (
		<path d="M20.8 8.6c0 5.6-8.8 10.9-8.8 10.9S3.2 14.2 3.2 8.6A4.7 4.7 0 0 1 12 6.2a4.7 4.7 0 0 1 8.8 2.4Z" />
	),
	chevron: <path d="m7 10 5 5 5-5" />,
	lock: (
		<>
			<rect height="11" rx="2" width="14" x="5" y="10" />
			<path d="M8 10V7a4 4 0 0 1 8 0v3" />
		</>
	),
	check: <path d="m5 12 4.2 4.2L19 6.5" />,
	star: (
		<path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.8-5.4 2.8 1-6.1-4.4-4.3 6.1-.9z" />
	),
	bolt: <path d="m13 2-8 12h6l-1 8 8-12h-6z" />,
	shield: <path d="M12 3 5 6v5c0 4.5 3 8 7 10 4-2 7-5.5 7-10V6z" />,
};

export function Icon({
	name,
	className = "",
}: {
	name: IconName;
	className?: string;
}) {
	return (
		<svg
			aria-hidden="true"
			className={className}
			fill="none"
			stroke="currentColor"
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth="2.2"
			viewBox="0 0 24 24"
		>
			{paths[name]}
		</svg>
	);
}
const nav = [
	["/aprender", "Aprender", "learn"],
	["/praticar", "Praticar", "practice"],
	["/ranking", "Ranking", "ranking"],
	["/missoes", "Missões", "quests"],
	["/loja", "Loja", "shop"],
	["/perfil", "Perfil", "profile"],
] as const;

export function DashboardLayout({
	children,
	active,
}: {
	children: ReactNode;
	active: string;
}) {
	return (
		<div className="min-h-screen bg-[#fbfbfd]">
			<aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-slate-100 border-r-2 bg-white px-5 py-7 lg:flex">
				<Link
					className="mb-8 flex items-center gap-2.5 px-2 font-black text-[23px] text-violet-600 tracking-[-.8px]"
					href="/aprender"
				>
					<span className="grid size-9 place-items-center rounded-xl bg-violet-600 text-lg text-white shadow-[0_3px_0_#4c36be]">
						T
					</span>
					trilha <strong className="text-slate-800">IMD</strong>
				</Link>
				<nav className="grid gap-1.5">
					{nav.map(([href, label, icon]) => (
						<Link
							className={`flex h-[52px] items-center gap-3.5 rounded-xl px-3.5 font-extrabold text-[15px] transition ${active === href ? "border-2 border-violet-200 bg-violet-50 text-violet-600" : "border-2 border-transparent hover:bg-slate-50"}`}
							href={href}
							key={href}
						>
							<Icon className="size-6" name={icon} />
							{label}
						</Link>
					))}
				</nav>
				<Link
					className="mt-auto flex items-center gap-3 rounded-xl px-2 py-3 hover:bg-slate-50"
					href="/perfil"
				>
					<div className="grid size-11 place-items-center rounded-full bg-violet-500 font-black text-white">
						E
					</div>
					<span className="grid">
						<strong className="text-sm">Estudante IMD</strong>
						<small className="text-slate-400">Nível 1</small>
					</span>
				</Link>
			</aside>
			<header className="sticky top-0 z-20 flex h-16 items-center justify-between border-slate-100 border-b-2 bg-white/95 px-5 backdrop-blur lg:hidden">
				<Link className="font-black text-violet-600 text-xl" href="/aprender">
					trilha <span className="text-slate-800">IMD</span>
				</Link>
				<Status compact />
			</header>
			<main className="pb-24 lg:ml-64 lg:pb-8">{children}</main>
			<nav className="fixed inset-x-0 bottom-0 z-30 flex h-[72px] justify-around border-slate-200 border-t bg-white px-1 lg:hidden">
				{nav
					.filter(([href]) => href !== "/loja")
					.map(([href, label, icon]) => (
						<Link
							className={`flex min-w-14 flex-col items-center justify-center gap-1 font-extrabold text-[10px] ${active === href ? "text-violet-600" : "text-slate-400"}`}
							href={href}
							key={href}
						>
							<Icon className="size-5" name={icon} />
							{label}
						</Link>
					))}
			</nav>
		</div>
	);
}
export function Status({ compact = false }: { compact?: boolean }) {
	return (
		<div className={`flex items-center ${compact ? "gap-3 text-sm" : "gap-4"}`}>
			<span className="flex items-center gap-1 font-black text-orange-500">
				<Icon className="size-5 fill-orange-400" name="fire" />0
			</span>
			<span className="flex items-center gap-1 font-black text-sky-500">
				<Icon className="size-5 fill-sky-400" name="gem" />
				120
			</span>
			<span className="flex items-center gap-1 font-black text-rose-500">
				<Icon className="size-5 fill-rose-400" name="heart" />5
			</span>
		</div>
	);
}
export function PageHeading({
	title,
	description,
}: {
	title: string;
	description: string;
}) {
	return (
		<header className="mb-8">
			<h1 className="font-black text-3xl text-slate-800 tracking-tight sm:text-4xl">
				{title}
			</h1>
			<p className="mt-2 max-w-2xl font-semibold text-[16px] text-slate-500 leading-relaxed">
				{description}
			</p>
		</header>
	);
}
export function Progress({
	value,
	color = "bg-violet-500",
}: {
	value: number;
	color?: string;
}) {
	return (
		<div className="h-3 overflow-hidden rounded-full bg-slate-100">
			<span
				className={`block h-full rounded-full ${color}`}
				style={{ width: `${value}%` }}
			/>
		</div>
	);
}
