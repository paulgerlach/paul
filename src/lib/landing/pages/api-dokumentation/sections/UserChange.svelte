<!-- Nutzerwechsel: on-site-roles, the direction of the data. -->
<script lang="ts">
	import Article from "../components/Article.svelte";
	import FlowLine from "../components/FlowLine.svelte";
	import { ARTICLE, userChange } from "../content";
</script>

<Article
	id={ARTICLE.userChange}
	h2={userChange.h2}
	version={userChange.version}
>
	<p>{userChange.text}</p>
	<div class="dir">
		<span>{userChange.direction.from}</span>
		<FlowLine kind="dir" />
		<span>{userChange.direction.to}</span>
	</div>
	<p class="sm">{userChange.small}</p>
</Article>

<style>
	.dir {
		display: inline-flex;
		align-items: center;
		gap: 12px;
		margin-top: 20px;
		font-size: 14.5px;
		font-weight: 500;
	}
	.dir > span {
		border: 1px solid var(--hair);
		background: #fff;
		border-radius: 10px;
		padding: 8px 14px;
	}
</style>
