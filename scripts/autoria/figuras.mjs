import { writeFile } from "node:fs/promises";

const escapeXml = (s) =>
	String(s)
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll('"', "&quot;");
const svg = (title, body, fontSize = 18) =>
	`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 440" role="img" aria-labelledby="title"><title id="title">${escapeXml(title)}</title><rect width="720" height="440" fill="#ffffff"/><g font-family="Arial, sans-serif" font-size="${fontSize}" fill="#18213a">${body}</g></svg>`;
const label = (x, y, s, extra = "") =>
	`<text x="${x}" y="${y}" ${extra}>${escapeXml(s)}</text>`;
function plot({
	title,
	xmin,
	xmax,
	ymin,
	ymax,
	curves,
	xticks = [],
	yticks = [],
	points = [],
	asymptotes = [],
}) {
	const px = (x) => 70 + ((x - xmin) / (xmax - xmin)) * 610,
		py = (y) => 365 - ((y - ymin) / (ymax - ymin)) * 300;
	let body =
		`<defs><clipPath id="plot"><rect x="70" y="65" width="610" height="300"/></clipPath></defs>` +
		label(70, 30, title);
	if (ymin <= 0 && ymax >= 0)
		body += `<path d="M70 ${py(0)}H680" stroke="#677188"/>`;
	if (xmin <= 0 && xmax >= 0)
		body += `<path d="M${px(0)} 65V365" stroke="#677188"/>`;
	body +=
		label(687, py(Math.max(ymin, Math.min(0, ymax))) + 5, "x") +
		label(px(Math.max(xmin, Math.min(0, xmax))) + 7, 57, "y");
	for (const x of xticks)
		body +=
			`<path d="M${px(x)} ${py(0) - 4}v8" stroke="#677188"/>` +
			label(
				px(x),
				395,
				Number.isInteger(x) ? x : x.toFixed(2),
				'text-anchor="middle"',
			);
	for (const y of yticks) body += label(62, py(y) + 6, y, 'text-anchor="end"');
	for (const x of asymptotes)
		body += `<path d="M${px(x)} 65V365" stroke="#9b4650" stroke-dasharray="6 5"/>`;
	for (const [index, c] of curves.entries()) {
		const left = c.min ?? xmin,
			right = c.max ?? xmax;
		let path = "",
			active = false;
		for (let i = 0; i <= 500; i++) {
			const x = left + ((right - left) * i) / 500,
				y = c.f(x);
			if (!Number.isFinite(y) || Math.abs(y) > 1e5) {
				active = false;
				continue;
			}
			path += `${active ? "L" : "M"}${px(x).toFixed(2)} ${py(y).toFixed(2)} `;
			active = true;
		}
		body += `<path d="${path}" fill="none" stroke="${c.color ?? "#5143b8"}" stroke-width="3" clip-path="url(#plot)" ${c.dash ? 'stroke-dasharray="7 5"' : ""}/>`;
		if (c.name)
			body += label(
				80 + index * 270,
				427,
				c.name,
				`fill="${c.color ?? "#5143b8"}"`,
			);
	}
	for (const p of points)
		body +=
			`<circle cx="${px(p.x)}" cy="${py(p.y)}" r="5" fill="${p.open ? "white" : "#18213a"}" stroke="#18213a" stroke-width="2"/>` +
			(p.name ? label(px(p.x) + 8, py(p.y) - 9, p.name) : "");
	return svg(title, body);
}

