<!-- The four badges under the hero (.fk-trust). -->
<script lang="ts">
	import Icon from "../components/Icon.svelte";
	import { badges } from "../content";
</script>

<section class="trust" aria-label={badges.label}>
	<ul class="wrap">
		{#each badges.items as badge (badge.title)}
			<li class="rv">
				<span class="ti"><Icon name={badge.icon} /></span>
				<span><b>{badge.title}</b><small>{badge.sub}</small></span>
			</li>
		{/each}
	</ul>
</section>

<style>
	.trust {
		padding: 36px 0;
		border-bottom: 1px solid var(--hair);
	}
	ul {
		list-style: none;
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 20px;
	}
	li {
		display: flex;
		align-items: center;
		gap: 14px;
	}
	.ti {
		width: 42px;
		height: 42px;
		border-radius: 12px;
		background: #e6f5e7;
		color: #245f33;
		display: grid;
		place-items: center;
		flex: none;
	}
	.ti :global(svg) {
		width: 19px;
		height: 19px;
	}
	b {
		display: block;
		font-size: 15.5px;
		font-weight: 600;
	}
	small {
		display: block;
		font-size: 13px;
		color: var(--muted);
	}
	@media (max-width: 1040px) {
		ul {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
	@media (max-width: 720px) {
		ul {
			grid-template-columns: minmax(0, 1fr);
		}
	}
</style>
