<!-- Shown when a search finds nothing: "Keine passende Antwort gefunden." with a contact link. -->
<script lang="ts">
	import ArrowLink from "$lib/landing/components/ArrowLink.svelte";
	import { noResults } from "../content";
</script>

<div class="none">
	<b>{noResults.title}</b>
	<p>{noResults.text}</p>
	<ArrowLink href={noResults.cta.href} label={noResults.cta.text} ink />
</div>

<style>
	.none {
		background: #fff;
		border: 1px dashed var(--hair);
		border-radius: 16px;
		padding: 28px;
		text-align: center;
	}
	p {
		color: var(--muted);
		margin: 6px 0 16px;
	}
</style>
