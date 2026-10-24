<!-- Datenaustausch V 3.10: the file format. -->
<script lang="ts">
	import Article from "../components/Article.svelte";
	import { ARTICLE, fileExchange } from "../content";
</script>

<Article
	id={ARTICLE.fileExchange}
	h2={fileExchange.h2}
	version={fileExchange.version}
>
	<p>{fileExchange.text}</p>
	<p class="sm">{fileExchange.small}</p>
</Article>
