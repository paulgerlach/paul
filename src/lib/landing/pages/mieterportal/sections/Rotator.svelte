<!--
  "Im Mieterportal:" with four phrases taking turns every 2.3 s in view: the
  new one sharpens into place, the previous one blurs and lifts away (the
  design's .uv-blur). The visual stack is hidden from screen readers; a plain
  list holds all four phrases.
-->
<script lang="ts">
	import { loopInView } from "$lib/landing/attachments/loopInView";
	import { rotator } from "../content";

	const n = rotator.phrases.length;
	let index = $state(0);
	let turned = $state(false);

	function run() {
		// The first pass keeps the server's first phrase.
		if (turned) index = (index + 1) % n;
		turned = true;
	}
</script>

<section class="rot" aria-label={rotator.label}>
	<div class="wrap">
		<p class="bk">{rotator.lead}</p>
		<ul class="sr-only">
			{#each rotator.phrases as phrase (phrase)}<li>{phrase}</li>{/each}
		</ul>
		<div
			class="bw"
			aria-hidden="true"
			{@attach loopInView({ run, every: rotator.intervalMs })}
		>
			{#each rotator.phrases as phrase, i (phrase)}
				<span
					class={[
						i === index && "on",
						turned && i === (index + n - 1) % n && "prev",
					]}>{phrase}</span
				>
			{/each}
		</div>
	</div>
</section>

<style>
	.rot {
		padding: 120px 0 150px;
		text-align: center;
	}
	.bk {
		color: var(--mute);
		font-size: clamp(17px, 1.5vw, 21px);
		margin: 0;
	}
	.bw {
		position: relative;
		height: clamp(110px, 12vw, 170px);
		margin-top: 16px;
	}
	.bw span {
		position: absolute;
		left: 0;
		right: 0;
		top: 50%;
		font-size: clamp(30px, 4.6vw, 64px);
		letter-spacing: -0.035em;
		line-height: 1.05;
		transform: translateY(-50%) translateY(40px);
		opacity: 0;
		filter: blur(10px);
		transition:
			opacity 0.8s,
			transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1),
			filter 0.8s;
	}
	.bw span.on {
		opacity: 1;
		filter: none;
		transform: translateY(-50%);
	}
	.bw span.prev {
		opacity: 0.38;
		filter: blur(5px);
		transform: translateY(-50%) translateY(-1.15em) scale(0.86);
	}
	@media (prefers-reduced-motion: reduce) {
		.bw span {
			transition: none;
		}
	}
</style>