export async function generateFigures(directory) {
	const result = {};
	const save = async (numbers, file, alt, markup) => {
		await writeFile(new URL(file, directory), markup);
		for (const n of numbers) result[n] = { file, alt };
	};
	await save(
		[4, 5],
		"venn.svg",
		"Universo com três regiões: só A tem 12 pessoas, A e B têm 6, só B tem 9; fora dos dois há 13. A união soma 27 e o universo soma 40.",
		svg(
			"Contar sem repetir pessoas",
			`<rect x="50" y="65" width="620" height="315" rx="10" fill="#f4f5fb" stroke="#677188"/><ellipse cx="285" cy="220" rx="150" ry="120" fill="#e8e4ff" stroke="#5143b8" stroke-width="2"/><ellipse cx="435" cy="220" rx="150" ry="120" fill="#e5f3ee" fill-opacity="0.7" stroke="#167b65" stroke-width="2"/>${label(180, 110, "A: cinema")}${label(460, 110, "B: debate")}${label(220, 225, "12")}${label(350, 225, "6")}${label(480, 225, "9")}${label(70, 355, "13 fora")}${label(50, 35, "U: 40 participantes")}`,
		),
	);
	await save(
		[6, 16],
		"intervalo.svg",
		"Reta com intervalo (1,4]: 1 está excluído por círculo aberto, 4 incluído por círculo fechado; o trecho entre eles está destacado.",
		svg(
			"Intervalo (1,4]",
			`<path d="M60 220H660" stroke="#677188" stroke-width="2"/><path d="M210 220H510" stroke="#5143b8" stroke-width="8"/><circle cx="210" cy="220" r="9" fill="white" stroke="#5143b8" stroke-width="3"/><circle cx="510" cy="220" r="9" fill="#5143b8"/>${label(203, 260, "1")}${label(503, 260, "4")}${label(70, 80, "1 < x ≤ 4")}${label(145, 315, "1 não entra")}${label(460, 315, "4 entra")}`,
		),
	);
	await save(
		[17],
		"sinais.svg",
		"Produto (x−1)(x−3): sinal positivo antes de 1, negativo entre 1 e 3, positivo depois de 3; zero em 1 e 3.",
		svg(
			"Sinais de (x−1)(x−3)",
			`<path d="M65 230H655" stroke="#677188" stroke-width="2"/>${label(140, 200, "positivo (+)")}${label(310, 200, "negativo (−)")}${label(510, 200, "positivo (+)")}<circle cx="270" cy="230" r="6" fill="#18213a"/><circle cx="460" cy="230" r="6" fill="#18213a"/>${label(265, 270, "1")}${label(455, 270, "3")}${label(70, 85, "Para ≤ 0: escolha o meio e inclua os zeros.")}${label(280, 340, "S = [1,3]")}`,
		),
	);
	const parabola = {
		title: "f(x)=x²−4x+3",
		xmin: -1,
		xmax: 5,
		ymin: -2,
		ymax: 9,
		xticks: [0, 1, 2, 3, 4],
		yticks: [-1, 0, 3, 8],
		curves: [{ f: (x) => x * x - 4 * x + 3, name: "Vértice (2,−1)" }],
		points: [
			{ x: 1, y: 0 },
			{ x: 3, y: 0 },
			{ x: 2, y: -1, name: "(2,−1)" },
			{ x: 0, y: 3 },
		],
	};
	await save(
		[13, 14, 38],
		"parabola.svg",
		"Parábola x²−4x+3 com concavidade para cima, zeros em 1 e 3, intercepto (0,3) e vértice (2,−1).",
		plot(parabola),
	);
	await save(
		[39],
		"maximo.svg",
		"R(x)=−(x−3)²+16 abre para baixo e tem máximo 16 em x=3. No domínio restrito [0,2], cresce de 7 até 15.",
		plot({
			title: "R(x)=−(x−3)²+16",
			xmin: 0,
			xmax: 6,
			ymin: 0,
			ymax: 18,
			xticks: [0, 1, 2, 3, 4, 5, 6],
			yticks: [0, 7, 15, 16],
			curves: [
				{ f: (x) => -((x - 3) ** 2) + 16, name: "Máximo global (3,16)" },
			],
			points: [
				{ x: 3, y: 16 },
				{ x: 0, y: 7 },
				{ x: 2, y: 15 },
			],
		}),
	);
	await save(
		[26, 27, 28],
		"ruffini.svg",
		"Ruffini por x−2: coeficientes 1,0,−2,4; produtos intermediários 2,4,4; resultados 1,2,2,8. Os três primeiros resultados formam x²+2x+2; o último é o resto 8.",
		svg(
			"Briot–Ruffini com a=2",
			`${label(55, 80, "Divisor x−2; use a=2")}${label(70, 190, "2")}<path d="M120 130V290M120 235H650" stroke="#677188" stroke-width="2"/>${[1, 0, "−2", 4].map((v, i) => label(180 + 130 * i, 160, v)).join("")}${[2, 4, 4].map((v, i) => label(310 + 130 * i, 215, v)).join("")}${[1, 2, 2, 8].map((v, i) => label(180 + 130 * i, 280, v)).join("")}${label(130, 350, "Quociente: x²+2x+2")}${label(500, 350, "Resto: 8")}`,
		),
	);
	await save(
		[31],
		"pares.svg",
		"Pontos (1,3), (1,4), (2,3), (2,4) representam o produto cartesiano {1,2}×{3,4}; a primeira coordenada é horizontal.",
		plot({
			title: "{1,2} × {3,4}",
			xmin: 0,
			xmax: 3,
			ymin: 0,
			ymax: 5,
			xticks: [0, 1, 2, 3],
			yticks: [0, 1, 2, 3, 4, 5],
			curves: [],
			points: [
				{ x: 1, y: 3, name: "(1,3)" },
				{ x: 1, y: 4, name: "(1,4)" },
				{ x: 2, y: 3, name: "(2,3)" },
				{ x: 2, y: 4, name: "(2,4)" },
			],
		}),
	);
	await save(
		[32, 34],
		"setas.svg",
		"Função de {1,2,3} para {a,b}: 1 vai para a, 2 vai para a e 3 vai para b. É função sobrejetora e não injetora, pois duas entradas chegam a a.",
		svg(
			"Uma saída para cada entrada",
			`<defs><marker id="arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0L8 4L0 8" fill="#5143b8"/></marker></defs><ellipse cx="180" cy="230" rx="95" ry="160" fill="#f3f0ff" stroke="#5143b8"/><ellipse cx="530" cy="230" rx="95" ry="160" fill="#edf6f2" stroke="#167b65"/>${label(125, 45, "Domínio")}${label(465, 45, "Contradomínio")}${label(172, 140, "1")}${label(172, 235, "2")}${label(172, 330, "3")}${label(525, 185, "a")}${label(525, 285, "b")}<path d="M205 135L500 178M205 230L500 183M205 325L500 282" fill="none" stroke="#5143b8" stroke-width="2" marker-end="url(#arrow)"/>`,
		),
	);
	await save(
		[37],
		"reta.svg",
		"Reta y=2x+3, crescente, passando por (0,3), (1,5) e (3,9); intercepta o eixo horizontal em −1,5.",
		plot({
			title: "f(x)=2x+3",
			xmin: -2,
			xmax: 4,
			ymin: -2,
			ymax: 12,
			xticks: [-1, 0, 1, 2, 3],
			yticks: [0, 3, 5, 9],
			curves: [{ f: (x) => 2 * x + 3, name: "Taxa constante: 2" }],
			points: [
				{ x: 0, y: 3 },
				{ x: 1, y: 5 },
				{ x: 3, y: 9 },
			],
		}),
	);
	await save(
		[41],
		"simetria.svg",
		"Gráficos de x² e x³: x² é simétrico no eixo y; x³ é simétrico na origem. Pontos com entradas opostas têm saídas iguais na primeira função e opostas na segunda.",
		plot({
			title: "Par: x² · Ímpar: x³",
			xmin: -2,
			xmax: 2,
			ymin: -4,
			ymax: 4,
			xticks: [-2, -1, 0, 1, 2],
			yticks: [-4, -2, 0, 2, 4],
			curves: [
				{ f: (x) => x * x, name: "x² — traço contínuo" },
				{
					f: (x) => x * x * x,
					color: "#167b65",
					dash: true,
					name: "x³ — traço tracejado",
				},
			],
		}),
	);
	await save(
		[42],
		"partes.svg",
		"Função x+1 para x<0 e x² para x≥0: o primeiro ramo termina com ponto aberto em (0,1); o segundo inclui ponto fechado em (0,0).",
		plot({
			title: "f(x)=x+1 se x<0; x² se x≥0",
			xmin: -3,
			xmax: 3,
			ymin: -3,
			ymax: 5,
			xticks: [-2, -1, 0, 1, 2],
			yticks: [-2, 0, 1, 4],
			curves: [
				{ f: (x) => x + 1, max: 0, name: "x<0" },
				{ f: (x) => x * x, min: 0, color: "#167b65", name: "x≥0" },
			],
			points: [
				{ x: 0, y: 1, open: true },
				{ x: 0, y: 0 },
			],
		}),
	);
	await save(
		[44, 46],
		"exponenciais.svg",
		"Curvas 2ˣ crescente e (1/2)ˣ decrescente: ambas passam por (0,1), permanecem positivas e se aproximam do eixo horizontal sem tocá-lo.",
		plot({
			title: "Crescimento e decaimento",
			xmin: -3,
			xmax: 3,
			ymin: 0,
			ymax: 8,
			xticks: [-3, -2, -1, 0, 1, 2, 3],
			yticks: [0, 1, 2, 4, 8],
			curves: [
				{ f: (x) => 2 ** x, name: "2ˣ — contínua" },
				{
					f: (x) => 2 ** -x,
					dash: true,
					color: "#167b65",
					name: "(1/2)ˣ — tracejada",
				},
			],
			points: [{ x: 0, y: 1 }],
		}),
	);
	await save(
		[36, 45],
		"inversas.svg",
		"Curvas 2ˣ e log₂x, refletidas em y=x. A exponencial passa por (0,1),(1,2),(2,4); a logarítmica passa por (1,0),(2,1),(4,2).",
		plot({
			title: "Exponencial e logarítmica são inversas",
			xmin: -2,
			xmax: 5,
			ymin: -2,
			ymax: 5,
			xticks: [-1, 0, 1, 2, 3, 4, 5],
			yticks: [-1, 0, 1, 2, 3, 4, 5],
			curves: [
				{ f: (x) => 2 ** x, name: "2ˣ" },
				{ f: (x) => Math.log2(x), min: 0.01, color: "#167b65", name: "log₂x" },
				{ f: (x) => x, dash: true, color: "#7c6270" },
			],
			points: [
				{ x: 0, y: 1 },
				{ x: 1, y: 0 },
				{ x: 1, y: 2 },
				{ x: 2, y: 1 },
			],
		}),
	);
	await save(
		[47],
		"triangulo.svg",
		"Triângulo retângulo com cateto adjacente 4 na horizontal, oposto 3 na vertical e hipotenusa 5. O ângulo θ está no extremo esquerdo da base.",
		svg(
			"Ângulo de referência e lados",
			`<path d="M140 335H540V95Z" fill="#f4f1ff" stroke="#5143b8" stroke-width="3"/><path d="M520 335V315H540" fill="none" stroke="#18213a"/>${label(310, 375, "adjacente: 4")}${label(555, 230, "oposto: 3")}${label(260, 175, "hipotenusa: 5")}${label(185, 315, "θ")}${label(70, 55, "senθ=3/5; cosθ=4/5; tanθ=3/4")}`,
		),
	);
	await save(
		[48, 49, 50],
		"ciclo.svg",
		"Ciclo unitário: em 0 o ponto é (1,0); em π/2 é (0,1); em π é (−1,0); em 3π/2 é (0,−1). No primeiro quadrante, o ponto tem coordenadas (cosθ,senθ).",
		svg(
			"Ciclo unitário",
			`<circle cx="350" cy="225" r="145" fill="#f8f7ff" stroke="#5143b8" stroke-width="2"/><path d="M150 225H550M350 40V410" stroke="#677188"/><path d="M350 225L453 122M453 122V225" stroke="#167b65" stroke-width="2" stroke-dasharray="5 4"/><circle cx="453" cy="122" r="5" fill="#167b65"/>${label(465, 102, "(cosθ,senθ)")}${label(507, 250, "0: (1,0)")}${label(364, 65, "π/2: (0,1)")}${label(35, 270, "π: (−1,0)")}${label(364, 405, "3π/2: (0,−1)")}${label(385, 210, "θ")}`,
			32,
		),
	);
	await save(
		[53, 54],
		"ondas.svg",
		"Seno e cosseno entre 0 e 2π: seno começa em 0, chega a 1 em π/2 e −1 em 3π/2; cosseno começa em 1 e chega a −1 em π. Ambos têm imagem [−1,1] e repetem o ciclo em 2π.",
		plot({
			title: "Uma volta: 0 até 2π rad",
			xmin: 0,
			xmax: 2 * Math.PI,
			ymin: -1.3,
			ymax: 1.3,
			xticks: [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2, 2 * Math.PI],
			yticks: [-1, 0, 1],
			curves: [
				{ f: Math.sin, name: "sen x — contínuo" },
				{
					f: Math.cos,
					dash: true,
					color: "#167b65",
					name: "cos x — tracejado",
				},
			],
		}),
	);
	await save(
		[51],
		"tangente.svg",
		"Ramos da tangente separados por assíntotas verticais em −π/2 e π/2. O ramo central é crescente e passa pela origem; não há pontos nas assíntotas.",
		plot({
			title: "tan x: ramos e assíntotas",
			xmin: -Math.PI,
			xmax: Math.PI,
			ymin: -4,
			ymax: 4,
			xticks: [-Math.PI, -Math.PI / 2, 0, Math.PI / 2, Math.PI],
			yticks: [-4, -2, 0, 2, 4],
			asymptotes: [-Math.PI / 2, Math.PI / 2],
			curves: [
				{ f: Math.tan, max: -Math.PI / 2 - 0.01 },
				{
					f: Math.tan,
					min: -Math.PI / 2 + 0.01,
					max: Math.PI / 2 - 0.01,
					name: "Exclusões: π/2+kπ",
				},
				{ f: Math.tan, min: Math.PI / 2 + 0.01 },
			],
		}),
	);
	return result;
}
