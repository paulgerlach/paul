<!-- "Direkt in Ihre Verwaltungssoftware" (`.db-int`): copy and the hand-over card. -->
<script lang="ts">
	import { focusSignup } from "$lib/landing/cta";
	import Pill from "../components/Pill.svelte";
	import { integration } from "../content";
	import Handover from "./Handover.svelte";
</script>

<section class="sec int" aria-labelledby="int-h">
	<div class="wrap frame">
		<div>
			<Pill text={integration.pill} icon="plug" class="rv" />
			<h2 class="rv" id="int-h">{integration.h2}</h2>
			<p class="rv">{integration.text}</p>
			<a class="more rv" href={integration.link.href} onclick={focusSignup}
				><i aria-hidden="true"></i>{integration.link.text}</a
			>
		</div>
		<Handover />
	</div>
</section>

<style>
	.frame {
		border-inline: 1px solid var(--hair);
		display: grid;
		grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.35fr);
		gap: 48px;
		align-items: center;
		padding-block: 96px;
	}
	.int h2 {
		margin-top: 20px;
		font-size: clamp(32px, 3.8vw, 52px);
		letter-spacing: -0.035em;
		line-height: 1.05;
		font-weight: 500;
	}
	.frame > div > p {
		color: var(--muted);
		font-size: 18px;
		margin: 16px 0 0;
		max-width: 42ch;
	}
	.more {
		display: inline-flex;
		align-items: center;
		gap: 10px;
		margin-top: 28px;
		background: #fff;
		border: 1px solid var(--hair);
		border-radius: 9px;
		padding: 10px 16px;
		font-weight: 500;
		color: var(--ink);
		text-decoration: none;
		box-shadow: 0 1px 2px rgba(30, 50, 45, 0.06);
	}
	.more i {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: var(--accent-deep);
	}
	@media (max-width: 900px) {
		.frame {
			grid-template-columns: minmax(0, 1fr);
		}
	}
</style>
