<!--
  "Was Ihnen das Dashboard abnimmt" (`.db-strike`). The server renders the
  design's reduced-motion layout, a plain list with every line struck; the
  scroll scene (520 vh, sticky stage) is switched on after mount when motion
  is allowed (plan README, Scroll scene).
-->
<script lang="ts">
	import { strike } from "../content";
</script>

<section class="sec strike" id="strike" aria-label={strike.label}>
	<div class="pin">
		<p class="k">{strike.label}</p>
		<div class="stage">
			<ul>
				{#each strike.lines as line (line)}
					<li class="l"><span class="tx">{line}</span></li>
				{/each}
			</ul>
			<p class="l fin">{strike.final} <span>{strike.finalAccent}</span></p>
		</div>
	</div>
</section>

<style>
	.strike {
		background: #fff;
		padding: 96px 0;
	}
	.k {
		text-align: center;
		font-size: 13px;
		font-weight: 600;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--faint);
		margin: 0 0 24px;
	}
	.stage,
	ul {
		display: grid;
		gap: 14px;
		justify-items: center;
	}
	ul {
		list-style: none;
		margin: 0;
		padding: 0 16px;
	}
	.l {
		margin: 0;
		font-size: clamp(26px, 3.6vw, 46px);
		font-weight: 400;
		letter-spacing: -0.025em;
		line-height: 1.2;
		text-align: center;
		color: var(--faint);
	}
	.tx {
		background: linear-gradient(currentColor, currentColor) no-repeat 0 58% /
			calc(var(--s, 1) * 100%) 2px;
	}
	.l.fin {
		font-weight: 500;
		color: var(--ink);
		padding: 0 16px;
	}
	.fin span {
		color: var(--accent-deep);
	}
	@media (max-width: 640px) {
		.l {
			font-size: clamp(24px, 7vw, 32px);
		}
	}
</style>
