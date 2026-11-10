"use client";

import { useState } from "react";
import styles from "./shell.module.css";

export function SkipLink() {
	const [focused, setFocused] = useState(false);

	return (
		<a
			className={styles.skip}
			href="#conteudo-principal"
			onBlur={() => setFocused(false)}
			onFocus={() => setFocused(true)}
			style={focused ? { opacity: 1, pointerEvents: "auto" } : undefined}
		>
			Pular para o conteúdo
		</a>
	);
}
