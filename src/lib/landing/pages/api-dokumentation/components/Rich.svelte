<!-- A text of the documentation with inline code (.ad-sec p code), bold runs, the "Pflicht" mark (.ad-req) and status codes (.ad-c). -->
<script lang="ts">
	import type { Rich } from "../content";

	let { text }: { text: Rich } = $props();
</script>

{#if typeof text === "string"}{text}{:else}{#each text as part, i (i)}{#if typeof part === "string"}{part}{:else if "code" in part}<code
				>{part.code}</code
			>{:else if "b" in part}<b>{part.b}</b>{:else if "req" in part}<i
				class="req">{part.req}</i
			>{:else}<b class={["sc", part.tone]}>{part.status}</b>{/if}{/each}{/if}

<style>
	code {
		font-size: 0.88em;
		background: #eef1ef;
		border-radius: 6px;
		padding: 1px 6px;
		color: var(--ink);
		white-space: nowrap;
	}
	b {
		font-weight: 500;
	}
	.req {
		font-style: normal;
		font-size: 11.5px;
		color: #b4532a;
		margin-left: 4px;
	}
	.sc {
		font-family: var(--mono);
		font-weight: 500;
		font-size: 13px;
		border-radius: 6px;
		padding: 2px 8px;
		background: #eef1ef;
		white-space: nowrap;
	}
	.sc.ok {
		background: #e3f3e4;
		color: #2e7a36;
	}
	.sc.er {
		background: #fbeae4;
		color: #a4472a;
	}
</style>
