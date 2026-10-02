/** @type {import("prettier").Config} */
const config = {
	// Matches the root .prettierrc of the Next app
	useTabs: true,
	tabWidth: 2,
	printWidth: 80,
	semi: true,
	singleQuote: false,
	trailingComma: "all",
	arrowParens: "always",
	endOfLine: "lf",
	plugins: ["prettier-plugin-svelte", "prettier-plugin-tailwindcss"],
	overrides: [{ files: "*.svelte", options: { parser: "svelte" } }],
	tailwindStylesheet: "./src/routes/layout.css",
};

export default config;
