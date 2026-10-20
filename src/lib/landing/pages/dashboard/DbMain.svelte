<!--
  The frame of /dashboard and /auswertung (the design's `.db` main): the page
  tokens, the reveal and the rules the sections share (`.db-h2`, `.db-lead`,
  `.db-btn`, `.okb`, `.badge`, `#hs-css`).
-->
<script lang="ts">
	import type { Snippet } from "svelte";
	import { reveal } from "$lib/landing/attachments/reveal";

	let { children }: { children: Snippet } = $props();
</script>

<main id="content" class="db" {@attach reveal(".rv", { threshold: 0.18 })}>
	{@render children()}
</main>

<style>
	/* The design's page tokens (#dash-css `.db`) */
	.db {
		--bg: #f6f7f6;
		--card: #fff;
		--hair: #e5e9e7;
		--soft: #eef1ef;
		--g1: var(--ink);
		--g2: var(--ok);
		--g3: var(--blue);
		--g4: var(--orange);
		--g5: #c9a227;
		background: var(--bg);
	}
	.db :global(.sec) {
		background: var(--bg);
		position: relative;
	}
	.db :global(.sec + .sec) {
		border-top: 1px solid var(--hair);
	}
	.db :global(.rv.rv-anim) {
		transition:
			opacity 0.7s cubic-bezier(0.2, 0.8, 0.2, 1),
			transform 0.7s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	.db :global(.rv.rv-wait) {
		opacity: 0;
		transform: translateY(18px);
	}

	/* `.db-h2`, `.db-lead` (Kennzahlen, Funktionen, Auswertungen, Kundenstimmen):
	   two classes, to beat the landing heading reset */
	.db :global(.sec .db-h2) {
		font-size: clamp(30px, 3.6vw, 48px);
		line-height: 1.08;
		letter-spacing: -0.03em;
		font-weight: 500;
		margin-top: 20px;
		text-wrap: balance;
	}
	.db :global(.db-lead) {
		color: var(--muted);
		font-size: clamp(16px, 1.5vw, 19px);
		margin-top: 14px;
		text-wrap: balance;
	}
	.db :global(.db-c) {
		text-align: center;
	}
	.db :global(.db-c .db-lead) {
		max-width: 620px;
		margin-inline: auto;
	}

	/* `.db-btn` (hero, roadmap) */
	.db :global(.db-btn) {
		display: inline-flex;
		align-items: center;
		gap: 10px;
		border-radius: 8px;
		padding: 14px 22px;
		font-size: 16px;
		font-weight: 500;
		border: 1px solid transparent;
		cursor: pointer;
		text-decoration: none;
		color: var(--ink);
		transition:
			transform 0.2s,
			box-shadow 0.2s,
			background 0.2s;
	}
	.db :global(.db-btn.w) {
		background: #fff;
		border-color: var(--hair);
		box-shadow: 0 1px 2px rgba(30, 50, 45, 0.08);
	}
	.db :global(.db-btn.w:hover) {
		box-shadow: 0 6px 18px -8px rgba(30, 50, 45, 0.3);
	}
	.db :global(.db-btn.k) {
		background: var(--ink);
		color: #fff;
	}
	.db :global(.db-btn.k:hover) {
		background: #2a443d;
	}
	.db :global(.db-btn .sq) {
		width: 9px;
		height: 9px;
		border-radius: 2px;
		background: #c7cfcb;
	}
	.db :global(.db-btn .ar) {
		transition: transform 0.25s;
	}
	.db :global(.db-btn:hover .ar) {
		transform: translateX(4px);
	}

	/* The design's tick badge (`.okb`) */
	.db :global(.okb) {
		width: 20px;
		height: 20px;
		border-radius: 50%;
		background: var(--accent);
		color: var(--ink);
		display: inline-grid;
		place-items: center;
		flex: none;
	}
	.db :global(.okb svg) {
		width: 12px;
		height: 12px;
	}
	.db :global(.badge) {
		display: inline-block;
		font-size: 11px;
		font-weight: 600;
		border-radius: 6px;
		padding: 2px 8px;
	}
	.db :global(.badge.f) {
		background: #e6f5e7;
		color: #2f7a3c;
	}
	.db :global(.badge.b) {
		background: #eaf0fa;
		color: #3c5ba8;
	}

	/* #hs-css: the H1 and the section H2s with an id */
	@media (max-width: 1040px) and (min-width: 621px) {
		.db :global(section h1[data-hs]) {
			font-size: clamp(48px, 7.4vw, 68px);
			line-height: 1.02;
		}
		.db :global(section.sec h2[id]) {
			font-size: clamp(36px, 5.6vw, 52px);
			line-height: 1.06;
		}
	}
	@media (max-width: 620px) {
		.db :global(section h1[data-hs]) {
			font-size: clamp(36px, 10vw, 48px);
			line-height: 1.04;
			overflow-wrap: break-word;
			hyphens: auto;
		}
		.db :global(section.sec h2[id]) {
			font-size: clamp(30px, 8.4vw, 40px);
			line-height: 1.08;
		}
	}
</style>
