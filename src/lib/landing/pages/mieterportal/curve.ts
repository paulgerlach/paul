/**
 * The mini dashboard's line charts (the design's `#md-js`): a smooth line
 * through `values` in a 200×100 box (y grows downwards, 0 at the bottom,
 * `max` at the top), the same line closed to the bottom as the area, and the
 * last point in % of the box for the end dot.
 */
export function curvePath(values: number[], max: number) {
	const n = values.length;
	const pts = values.map(
		(v, i) => [n > 1 ? (i / (n - 1)) * 200 : 0, 100 - (v / max) * 100] as const,
	);
	const r = (x: number) => Math.round(x * 100) / 100;
	let line = `M${r(pts[0][0])},${r(pts[0][1])}`;
	for (let i = 1; i < n; i++) {
		const [ax, ay] = pts[i - 1];
		const [bx, by] = pts[i];
		const c = (bx - ax) / 2;
		line += ` C${r(ax + c)},${r(ay)} ${r(bx - c)},${r(by)} ${r(bx)},${r(by)}`;
	}
	const [lx, ly] = pts[n - 1];
	return {
		line,
		area: `${line} L200,100 L0,100 Z`,
		dot: { left: r(lx / 2), top: r(ly) },
	};
}
