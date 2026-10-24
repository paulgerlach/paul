<!-- Überblick: the two roles with the data line between them, the four services. -->
<script lang="ts">
	import Article from "../components/Article.svelte";
	import FlowLine from "../components/FlowLine.svelte";
	import Icon from "../components/Icon.svelte";
	import { ARTICLE, overview } from "../content";

	const [heidi, software] = overview.roles;
</script>

{#snippet role(r: (typeof overview.roles)[number])}
	<div class="role">
		<span class="ic"><Icon name={r.icon} /></span>
		<div><b>{r.title}</b><span>{r.text}</span></div>
	</div>
{/snippet}

<Article id={ARTICLE.overview} h2={overview.h2}>
	<p>{overview.text}</p>
	<div class="roles">
		{@render role(heidi)}
		<FlowLine kind="roles" />
		{@render role(software)}
	</div>
	<div class="svc">
		{#each overview.services as service (service.name)}
			<a class="sv" href={service.href}>
				<span class="ic"><Icon name={service.icon} /></span>
				<b>{service.name}</b>
				<span>{service.text}</span>
				<em>{service.version}</em>
			</a>
		{/each}
	</div>
</Article>

<style>
	.roles {
		display: grid;
		grid-template-columns: 1fr 64px 1fr;
		align-items: center;
		margin-top: 28px;
	}
	.role {
		display: flex;
		gap: 14px;
		align-items: flex-start;
		background: #fff;
		border: 1px solid var(--hair);
		border-radius: 16px;
		padding: 18px;
	}
	.role b {
		display: block;
		font-weight: 500;
		font-size: 16px;
	}
	.role div span {
		display: block;
		color: var(--muted);
		font-size: 14.5px;
		line-height: 1.5;
		margin-top: 4px;
	}
	.ic {
		width: 38px;
		height: 38px;
		flex: none;
		border-radius: 10px;
		background: #eef1ef;
		display: inline-flex;
		align-items: center;
		justify-content: center;
	}
	.ic :global(svg) {
		width: 19px;
		height: 19px;
	}
	.svc {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 14px;
		margin-top: 16px;
	}
	.sv {
		position: relative;
		display: flex;
		flex-direction: column;
		gap: 6px;
		background: #fff;
		border: 1px solid var(--hair);
		border-radius: 16px;
		padding: 20px;
		color: var(--ink);
		transition:
			border-color 0.25s,
			transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1),
			box-shadow 0.3s;
	}
	.sv:hover {
		border-color: #c3cdc8;
		transform: translateY(-2px);
		box-shadow: 0 20px 40px -30px rgba(30, 50, 45, 0.4);
	}
	.sv .ic {
		margin-bottom: 8px;
	}
	.sv b {
		font-family: var(--mono);
		font-weight: 500;
		font-size: 15px;
	}
	.sv > span:not(.ic) {
		color: var(--muted);
		font-size: 14.5px;
		line-height: 1.5;
	}
	.sv em {
		position: absolute;
		top: 20px;
		right: 20px;
		font-style: normal;
		font-family: var(--mono);
		font-size: 12px;
		color: var(--muted);
	}
	@media (max-width: 640px) {
		.roles {
			grid-template-columns: 1fr;
			gap: 10px;
		}
		.svc {
			grid-template-columns: 1fr;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.sv:hover {
			transform: none;
		}
	}
</style>
