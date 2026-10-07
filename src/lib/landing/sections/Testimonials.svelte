<!--
  Row of verified-customer quotes (the designs' "dm-tm" section): badge,
  quote, initials avatar, name and role.
-->
<script lang="ts">
	import VerifiedBadge from "$lib/landing/components/icons/VerifiedBadge.svelte";
	import {
		testimonials as all,
		type Testimonial,
	} from "$lib/landing/data/testimonials";

	let { title, items = all }: { title: string; items?: Testimonial[] } =
		$props();
</script>

<section class="tm" aria-labelledby="tm-h2">
	<div class="wrap">
		<h2 id="tm-h2">{title}</h2>
		<div class="tm-row" style:--n={items.length}>
			{#each items as item (item.key)}
				<figure>
					<span class="ver"><VerifiedBadge />{item.badge}</span>
					<blockquote>{item.quote}</blockquote>
					<figcaption>
						<span class="av" aria-hidden="true">{item.initials}</span>
						<span><b>{item.name}</b>{item.role}</span>
					</figcaption>
				</figure>
			{/each}
		</div>
	</div>
</section>

<style>
	.tm {
		background: var(--bg, var(--stone));
		padding: 104px 0;
		border-top: 1px solid var(--hair, var(--line));
	}
	h2 {
		font-size: clamp(30px, 3.6vw, 48px);
		line-height: 1.08;
		letter-spacing: -0.03em;
		text-align: center;
	}
	.tm-row {
		display: grid;
		grid-template-columns: repeat(var(--n), minmax(0, 1fr));
		gap: 14px;
		margin-top: 48px;
	}
	figure {
		margin: 0;
		background: #fff;
		border: 1px solid var(--hair, var(--line));
		border-radius: 18px;
		padding: 30px 30px 26px;
		display: flex;
		flex-direction: column;
		gap: 20px;
	}
	blockquote {
		margin: 0;
		font-size: 18px;
		line-height: 1.55;
		color: #3e4f4a;
	}
	figcaption {
		display: flex;
		align-items: center;
		gap: 12px;
		margin-top: auto;
		font-size: 14px;
		color: var(--muted);
	}
	figcaption b {
		display: block;
		color: var(--ink);
		font-weight: 600;
		font-size: 15px;
	}
	.av {
		width: 46px;
		height: 46px;
		border-radius: 50%;
		background: var(--ink);
		color: var(--accent);
		display: grid;
		place-items: center;
		font-weight: 600;
		flex: none;
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
	@media (max-width: 1040px) {
		.tm-row {
			grid-template-columns: minmax(0, 1fr);
		}
	}
</style>
