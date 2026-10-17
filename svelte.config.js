import adapter from "@sveltejs/adapter-vercel";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	compilerOptions: {
		// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
		runes: ({ filename }) =>
			filename.split(/[/\\]/).includes("node_modules") ? undefined : true,
	},
	kit: {
		// fra1: the audience is German, so render next to it instead of in the
		// default iad1 (a transatlantic hop on every CDN cache miss).
		adapter: adapter({ runtime: "nodejs22.x", regions: ["fra1"] }),
		alias: { $slices: "src/lib/slices" },
	},
};

export default config;
