import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { setTimeout as delay } from "node:timers/promises";

export async function until(check, label) {
	for (let index = 0; index < 160; index++) {
		if (await check()) return;
		await delay(125);
	}
	throw new Error(`Não confirmou: ${label}`);
}

export async function openBrowser() {
	const executable =
		process.env.TRILBIT_TEST_CHROME ??
		[
			"C:/Program Files/Google/Chrome/Application/chrome.exe",
			"C:/Program Files/BraveSoftware/Brave-Browser/Application/brave.exe",
			"C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
		].find(existsSync);
	if (!executable || !existsSync(executable))
		throw new Error(
			"Navegador não encontrado. Configure TRILBIT_TEST_CHROME com o caminho de um navegador Chromium instalado.",
		);
	const profile = await mkdtemp(join(tmpdir(), "trilbit-feedback-"));
	const processHandle = spawn(
		executable,
		[
			"--headless",
			"--disable-extensions",
			"--disable-gpu",
			"--no-first-run",
			"--no-proxy-server",
			"--remote-debugging-port=0",
			`--user-data-dir=${profile}`,
			"about:blank",
		],
		{ windowsHide: true, stdio: "ignore" },
	);
	let launchError;
	processHandle.on("error", (error) => {
		launchError = error;
	});
	let port;
	await until(async () => {
		if (launchError) throw launchError;
		try {
			[port] = (
				await readFile(join(profile, "DevToolsActivePort"), "utf8")
			).split("\n");
			return Boolean(port);
		} catch {
			return false;
		}
	}, "porta do Chrome");
	let tab;
	await until(async () => {
		if (launchError) throw launchError;
		try {
			const targets = await (
				await fetch(`http://127.0.0.1:${port}/json/list`)
			).json();
			tab = targets.find(
				({ type, url }) => type === "page" && url === "about:blank",
			);
			return Boolean(tab);
		} catch (error) {
			if (error instanceof TypeError && error.message === "fetch failed")
				return false;
			throw error;
		}
	}, "aba de teste pronta");
	assert.ok(tab);
	const ws = new WebSocket(tab.webSocketDebuggerUrl);
	await new Promise((resolve, reject) => {
		ws.addEventListener("open", resolve, { once: true });
		ws.addEventListener("error", reject, { once: true });
	});
	let counter = 0;
	const pending = new Map();
	const handlers = new Map();
	const disconnect = () => {
		for (const command of pending.values()) {
			clearTimeout(command.timer);
			command.reject(new Error("Navegador de teste desconectado"));
		}
		pending.clear();
	};
	ws.addEventListener("close", disconnect);
	ws.addEventListener("error", disconnect);
	ws.addEventListener("message", (event) => {
		const data = JSON.parse(event.data);
		if (data.method) handlers.get(data.method)?.(data.params);
		const command = pending.get(data.id);
		if (!command) return;
		pending.delete(data.id);
		clearTimeout(command.timer);
		if (data.error) command.reject(new Error(data.error.message));
		else command.resolve(data.result);
	});
	const send = (method, params = {}) =>
		new Promise((resolve, reject) => {
			const id = ++counter;
			const timer = setTimeout(() => {
				pending.delete(id);
				reject(new Error(`Tempo esgotado no comando do navegador: ${method}`));
			}, 20000);
			pending.set(id, { resolve, reject, timer });
			ws.send(JSON.stringify({ id, method, params }));
		});
	const evaluate = async (expression) => {
		const result = await send("Runtime.evaluate", {
			expression,
			returnByValue: true,
			awaitPromise: true,
		});
		if (result.exceptionDetails)
			throw new Error(
				result.exceptionDetails.exception?.description ??
					result.exceptionDetails.text,
			);
		return result.result.value;
	};
	const go = async (url, heading) => {
		await send("Page.navigate", { url });
		await until(
			() =>
				evaluate(
					`[...document.querySelectorAll('main h1, main h2')].some(e=>e.getClientRects().length&&e.textContent.includes(${JSON.stringify(heading)}))`,
				),
			heading,
		);
	};
	const screenshot = async (name) => {
		if (!process.env.TRILBIT_SCREENSHOTS) return;
		await evaluate("document.fonts.ready.then(()=>true)");
		await delay(250);
		const result = await send("Page.captureScreenshot", { format: "png" });
		await writeFile(
			join(process.env.TRILBIT_SCREENSHOTS, `${name}.png`),
			Buffer.from(result.data, "base64"),
		);
	};
	await send("Page.enable");
	return {
		send,
		evaluate,
		go,
		screenshot,
		on: (name, handler) => handlers.set(name, handler),
		close: async () => {
			try {
				await send("Browser.close");
			} catch {
			} finally {
				ws.close();
				processHandle.kill();
				if (dirname(resolve(profile)) === resolve(tmpdir()))
					await rm(profile, {
						recursive: true,
						force: true,
						maxRetries: 3,
						retryDelay: 250,
					}).catch(() => {});
			}
		},
	};
}
