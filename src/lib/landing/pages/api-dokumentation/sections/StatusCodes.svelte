<!-- Statuscodes: the table of the answers' codes. -->
<script lang="ts">
	import Article from "../components/Article.svelte";
	import DocTable from "../components/DocTable.svelte";
	import { ARTICLE, status } from "../content";
</script>

<Article id={ARTICLE.status} h2={status.h2}>
	<p>{status.text}</p>
	<DocTable table={status.table} title={status.h2} />
</Article>
