<!--
  "Was Verwaltungen über Heidi sagen": the Höhne and Gerhard quotes with their
  badges, from the shared testimonial data (`.db-tm`).
-->
<script lang="ts">
	import VerifiedBadge from "$lib/landing/components/icons/VerifiedBadge.svelte";
	import { testimonial } from "$lib/landing/data/testimonials";
	import Pill from "../components/Pill.svelte";
	import { testimonials } from "../content";

	const items = testimonials.keys.map(testimonial);
</script>

<section class="sec tm-sec" aria-labelledby="tm-h">
	<div class="wrap db-c">
		<Pill text={testimonials.pill} icon="star" class="rv" />
		<h2 class="db-h2 rv" id="tm-h">{testimonials.h2}</h2>
	</div>
	<div class="wrap">
		<ul class="tm">
			{#each items as t (t.key)}
				<li class="rv">
					<figure class="c">
						{#if t.badge}
							<span class="ver"><VerifiedBadge />{t.badge}</span>
						{/if}
						<blockquote>{t.quote}</blockquote>
						<figcaption class="who">
							<span class="av" aria-hidden="true">{t.initials}</span>
							<span><b>{t.name}</b><span>{t.role}</span></span>
						</figcaption>
					</figure>
				</li>
			{/each}
		</ul>
	</div>
</section>

<style>
	.tm-sec {
		padding: 112px 0 12px;
	}
	.tm {
		list-style: none;
		margin: 56px 0 0;
		padding: 0;
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 12px;
	}
	.c {
		margin: 0;
		height: 100%;
		background: #fff;
		border: 1px solid var(--hair);
		border-radius: 16px;
		padding: 36px 36px 32px;
		display: flex;
		flex-direction: column;
		gap: 28px;
		transition:
			box-shadow 0.3s,
			transform 0.3s;
	}
	.c:hover {
		box-shadow: 0 24px 44px -28px rgba(30, 50, 45, 0.35);
		transform: translateY(-2px);
	}
	blockquote {
		margin: 0;
		color: #55635f;
		font-size: 18px;
		line-height: 1.55;
	}
	.ver {
		display: inline-flex;
		align-items: center;
		gap: 7px;
		font-size: 13px;
		font-weight: 600;
		color: #2f6eb0;
	}
	.ver :global(svg) {
		width: 18px;
		height: 18px;
	}
	.who {
		display: flex;
		align-items: center;
		gap: 14px;
		margin-top: auto;
	}
	.av {
		width: 52px;
		height: 52px;
		border-radius: 50%;
		background: var(--ink);
		color: var(--accent);
		display: grid;
		place-items: center;
		font-weight: 600;
		font-size: 17px;
		flex: none;
	}
	.who b {
		display: block;
		font-size: 16px;
		font-weight: 600;
	}
	.who span span {
		color: var(--muted);
		font-size: 14px;
	}
	@media (max-width: 900px) {
		.tm {
			grid-template-columns: minmax(0, 1fr);
		}
	}
	@media (max-width: 640px) {
		.c {
			padding: 28px 22px;
		}
		blockquote {
			font-size: 16.5px;
		}
	}
</style>
