<!-- A section of /funktionen (the design's .pg-sec): hairline on top, every second one on the light grey (`alt`). -->
<script lang="ts">
	import type { Snippet } from "svelte";

	let {
		alt = false,
		labelledby,
		label,
		children,
	}: {
		alt?: boolean;
		/** Id of the section's H2. */
		labelledby?: string;
		/** Accessible name of a section without a heading. */
		label?: string;
		children: Snippet;
	} = $props();
</script>

<section
	class={["fsec", alt && "alt"]}
	aria-labelledby={labelledby}
	aria-label={label}
>
	<div class="wrap">{@render children()}</div>
</section>

<style>
	.fsec {
		padding: 104px 0;
		border-top: 1px solid var(--hair);
	}
	/* SectionHead's H2 margin and letter-spacing; the landing heading reset
	   (same specificity) wins over them otherwise. */
	.fsec :global(.pill + h2) {
		margin-top: 18px;
		letter-spacing: -0.03em;
	}
	.alt {
		background: var(--bg);
	}
	@media (max-width: 640px) {
		.fsec {
			padding: 72px 0;
		}
	}
</style>
