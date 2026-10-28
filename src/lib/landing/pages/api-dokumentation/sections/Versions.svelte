<!-- Versionen: the changes per service version and the link to the bved's specifications. -->
<script lang="ts">
	import Article from "../components/Article.svelte";
	import DocTable from "../components/DocTable.svelte";
	import Icon from "../components/Icon.svelte";
	import { ARTICLE, versions } from "../content";
</script>

<Article id={ARTICLE.versions} h2={versions.h2}>
	<DocTable table={versions.table} title={versions.h2} />
	<p class="src">
		{versions.source.label}
		<a href={versions.source.href} target="_blank" rel="noopener noreferrer"
			>{versions.source.text}
			<Icon name="source" /><span class="sr-only">{versions.source.newTab}</span
			></a
		>
	</p>
</Article>

<style>
	/* `p.src`: beats Article's paragraph size, as the design's !important. */
	p.src {
		font-size: 14px;
	}
	a {
		display: inline-flex;
		align-items: center;
		gap: 5px;
		color: var(--ink);
		text-decoration: underline;
		text-underline-offset: 3px;
	}
	a :global(svg) {
		width: 13px;
		height: 13px;
	}
</style>
