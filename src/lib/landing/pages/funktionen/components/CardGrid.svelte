<!--
  Three-column cards with an icon tile (.fk-le, .fk-gr). A card with `href` is
  a link (green border on hover); one without stays a plain card.
-->
<script lang="ts">
	import type { IconName } from "../icons";
	import Icon from "./Icon.svelte";

	let {
		items,
	}: {
		items: { icon: IconName; title: string; text: string; href?: string }[];
	} = $props();
</script>

<ul class="grid">
	{#each items as item (item.title)}
		<li class="rv">
			{#if item.href}
				<a class="card link" href={item.href}>
					<span class="li"><Icon name={item.icon} /></span>
					<h3>{item.title}</h3>
					<p>{item.text}</p>
				</a>
			{:else}
				<article class="card">
					<span class="li"><Icon name={item.icon} /></span>
					<h3>{item.title}</h3>
					<p>{item.text}</p>
				</article>
			{/if}
		</li>
	{/each}
</ul>

<style>
	.grid {
		list-style: none;
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 20px;
		margin-top: 52px;
	}
	.card {
		display: block;
		height: 100%;
		background: #fff;
		border: 1px solid var(--hair);
		border-radius: 20px;
		padding: 28px;
		color: var(--ink);
		transition:
			transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1),
			box-shadow 0.35s,
			border-color 0.35s;
	}
	.card:hover {
		box-shadow: 0 24px 40px -30px rgba(30, 50, 45, 0.4);
	}
	.link:hover {
		border-color: #bfe3c2;
	}
	.li {
		width: 44px;
		height: 44px;
		border-radius: 12px;
		background: #e6f5e7;
		color: #245f33;
		display: grid;
		place-items: center;
	}
	.li :global(svg) {
		width: 20px;
		height: 20px;
	}
	.card h3 {
		font-size: 20px;
		font-weight: 600;
		letter-spacing: -0.02em;
		margin-top: 22px;
	}
	p {
		color: var(--muted);
		font-size: 15.5px;
		line-height: 1.5;
		margin-top: 10px;
	}
	@media (max-width: 720px) {
		.grid {
			grid-template-columns: minmax(0, 1fr);
		}
	}
</style>
