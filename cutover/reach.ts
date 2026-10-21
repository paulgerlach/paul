/**
 * Lists every file under src/lib that no route, hook, param matcher or slice
 * reaches through static or dynamic imports. Run from the repo root:
 *
 *   bun cutover/reach.ts
 *
 * It follows `$lib/…`, `$slices/…` and relative imports (`?url`, `?enhanced`
 * stripped). It doesn't follow `import.meta.glob` (the city modules) or CSS
 * `@import`, so check those by hand before deleting anything it lists.
 */
import { existsSync, globSync, readFileSync, statSync } from "node:fs";
import { dirname, resolve } from "node:path";

const root = process.cwd();
const files = globSync("src/**/*.{ts,js,svelte}");
const entries = files.filter(
	(f) =>
		f.startsWith("src/routes/") ||
		f.startsWith("src/hooks") ||
		f.startsWith("src/params/") ||
		f.startsWith("src/lib/slices/"),
);

function resolveImport(from: string, spec: string): string | null {
	let base: string;
	if (spec.startsWith("$lib/")) base = resolve(root, "src/lib", spec.slice(5));
	else if (spec.startsWith("$slices"))
		base = resolve(root, "src/lib/slices", spec.slice(8));
	else if (spec.startsWith("."))
		base = resolve(dirname(resolve(root, from)), spec);
	else return null;
	base = base.replace(/\?.*$/, "");
	for (const candidate of [
		base,
		`${base}.ts`,
		`${base}.js`,
		`${base}.svelte.ts`,
		`${base}/index.ts`,
	])
		if (existsSync(candidate) && statSync(candidate).isFile())
			return candidate.slice(root.length + 1);
	return null;
}

const seen = new Set<string>();
const queue = [...entries];
while (queue.length) {
	const file = queue.pop()!;
	if (seen.has(file)) continue;
	seen.add(file);
	if (!/\.(ts|js|svelte)$/.test(file)) continue;
	const source = readFileSync(file, "utf8");
	for (const match of source.matchAll(
		/(?:from\s+|import\s*\(\s*|import\s+)["']([^"']+)["']/g,
	)) {
		const target = resolveImport(file, match[1]);
		if (target) queue.push(target);
	}
}

for (const file of files)
	if (
		file.startsWith("src/lib/") &&
		!/\.test\.ts$/.test(file) &&
		!seen.has(file)
	)
		console.log(file);
