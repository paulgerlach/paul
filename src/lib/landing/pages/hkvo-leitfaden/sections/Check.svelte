<!--
  "Schnell-Check" (.lf-chk): five yes/no questions, the score ring and the
  result (a hint, the open count, the risks with a link to the closing form,
  or "Alles erfüllt" with confetti). The server renders the unanswered
  state; without JS the questions stay as a list without buttons.
-->
<script lang="ts">
	import { onDestroy } from "svelte";
	import StrokeIcon from "$lib/landing/components/icons/StrokeIcon.svelte";
	import { confettiFrom } from "$lib/landing/sections/sg/confetti";
	import { type Answers, openText, outcome, ringDash, score } from "../check";
	import { check, type QuestionKey } from "../content";

	const total = check.questions.length;
	let answers = $state<Answers>({});
	const yes = $derived(score(answers));
	const result = $derived(outcome(check.questions, answers));

	let scoreEl: HTMLElement | undefined = $state();
	let stopConfetti: (() => void) | undefined;

	function answer(key: QuestionKey, value: boolean) {
		answers[key] = value;
		// The design bursts on every answer that leaves all five at "Ja".
		if (outcome(check.questions, answers).kind === "ok" && scoreEl) {
			stopConfetti?.();
			stopConfetti = confettiFrom(scoreEl);
		}
	}

	onDestroy(() => stopConfetti?.());
</script>

<div class="card rv" aria-label={check.label} role="group">
	<div class="head">
		<div class="ttl">
			<b>{check.title}</b>
			<small>{check.sub}</small>
		</div>
		<div class="dial" role="img" aria-label={`${yes} von ${total} mit Ja`}>
			<svg viewBox="0 0 44 44" aria-hidden="true">
				<circle cx="22" cy="22" r="19" class="bg" />
				<circle
					cx="22"
					cy="22"
					r="19"
					class="fg"
					pathLength="100"
					style:stroke-dasharray={ringDash(yes, total)}
				/>
			</svg>
			<b bind:this={scoreEl} aria-hidden="true">{yes}/{total}</b>
		</div>
	</div>
	<div class="qs">
		{#each check.questions as q (q.key)}
			<div class="qi" role="group" aria-labelledby={`lf-q-${q.key}`}>
				<span class="qt" id={`lf-q-${q.key}`}
					>{q.question}<small>{q.law}</small></span
				>
				<div class="yn">
					<button
						type="button"
						class={["y", answers[q.key] === true && "on"]}
						aria-pressed={answers[q.key] === true}
						onclick={() => answer(q.key, true)}>{check.yes}</button
					>
					<button
						type="button"
						class={["n", answers[q.key] === false && "on"]}
						aria-pressed={answers[q.key] === false}
						onclick={() => answer(q.key, false)}>{check.no}</button
					>
				</div>
			</div>
		{/each}
	</div>
	<div class="out" role="status">
		{#if result.kind === "hint"}
			<span class="hi">{check.hint}</span>
		{:else if result.kind === "ok"}
			<div class="ok">
				<StrokeIcon><path d="M5 10.5l3.2 3L15 7" /></StrokeIcon>{check.ok}
			</div>
		{:else if result.kind === "risks"}
			<div class="rk">
				<b>{check.risks}</b>
				<ul>
					{#each result.risks as r (r.risk)}
						<li>{r.risk} <span class="hi">({r.law})</span></li>
					{/each}
				</ul>
				<a href={check.link.href}>{check.link.text} →</a>
			</div>
		{:else}
			<span class="hi">{openText(result.left)}</span>
		{/if}
	</div>
</div>

<style>
	.card {
		background: #fff;
		border: 1px solid var(--hair);
		border-radius: 22px;
		padding: 20px;
		box-shadow: 0 30px 60px -40px rgba(30, 50, 45, 0.35);
	}
	.head {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 12px;
		padding-bottom: 14px;
		border-bottom: 1px solid var(--hair);
	}
	.ttl b {
		display: block;
		font-size: 16px;
		font-weight: 600;
	}
	.ttl small {
		font-size: 12.5px;
		color: var(--muted);
	}
	.dial {
		position: relative;
		width: 52px;
		height: 52px;
		flex: none;
	}
	.dial svg {
		width: 100%;
		height: 100%;
		transform: rotate(-90deg);
	}
	.dial circle {
		fill: none;
		stroke-width: 4;
	}
	.dial .bg {
		stroke: #eef1ef;
	}
	.dial .fg {
		stroke: var(--ok);
		stroke-linecap: round;
		transition: stroke-dasharray 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	.dial b {
		position: absolute;
		inset: 0;
		display: grid;
		place-items: center;
		font-size: 12px;
		font-weight: 700;
	}
	.qs {
		display: grid;
	}
	.qi {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		padding: 11px 0;
		border-bottom: 1px solid #f0f1f0;
	}
	.qt {
		font-size: 13.5px;
		line-height: 1.35;
	}
	.qt small {
		display: block;
		font-size: 11.5px;
		color: var(--faint);
		margin-top: 2px;
	}
	.yn {
		display: flex;
		gap: 4px;
		flex: none;
	}
	.yn button {
		border: 1px solid var(--hair);
		background: #fff;
		font-size: 12.5px;
		line-height: 1.5;
		border-radius: 8px;
		padding: 6px 11px;
		cursor: pointer;
		color: var(--muted);
		transition: all 0.2s;
	}
	.yn button:hover {
		border-color: #c9d2ce;
		color: var(--ink);
	}
	.yn .y.on {
		background: #e3f3e4;
		border-color: #cfe3d3;
		color: #2f7a3c;
	}
	.yn .n.on {
		background: #f9e1d8;
		border-color: #f2c9b8;
		color: #a8431a;
	}
	.out {
		margin-top: 14px;
		font-size: 13px;
		line-height: 1.5;
		min-height: 20px;
	}
	.ok {
		display: flex;
		gap: 8px;
		align-items: center;
		background: #eef6ef;
		color: #245f33;
		border-radius: 10px;
		padding: 10px 12px;
		font-weight: 500;
	}
	.ok :global(svg) {
		flex: none;
	}
	.rk {
		background: #fbf3ef;
		border-radius: 10px;
		padding: 10px 12px;
	}
	.rk b {
		display: block;
		font-size: 13px;
		margin-bottom: 4px;
		color: #a8431a;
	}
	/* The design keeps the list's default margins, padding and bullets. */
	.rk ul {
		margin: 1em 0;
		padding-left: 40px;
		list-style: disc;
	}
	.rk li {
		margin-left: 16px;
		color: var(--ink);
	}
	.rk a {
		display: inline-block;
		margin-top: 6px;
		color: var(--ok);
		font-weight: 600;
	}
	.hi {
		color: var(--faint);
	}
	@media (max-width: 560px) {
		.qi {
			flex-direction: column;
			align-items: flex-start;
			gap: 8px;
		}
	}
	/* Nothing can answer the questions without JS: they stay a list. */
	@media (scripting: none) {
		.dial,
		.yn,
		.out {
			display: none;
		}
	}
</style>
