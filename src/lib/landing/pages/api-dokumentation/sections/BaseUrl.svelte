<!-- Basis-URL und Versionen: the text, the placeholder URL, the formats. -->
<script lang="ts">
	import Article from "../components/Article.svelte";
	import CodeBlock from "../components/CodeBlock.svelte";
	import DotList from "../components/DotList.svelte";
	import { ARTICLE, baseUrl } from "../content";
</script>

<Article id={ARTICLE.baseUrl} h2={baseUrl.h2}>
	<p>{baseUrl.text}</p>
	<CodeBlock sample={baseUrl.sample} />
	<DotList items={baseUrl.list} />
</Article>
