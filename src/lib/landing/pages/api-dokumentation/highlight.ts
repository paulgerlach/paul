/**
 * The design's JSON colouring (#ad-js), pure: instead of rewriting the code
 * block's `innerHTML` in the browser, the server renders these tokens as
 * spans. Joined, the tokens give back the code unchanged.
 */

export type CodeToken = { text: string; kind?: "k" | "s" };

/**
 * A quoted string followed by `:` is a key (`k`), one after `:` a string
 * value (`s`). Only for code that starts with `{` (the design's check); any
 * other code is one plain token.
 */
export function jsonTokens(code: string): CodeToken[] {
	if (code.trim().charAt(0) !== "{") return [{ text: code }];
	const tokens: CodeToken[] = [];
	let plain = "";
	let last = 0;
	for (const match of code.matchAll(/"[^"]*"/g)) {
		const start = match.index;
		const end = start + match[0].length;
		const before = code.slice(last, start);
		const kind = /^\s*:/.test(code.slice(end))
			? "k"
			: /:\s*$/.test(code.slice(0, start))
				? "s"
				: undefined;
		if (!kind) {
			plain += before + match[0];
		} else {
			plain += before;
			if (plain) tokens.push({ text: plain });
			tokens.push({ text: match[0], kind });
			plain = "";
		}
		last = end;
	}
	plain += code.slice(last);
	if (plain) tokens.push({ text: plain });
	return tokens;
}
