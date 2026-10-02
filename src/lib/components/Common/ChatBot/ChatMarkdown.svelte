<!-- react-markdown + remark-gfm with the `components` overrides the React chat used -->
<script lang="ts">
	import Markdown from "svelte-exmarkdown";
	import { gfmPlugin } from "svelte-exmarkdown/gfm";

	let { md }: { md: string } = $props();
	const plugins = [gfmPlugin()];
</script>

<Markdown {md} {plugins}>
	{#snippet a(props)}
		{@const { children, ...rest } = props}
		<a
			{...rest}
			target="_blank"
			rel="noopener noreferrer"
			class="text-blue-600 underline">{@render children?.()}</a
		>
	{/snippet}
	{#snippet strong(props)}
		{@const { children, ...rest } = props}
		<strong {...rest} class="font-bold">{@render children?.()}</strong>
	{/snippet}
	{#snippet ul(props)}
		{@const { children, ...rest } = props}
		<ul {...rest} class="ml-4 list-inside list-disc">{@render children?.()}</ul>
	{/snippet}
	{#snippet ol(props)}
		{@const { children, ...rest } = props}
		<ol {...rest} class="ml-4 list-inside list-decimal">
			{@render children?.()}
		</ol>
	{/snippet}
	{#snippet h1(props)}
		{@const { children, ...rest } = props}
		<h1 {...rest} class="mt-3 text-lg font-bold">{@render children?.()}</h1>
	{/snippet}
	{#snippet h2(props)}
		{@const { children, ...rest } = props}
		<h2 {...rest} class="mt-2 text-base font-bold">{@render children?.()}</h2>
	{/snippet}
	{#snippet h3(props)}
		{@const { children, ...rest } = props}
		<h3 {...rest} class="mt-2 text-sm font-bold">{@render children?.()}</h3>
	{/snippet}
</Markdown>
