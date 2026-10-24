<!--
  Customer quotes as dark cards (the design's .uv-q, no badge), from the
  shared testimonial data. Copy and roles need sign-off in each page's
  go-live gate.
-->
<script lang="ts">
	import {
		testimonial,
		type Testimonial,
	} from "$lib/landing/data/testimonials";

	let {
		id,
		h2,
		keys,
	}: {
		/** The heading's id. */
		id: string;
		h2: [string, string];
		keys: Testimonial["key"][];
	} = $props();

	const items = $derived(keys.map(testimonial));
</script>

<section class="q" aria-labelledby={id}>
	<div class="wrap">
		<h2 class="h rv" {id}>{h2[0]}<br />{h2[1]}</h2>
		<ul>
			{#each items as item (item.key)}
				<li class="rv">
					<figure>
						<blockquote>{item.quote}</blockquote>
						<figcaption>
							<span class="av" aria-hidden="true">{item.initials}</span>
							<span><b>{item.name}</b><small>{item.role}</small></span>
						</figcaption>
					</figure>
				</li>
			{/each}
		</ul>
	</div>
</section>

<style>
	.q {
		padding: 40px 0 120px;
	}
	.q .h {
		font-size: clamp(32px, 4vw, 56px);
		font-weight: 400;
		letter-spacing: -0.04em;
		line-height: 1.05;
		text-align: center;
	}
	ul {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 18px;
		margin: clamp(36px, 6vw, 80px) 0 0;
		padding: 0;
		list-style: none;
	}
	li {
		display: flex;
	}
	figure {
		margin: 0;
		background: var(--card);
		border-radius: 20px;
		padding: 28px;
		display: flex;
		flex-direction: column;
		gap: 40px;
		width: 100%;
	}
	blockquote {
		margin: 0;
		font-size: clamp(17px, 1.4vw, 20px);
		line-height: 1.42;
		letter-spacing: -0.01em;
	}
	figcaption {
		margin-top: auto;
		display: flex;
		gap: 14px;
		align-items: center;
	}
	.av {
		width: 44px;
		height: 44px;
		border-radius: 50%;
		background: var(--card2);
		display: grid;
		place-items: center;
		font-size: 14px;
		font-weight: 600;
		flex: none;
	}
	figcaption b {
		display: block;
		font-size: 13px;
		font-weight: 600;
		letter-spacing: 0.06em;
		text-transform: uppercase;
	}
	figcaption small {
		display: block;
		font-size: 12.5px;
		color: var(--mute);
		margin-top: 3px;
		letter-spacing: 0.02em;
	}
	@media (max-width: 980px) {
		ul {
			grid-template-columns: 1fr;
		}
	}
</style>
