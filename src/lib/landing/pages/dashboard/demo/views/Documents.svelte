<!--
  The preview's "Dokumente" view: category chips and the documents; a
  download only shows the preview note (plan 03, 3A.4).
-->
<script lang="ts">
	import Icon from "../../components/Icon.svelte";
	import { DOC_CATEGORIES } from "../data";
	import { getDemo } from "../demo.svelte";
	import { documentsFor } from "../model";

	const demo = getDemo();
	const list = $derived(
		documentsFor(demo.documents, demo.docCategory, demo.scope),
	);
</script>

<div class="vh">
	<h3>Dokumente</h3>
	<span class="mut"
		>{list.length} Dokumente{demo.scoped ? ` · ${demo.scoped.name}` : ""}</span
	>
</div>
<div class="chips" role="group" aria-label="Kategorie">
	{#each DOC_CATEGORIES as c (c.key)}
		<button
			type="button"
			class={["chip2", demo.docCategory === c.key && "on"]}
			aria-pressed={demo.docCategory === c.key}
			onclick={() => (demo.docCategory = c.key)}>{c.label}</button
		>
	{/each}
</div>
<ul class="docs">
	{#each list as d, i (`${d.title}-${d.object}-${d.date}-${i}`)}
		<li class={["doc", d.isNew && "new"]}>
			<span class="di"
				><Icon name={d.category === "uvi" ? "filePlus" : "file"} /></span
			>
			<span class="dt">
				<b
					>{d.isNew ? `${d.title} ` : d.title}{#if d.isNew}<span class="badge f"
							>neu</span
						>{/if}</b
				>
				<small>{demo.objectName(d.object)} · {d.date} · {d.detail}</small>
			</span>
			<button
				type="button"
				class="dlb"
				onclick={() => demo.notify("Download in der Vorschau nicht verfügbar")}
				><Icon name="download" /><span>Herunterladen</span></button
			>
		</li>
	{:else}
		<li class="mut">Keine Dokumente für diese Auswahl.</li>
	{/each}
</ul>

<style>
	.docs {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: 8px;
	}
	.doc {
		display: flex;
		align-items: center;
		gap: 12px;
		background: #fff;
		border: 1px solid var(--hair);
		border-radius: 12px;
		padding: 12px 14px;
		transition: box-shadow 0.2s;
	}
	.doc:hover {
		box-shadow: 0 10px 24px -18px rgba(30, 50, 45, 0.4);
	}
	.doc.new {
		border-color: #cdebd0;
		background: #f7fcf7;
	}
	.di {
		width: 36px;
		height: 36px;
		border-radius: 9px;
		background: #eef3f0;
		display: grid;
		place-items: center;
		flex: none;
	}
	.di :global(svg) {
		width: 17px;
		height: 17px;
	}
	.dt {
		min-width: 0;
	}
	.dt b {
		display: block;
		font-size: 13.5px;
		font-weight: 600;
	}
	.dt small {
		font-size: 12px;
		color: var(--muted);
	}
	.dlb {
		margin-left: auto;
		display: inline-flex;
		align-items: center;
		gap: 6px;
		border: 1px solid var(--hair);
		background: #fff;
		border-radius: 8px;
		padding: 7px 10px;
		font-size: 12.5px;
		cursor: pointer;
		flex: none;
	}
	.dlb:hover {
		border-color: var(--accent-deep);
	}
	.dlb :global(svg) {
		width: 14px;
		height: 14px;
	}
	@media (max-width: 640px) {
		.doc {
			flex-wrap: wrap;
		}
		.dlb span {
			position: absolute;
			width: 1px;
			height: 1px;
			overflow: hidden;
			clip: rect(0 0 0 0);
		}
	}
</style>
