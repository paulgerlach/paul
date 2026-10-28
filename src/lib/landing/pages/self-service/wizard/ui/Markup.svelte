<!-- The design's static markup (the icons in `svg.ts`, the explanations in `data.ts`). -->
<script lang="ts">
	let { html }: { html: string } = $props();
</script>

<!-- eslint-disable-next-line svelte/no-at-html-tags -- static, trusted markup -->
{@html html}
