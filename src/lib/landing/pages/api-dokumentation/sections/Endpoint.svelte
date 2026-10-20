<!-- One endpoint (.ad-ep): method and path, the text, the parameters, the answer and its fields or the list of contents. -->
<script lang="ts">
	import CodeBlock from "../components/CodeBlock.svelte";
	import DocTable from "../components/DocTable.svelte";
	import DotList from "../components/DotList.svelte";
	import type { Endpoint } from "../content";

	let { endpoint }: { endpoint: Endpoint } = $props();

	const name = $derived(`${endpoint.method} ${endpoint.path}`);
</script>

<div class="ep" id={endpoint.id}>
	<div class="h">
		<span class="m">{endpoint.method}</span><code>{endpoint.path}</code>
	</div>
	<p>{endpoint.text}</p>
	<DocTable table={endpoint.params} title="{name}, Parameter" />
	{#if endpoint.answer}
		<CodeBlock sample={endpoint.answer} />
	{/if}
	{#if endpoint.fields}
		<DocTable table={endpoint.fields} title="{name}, Felder" />
	{/if}
	{#if endpoint.list}
		<DotList items={endpoint.list} />
	{/if}
	{#if endpoint.small}
		<p class="sm">{endpoint.small}</p>
	{/if}
</div>

<style>
	.ep {
		margin-top: 28px;
		border: 1px solid var(--hair);
		border-radius: 18px;
		padding: 22px;
		background: #fbfcfb;
	}
	.h {
		display: flex;
		align-items: center;
		gap: 12px;
		flex-wrap: wrap;
	}
	code {
		font-size: 14.5px;
		word-break: break-all;
	}
	.m {
		font-family: var(--mono);
		font-size: 12.5px;
		font-weight: 500;
		background: #8ad68f;
		color: #1e322d;
		border-radius: 7px;
		padding: 3px 9px;
	}
	.ep > p {
		margin-top: 14px;
		color: var(--muted);
		font-size: 16.5px;
		line-height: 1.65;
		max-width: 68ch;
	}
	.ep > p.sm {
		font-size: 14.5px;
	}
	@media (max-width: 640px) {
		.ep {
			padding: 16px;
		}
	}
</style>
