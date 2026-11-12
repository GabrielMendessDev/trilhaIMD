// Fonte editorial: texto autoral, com alternativas e comentários revisáveis.
export const lesson = (data) => {
	const quiz = data.quiz
		.trim()
		.split("\n")
		.map((line) => {
			const parts = line.trim().split(" | ");
			if (parts.length !== 5)
				throw new Error(`Passo ${data.n}: questão mal formada: ${line}`);
			return parts;
		});
	if (quiz.length !== 10)
		throw new Error(`Passo ${data.n}: esperadas 10 questões.`);
	return { ...data, quiz };
};
