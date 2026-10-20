<!-- The table of contents (.ad-side): sticky beside the articles, a row of chips below 1040 px. -->
<script lang="ts">
	import { docs } from "../content";

	let current = $state(0);

	const links = docs.groups.flatMap((g) => g.links);
	const index = (id: string) => links.findIndex((l) => l.id === id);
</script>

<nav class="side" aria-label={docs.navLabel}>
	{#each docs.groups as group (group.title)}
		<p class="gh">{group.title}</p>
		{#each group.links as link (link.id)}
			{@const on = index(link.id) === current}
			<a
				href="#{link.id}"
				class={[on && "on"]}
				aria-current={on ? "location" : undefined}>{link.text}</a
			>
		{/each}
	{/each}
</nav>

<style>
	.side {
		position: sticky;
		top: 96px;
		display: flex;
		flex-direction: column;
		gap: 2px;
		max-height: calc(100vh - 120px);
		overflow: auto;
	}
	.gh {
		font-size: 12.5px;
		font-weight: 500;
		color: var(--muted);
		margin: 20px 0 8px 12px;
	}
	.gh:first-child {
		margin-top: 0;
	}
	a {
		display: block;
		padding: 7px 12px;
		border-radius: 9px;
		font-size: 14.5px;
		color: var(--muted);
		border-left: 2px solid transparent;
		transition:
			color 0.2s,
			background 0.2s;
	}
	a:hover,
	a.on {
		color: var(--ink);
		background: #eef1ef;
	}
	a.on {
		font-weight: 500;
	}
	@media (max-width: 1040px) {
		.side {
			position: static;
			flex-direction: row;
			flex-wrap: nowrap;
			overflow-x: auto;
			max-height: none;
			gap: 6px;
			padding-bottom: 6px;
			margin: 0 -4px 8px;
		}
		.gh {
			display: none;
		}
		a {
			white-space: nowrap;
			border: 1px solid var(--hair);
			background: #fff;
		}
	}
</style>
