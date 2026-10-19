<!--
  "Was stört Sie heute?" (.sg-pain): eight problems as toggle buttons; each
  chosen one adds Heidi's answer to the panel, newest first, with the count
  and a CTA below. Without JS the chips stay readable and the panel shows its
  prompt. The resource links below (.sg-links) render only with a page.
-->
<script lang="ts">
	import ArrowLink from "$lib/landing/components/ArrowLink.svelte";
	import Bars from "./Bars.svelte";
	import Head from "./Head.svelte";
	import Icon from "./Icon.svelte";
	import type { PainPicker } from "./types";

	let { pain }: { pain: PainPicker } = $props();

	/** Indices of the chosen problems, newest first. */
	let selected = $state<number[]>([]);
	const count = $derived(
		selected.length === 1
			? pain.count.one
			: pain.count.many.replace("{n}", String(selected.length)),
	);
	const links = $derived(pain.links.filter((l) => l.href));

	function toggle(i: number) {
		const k = selected.indexOf(i);
		if (k < 0) selected.unshift(i);
		else selected.splice(k, 1);
	}
</script>

<section class="pg-sec alt" id={pain.id} aria-labelledby="sg-w-h">
	<div class="wrap">
		<Head id="sg-w-h" pill={pain.pill} heading={pain.h2} />
		<div class="pain">
			<div class="pl" role="group" aria-label={pain.groupLabel}>
				{#each pain.items as item, i (item.problem)}
					<button
						type="button"
						class={[selected.includes(i) && "on"]}
						aria-pressed={selected.includes(i)}
						onclick={() => toggle(i)}>{item.problem}</button
					>
				{/each}
			</div>
			<div class={["pr", selected.length > 0 && "has"]} aria-live="polite">
				<div class="pr-e">
					<span><Bars /></span><b>{pain.empty.title}</b><small
						>{pain.empty.text}</small
					>
				</div>
				<ul>
					{#each selected as i (i)}
						<li>
							<span class="ck"><Icon name="check" /></span><span
								><b>{pain.items[i].title}</b><small>{pain.items[i].text}</small
								></span
							>
						</li>
					{/each}
				</ul>
				{#if selected.length}
					<div class="pr-f">
						<span>{count}</span>
						<ArrowLink href={pain.cta.href} label={pain.cta.text} ink />
					</div>
				{/if}
			</div>
		</div>
		{#if links.length}
			<div class="links rv">
				{#each links as link (link.text)}
					<a href={link.href}
						><Icon name={link.icon} />{link.text}
						<span class="ar" aria-hidden="true">→</span></a
					>
				{/each}
			</div>
		{/if}
	</div>
</section>

<style>
	.pain {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
		gap: 24px;
		margin-top: 44px;
		align-items: start;
	}
	.pl {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
	}
	.pl button {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		border: 1px solid var(--hair);
		background: #fff;
		border-radius: 999px;
		padding: 11px 16px;
		font: inherit;
		font-size: 14.5px;
		color: var(--ink);
		cursor: pointer;
		transition:
			background 0.2s,
			border-color 0.2s,
			transform 0.2s;
	}
	.pl button::before {
		content: "+";
		font-weight: 600;
		color: var(--faint);
		width: 12px;
		text-align: center;
	}
	.pl button:hover {
		transform: translateY(-1px);
		border-color: #c9d2ce;
	}
	.pl button.on {
		background: #fbe9e1;
		border-color: #f0c7b4;
		color: #8a3a14;
	}
	.pl button.on::before {
		content: "✕";
		color: #b5471a;
		font-size: 11px;
	}
	.pr {
		background: #fff;
		border: 1px solid var(--hair);
		border-radius: 20px;
		padding: 22px;
		min-height: 300px;
	}
	.pr-e {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;
		gap: 6px;
		min-height: 250px;
		color: var(--muted);
	}
	.pr-e span {
		width: 52px;
		height: 52px;
		border-radius: 14px;
		background: var(--bg);
		display: grid;
		place-items: center;
		margin-bottom: 8px;
	}
	.pr-e span :global(svg) {
		width: 26px;
		height: 22px;
	}
	.pr-e b {
		color: var(--ink);
		font-size: 16px;
	}
	.pr-e small {
		font-size: 14px;
	}
	.has .pr-e {
		display: none;
	}
	ul {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: 10px;
	}
	li {
		display: grid;
		grid-template-columns: 30px minmax(0, 1fr);
		gap: 12px;
		padding: 12px;
		border-radius: 14px;
		background: #f4faf5;
		border: 1px solid #d7ebda;
		animation: sg-in 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) both;
	}
	@keyframes sg-in {
		from {
			opacity: 0;
			transform: translateX(10px);
		}
		to {
			opacity: 1;
			transform: none;
		}
	}
	.ck {
		width: 30px;
		height: 30px;
		border-radius: 50%;
		background: var(--accent);
		display: grid;
		place-items: center;
	}
	li b {
		display: block;
		font-size: 14.5px;
		font-weight: 600;
	}
	li small {
		display: block;
		font-size: 13.5px;
		color: var(--muted);
		margin-top: 2px;
		line-height: 1.45;
	}
	.pr-f {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		flex-wrap: wrap;
		margin-top: 16px;
		padding-top: 16px;
		border-top: 1px solid var(--hair);
	}
	.pr-f span {
		font-size: 14px;
		font-weight: 600;
	}
	.pr-f :global(.bk) {
		padding: 11px 16px;
	}
	.links {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
		margin-top: 24px;
	}
	.links a {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		border: 1px solid var(--hair);
		background: #fff;
		border-radius: 11px;
		padding: 11px 15px;
		font-size: 14.5px;
		font-weight: 600;
	}
	.links a :global(svg) {
		width: 15px;
		height: 15px;
		color: var(--faint);
	}
	@media (max-width: 1040px) {
		.pain {
			grid-template-columns: minmax(0, 1fr);
		}
	}
	@media (max-width: 640px) {
		.pl button {
			font-size: 13.5px;
			padding: 10px 13px;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		li {
			animation: none;
		}
		.pl button:hover {
			transform: none;
		}
	}
</style>
