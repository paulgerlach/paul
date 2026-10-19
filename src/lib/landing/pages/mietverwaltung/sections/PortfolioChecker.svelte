<!--
  The first audience card's mock (the design's #pcm): the Portfolio-Checker
  goes through four buildings' metering contracts and gives each its next
  step. Every 9.1 s while 35 % of it is in view it starts over: the rows fade
  in, each turns from a spinner to its action pill 900 ms after the previous
  one, the count and the bar follow, and with the last the status changes.
  The server renders the finished check. The mock is hidden from screen
  readers; a plain list states each building's next step.
-->
<script lang="ts">
	import { loopInView } from "$lib/landing/attachments/loopInView";
	import b1 from "$lib/assets/landing/mietverwaltung/building-1.jpg";
	import b2 from "$lib/assets/landing/mietverwaltung/building-2.jpg";
	import b3 from "$lib/assets/landing/mietverwaltung/building-3.jpg";
	import b4 from "$lib/assets/landing/mietverwaltung/building-4.jpg";
	import { checker } from "../content";

	const PHOTOS = [b1, b2, b3, b4];
	const total = checker.rows.length;

	/** Rows checked so far: all of them on the server. */
	let done = $state(total);
	/** The rows are shown (the design's .go). */
	let go = $state(true);

	function run() {
		done = 0;
		go = false;
		let frame = requestAnimationFrame(() => {
			// One frame without .go, so the rows fade in again.
			frame = requestAnimationFrame(() => (go = true));
		});
		const timers = checker.rows.map((_, i) =>
			setTimeout(() => (done = i + 1), 1300 + i * 900),
		);
		return () => {
			cancelAnimationFrame(frame);
			timers.forEach(clearTimeout);
		};
	}
</script>

<div
	class={["pcm", go && "go"]}
	aria-hidden="true"
	{@attach loopInView({
		run,
		every: 1300 + total * 900 + 4200,
		threshold: 0.35,
	})}
>
	<div class="h">
		<span class="ic">
			<svg
				width="16"
				height="16"
				viewBox="0 0 20 20"
				fill="none"
				stroke="currentColor"
				stroke-width="1.6"
				stroke-linecap="round"
				stroke-linejoin="round"
				><circle cx="9" cy="9" r="5.5" /><path d="M13 13l4 4" /></svg
			>
		</span>
		<span>
			<b>{checker.title}</b>
			<small>{done === total ? checker.done : checker.checking}</small>
		</span>
		<span class="c"><b>{done}</b>/{total}</span>
	</div>
	<div class="bar"><i style:width="{(done / total) * 100}%"></i></div>
	{#each checker.rows as row, i (row.name)}
		<div class={["r", i < done && "done"]}>
			<img src={PHOTOS[i]} alt="" width="36" height="36" loading="lazy" />
			<span class="n"><b>{row.name}</b><small>{row.units}</small></span>
			<span class="s">{row.status}</span>
			<span class="e">
				<i class="sp"></i>
				<em class="b {row.tone}-step">{row.action}</em>
			</span>
		</div>
	{/each}
	<div class="f"><span class="demo">{checker.tag}</span></div>
</div>
<ul class="sr-only">
	{#each checker.rows as row (row.name)}
		<li>{row.name}, {row.units}: {row.status}. {row.action}.</li>
	{/each}
</ul>

<style>
	.pcm {
		width: 100%;
		max-width: 440px;
		background: #fff;
		border-radius: 18px;
		padding: 16px;
		color: var(--ink);
		box-shadow: 0 30px 60px -34px rgba(0, 0, 0, 0.55);
	}
	.h {
		display: flex;
		align-items: center;
		gap: 10px;
	}
	.ic {
		width: 34px;
		height: 34px;
		border-radius: 10px;
		background: var(--ink);
		color: var(--accent);
		display: grid;
		place-items: center;
		flex: none;
	}
	.ic svg {
		width: 16px;
		height: 16px;
	}
	.h b {
		display: block;
		font-size: 14px;
		font-weight: 600;
	}
	.h small {
		display: block;
		font-size: 11.5px;
		color: #7a8783;
	}
	.h .c {
		margin-left: auto;
		white-space: nowrap;
		font-size: 12px;
		color: #7a8783;
		font-variant-numeric: tabular-nums;
	}
	.h .c b {
		display: inline;
		font-size: 16px;
		color: var(--ink);
	}
	.bar {
		height: 4px;
		border-radius: 2px;
		background: #eef1ef;
		margin: 12px 0 6px;
		overflow: hidden;
	}
	.bar i {
		display: block;
		height: 100%;
		background: var(--ok);
		border-radius: 2px;
		transition: width 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	.r {
		display: grid;
		grid-template-columns: 36px minmax(0, 1fr) auto;
		grid-template-areas: "img n e" "img s e";
		gap: 1px 10px;
		align-items: center;
		padding: 9px 0;
		border-bottom: 1px solid #eef1ef;
		opacity: 0;
		transform: translateY(6px);
		transition:
			opacity 0.4s,
			transform 0.4s;
	}
	.r:last-of-type {
		border-bottom: 0;
	}
	.go .r {
		opacity: 1;
		transform: none;
	}
	.go .r:nth-of-type(2) {
		transition-delay: 0.1s;
	}
	.go .r:nth-of-type(3) {
		transition-delay: 0.2s;
	}
	.go .r:nth-of-type(4) {
		transition-delay: 0.3s;
	}
	/* Beats uv/Audience's figure image rules; keeps their hover zoom. */
	.r img {
		grid-area: img;
		width: 36px;
		height: 36px;
		border-radius: 8px;
		object-fit: cover;
	}
	.n {
		grid-area: n;
		min-width: 0;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.n b {
		font-size: 12.5px;
		font-weight: 600;
	}
	.n small {
		display: none;
	}
	.s {
		grid-area: s;
		font-size: 11px;
		color: #5b6b66;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.e {
		grid-area: e;
		display: grid;
		justify-items: end;
		align-items: center;
	}
	.sp,
	.b {
		grid-area: 1/1;
	}
	.sp {
		width: 14px;
		height: 14px;
		border-radius: 50%;
		border: 2px solid #dce3df;
		border-top-color: var(--ok);
		animation: spin 0.8s linear infinite;
		transition: opacity 0.2s;
	}
	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
	.b {
		transform: scale(0.85);
		opacity: 0;
		font-style: normal;
		font-size: 11px;
		font-weight: 700;
		white-space: nowrap;
		border-radius: 999px;
		padding: 5px 10px;
		transition:
			opacity 0.35s,
			transform 0.45s cubic-bezier(0.3, 1.6, 0.5, 1);
	}
	.take-step {
		background: var(--ink);
		color: #fff;
	}
	.cancel-step {
		background: #fbefdf;
		color: #8a5410;
	}
	.bill-step {
		background: #e6f5e7;
		color: #2f7a3c;
	}
	.done .sp {
		opacity: 0;
	}
	.done .b {
		opacity: 1;
		transform: none;
	}
	.f {
		display: flex;
		justify-content: flex-end;
		margin-top: 8px;
	}
	.demo {
		font-size: 10.5px;
		font-weight: 600;
		color: #2f7a3c;
		background: #e6f5e7;
		border-radius: 999px;
		padding: 2px 8px;
	}
	@media (max-width: 520px) {
		.b {
			font-size: 10px;
			padding: 4px 8px;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.sp {
			animation: none;
		}
	}
</style>
