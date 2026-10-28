<!-- Authentifizierung: the text and the table of the two methods. -->
<script lang="ts">
	import Article from "../components/Article.svelte";
	import DocTable from "../components/DocTable.svelte";
	import Rich from "../components/Rich.svelte";
	import { ARTICLE, auth } from "../content";
</script>

<Article id={ARTICLE.auth} h2={auth.h2}>
	<p><Rich text={auth.text} /></p>
	<DocTable table={auth.table} title={auth.h2} />
</Article>
