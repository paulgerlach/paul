<!-- Dokumente: documents 1.3. -->
<script lang="ts">
	import Article from "../components/Article.svelte";
	import DotList from "../components/DotList.svelte";
	import { ARTICLE, documents } from "../content";
</script>

<Article id={ARTICLE.documents} h2={documents.h2} version={documents.version}>
	<p>{documents.text}</p>
	<DotList items={documents.list} />
	<p class="sm">{documents.small}</p>
</Article>
