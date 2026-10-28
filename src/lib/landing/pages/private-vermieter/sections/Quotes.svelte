<!--
  "Erst Vertrauen. Dann Ruhe." (.pv-q): the quotes and photo tiles as a
  marquee; the second half repeats the first (hidden from screen readers)
  so the row loops. It runs only while in view, pauses on hover, and stands
  still with reduced motion.
-->
<script lang="ts">
	import { loopInView } from "$lib/landing/attachments/loopInView";
	import facade from "$lib/assets/landing/cities/stuttgart/hero.jpg?enhanced";
	import { testimonial } from "$lib/landing/data/testimonials";
	import Head from "../components/Head.svelte";
	import { quotes } from "../content";

	const items = quotes.items.map((q) => ({ ...q, t: testimonial(q.key) }));
	const TILES = {
		room: "background-image:var(--img-room);background-size:220%;background-position:20% 50%",
		meter:
			"background-image:var(--img-meter);background-size:240%;background-position:78% 70%",
		facade: `background-image:url(${facade.img.src})`,
	};

	const running = loopInView({
		run: () => {
			track?.classList.add("run");
			return () => track?.classList.remove("run");
		},
		every: 3_600_000,
		threshold: 0,
	});
	let track = $state<HTMLElement>();
</script>

<section class="q" aria-labelledby="pv-qh">
	<div class="wrap">
		<Head id="pv-qh" eyebrow={quotes.eyebrow} lines={quotes.h2} center />
	</div>
	<div class="mq" aria-label={quotes.label} role="region" {@attach running}>
		<div class="mt" bind:this={track}>
			{#each [false, true] as copy (copy)}
				{#each items as item (item.key)}
					<figure class="qc" aria-hidden={copy || undefined}>
						<blockquote>{item.t.quote}</blockquote>
						<figcaption>
							<span class="av">{item.t.initials}</span><span
								><b>{item.t.name}</b><small>{item.company}</small></span
							>
						</figcaption>
					</figure>
					<div class="qi" style={TILES[item.tile]}></div>
				{/each}
			{/each}
		</div>
	</div>
</section>

<style>
	.q {
		padding: 40px 0 120px;
		overflow: hidden;
	}
	.mq {
		margin-top: 56px;
		overflow: hidden;
	}
	.mt {
		display: flex;
		gap: 16px;
		width: max-content;
	}
	.mt:global(.run) {
		animation: pv-mq 70s linear infinite;
	}
	.mq:hover .mt {
		animation-play-state: paused;
	}
	@keyframes pv-mq {
		to {
			transform: translateX(-50%);
		}
	}
	.qc {
		width: min(420px, 80vw);
		flex: none;
		background: var(--card);
		border-radius: 18px;
		padding: 24px;
		display: flex;
		flex-direction: column;
		gap: 36px;
		min-height: 260px;
		/* The design keeps the browser's figure margins (Tailwind's preflight
		   resets them). */
		margin: 1em 40px;
	}
	blockquote {
		margin: 0;
		font-size: 17px;
		line-height: 1.45;
	}
	figcaption {
		margin-top: auto;
		display: flex;
		gap: 12px;
		align-items: center;
	}
	.av {
		width: 42px;
		height: 42px;
		border-radius: 50%;
		background: var(--card2);
		display: grid;
		place-items: center;
		font-size: 13px;
		font-weight: 600;
		flex: none;
	}
	b {
		display: block;
		font-size: 12.5px;
		letter-spacing: 0.07em;
		text-transform: uppercase;
	}
	small {
		display: block;
		font-size: 12.5px;
		color: var(--mute);
		margin-top: 2px;
	}
	.qi {
		width: min(300px, 62vw);
		flex: none;
		border-radius: 18px;
		background-size: cover;
		background-position: center;
		min-height: 260px;
	}
</style>
