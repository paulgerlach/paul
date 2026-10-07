<!-- "Kein Warten aufs Vertragsende": the contract timeline. -->
<script lang="ts">
	import Check from "$lib/landing/components/icons/Check.svelte";
	import type { RegionContent } from "./types";

	let { content }: { content: RegionContent } = $props();
	const s = $derived(content.noWait);

	// The timeline itself is the same in every design.
	const years = [2026, 2027, 2028, 2029, 2030];
</script>

<section class="nowait wrap" aria-labelledby="nw-h">
	<div class="shead">
		<div class="eyebrow">{s.eyebrow}</div>
		<h2 id="nw-h">{s.title}</h2>
		<p>{s.text}</p>
	</div>
	<div class="tl-card">
		<div class="tl-scroll">
			<div
				class="tl"
				role="img"
				aria-label="Zeitstrahl: Der Altvertrag läuft bis 2029 weiter. Heidi übernimmt ab heute Auswertung und Abrechnung mit den bestehenden Zählern und tauscht 2029 auf Heidi-Funkzähler."
			>
				<div class="tl-years">
					<div></div>
					{#each years as year (year)}<div>{year}</div>{/each}
				</div>
				<div class="tl-row">
					<div class="lab">
						Bisheriger Messdienst<small>Gerätemiete läuft weiter</small>
					</div>
					<div class="tl-lane">
						<div class="tl-bar old">Vertrag läuft bis Ende 2029</div>
					</div>
				</div>
				<div class="tl-row">
					<div class="lab">Heidi<small>ab heute zuständig</small></div>
					<div class="tl-lane">
						<div class="tl-bar now">
							Ablesung, uVI und Abrechnung mit Ihren Bestandszählern
						</div>
						<div class="tl-bar new">Funkzähler</div>
					</div>
				</div>
				<div class="tl-today"><span>Heute</span></div>
			</div>
		</div>
		<div class="tl-note">
			{#each s.notes as note (note)}
				<span><span class="okb"><Check /></span>{note}</span>
			{/each}
		</div>
	</div>
</section>

<style>
	.nowait {
		padding-block: 96px;
	}
	.tl-card {
		margin-top: 56px;
		background: #fff;
		border: 1px solid var(--line);
		border-radius: 22px;
		padding: 32px 36px;
		box-shadow: 0 20px 60px -30px rgba(30, 50, 45, 0.25);
	}
	.tl-scroll {
		overflow-x: auto;
	}
	.tl {
		min-width: 760px;
		position: relative;
		padding-top: 34px;
	}
	.tl-years {
		display: grid;
		grid-template-columns: 180px repeat(5, 1fr);
		font-size: 12px;
		font-weight: 600;
		letter-spacing: 0.06em;
		color: var(--faint);
		text-transform: uppercase;
	}
	.tl-years div {
		padding: 0 0 10px;
		border-left: 1px dashed #e3e7e5;
		padding-left: 10px;
	}
	.tl-years div:first-child {
		border: 0;
		padding-left: 0;
	}
	.tl-row {
		display: grid;
		grid-template-columns: 180px 1fr;
		align-items: center;
		min-height: 74px;
		border-top: 1px solid var(--line);
	}
	.lab {
		font-weight: 500;
		font-size: 15px;
	}
	.lab small {
		display: block;
		color: var(--muted);
		font-weight: 400;
		font-size: 13px;
	}
	.tl-lane {
		position: relative;
		height: 74px;
		background: repeating-linear-gradient(
			90deg,
			transparent 0 calc(20% - 1px),
			#eef0ef calc(20% - 1px) 20%
		);
	}
	.tl-bar {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		height: 38px;
		border-radius: 999px;
		display: flex;
		align-items: center;
		padding: 0 16px;
		font-size: 14px;
		font-weight: 500;
		white-space: nowrap;
		overflow: hidden;
	}
	.tl-bar.old {
		left: 0;
		width: 79.5%;
		background: repeating-linear-gradient(
			135deg,
			#eceeed 0 6px,
			#f4f5f4 6px 12px
		);
		color: var(--muted);
		border: 1px solid #e1e5e3;
	}
	.tl-bar.now {
		left: 15%;
		width: 64.5%;
		background: var(--accent);
		color: var(--ink);
	}
	.tl-bar.new {
		left: 80.5%;
		right: 0;
		background: var(--ink);
		color: #fff;
		border-radius: 999px 0 0 999px;
	}
	.tl-today {
		position: absolute;
		top: 28px;
		bottom: 0;
		left: calc(180px + (100% - 180px) * 0.15);
		width: 0;
		border-left: 2px solid var(--orange);
		z-index: 2;
	}
	.tl-today span {
		position: absolute;
		top: -22px;
		left: -26px;
		background: var(--orange);
		color: #fff;
		border-radius: 999px;
		font-size: 11px;
		font-weight: 600;
		padding: 2px 9px;
		white-space: nowrap;
	}
	.tl-note {
		display: flex;
		flex-wrap: wrap;
		gap: 12px 28px;
		margin-top: 22px;
		padding-top: 18px;
		border-top: 1px solid var(--line);
		font-size: 15px;
	}
	.tl-note > span {
		display: inline-flex;
		align-items: center;
		gap: 8px;
	}
</style>
