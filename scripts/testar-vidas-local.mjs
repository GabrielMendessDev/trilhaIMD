// Ambiente descartável: não altera .env nem o banco configurado pelo estudante.
import { execFile, spawn } from "node:child_process";
import { mkdir, mkdtemp, open, readdir, rm, writeFile } from "node:fs/promises";
import { createServer } from "node:net";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { setTimeout as delay } from "node:timers/promises";
import { promisify } from "node:util";

const exec = promisify(execFile);
const args = process.argv.slice(2);
if (
	args.length > 1 ||
	args.some((arg) => !["--read-models", "--browser"].includes(arg))
)
	throw new Error(
		"Use sem argumentos, --read-models ou --browser para a verificação focada.",
	);
const pg = process.env.TRILBIT_PG_BIN ?? "C:/Program Files/PostgreSQL/16/bin";
const temporary = await mkdtemp(join(tmpdir(), "trilbit-lives-"));
const dbPath = join(temporary, "data");
const freePort = () =>
	new Promise((resolve) => {
		const s = createServer();
		s.listen(0, "127.0.0.1", () => {
			const p = s.address().port;
			s.close(() => resolve(p));
		});
	});
const dbPort = await freePort(),
	appPort = await freePort();
const origin = `http://127.0.0.1:${appPort}`;
const artifacts = resolve("tests/artifacts/optimization");
const env = {
	...process.env,
	DATABASE_URL: `postgresql://postgres@127.0.0.1:${dbPort}/postgres`,
	TRILBIT_TEST_URL: origin,
	TRILBIT_TEST_DATABASE_URL: `postgresql://postgres@127.0.0.1:${dbPort}/postgres`,
	TRILBIT_DISPOSABLE_TEST: "1",
	TRILBIT_SCREENSHOTS: artifacts,
	AUTH_URL: origin,
	AUTH_TRUST_HOST: "true",
	AUTH_SECRET: "trilbit-disposable-local-test-secret",
	TRILBIT_NEXT_DIST_DIR: ".next-lives-check",
	NEXT_TELEMETRY_DISABLED: "1",
};
let server, log;
const run = async (args) => {
	const result = await exec(process.execPath, args, {
		env,
		windowsHide: true,
		maxBuffer: 8e6,
		timeout: 240000,
	});
	if (result.stdout) process.stdout.write(result.stdout);
};
try {
	await exec(
		join(pg, "initdb.exe"),
		[
			"-D",
			dbPath,
			"-U",
			"postgres",
			"-A",
			"trust",
			"--no-locale",
			"-E",
			"UTF8",
		],
		{ windowsHide: true, timeout: 60000 },
	);
	await exec(
		join(pg, "pg_ctl.exe"),
		[
			"-D",
			dbPath,
			"-l",
			join(temporary, "postgres.log"),
			"-o",
			`-p ${dbPort} -h 127.0.0.1`,
			"-w",
			"start",
		],
		{ windowsHide: true, timeout: 60000 },
	);
	console.log("PostgreSQL descartável iniciado.");
	// Executa as mesmas migrações SQL num banco novo; dispensa o processo schema-engine.
	const migrations = (
		await readdir("prisma/migrations", { withFileTypes: true })
	)
		.filter((d) => d.isDirectory())
		.map((d) => d.name)
		.sort();
	for (const name of migrations)
		await exec(
			join(pg, "psql.exe"),
			[
				"-h",
				"127.0.0.1",
				"-p",
				String(dbPort),
				"-U",
				"postgres",
				"-d",
				"postgres",
				"-v",
				"ON_ERROR_STOP=1",
				"-f",
				resolve("prisma/migrations", name, "migration.sql"),
			],
			{ windowsHide: true, timeout: 30000 },
		);
	console.log(
		`Aplicadas ${migrations.length} migrações SQL no banco descartável.`,
	);
	await run(["tests/legacy-elementar-fixture.mjs", "preparar"]);
	await run(["scripts/publicar-elementar.mjs", "--importar"]);
	await run(["tests/legacy-elementar-fixture.mjs", "conferir"]);
	await run(["scripts/publicar-elementar.mjs", "--importar"]);
	await mkdir(artifacts, { recursive: true });
	await writeFile(
		join(artifacts, "test-environment.json"),
		JSON.stringify({ origin, database: env.DATABASE_URL }),
	);
	log = await open(join(artifacts, "server.log"), "w");
	server = spawn(
		process.execPath,
		[
			"node_modules/next/dist/bin/next",
			"dev",
			"--turbo",
			"--hostname",
			"127.0.0.1",
			"--port",
			String(appPort),
		],
		{ env, windowsHide: true, stdio: ["ignore", log.fd, log.fd] },
	);
	let ready = false;
	for (let i = 0; i < 80; i++) {
		if (server.exitCode !== null)
			throw new Error("Servidor de teste encerrou antes de ficar pronto.");
		try {
			const r = await fetch(origin + "/api/auth/session");
			if (r.ok) {
				ready = true;
				break;
			}
		} catch {}
		await delay(1000);
	}
	if (!ready) throw new Error("Servidor de teste não respondeu.");
	console.log(`Servidor descartável disponível em ${origin}.`);
	if (!args.length) await run(["--test", "tests/vidas-http.mjs"]);
	if (!args.includes("--browser"))
		await run(["--test", "tests/read-models-http.mjs"]);
	await run(["--test", "tests/elementar-browser.mjs"]);
} finally {
	if (server?.pid)
		await exec("taskkill", ["/pid", String(server.pid), "/t", "/f"], {
			windowsHide: true,
		}).catch(() => {});
	await log?.close();
	await exec(
		join(pg, "pg_ctl.exe"),
		["-D", dbPath, "-m", "fast", "-w", "stop"],
		{ windowsHide: true, timeout: 30000 },
	).catch(() => {});
	if (
		dirname(resolve(temporary)) === resolve(tmpdir()) &&
		temporary.includes("trilbit-lives-")
	)
		await rm(temporary, {
			recursive: true,
			force: true,
			maxRetries: 5,
			retryDelay: 500,
		});
}
