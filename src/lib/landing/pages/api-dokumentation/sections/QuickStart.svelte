<!-- Schnellstart: three numbered steps and the cURL call. -->
<script lang="ts">
	import Article from "../components/Article.svelte";
	import CodeBlock from "../components/CodeBlock.svelte";
	import { ARTICLE, quickStart } from "../content";
</script>

<Article id={ARTICLE.quickStart} h2={quickStart.h2}>
	<ol class="steps">
		{#each quickStart.steps as step, i (step.title)}
			<li>
				<span aria-hidden="true">{i + 1}</span>
				<div>
					<b>{step.title}</b>
					<p>{step.text}</p>
				</div>
			</li>
		{/each}
	</ol>
	<CodeBlock sample={quickStart.sample} />
</Article>

<style>
	.steps {
		list-style: none;
		padding: 0;
		margin: 24px 0 0;
		display: grid;
		gap: 12px;
	}
	li {
		display: flex;
		gap: 16px;
		align-items: flex-start;
	}
	li > span {
		width: 30px;
		height: 30px;
		flex: none;
		border-radius: 50%;
		background: #1e322d;
		color: #fff;
		font-size: 14px;
		font-weight: 500;
		display: inline-flex;
		align-items: center;
		justify-content: center;
	}
	b {
		font-weight: 500;
	}
	p {
		color: var(--muted);
		font-size: 15px;
		margin-top: 2px;
		line-height: 1.55;
	}
</style>
