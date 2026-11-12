import assert from "node:assert/strict";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { openBrowser, until } from "./browser-client.mjs";

process.env.TRILBIT_SCREENSHOTS = resolve(".impeccable/review/elementar-60");
const browser = await openBrowser();
const base = pathToFileURL(
	resolve("public/materiais/elementar/index.html"),
).href;
const size = (width, height) =>
	browser.send("Emulation.setDeviceMetricsOverride", {
		width,
		height,
		deviceScaleFactor: 1,
		mobile: width < 600,
	});
try {
	await size(1440, 1000);
	await browser.go(base + "#passo-1", "Coleções");
	await until(
		() =>
			browser.evaluate(
				"document.fonts.ready.then(()=>document.fonts.check('800 20px Sora'))",
			),
		"Sora offline",
	);
	assert.match(
		await browser.evaluate(
			"getComputedStyle(document.querySelector('h1')).fontFamily",
		),
		/Sora/,
	);
	await browser.screenshot("reader-desktop");
	await browser.go(base + "#passo-49-tela-4", "Por que isso funciona");
	await until(
		() =>
			browser.evaluate(
				"[...document.images].every(i=>i.complete&&i.naturalWidth>0)",
			),
		"SVG offline",
	);
	await browser.screenshot("reader-diagram-desktop");
	await size(390, 844);
	assert.ok(
		await browser.evaluate(
			"document.documentElement.scrollWidth<=innerWidth+1",
		),
	);
	await browser.screenshot("reader-diagram-mobile");
	await browser.go(base + "#passo-60-tela-17", "Qual é a inversa");
	assert.ok(
		await browser.evaluate(
			"document.documentElement.scrollWidth<=innerWidth+1",
		),
	);
	await browser.screenshot("reader-quiz-mobile");
	console.log(
		"Leitor recapturado via arquivo local: Sora incorporada, ciclo com rótulos ampliados, navegação e ausência de overflow conferidos.",
	);
} finally {
	await browser.close();
}
