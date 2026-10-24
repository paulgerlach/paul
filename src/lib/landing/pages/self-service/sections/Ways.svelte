<!-- "Zwei Wege, ein Ergebnis." (`#so`): the two ways and the result. -->
<script lang="ts">
	import Icon from "../components/Icon.svelte";
	import { ways } from "../content";
</script>

<section class="pg-sec" id="so" aria-labelledby="so-h">
	<div class="wrap">
		<div class="head">
			<span class="pill rv"><Icon name="list" />{ways.pill}</span>
			<h2 class="h2 rv" id="so-h">
				{ways.h2}<br /><span>{ways.h2Accent}</span>
			</h2>
		</div>
		<div class="ways">
			{#each ways.items as way (way.title)}
				<article class={["way rv", "end" in way && "end"]}>
					<span class="kicker">{way.kicker}</span>
					<h3>{way.title}</h3>
					<p>{way.text}</p>
					<span class="time"><Icon name={way.icon} />{way.time}</span>
				</article>
			{/each}
		</div>
	</div>
</section>

<style>
	.head {
		max-width: 760px;
	}
	.ways {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 14px;
		margin-top: 44px;
	}
	.way {
		background: #fff;
		border: 1px solid var(--hair);
		border-radius: 20px;
		padding: 26px;
		display: flex;
		flex-direction: column;
		gap: 10px;
	}
	.way.end {
		background: var(--ink);
		color: #fff;
		border-color: var(--ink);
	}
	.kicker {
		font-size: 12px;
		font-weight: 600;
		color: var(--faint);
	}
	.end .kicker {
		color: var(--accent);
	}
	/* `.way h3`: beats the landing reset of heading margins. */
	.way h3 {
		font-size: 21px;
		font-weight: 600;
		letter-spacing: -0.02em;
		margin: 0;
	}
	.way p {
		color: var(--muted);
		font-size: 15.5px;
		line-height: 1.55;
		margin: 0;
		flex: 1;
	}
	.end p {
		color: rgba(255, 255, 255, 0.72);
	}
	.time {
		display: inline-flex;
		align-items: center;
		gap: 7px;
		font-size: 13px;
		font-weight: 600;
		color: #2f7a3c;
	}
	.end .time {
		color: var(--accent);
	}
	.time :global(svg) {
		width: 15px;
		height: 15px;
	}
	@media (max-width: 1040px) {
		.ways {
			grid-template-columns: minmax(0, 1fr);
		}
	}
</style>
