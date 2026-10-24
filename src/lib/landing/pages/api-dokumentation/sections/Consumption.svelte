<!-- Verbrauchsdaten (uVI): consumption-data with its two endpoints. -->
<script lang="ts">
	import Article from "../components/Article.svelte";
	import { ARTICLE, consumption } from "../content";
	import Endpoint from "./Endpoint.svelte";
</script>

<Article
	id={ARTICLE.consumption}
	h2={consumption.h2}
	version={consumption.version}
>
	<p>{consumption.text}</p>
	{#each consumption.endpoints as endpoint (endpoint.id)}
		<Endpoint {endpoint} />
	{/each}
</Article>
